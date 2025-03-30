 
### 1. **Array Creation**

- `np.array()`: Create an array from a list or tuple.
- `np.zeros()`: Create an array filled with zeros.
- `np.ones()`: Create an array filled with ones.
- `np.empty()`: Create an uninitialized array.
- `numpy.arange([start,] stop[, step,], dtype=None)`: Create an array with evenly spaced values. **`dtype`** (optional): The desired data type of the array. If not specified, it is inferred from the inputs.
- `numpy.linspace(start, stop, num=50, endpoint=True, retstep=False, dtype=None, axis=0)`: Create an array with evenly spaced numbers over a specified range. - 
  **`num`** (optional): The number of evenly spaced samples to generate. Default is `50`.
  **`endpoint`** (optional): If `True` (default), includes the `stop` value in the array. If `False`, excludes it.
  **`retstep`** (optional): If `True`, returns the spacing (step size) between samples along with the array.
  **`dtype`** (optional): The data type of the output array.
  **`axis`** (optional): The axis in the result along which the samples are stored (useful for higher-dimensional data).
- `np.eye()`: Create a 2D identity matrix.
- `np.random.rand()`: Create an array of random values between 0 and 1.
- `np.random.randn()`: Create an array of random values with standard normal distribution.
- `np.random.randint()`: Create an array of random integers.
- `np.fromfunction()`: Construct an array by executing a function over each coordinate.
- `np.full()`: Create an array filled with a specific value.

### 2. **Array Manipulation**

- `np.reshape()`: Change the shape of an array. To reshape data , initial size of array must be same as final size ( eg 2 x 2 =4 x1)
- `np.ravel()`: Flatten an array.
- `np.transpose()`: Transpose an array.
- `np.vstack()`, `np.hstack()`: Stack arrays vertically and horizontally.
- `concatenated = np.concatenate((array1, array2), axis=0):` Join arrays along an existing axis. Axis=0 vertical concatenation. Axis=1 horizontal concatenation.
- `np.split()`: Split an array into multiple sub-arrays.
- `np.tile()`: Repeat an array a specified number of times.
- `np.repeat()`: Repeat elements of an array.
- `np.squeeze()`: Remove single-dimensional entries from the shape of an array.
- `np.expand_dims()`: Add a new axis to an array.
- `np.swapaxes()`: Interchange two axes of an array.
- `np.flip()`: Reverse the order of elements along an axis.
- `np.random.choice(array name, , replace=True, p=)`

### 3. **Mathematical Functions**

- `np.add()`, `np.subtract()`, `np.multiply()`, `np.divide()`: Basic element-wise operations.
- `np.power()`: Raise array elements to a power.
- `np.mod()`: Element-wise modulus.
- `np.dot()`: Dot product of two arrays.
- `np.matmul()`: Matrix product of two arrays.
- `np.exp()`: Element-wise exponential.
- `np.log()`, `np.log10()`: Natural and base-10 logarithm.
- `np.sqrt()`: Element-wise square root.
- `np.sin()`, `np.cos()`, `np.tan()`: Trigonometric functions.
- `np.arcsin()`, `np.arccos()`, `np.arctan()`: Inverse trigonometric functions.
- `np.sinh()`, `np.cosh()`, `np.tanh()`: Hyperbolic functions.
- `np.floor()`, `np.ceil()`, `np.round()`: Rounding functions.
- `np.abs()`: Absolute value of elements.
- `np.sign()`: Returns the sign of elements.

### 4. **Statistics**

- `np.mean()`: Compute the arithmetic mean.
- `np.median()`: Compute the median.
- `np.std()`: Compute the standard deviation.
- `np.var()`: Compute the variance.
- `np.sum()`: Sum of elements.
- `np.prod()`: Product of elements.
- `np.min()`, `np.max()`: Minimum and maximum values.
- `np.percentile()`: Compute the percentile.
- `np.quantile()`: Compute the quantile.
- `np.cumsum()`: Cumulative sum of the elements.
- `np.cumprod()`: Cumulative product of the elements.
- `np.corrcoef()`: Pearson product-moment correlation coefficients.
- `np.histogram()`: Compute the histogram of a dataset.
- `np.bincount()`: Count occurrences of each value in an array of non-negative ints.

### 5. **Linear Algebra**

- `np.linalg.inv()`: Compute the inverse of a matrix.
- `np.linalg.det()`: Compute the determinant of a matrix.
- `np.linalg.eig()`: Compute the eigenvalues and eigenvectors of a matrix.
- `np.linalg.svd()`: Perform singular value decomposition (SVD).
- `np.linalg.norm()`: Compute the matrix or vector norm.
- `np.linalg.solve()`: Solve a system of linear equations.
- `np.linalg.cholesky()`: Cholesky decomposition.
- `np.dot()`: Matrix multiplication (dot product).
- `np.inner()`, `np.outer()`: Inner and outer product of two arrays.

### 6. **Random Numbers**

- `np.random.seed()`: Set the random seed.
- `np.random.rand()`: Generate random numbers from a uniform distribution.
- `np.random.randn()`: Generate random numbers from a standard normal distribution.
- `np.random.randint()`: Generate random integers within a specified range.
- `np.random.choice()`: Generate a random sample from an array.
- `np.random.permutation()`: Randomly permute an array.
- `np.random.shuffle()`: Shuffle an array in-place.

### 7. **Sorting, Searching, and Counting**

- `np.sort()`: Sort an array.
- `np.argsort()`: Indices that would sort an array.
- `np.argmax()`, `np.argmin()`: Indices of the maximum and minimum values.
- `np.searchsorted()`: Find indices where elements should be inserted to maintain order.
- `np.nonzero()`: Return the indices of non-zero elements.
- `np.unique()`: Find unique elements in an array.
- `np.count_nonzero()`: Count the number of non-zero elements.

### 8. **Logic and Comparison**

- `np.greater()`, `np.less()`, `np.equal()`: Element-wise comparison.
- `np.logical_and()`, `np.logical_or()`, `np.logical_not()`: Logical operations.
- `np.isfinite()`, `np.isnan()`, `np.isinf()`: Check for finite, NaN, or infinite values.
- `np.where()`: Return elements based on condition.
- `np.all()`, `np.any()`: Test whether all or any elements evaluate to True.
- `np.array_equal()`: Check if two arrays are element-wise equal.

### 9. **I/O (Input/Output)**

- `np.load()`: Load arrays from a `.npy` file.
- `np.save()`: Save an array to a binary file in `.npy` format.
- `np.loadtxt()`, `np.savetxt()`: Load and save arrays to/from text files.
- `np.genfromtxt()`: Load data from a text file, with missing values handled.

### 10. **Data Type Functions**

- `np.astype()`: Cast to a specified data type.
- `np.dtype()`: Data type object.
- `np.iscomplex()`, `np.isreal()`: Check for complex or real elements.
- `np.isscalar()`: Determine if an input is a scalar.

### 11. **Time functions**
1. `pd.date_range(start = , end = )` -  This function generates a sequence of dates between the specified start and end dates.

For a 2D array, `axis=0` means taking the mean down the columns, and `axis=1` means taking the mean across the rows.