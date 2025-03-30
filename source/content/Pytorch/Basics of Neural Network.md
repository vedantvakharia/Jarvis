

## Torch.nn

Contains all of the building blocks for computational graphs (essentially a series of computations executed in a particular way). Almost everything in a PyTorch neural network comes from `torch.nn`. 

1. **Forward Pass -** The forward pass is the process of passing input data through the layers of a neural network to obtain an output. In PyTorch, this is implemented through the forward() method of a model class that inherits from torch.nn.Module. The forward pass is essential for both training and inference, as it computes the predictions of the model given a set of inputs.
   
   The forward() function defines the computation performed at every call and must be overridden by all subclasses of torch.nn.Module. This function takes input data, processes it through the network's layers, and returns the output. The output can be logits, probabilities, or any other form of processed data, depending on the final layer of the network and the task at hand.