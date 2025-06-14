
Optimization is a process where we try to find the best possible set of parameters for a deep learning model. Optimizers generate new parameter values and evaluate them using some criterion to determine the best option.

## Constructing an Optimizer
To construct an Optimizer, you have to give it an iterable containing the parameters (all should be `Parameter` s) or named parameters (tuples of (str, `Parameter`)) to optimize. Then, you can specify optimizer-specific options such as the learning rate, weight decay, etc.

```python
# Example
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)
optimizer = optim.Adam([var1, var2], lr=0.0001)

# Named parameters example:
optimizer = optim.SGD(model.named_parameters(), lr=0.01, momentum=0.9)
optimizer = optim.Adam([('layer0', var1), ('layer1', var2)], lr=0.0001)
```

## Taking an optimization step

All optimizers implement a`step()`method, that updates the parameters ,i.e., because of `step()` method, the model learns. It can be used in two ways 
### `optimizer.step()`
This is a simplified version supported by most optimizers. The function can be called once the gradients are computed using e.g. `backward()`.

Example:
```python
for input, target in dataset:
    optimizer.zero_grad()
    output = model(input)
    loss = loss_fn(output, target)
    loss.backward()
    optimizer.step()
   
# Internally, this happens for SGD
for param in model.parameters():
    if param.grad is None:
        continue
    param.data -= learning_rate * param.grad
# Each parameter is updated in-place using its gradient and the optimizer’s update rule (momentum, etc.).
```

**What Does `param.grad` Store?**
- After calling `loss.backward()`, every parameter gets its `.grad` field populated.
- `optimizer.step()` uses those `.grad` values.
- These are automatically cleared only when you call `optimizer.zero_grad()`.
### `optimizer.step(closure)`

Some optimization algorithms such as Conjugate Gradient and LBFGS need to reevaluate the function multiple times, so you have to pass in a closure that allows them to recompute your model. The closure should clear the gradients, compute the loss, and return it.

Example:
```css
for input, target in dataset:
    def closure():
        optimizer.zero_grad()
        output = model(input)
        loss = loss_fn(output, target)
        loss.backward()
        return loss
    optimizer.step(closure)
```

## Optimization Functions

### Stochastic Gradient Descent (SGD)
Stochastic Gradient Descent (SGD) is an optimization algorithm in machine learning, particularly when dealing with large datasets.

#### Need for SGD over GD
The update rule for the traditional gradient descent algorithm is:$$θ=θ−η∇_θJ(θ)$$
In traditional gradient descent, the gradients are computed based on the entire dataset, which can be computationally expensive for large datasets. For large datasets, computing the gradient using all data points can be slow and memory-intensive. This is where SGD comes into play. Instead of using the full dataset to compute the gradient at each step, SGD uses only one random data point (or a small batch of data points) at each iteration. This makes the computation much faster.
![[stochastic.webp]]

#### Terms related to SGD

| Symbol     | Meaning                                         |
| ---------- | ----------------------------------------------- |
| `γ`        | Learning rate (`lr`)                            |
| `θₜ`       | Parameters at iteration `t`                     |
| `f(θ)`     | Loss function (objective)                       |
| `λ`        | Weight decay                                    |
| `μ`        | Momentum                                        |
| `τ`        | Dampening                                       |
| `bₜ`       | Momentum buffer                                 |
| `gₜ`       | Gradient at time `t`                            |
| `maximize` | Whether we are maximizing instead of minimizing |
##### Learning rate
Learning rate controls the step size of each update. If it is too small, then there is slow convergence and if it is too large, then there is overshooting or divergence.
##### θ₀, θₜ — Parameters
These are the weights and biases of your model, i.e., they are the model parameters. θ₀ is the Initial value which is usually random or initialized using methods like Xavier, Kaiming, etc.

##### Weight decay
**Weight decay** is a **regularization technique** used to **prevent overfitting** by discouraging large weights in the model. It works by **adding a penalty to the loss function** that increases as the magnitude of the weights increases(Few peaky weights means only those inputs connected to it are considered for decision making.). `Weight decay` is nothing but `L2 regularisation` of the weights, which can be achieved using `tf.nn.l2_loss`. 

During gradient descent parameter update, the above L2 regularization ultimately means that every weight is decayed linearly: $$W_{\text{new}} = (1 - \lambda) \cdot W_{\text{old}} + \alpha \cdot \frac{\partial J}{\partial w}$$
That's why its generally called `Weight decay`.


Suppose your original loss function is:$$L(θ)=Loss(predictions, targets)$$
With weight decay (L2 regularization), it becomes $$L_{\text{total}}(θ)=L(θ)+λ⋅∥θ∥^2$$
Where:
- λ\lambdaλ = regularization coefficient (in PyTorch: `weight_decay`)
- ∥θ∥2\|\theta\|^2∥θ∥2 = sum of squares of the weights