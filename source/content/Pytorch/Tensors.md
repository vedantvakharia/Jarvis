
| Name       | What is it?                                                  | Number of dimensions | Lower or upper (usually/example) |
| ---------- | ------------------------------------------------------------ | -------------------- | -------------------------------- |
| **Scalar** | a single number                                              | 0                    | Lower (`a`)                      |
| **Vector** | a number with direction but can also have many other numbers | 1                    | Lower (`y`)                      |
| **Matrix** | a 2-dimensional array of numbers                             | 2                    | Upper (`Q`)                      |
| **Tensor** | an n-dimensional array of numbers                            | n                    | Upper (`X`)                      |

# Tensor operations
1. **Creating Tensors -** 
	1. `torch.tensor(data)` - Where data is a python list
	2. `torch.from_numpy()` - Tensor from a numpy array
	3. `torch.zeros()` - 
	4. `torch.ones()` - 
	5. `torch.eye(n)` - Creates a nxn identity tensor
	6. `torch.rand()` - Creates a tensor with random values from 0 to 1
	7. `torch.randint(a,b,(c,d))` - Creates a tensor with random values from a to b of shape cxd
	8. `torch.randn()` - Creates a tensor with normal distribution
	9. `torch.arange(start, end, step=1, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)`- When the `step` argument is a non-integer (floating point),`torch.arange()`generates numbers by repeated addition of`step` to `start` until reaching (but not exceeding)`end`. Since `torch.arange()` performs repeated additions, it can lead to floating-point precision errors. Use `torch.linspace()` if you need a precise number of points between two values.
	   
	  `torch.arrange(1,11)`
	  `tensor([1,2,3,4,5,6,7,8,9,10])`
	10. `torch.range`
	11. `torch.linspace(start, end, steps, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)` -  `requires_grad` - If `True`, gradients will be computed for the tensor during backpropagation.
	12. `torch.empty` - Empty tensor
	13. `torch.full(size, fill_value, *, out=None, dtype=None, layout=torch.strided, device=None, requires_grad=False)` - Creates a tensor filled with a specified scalar value. Shape is manually specified. Used when we know the desired shape and attributes.
	14. `torch.full_like(input, fill_value, *, dtype=None, layout=None, device=None, requires_grad=False, memory_format=torch.preserve_format)` - Creates a tensor filled with a specified scalar value but copies the shape of an existing tensor
2. **Tensor properties functions -** 
	1. `tensor.shape()`
	2. `tensor.size()`
	3. `tensor.ndim()`
	4. `tensor.numel()` - Returns the total number of elements in the tensor.
	5. `torch.equal(tensor1, tensor2)` - Checks if two tensors are equal (same size and elements)
	6. `torch.allclose(tensor1, tensor2)` - Checks if two tensors are element-wise close within a tolerance.
3. **Tensor attributes -**  In PyTorch, tensors have several attributes that provide information about their properties.
	1. `.shape` or `.size()` - Returns the **dimensions (shape)** of the tensor. `torch.Size` is a subclass of `tuple`.
	2. `.dtype` - Returns the **data type** of elements in the tensor.
	3. `.device` - Shows the **device** where the tensor is stored (`cpu` or `cuda`). If x is currently on device, `x = x.to('cuda')` transfers x to cuda. 
	4. `.requires_grad` - Indicates whether the tensor is tracking gradients for autograd. Default is `False`, useful in **neural network training**.
	5. `.is_leaf` - Returns `True` if the tensor is **a leaf node** (i.e., not created by an operation that requires gradients). If a tensor is the **result of an operation** (not manually created), it's **not a leaf**.
	   
	   `x = torch.tensor([1.0, 2.0], requires_grad=True)`
	    `print(x.is_leaf)  # Output: True`

		`y = x * 2`
		`print(y.is_leaf)  # Output: False`

	6. `.grad` - Stores the **gradient** of the tensor **if** `requires_grad=True`. Before calling `.backward()`, it is `None`.
	   
	   `x = torch.tensor(2.0, requires_grad=True)`
	   `y = x ** 2  # y = x^2`
	   
	   `y.backward()  # Compute gradients`
	   `print(x.grad)  # Output: tensor(4.)`
	   
	7. `.grad_fn` - If the tensor is the **result of an operation**, `.grad_fn` stores the **function that created it**.
	   
	   `x = torch.tensor(2.0, requires_grad=True)`
	   `y = x ** 2`
	   `print(y.grad_fn)  # Output: <PowBackward0 object at ...>`
	   
	8. `.ndim` - Returns the **number of dimensions (rank)** of the tensor.
	9. `.numel()` - Returns the **total number of elements** in the tensor.
	10. `.is_contiguous()` - Checks whether the tensor is **contiguous** in memory (stored in row-major order).
	11. `.stride()` - Returns a tuple showing **how many memory locations** to jump to move along each dimension.
	12. `.storage_offset()` - Returns the **offset** in the memory storage where the first element of the tensor is stored.
	    
	    `x = torch.arange(10)`
	    `y = x[2:]  # Slice the tensor`
	    `print(y.storage_offset())  # Output: 2`
	    
	13. `.layout` - Returns the **memory layout** of the tensor (`torch.strided` by default).
	14. `.data` - Accesses the raw **data** of a tensor **without tracking gradients**. Directly modifying `.data` can lead to issues in autograd.
	    
	    `x = torch.tensor([1.0, 2.0], requires_grad=True)`
	    `print(x.data)  # Output: tensor([1., 2.])`
	    
	    `x.data += 1  # This modifies the tensor but bypasses autograd`
	    `print(x)  # Output: tensor([2., 3.], requires_grad=True)`
	    
	15. `.tolist()` - Converts the tensor into a **Python list**.
	16. `.clone()` - Creates a **copy** of the tensor **with the same attributes**.
	17. `.detach()` - Returns a **new tensor** that **does not track gradients**.
4. **In place operations -** In PyTorch, in-place operations are operations that modify the data of a tensor directly, without creating a new tensor. These operations are identifiable by a trailing underscore (`_`) in their function names. 
	1. **Arithmetic operation -** 
		1. add_()
		2. sub_()
		3. mul_()
		4. div_()
		5. pow_()
		6. remainder_()
		7. floor_divide_()
		8. neg_()
	2. **Comparison & Logical Operations -**
		1. `tensor.clamp(min=None, max=None)/tensor.clip` - Restricts the values of a tensor within a specified range. Values less than min become the min value, values greater than max become the max value. 
		   
		   `import torch`
		   `x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0, 3.0])`
		   `x.clamp_(-1.0, 2.0)  # Values less than -1 become -1, values greater than 2 become 2`
		   `print(x)`
		   
		   **Output -** 
		 `  tensor([-1., -1.,  0.,  1.,  2.,  2.])`
		 
		 2. ceil_()
		 3. floor_()
		 4. round_()
		 5. trunc_()
		 6. abs_()
		 7. sign_()
		 8. 
	3. 
5. **Checking Contiguity -**
	2. `tensor.is_contiguous()` - Checks if the tensor is stored in contiguous memory.
	3. `tensor.contiguous()` - Returns a contiguous copy of the tensor if it's not already contiguous.
6. **Tensor and statistics -** 
	1. `torch.mean()` - Computes the mean (average) of all elements or along a specific dimension.
	2. `torch.median()` - Computes the median of all elements or along a specific dimension.
	3. `torch.mode()` - Returns the mode (most frequent value) along a specific dimension.
	4. `torch.sum()` - Computes the sum of all elements or along a specific dimension
	5. `torch.prod()` - Computes the product of all elements or along a specific dimension
	6. `torch.cumsum()` - Computes the cumulative sum along a specified dimension.
	7. `torch.cumprod()` - Computes the cumulative product along a specified dimension.
	8. `torch.var()` - Computes the variance of elements.
	9. `torch.std()` - Computes the standard deviation of elements.
	10. `torch.min()` - Without arguments, it computes the minimum value of all elements in the tensor. With the `dim` argument, it computes the minimum value along a specified dimension and also returns the indices of the minimum values.
	11. `torch.amin()` - It is used for finding the minimum value along specified dimensions
	13. `torch.argmin()` - It returns the index of minimum value along specified dimensions
	14. `torch.ptp(input, dim=None, keepdim=False)` - It returns a tensor containing the range (max - min) values.
	    - **`dim`** _(int, optional)_: The dimension along which to compute the range. Default is `None`, meaning the operation is performed on the flattened tensor. dim = 0 means along column and dim = 1 means along rows
		- **`keepdim`** _(bool, optional)_: Whether to retain the reduced dimension in the output as a dimension with size `1`. Default is `False`.
7. . **Tensor operations -** 
	1. 
	

8. **Matrix multiplication -** We can use `matmul(tensor A, tensor B)`, `A@B`, `mm(tensor A, tensor B)`. - If both arguments are at least 1-dimensional and at least one argument is N-dimensional (where N > 2), then a batched matrix multiply is returned. If the first argument is 1-dimensional, a 1 is prepended to its dimension for the purpose of the batched matrix multiply and removed after. If the second argument is 1-dimensional, a 1 is appended to its dimension for the purpose of the batched matrix multiple and removed after. The non-matrix (i.e. batch) dimensions are broadcasted (and thus must be broadcastable). For example, if `input` is a (j×1×n×n)(j×1×n×n) tensor and `other` is a (k×n×n)(k×n×n) tensor, `out` will be a (j×k×n×n)(j×k×n×n) tensor.
    
    Note that the broadcasting logic only looks at the batch dimensions when determining if the inputs are broadcastable, and not the matrix dimensions. For example, if `input` is a (j×1×n×m)(j×1×n×m) tensor and `other` is a (k×m×p)(k×m×p) tensor, these inputs are valid for broadcasting even though the final two dimensions (i.e. the matrix dimensions) are different. `out` will be a (j×k×n×p)(j×k×n×p) tensor.**

# Tensor layouts - 
## 1. torch.stride - 

A stride specifies the number of memory locations (steps) to skip in each dimension to move to the next element along that dimension. It determines how the tensor's elements are laid out in memory and how the tensor is accessed.

1. **Contiguity -** A tensor is contiguous if its memory layout matches the default (row-major order). Non-contiguous tensors arise after certain operations (e.g., slicing, transposing) but can be made contiguous with `.contiguous()`.
2. **`tensor.strides()` -** To find strides of a tensor
3. **`tensor_name.contiguous()` -** makes non contiguous tensors contiguous
4. **`print(tensor.is_contiguous())` -** to check if tensor is contiguous. Output = true means it is
5. **How does slicing makes tensors non contiguous -** When slicing, PyTorch doesn't create a new copy of the data; it references the same memory as the original tensor. This allows efficient slicing without duplicating large data. However, it does not preserve its default row-major order. Instead of copying data, slicing uses strides to reference only the relevant elements of the original memory, which can result in non-contiguous memory layouts. 
   E.g. - If there is a 3x3 tensor and we remove, the 2nd column. The stride of the sliced tensor will be `(3, 2)` which means that
    - To move to the next row, jump 3 memory locations (same as the original tensor).
    - To move to the next column, jump 2 memory locations (instead of 1 in the original tensor).
6. **Problem with non - contiguous tensors -** Operations on non-contiguous tensors may be slower because PyTorch has to jump around in memory instead of accessing contiguous blocks. The following PyTorch operations require the tensor to be contiguous.
	1. **Tensor Reshaping -** Functions like  `.view()` require contiguous tensors because they rely on the memory layout to interpret the shape.
	2. **In - place operations -** May fail or behave unexpectedly with non-contiguous tensors because they expect a regular memory layout.
	3. **Tensor Storage Conversion -** Conversions that depend on raw memory storage, like `.numpy()`, might not work with non-contiguous tensors.**Flattening and Broadcasting Operations -** Some flattening or broadcasting operations that assume contiguous strides might not behave as expected with non-contiguous tensors.
7. **Default memory layout -** The default memory layout row-major order, which means that the elements of a tensor are stored row by row in contiguous memory. 
	1. **Row major layout -** The last dimension (columns) changes fastest in memory. For a 2D tensor, the elements in a row are contiguous in memory.
	2. **Column-major order** (used in languages like Fortran and MATLAB) - The first dimension (rows) changes fastest.

## 2. torch.sparse_coo - 

1. It is stores data in the form of coordinate form. So it is used for sparse data like graphs or large matrices. It consists of indices and values. 
2. **Indices -** The **`indices`** tensor specifies the positions (coordinates) of the non-zero elements in the sparse tensor. It is a 2D tensor of size `(n, nnz)`, where `n` is the number of dimensions of the sparse tensor and`nnz` is the number of non-zero elements. Each column in the `indices` tensor represents the indices (coordinates) of a single non-zero element in the sparse tensor. Typically an integer tensor. 
3. **Values -** The **`values`** tensor contains the actual values of the non-zero elements in the sparse tensor. It is a 1D tensor of size `(nnz)`, where `nnz` is the number of non-zero elements. Each element in the `values` tensor corresponds to the value at the position specified by the respective column in the `indices` tensor. Typically a float tensor.
4. **Sparse tensor to dense tensor -** `dense_tensor = sparse_tensor.to_dense()`
```python
import torch

# Input -
	indices = torch.tensor([[0, 1, 1], [2, 0, 2]])  # Indices of non-zero elements
	values = torch.tensor([3.0, 4.0, 5.0])        # Non-zero values
	size = (2, 3)                                 # Shape of the dense tensor
	
	sparse_tensor = torch.sparse_coo_tensor(indices, values, size)
	print("Sparse Tensor:")
	print(sparse_tensor)
	
	dense_tensor = sparse_tensor.to_dense()`
	print("\nDense Tensor:")`
	print(dense_tensor)`

# Output - 
	Sparse Tensor:
	tensor(indices=tensor([[0, 1, 1],
	                       `[2, 0, 2]]),
	       values=tensor([3., 4., 5.]),
	       size=(2, 3), nnz=3, layout=torch.sparse_coo)
	
	Dense Tensor:`
	tensor([[0., 0., 3.],
	        [4., 0., 5.]])

```

5. **Dense tensor to sparse tensor -** `sparse_tensor = dense_tensor.to_sparse()`
```python
import torch

dense_tensor = torch.tensor([[1, 0, 0],
	                        [0, 0, 2],
	                        [0, 3, 0]], dtype=torch.float32)
	
sparse_tensor = dense_tensor.to_sparse()

print("Sparse Tensor:")
print(sparse_tensor)

print("\nIndices:")
print(sparse_tensor.indices())  # Non-zero positions

print("\nValues:")
print(sparse_tensor.values())  # Non-zero values

print("\nShape of Sparse Tensor:")
print(sparse_tensor.size())

# Output -
Dense tensor - [[1. 0. 0.]
				[0. 0. 2.]
				[0. 3. 0.]]

Sparse Tensor - tensor(indices=tensor([[0, 1, 2],
										[0, 2, 1]]),
						values=tensor([1., 2., 3.]),
						size=(3, 3), nnz=3, layout=torch.sparse_coo)
```

# Torch functions

1. `torch.cat(tensors, dim)` -  All tensors must have the same shape, except for the concatenation dimension. If dimensions don’t match, you’ll get a `RuntimeError`. Zero-dimensional (scalar) tensors cannot be concatenated.
	1. **Concatenating 1D Tensors** - 
	   
	   `tensor1 = torch.tensor([1, 2, 3])` 
	   `tensor2 = torch.tensor([4, 5, 6])`
	   `result = torch.cat((tensor1, tensor2), dim=0)`
	   `print(result)`
	   
	   **Output**
	   `tensor([1, 2, 3, 4, 5, 6])`
	   
	2. **Concatenating Along the First Dimension** (`dim=0`)
	   `import torch
	   
	   `tensor1 = torch.tensor([[1, 2], [3, 4]])` 
	   `tensor2 = torch.tensor([[5, 6]])`
	   
	   `result = torch.cat((tensor1, tensor2), dim=0)
	   `print(result)`
	   
	   **Output**
	   `tensor([[1, 2], 
			   `[3, 4],` 
			   `[5, 6]])``
		
	3. **Concatenating 3D Tensors -** 
	   
	   `tensor1 = torch.ones(2, 3, 4)` 
	   `tensor2 = torch.zeros(2, 3, 4)`
	   
	   `result_dim0 = torch.cat((tensor1, tensor2), dim=0)`
	   `result_dim1 = torch.cat((tensor1, tensor2), dim=1)`
	   `result_dim2 = torch.cat((tensor1, tensor2), dim=2)`
	   
	   `print(result_dim0.shape)` 
	   `print(result_dim1.shape)` 
	   `print(result_dim2.shape)`
	   
	   **Output**
	   `torch.Size([4, 3, 4])` 
	   `torch.Size([2, 6, 4])` 
	   `torch.Size([2, 3, 8])`
	   
2. `torch.vstack` - `torch.vstack()` **stacks (concatenates) tensors vertically along dimension 0 (row-wise stacking)**. It is equivalent to `torch.cat(tensors, dim=0)`. 
3. `torch.split(tensor, split_size_or_sections, dim)` - `torch.split()` splits a tensor into multiple smaller tensors along a specified dimension. Supports both equal-sized splits and variable-sized splits. If the second parameter is an **integer**, it divides the tensor into equal-sized chunks and if it is a **list/tuple**, it splits according to the given sizes.
	1. **Equal division -** 
	   `import torch`
	   `x = torch.tensor([1, 2, 3, 4, 5, 6])`
	   `splits = torch.split(x, 2)  # Split into chunks of size 2`
	   
	   `for i, s in enumerate(splits):`
	   `print(f"Split {i}: {s}")`
	   
	   Output - 
	   `Split 0: tensor([1, 2])`
	   `Split 1: tensor([3, 4])`
	   `Split 2: tensor([5, 6])`

	2. **Unequal division -** 
	   `x = torch.tensor([1, 2, 3, 4, 5])`
	   `splits = torch.split(x, 2)  # Size 5 is not divisible by 2`
	   `for i, s in enumerate(splits):`
	   `print(f"Split {i}: {s}")`
	   
	   Output - 
	   `Split 0: tensor([1, 2])`
	   `Split 1: tensor([3, 4])`
	   `Split 2: tensor([5])`
	   
	3. **Custom Split Sizes -** 
	   `x = torch.tensor([1, 2, 3, 4, 5, 6, 7])`
	   `splits = torch.split(x, [2, 3, 2])  # Custom split sizes`
	   
	   `for i, s in enumerate(splits):`
	   `print(f"Split {i}: {s}")`
	   
	   Output - 
	   `Split 0: tensor([1, 2])`
	   `Split 1: tensor([3, 4, 5])`
	   `Split 2: tensor([6, 7])`

	4. **Splitting Along Different Dimensions** -
	   `x = torch.tensor([[1, 2, 3],` 
                  `[4, 5, 6],` 
                  `[7, 8, 9]])`
	    `splits = torch.split(x, 2, dim=1)  # Split along columns (dim=1)`
	    
	    `for i, s in enumerate(splits):`
	    `print(f"Split {i}:\n{s}")`
	    
	    Output - 
	    `Split 0: tensor([[1, 2],`
				    `[4, 5],`
			        `[7, 8]])`

		`Split 1: tensor([[3],`
				    `[6],`
			        `[9]])`

4. `torch.squeeze(input, dim=None)` - Used to remove dimensions of size 1 from a tensor. So, it will not remove a dimension if it's size is not equal to 1. If `dim=None`, all singleton dimensions are removed. The returned tensor shares the storage with the input tensor, so changing the contents of one will change the contents of the other.
   
   `import` `torch`   
   
   `input` `=` `torch.randn(3`,`1`,`2,1`,`4)`
   `print("Dimension of input tensor:",` `input.dim())`
   `print`(``"Input tensor Size:\n",input.size())`
   
   `output` `=` `torch.squeeze(``input``,dim``=``0``)`
   `print``(``"Size after squeeze with dim=0:\n"``,``output.size())`
   
   `output` `=` `torch.squeeze(``input``,dim``=``1``)`
   `print``(``"Size after squeeze with dim=1:\n"``,``output.size())`
   
   `output` `=` `torch.squeeze(``input``,dim``=``2``)`
   `print("Size after squeeze with dim=2:\n",` `output.size())`
   
   `output` `=` `torch.squeeze(``input``,dim``=``3``)`
   `print``(``"Size after squeeze with dim=3:\n"``,``output.size())`
   
   `output` `=` `torch.squeeze(``input``,dim``=``4``)`
   `print``(``"Size after squeeze with dim=4:\n"``,``output.size())`
   
   **Output:**
   `Dimension of input tensor: 5`
   `Input tensor Size:`
   `torch.Size([3, 1, 2, 1, 4])`
   `Size after squeeze with dim=0:`
   `torch.Size([3, 1, 2, 1, 4])`
   `Size after squeeze with dim=1:`
   `torch.Size([3, 2, 1, 4])`
   `Size after squeeze with dim=2:`
   `torch.Size([3, 1, 2, 1, 4])`
   `Size after squeeze with dim=3:`
   `torch.Size([3, 1, 2, 4])`
   `Size after squeeze with dim=4:`
   `torch.Size([3, 1, 2, 1, 4])`
   
   Dimensions not equal to 1 are not removed as seen above.
   
5.  `torch.unsqueeze(tensor_name, dim)` - **`dim`**: The dimension (axis) along which to insert the new dimension. Can be negative.  Valid range for `dim` is from `-tensor.dim()-1` to `tensor.dim()`.
6. `torch.permute(tensor_name, (order of dim))` - Reorders the dimensions of a tensor.  
7. `torch.transpose`
8. `torch.reshape(input,shape)` - `torch.reshape()` is a function that changes the shape of a tensor **without altering its data**. It tries to return a **view** of the original tensor when possible, but if the memory layout is not compatible, it creates a new tensor (a copy).
9. `torch.flatten(input, start_dim=0, end_dim=-1)` - It returns a new tensor with the same data as the input but with the specified dimensions flattened into one.
	   - **`start_dim`** _(int, optional)_: The first dimension to flatten. Default is `0`.
	- **`end_dim`** _(int, optional)_: The last dimension to flatten. Default is `-1` (the last dimension).

# Tensor Views - 

In PyTorch, tensor views allow you to reshape or manipulate tensors without copying the underlying data. These operations return a new tensor that shares the same memory as the original tensor but with a different shape or structure. 

1. `tensor.view(shape)` - Changes the **shape** of a contiguous tensor. 
	1. Negative index
	   `x = torch.randn(4, 4)`
	   `x.size()`
	   `torch.Size([4, 4])`
	   
	   `z = x.view(-1, 8)  # the size -1 is inferred from other dimensions`
	   `z.size()`
	   `torch.Size([2, 8])`
	   
	   `-1` tells PyTorch to automatically infer the correct dimension based on the other specified dimension (`8` in this case). Since `x` has `16` elements, PyTorch determines `z` must have shape **[2, 8]** because `2 × 8 = 16`. This only works for -1 and not for any other negative number. 
	   
	 2. Difference between transpose and view - 
	    
	    `a = torch.randn(3, 2)`
	    `b = a.T`
	    `c = a.view(2,3)`
	    `a,b,c`
	    
	    `(tensor([[-0.4351, -0.6847],`
         `[-1.0502,  0.5902],`
         `[-0.2636, -0.3409]]),`
		`tensor([[-0.4351, -1.0502, -0.2636],`
         `[-0.6847,  0.5902, -0.3409]]),`
		`tensor([[-0.4351, -0.6847, -1.0502],`
         `[ 0.5902, -0.2636, -0.3409]]))`
         
	 3. **The Scaling Effect -** `view(dtype)` Returns a new tensor with the same data as the `self` tensor but of a different `dtype`. When changing the `dtype` (data type) of a tensor, the number of elements in the **last dimension** may **increase or decrease** depending on how the new `dtype` compares in **element size** to the original `dtype`. This is because memory is allocated in **bytes**, and the tensor layout in memory needs to remain valid. If the new `dtype` has a **larger element size**, the number of elements in the last dimension **decreases** and vice versa. 
	    
	    1. Conditions for `dtype` conversion -
		    1. `self.stride(-1) == 1`  - Ensures last dimension is stored **contiguously** in memory.
		    2. If new dtype is **larger**, `self.size(-1)` must be divisible by the ratio between the element sizes of the dtypes. - Prevents improper merging of elements.
		    3. If new dtype is **larger**, `self.storage_offset()` must be divisible by the ratio between the element sizes of the dtypes. - Ensures proper memory alignment.
		    4. If new dtype is **larger**, the strides of all dimensions, except the last dimension, must be divisible by the ratio between the element sizes of the dtypes. - Maintains correct memory indexing.
	    2. New `dtype` has a LARGER element size - Converting `torch.float16` (2 bytes per element) → `torch.float32` (4 bytes per element). `torch.float32` is **twice** the size of `torch.float16`. So, **pairs of elements** in the last dimension **combine**, reducing the size of the last dimension by **half**.
	    3. New `dtype` has a SMALLER element size - 
	 4. a
	 
2. `tensor.permute`
3. `tensor.transpose/tensor.T` - `tensor.T` is used for 2-d tensors
4. `tensor.reshape()` - 
5. `tensor.expand()` - `tensor.expand()` **returns a new tensor with expanded dimensions** without copying data. It is mainly used for **broadcasting** a tensor along specific dimensions. It **only works on dimensions of size `1`** (singleton dimensions). It **does not allocate new memory** (returns a view, not a copy).
   
   `import torch`
   `x = torch.tensor([[1], [2], [3]])  # Shape: (3,1)`
   `y = x.expand(3, 4)  # Expand the second dimension to size 4`
   `print(y)`
   
   `tensor([[1, 1, 1, 1],`
        `[2, 2, 2, 2],`
        `[3, 3, 3, 3]])`
6. 
   
# Broadcasting - 
Broadcasting is a **mechanism** that allows **tensors with different shapes** to be **operated together** (e.g., addition, multiplication) **without explicitly replicating data**. This makes computations more **memory-efficient** and **faster**.
1. **Broadcasting rules -** 
	1. **Padding with Ones (Left-Side Padding) -** If the two tensors have different ranks (number of dimensions), PyTorch automatically expands the smaller-rank tensor by adding dimensions of size `1` on the left.
	   
	   Tensor A has shape ****(5, 3)****
	   Tensor B has shape ****(3,)****
	   PyTorch pads Tensor B to become ****(1, 3).
	2. **Dimension Matching -** For each dimension in the tensors, PyTorch checks if the sizes match. The sizes are compatible if:
		   They are equal, or
		   One of them is 1. When a size is 1, that dimension will be ****"stretched"**** to match the size of the other tensor.
		
		Tensor A has shape ****(5, 3)****
		Tensor B has shape ****(1, 3)****
		The first dimension of Tensor B (with size 1) will be broadcasted to size 5.
2. Common operations using broadcasting - 
	1. Element-Wise Operations - 
	   
	   `import torch`
	   `A = torch.tensor([[1, 2, 3], [4, 5, 6]])  # Shape (2, 3)`
	   `B = torch.tensor([10, 20, 30])           # Shape (3,)`
	   `result = A + B  # Broadcasting B to shape (2, 3)`
	   `print("\nResult of a + b (after broadcasting):")`
	   `print(result)`
	   
	   Result of a + b (after broadcasting):
	   tensor([[11, 22, 33],
				[14, 25, 36]])

1. 
   
# Reproduction - 
Reproducibility means that when you run the **same code multiple times**, you get the **same results**. This is important in **machine learning and deep learning** because results can vary due to randomness in:
- **Random number generation** (e.g., dataset shuffling, weight initialization).
- **Hardware differences** (especially on GPUs).
- **Multi-threading and parallelism**.
  
1. **Reasons for variation** - 
	1. **Random Number Generation (RNG) -** PyTorch uses random number generators for weight initialization in neural networks., data augmentation(e.g., random crops, flips) and data shuffling in Data Loader.
	2. **CUDA & GPU Computations -** Some operations in PyTorch are implemented using **NVIDIA’s cuDNN library**, which optimizes performance but can be non-deterministic due to parallel execution. Tensor cores and floating-point arithmetic can also cause slight variations.
	3. **Multi-threading & Parallelism -** PyTorch leverages multiple CPU/GPU threads for speed. Some operations don’t always execute in the same order, causing minor variations.
2. **Deterministic and Non-deterministic Algorithms -** In a deterministic algorithm, for a given particular input, the computer will always produce the same output going through the same states but in the case of the non-deterministic algorithm, for the same input, the compiler may produce different output in different runs. Deterministic behaviour can be forced by using seeding. However, this slightly reduces training speed because PyTorch optimizations are sometimes non-deterministic.
   For exact reproducibility, use
   `torch.backends.cudnn.deterministic = True`
   `torch.backends.cudnn.benchmark = False`
3. **Seeding -** Seeding in programming, especially in the context of random number generation, refers to initializing the random number generator with a fixed value (called a **seed**). When you set a seed, the sequence of random numbers generated becomes reproducible. This is crucial for ensuring consistency and reproducibility in experiments, particularly in machine learning and scientific computations.
	1. **Reason of getting same output due to seeding** - Random number generators have a certain algorithm by which they give random numbers. The output of one iteration is used as the input for the next iteration. Now, the 1st number to go through the algorithm is decided upon the maker like number of keystrokes, number of apps opened, etc. Now, when we do seeding, we are giving the 1st number to this algorithm. That is why, seeding produces reproducibility as the algorithm has the same 1st number every time which gives the same 2nd number and so on. However, sometimes, the 1st number gets produced in the later iterations which results in a loop, i.e., the same numbers generated before are generated again. That is why, this is called Pseudo Random numbers. 
	2. We can take any number for seeding but programmers use 42 for historic reasons. 
	 3. **PyTorch General Seeding Functions**
		1. `torch.manual_seed(seed)` - Sets the seed for PyTorch's random number generator (RNG) for both **CPU** and **CUDA tensors**.
		2. `torch.seed()` - Returns a newly generated random seed.
		3. `torch.initial_seed()` - Returns the **current seed** set by `torch.manual_seed()`.
	4. **On Cuda**
		1. `torch.cuda.manual_seed(seed)`
		2. `torch.cuda.manual_seed_all(seed)`
		3. `torch.cuda.seed()`
		4. `torch.cuda.initial_seed()`
	5. **NumPy and Python Random Seeding**
		1. `random.seed(seed)` - Sets seed for Python’s built-in `random` module.
		2. `np.random.seed(seed)` - Sets seed for NumPy’s random number generator.
	6. Seeding in DataLoader
		1. `worker_init_fn=lambda x: np.random.seed(seed + x)` - Ensures each DataLoader worker gets a reproducible seed.
		2. `generator=torch.Generator().manual_seed(seed)` - Creates a fixed generator for PyTorch's DataLoader
4. 