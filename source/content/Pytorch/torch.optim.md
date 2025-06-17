
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
| `m`        | Batch size                                      |
##### Learning rate
Learning rate controls the step size of each update. If it is too small, then there is slow convergence and if it is too large, then there is overshooting or divergence.
##### θ₀, θₜ — Parameters
These are the weights and biases of your model, i.e., they are the model parameters. θ₀ is the Initial value which is usually random or initialized using methods like Xavier, Kaiming, etc.

##### Weight decay / Regularization Co-efficient
Weight decay is a regularization technique used to prevent overfitting by discouraging large weights in the model. It works by adding a penalty to the loss function that increases as the magnitude of the weights increases(Few peaky weights means only those inputs connected to it are considered for decision making.). `Weight decay` is nothing but `L2 regularisation` of the weights, which can be achieved using `tf.nn.l2_loss`. 

During gradient descent parameter update, the above L2 regularization ultimately means that every weight is decayed linearly: $$w_{new} = w_{old} - \gamma \left( \frac{1}{m} \nabla L(w_t, B) + \lambda w_{old} \right)$$
. That's why its generally called `Weight decay`.

This formula ensures that SGD accounts for both the stochastic gradient of the loss and the regularization effect of weight decay.
Suppose your original loss function is:$$L(θ)=Loss(predictions, targets)$$
With weight decay (L2 regularization), it becomes $$L_{\text{total}}(θ)=L(θ)+λ⋅∥θ∥^2$$
Where:
- λ = regularization coefficient (in PyTorch: `weight_decay`)
- ∥θ∥^2 = sum of squares of the weights
  
##### Momentum
Momentum is an extension to the gradient descent optimization algorithm, often referred to as gradient descent with momentum.

It is designed to accelerate the optimization process, e.g. decrease the number of function evaluations required to reach the optima, or to improve the capability of the optimization algorithm, e.g. result in a better final result.

A problem with the gradient descent algorithm is that the progression of the search can bounce around the search space based on the gradient. For example, the search may progress downhill towards the minima, but during this progression, it may move in another direction, even uphill, depending on the gradient of specific points (sets of parameters) encountered during the search. This can slow down the progress of the search, especially for those optimization problems where the broader trend or shape of the search space is more useful than specific gradients along the way.

One approach to this problem is to add history to the parameter update equation based on the gradient encountered in the previous updates. This change is based on the metaphor of momentum from physics where acceleration in a direction can be accumulated from past updates.

```python title:"Example code to understand Momentum"
# Let us take the example where the function is x^2.

from numpy import asarray
from numpy.random import rand
from numpy.random import seed

# objective function
def objective(x):
	return x**2.0

# derivative of objective function
def derivative(x):
	return x * 2.0

# gradient descent algorithm
def gradient_descent(objective, derivative, bounds, n_iter, step_size, momentum):
	# generate an initial point
	solution = bounds[:, 0] + rand(len(bounds)) * (bounds[:, 1] - bounds[:, 0])
	# keep track of the change
	change = 0.0
	# run the gradient descent
	for i in range(n_iter):
		# calculate gradient
		gradient = derivative(solution)
		# calculate update
		new_change = step_size * gradient + momentum * change
		# take a step
		solution = solution - new_change
		# save the change
		change = new_change
		# evaluate candidate point
		solution_eval = objective(solution)
		# report progress
		print('>%d f(%s) = %.5f' % (i, solution, solution_eval))
	return [solution, solution_eval]

# seed the pseudo random number generator
seed(4)
# define range for input
bounds = asarray([[-1.0, 1.0]])
# define the total iterations
n_iter = 30
# define the step size
step_size = 0.1
# define momentum
momentum = 0.3
# perform the gradient descent search with momentum
best, score = gradient_descent(objective, derivative, bounds, n_iter, step_size, momentum)
print('Done!')
print('f(%s) = %f' % (best, score))
```
![[Figure_1 1.png]]
This is with Momentum = 0.3 (Ideal one for this example). Convergence was achieved in 13 iterations![[Figure_1 2.png]]
This is with momentum = 0.8. Convergence was achieved in 49 iterations.![[Figure_1 3.png]]
This is with momentum = 0.1. Convergence was achieved in 23 iterations.



In **standard SGD**, each step depends _only_ on the current gradient: $$ θ_{t+1} = θ_t−η⋅∇L(θ_t)$$
But with **momentum**, we update using a velocity term that carries over information from the previous steps:
$$
\begin{align}
v_t = \mu v_{t-1} - \eta \cdot \nabla L(\theta_t) \\
\theta_{t+1} = \theta_t + v_t
\end{align}
$$
 ​The velocity term stores accumulated gradients. Initially 0, then picks up speed. If the momentum value is too small, then there will be slow convergence whereas if it is too large, then the function may diverge or oscillate.