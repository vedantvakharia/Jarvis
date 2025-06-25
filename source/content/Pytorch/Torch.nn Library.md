Contains all of the building blocks for computational graphs (essentially a series of computations executed in a particular way). Almost everything in a PyTorch neural network comes from `torch.nn`. 
## Forward Function

The PyTorch forward pass is the process of computing the output of a neural network given an input. It is the first step in training a neural network and is also used to make predictions on new data. The forward pass is implemented by the forward() method of a PyTorch model. This method takes the input data and returns the output data as output. The forward pass can be as simple as a single linear layer or as complex as a multi-layer neural network with multiple hidden layers. The output can be logits, probabilities, or any other form of processed data, depending on the final layer of the network and the task at hand.

The forward() function defines the computation performed at every call and must be overridden by all subclasses of torch.nn.Module.

A normal training loop looks like this:
1. **Forward pass** → `output = model(input)`
2. **Loss calculation** → `loss = criterion(output, target)`
3. **Backward pass** → `loss.backward()`
4. **Optimizer step** → `optimizer.step()`
5. **Repeat**
So the forward pass is the first computational step.

It just computes output and does not update weights. Weights only update after `loss.backward()` + `optimizer.step()`.

## torch.nn.parameter
`torch.nn.Parameter` is a special kind of tensor that is automatically registered as a learnable parameter when assigned as an attribute to a `nn.Module`. It’s how PyTorch knows what tensors should be updated during training (via `optimizer.step()`). 

```python
# Internal code
class Parameter(torch.Tensor):
    def __new__(cls, data, requires_grad=True):
        return super().__new__(cls, data, requires_grad)

# Example
import torch
import torch.nn as nn

class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(3, 3))  # Learnable
        self.bias = nn.Parameter(torch.randn(3))       # Learnable

    def forward(self, x):
        return torch.matmul(x, self.weight) + self.bias
# Here, as self.weight and self.bias are instances of nn.Parameter, they are automatically added to the model’s .parameters().
```


## Loss functions
Loss functions measure the difference between the network's predictions and the actual target values. Loss functions in PyTorch are crucial for training neural networks, as they measure how well or poorly a model is performing. Different types of loss functions are used based on the nature of the task, such as regression, classification, or probabilistic modeling.  Loss functions are usually differentiable across their domain (but it is allowed that the gradient is undefined only for very specific points, such as , which is basically ignored in practice). In the training loop, they are differentiated with respect to parameters, and these gradients are used for your backpropagation and gradient descent steps to optimize your model on the training set.

### Regression Losses
Used when the model is predicting continuous values.
#### L1 Loss Function
Creates a criterion that measures the mean absolute error (MAE) between each element in the input x and target y. More robust to outliers than MSE because it doesn’t square the error. The reduction parameter specifies how the loss is reduced over the batch. $$MAE = \frac{1}{N} \sum_{i=1}^{N} | y_i - \hat{y}_i |$$
![[pytorch-loss1.png]]

**Syntax -** `torch.nn.L1Loss(reduction)`
Reduction parameter has 3 options 
- `mean`- (default): Returns the average loss.
- `sum`- Returns the total sum of errors.
- `none`- Returns loss per element without reduction.
  
#### MSE Loss Function
Creates a criterion that measures the mean squared error (squared L2 norm) between each element in the input x and target y. One property is that the mean squared error favors a large number of small errors over a small number of large errors, which leads to models with fewer outliers or at least outliers that are less severe than models trained with a MAE. This is because a large error would have a significantly larger impact on the error and, consequently, the gradient of the error when compared to a small error. Works best when the data has normally distributed errors. $$MSE = \frac{1}{N} \sum_{i=1}^{N} | y_i - \hat{y}_i |^2$$
![[pytorch-loss2.png]]

```python
# Syntax - 
torch.nn.MSELoss(size_average=None,reduce=None,reduction='mean')

loss = nn.MSELoss()
output = loss(input, target)
```



## Linear Layers

### What is a Linear Layer?
A linear layer (also called a fully connected layer or dense layer) performs a linear affine transformation on its input. It's the fundamental building block of neural networks, implementing the mathematical operation: $$y = xW^T + b$$
where 
- `x` is the input tensor of shape `(batch_size, in_features)`
- `W` is the weight matrix of shape `(out_features, in_features)`
- `b` is the bias vector of shape `(out_features,)`
- `y` is the output tensor of shape `(batch_size, out_features)`
### Implementation in Pytorch

```python title:"Without nn.linear"
class LinearRegressionModel(nn.Module):
	def __init__(self)
		super().__init__()
		# Initialize Model Parameters
		self.weights = nn.Parameter(torch.randn(1, requires_grad = True, dtype = torch.float))
		self.weights = nn.Parameter(torch.randn(1, requires_grad = True, dtype = torch.float))

	def forward(self, x:torch.Tensor) ->torch.Tensor
		return self.weights*x + self.bias
```

```python title:"With nn.linear" 
class LinearRegressionModel(nn.Module):
	def __init__(self)
		super().__init__()
		self.linear_layer = nn.linear(in_features = 1, out_features = 1)

	def forward(self, x:torch.Tensor) ->torch.Tensor
		return self.weights*x + self.bias

torch.manual_seed(42)
model_1 = LinearRegressionModel()

# Set model to GPU if it's available, otherwise it'll default to CPU
model_1.to(device) # the device variable was set above to be "cuda" if available or "cpu" if not
next(model_1.parameters()).device

# Create loss function
loss_fn = nn.L1Loss()

# Create optimizer
optimizer = torch.optim.SGD(params=model_1.parameters(), # optimize newly created model's parameters
                            lr=0.01)

# Training loop
torch.manual_seed(42)

# Set the number of epochs 
epochs = 1000 

# Put data on the available device
# Without this, error will happen (not all model/data on device)
X_train = X_train.to(device)
X_test = X_test.to(device)
y_train = y_train.to(device)
y_test = y_test.to(device)

for epoch in range(epochs):
    ### Training
    model_1.train() # train mode is on by default after construction

    # 1. Forward pass
    y_pred = model_1(X_train)

    # 2. Calculate loss
    loss = loss_fn(y_pred, y_train)

    # 3. Zero grad optimizer
    optimizer.zero_grad()

    # 4. Loss backward
    loss.backward()

    # 5. Step the optimizer
    optimizer.step()

    ### Testing
    model_1.eval() # put the model in evaluation mode for testing (inference)
    # 1. Forward pass
    with torch.inference_mode():
        test_pred = model_1(X_test)
    
        # 2. Calculate the loss
        test_loss = loss_fn(test_pred, y_test)

    if epoch % 100 == 0:
        print(f"Epoch: {epoch} | Train loss: {loss} | Test loss: {test_loss}")
```

### nn.Linear
`Class torch.nn.Linear(_in_features_, _out_features_, _bias=True_, _device=None_, _dtype=None_)`. This applies the affine linear transformation. 

```python title:"Code behind nn.Linear"
class Linear(Module)	
	__constants__ = ["in_features", "out_features"]
    in_features: int
    out_features: int
    weight: Tensor

    def __init__(self, in_features: int, out_features: int, bias: bool = True, device=None,
        dtype=None,
    ) -> None:
        factory_kwargs = {"device": device, "dtype": dtype}
        super().__init__()
        self.in_features = in_features
        self.out_features = out_features
        self.weight = Parameter(
            torch.empty((out_features, in_features), **factory_kwargs)
        )
        if bias:
            self.bias = Parameter(torch.empty(out_features, **factory_kwargs))
        else:
            self.register_parameter("bias", None)
        self.reset_parameters()

    def reset_parameters(self) -> None:
        # Setting a=sqrt(5) in kaiming_uniform is the same as initializing with
        # uniform(-1/sqrt(in_features), 1/sqrt(in_features)). For details, see
        # https://github.com/pytorch/pytorch/issues/57109
        init.kaiming_uniform_(self.weight, a=math.sqrt(5))
        if self.bias is not None:
            fan_in, _ = init._calculate_fan_in_and_fan_out(self.weight)
            bound = 1 / math.sqrt(fan_in) if fan_in > 0 else 0
            init.uniform_(self.bias, -bound, bound)

    def forward(self, input: Tensor) -> Tensor:
        return F.linear(input, self.weight, self.bias)

    def extra_repr(self) -> str:
        return f"in_features={self.in_features}, out_features={self.out_features}, bias={self.bias is not None}"


# This class exists solely to avoid triggering an obscure error when scripting
# an improperly quantized attention layer. See this issue for details:
# https://github.com/pytorch/pytorch/issues/58969
# TODO: fail fast on quantization API usage error, then remove this class
# and replace uses of it with plain Linear
```
