## Paged attention

At the core of LLMs lies an autoregressive Transformer model [ 53]. This model generates words (tokens), one at a time, based on the input (prompt) and the previous sequence of the output’s tokens it has generated so far. For each request, this expensive process is repeated until the model outputs a termination token. This sequential generation process makes the workload memory-bound, underutilizing the computation power of GPUs and limiting the serving throughput. Improving the throughput is possible by batching multiple requests together. However, to process many requests in a batch, the memory space for each request should be efficiently managed. For example, the memory distribution for a 13B-parameter LLM on an NVIDIA A100 GPU with 40GB RAM. Approximately 65% of the memory is allocated for the model weights, which remain static
during serving. Close to 30% of the memory is used to store the dynamic states of the requests. For Transformers, these states consist of the key and value tensors associated with the attention mechanism, commonly referred to as KV cache [ 41], which represent the context from earlier tokens to generate new output tokens in sequence. The remaining small percentage of memory is used for other data, including activations – the ephemeral tensors created when evaluating the LLM. Since the model weights are constant and the activations only occupy a small fraction of the GPU memory, the way the KV cache is managed is critical in determining the maximum batch size. When managed inefficiently, the KV cache memory can significantly limit the batch size and
consequently the throughput of the LLM.   

![[Pasted image 20251101200956.png]]
Existing LLM serving systems [31, 60] fall short of managing the KV cache memory efficiently. This is mainly because they store the KV cache of a request in contiguous memory space, as most deep learning frameworks [33, 39 ] require tensors to be stored in contiguous memory. However, unlike the tensors in the traditional deep learning workloads, the KV cache has unique characteristics: it dynamically grows and shrinks over time as the model generates new tokens, and its lifetime and length are not known a priori. These characteristics make the existing systems’ approach significantly inefficient in two ways: 
1. The existing systems [31 , 60 ] suffer from internal and external memory fragmentation. To store the KV cache of a request in contiguous space, they pre-allocate a contiguous chunk of memory with the request’s maximum length (e.g., 2048 tokens). This can result in severe internal fragmentation, since the request’s actual length can be much shorter than its maximum length (e.g., Fig. 11). Moreover, even if the actual length is known a priori, the pre-allocation is still inefficient: As the entire chunk is reserved during the request’s lifetime, other shorter requests cannot utilize any part of the chunk that is currently unused. Besides, external memory fragmentation can also be significant, since the preallocated size can be different for each request. Indeed, our profiling results in Fig. 2 show that only 20.4% - 38.2% of the KV cache memory is used to store the actual token states in the existing systems. 
2. The existing systems cannot exploit the opportunities for memory sharing. LLM services often use advanced decoding algorithms, such as parallel sampling and beam search, that generate multiple outputs per request. In these scenarios, the request consists of multiple sequences that can partially share their KV cache. However, memory sharing is not possible in the existing systems because the KV cache of the sequences is stored in separate contiguous spaces.

Paged Attention divides the request’s KV cache into blocks, each of which can contain the attention keys and values of a fixed number of tokens. In Paged Attention, the blocks for the KV cache are not necessarily stored in contiguous space. Therefore, we can manage the KV cache in a more flexible way as in OS’s virtual memory: one can think of blocks as pages, tokens as bytes, and
requests as processes. This design alleviates internal fragmentation by using relatively small blocks and allocating them on demand. Moreover, it eliminates external fragmentation as all blocks have the same size. Finally, it enables memory sharing at the granularity of a block, across the different sequences associated with the same request or even across the different requests.

This text describes how Paged Attention uses a memory management strategy, very similar to how a computer's operating system (OS) handles virtual memory, to efficiently manage the K/V cache.

Here’s a detailed breakdown of each point:

### 1. "alleviates internal fragmentation"

- **The Problem (Internal Fragmentation):** This is wasted memory _inside_ an allocated block. Imagine you need to reserve VRAM for a user's K/V cache. You might reserve a contiguous 2048-token "slot" to be safe. If the user's prompt is only 10 tokens long, the 2038 "empty" token slots _inside_ that reserved block are wasted. This is internal fragmentation.
    
- **The Fix:** Paged Attention uses "relatively small blocks" (e.g., 16 tokens) and "allocat[es] them on demand." When the 10-token prompt arrives, it only gets allocated _one_ 16-token block. The waste is only 6 tokens (16-10), not 2038.
    

### 2. "eliminates external fragmentation"

- **The Problem (External Fragmentation):** This is wasted memory _between_ allocated blocks. Imagine your VRAM is like a street. You have a 100-token-long building, then a 20-token-long parking spot (free space), then a 500-token-long building, then a 30-token-long parking spot. You have 50 tokens of _total_ free VRAM, but you can't fit a new 40-token-long building because no single _contiguous_ spot is big enough.
    
- **The Fix:** Paged Attention works like a LEGO baseplate. "All blocks have the same size" (e.g., 16 tokens). If a new 40-token prompt arrives, it doesn't need one contiguous 40-token block; it just needs `ceil(40/16) = 3` small blocks, which it can grab from anywhere on the "baseplate." This _eliminates_ the problem of having unusable "gaps" in your VRAM.
    

### 3. "enables memory sharing at the granularity of a block"

- **The Problem (Duplicate Memory):** Imagine 10 users all send a prompt that starts with the same 500-token system message, or you are running a beam search where 4 different possible outputs (beams) share the same 100-token prompt. A naive system would store that 500-token (or 100-token) K/V cache 10 times (or 4 times), creating massive, redundant copies.
    
- **The Fix:** Since the K/V cache is stored in "blocks," Paged Attention can be smart. It stores the blocks for the shared 500-token prompt _once_. Then, all 10 user requests (or all 4 beams) are simply given "pointers" to that one shared copy. When they start generating their _own_ unique new tokens, they are just allocated new, separate blocks. This drastically saves memory.