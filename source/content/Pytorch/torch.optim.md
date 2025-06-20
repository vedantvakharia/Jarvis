
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


## Terms related to Optimizer Functions

### Learning Rate 
The learning rate is a tuning parameter in an optimization algorithm that determines the step size at each iteration while moving toward a minimum of a loss function. Since it influences to what extent newly acquired information overrides old information, it metaphorically represents the speed at which a machine learning model "learns".

In setting a learning rate, there is a trade-off between the rate of convergence and overshooting. While the descent direction is usually determined from the gradient of the loss function, the learning rate determines how big a step is taken in that direction. A too high learning rate will make the learning jump over minima but a too low learning rate will either take too long to converge or get stuck in an undesirable local minimum.

In order to achieve faster convergence, prevent oscillations and getting stuck in undesirable local minima the learning rate is often varied during training either in accordance to a learning rate schedule or by using an adaptive learning rate.

#### Learning Rate Scheduling
A learning rate schedule changes the learning rate during learning and is most often changed between epochs/iterations. This is mainly done with two parameters: **decay** and **momentum**. There are many different learning rate schedules but the most common are **time-based, step-based** and **exponential**.

**Time-based** learning schedules alter the learning rate depending on the learning rate of the previous time iteration. Factoring in the decay the mathematical formula for the learning rate is:
 ![{\displaystyle \eta {n+1}={\frac {\eta{n}}{1+dn}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/cfa070a24bc09ed2e0e3d1faab36cd9e0a287084) 
where η is the learning rate, d is a decay parameter and n is the iteration step.

**Step-based** learning schedules changes the learning rate according to some predefined steps. The decay application formula is here defined as:
 ![{\displaystyle \eta _{n}=\eta _{0}d^{\left\lfloor {\frac {1+n}{r}}\right\rfloor }}](https://wikimedia.org/api/rest_v1/media/math/render/svg/0635bfca6af3a701de5bbd1c580290fb9ad89935) 

where ![{\displaystyle \eta{n}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/cd926d56b81de76d958cf7efacd5df963f01297f) is the learning rate at iteration n , ![{\displaystyle \eta{0}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ef3886c3f161b7f02d23221bfead21a18ffb82ff) is the initial learning rate, d is how much the learning rate should change at each drop (0.5 corresponds to a halving) and r corresponds to the drop rate, or how often the rate should be dropped (10 corresponds to a drop every 10 iterations). The floor function here drops the value of its input to 0 for all values smaller than 1.

**Exponential** learning schedules are similar to step-based, but instead of steps, a decreasing exponential function is used. The mathematical formula for factoring in the decay is:
![{\displaystyle \eta {n}=\eta {0}e^{-dn}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b17e6270c5a70c3d69e466f4146588aa69023441) 

#### Adaptive learning rate
The issue with learning rate schedules is that they all depend on hyperparameters that must be manually chosen for each given learning session and may vary greatly depending on the problem at hand or the model used. To combat this, there are many different types of adaptive gradient descent algorithms such as Adagrad, Adadelta, [RMSprop](https://en.wikipedia.org/wiki/Stochastic_gradient_descent#RMSProp "Stochastic gradient descent"), and [Adam](https://en.wikipedia.org/wiki/Stochastic_gradient_descent#Adam "Stochastic gradient descent")

## Optimization Functions

### Stochastic Gradient Descent (SGD)
Stochastic Gradient Descent (SGD) is an optimization algorithm in machine learning, particularly when dealing with large datasets.

#### Need for SGD over GD
Given a training dataset of n examples, we assume that $f_i(x)$ is the loss function with respect to the training example of index i, where x is the parameter vector. Then we arrive at the objective function $$f(\mathbf{x}) = \frac{1}{n} \sum_{i = 1}^n f_i(\mathbf{x})$$The gradient of the objective function at x is computed as $$ \nabla f(\mathbf{x}) = \frac{1}{n} \sum_{i = 1}^n \nabla f_i(\mathbf{x})$$If gradient descent is used, the computational cost for each independent variable iteration is $\mathcal{O}(n)$, which grows linearly with n. Therefore, when the training dataset is larger, the cost of gradient descent for each iteration will be higher.

Stochastic gradient descent (SGD) reduces computational cost at each iteration. At each iteration of stochastic gradient descent, we uniformly sample an index $i\in\{1,\ldots, n\}$ for data examples at random, and compute the gradient $\nabla f_i(\mathbf{x})$ to update x::$$\mathbf{x} \leftarrow \mathbf{x} - \eta \nabla f_i(\mathbf{x})$$
We can see that the computational cost for each iteration drops from $\mathcal{O}(n)$ of the gradient descent to the constant $\mathcal{O}(1)$. Moreover, we want to emphasize that the stochastic gradient $\nabla f_i(\mathbf{x})$ is an unbiased estimate of the full gradient $\nabla f(\mathbf{x})$ because $$\mathbb{E}_i \nabla f_i(\mathbf{x}) = \frac{1}{n} \sum_{i = 1}^n \nabla f_i(\mathbf{x}) = \nabla f(\mathbf{x})$$
This means that, on average, the stochastic gradient is a good estimate of the gradient.


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
 
##### The need for Dynamic Learning Rate
Lets compare SGD with gradient descent by adding random noise with a mean of 0 and a variance of 1 to the gradient to simulate a stochastic gradient descent.
```python
def f(x1, x2):  # Objective function
    return x1 ** 2 + 2 * x2 ** 2

def f_grad(x1, x2):  # Gradient of the objective function
    return 2 * x1, 4 * x2

def sgd(x1, x2, s1, s2, f_grad):
    g1, g2 = f_grad(x1, x2)
    # Simulate noisy gradient
    g1 += torch.normal(0.0, 1, (1,)).item()
    g2 += torch.normal(0.0, 1, (1,)).item()
    eta_t = eta * lr()
    return (x1 - eta_t * g1, x2 - eta_t * g2, 0, 0)

def constant_lr():
    return 1

eta = 0.1
lr = constant_lr  # Constant learning rate
d2l.show_trace_2d(f, d2l.train_2d(sgd, steps=50, f_grad=f_grad))

epoch 50, x1: 0.225517, x2: -0.076646
```
![[output_sgd_baca77_15_1.svg]]
As we can see, the trajectory of the variables in the stochastic gradient descent is much more noisy than gradient descent. This is due to the stochastic nature of the gradient. That is, even when we arrive near the minimum, we are still subject to the uncertainty injected by the instantaneous gradient via $\eta \nabla f_i(\mathbf{x})$. Even after 50 steps the quality is still not so good. Even worse, it will not improve after additional steps (we encourage you to experiment with a larger number of steps to confirm this). This leaves us with the only alternative: change the learning rate . However, if we pick this too small, we will not make any meaningful progress initially. On the other hand, if we pick it too large, we will not get a good solution, as seen above. The only way to resolve these conflicting goals is to reduce the learning rate dynamically as optimization progresses.

Replacing $\eta$  with a time-dependent learning rate adds to the complexity of controlling convergence of an optimization algorithm. In particular, we need to figure out how rapidly should decay. If it is too quick, we will stop optimizing prematurely. If we decrease it too slowly, we waste too much time on optimization.

### Mini-Batch Stochastic Gradient Descent

#### Need for Mini-Batch Stochastic Gradient Descent over SGD

The Noise Problem
SGD uses exactly one randomly selected sample per parameter update. This approach is lightning fast. However, this speed comes with a serious cost. Each gradient computed from a single sample is extremely noisy. Think about it this way: if you're trying to learn to recognize cats versus dogs, and you base your entire parameter update on one picture of a black cat, you might learn that "black" is a strong indicator of "cat." But the next sample might be a black dog, causing you to completely reverse that learning.

This noise manifests in several problematic ways:

**Erratic Convergence Path**: Instead of smoothly descending toward the minimum, the optimization path becomes zigzagged and chaotic. The loss function might improve on average, but individual steps can actually make performance worse.

**Inability to Reach Precise Minima**: The noise prevents the algorithm from settling into sharp, precise minima. It's like trying to thread a needle while riding a bumpy bus.

**Hyperparameter Sensitivity**: The learning rate becomes extremely critical. Too high, and the noise overwhelms any learning signal. Too low, and progress becomes glacially slow.

**Less GPU Efficiency -** Since SGD processes only one sample at a time, it's inefficient for GPUs, which are designed for vectorized computations.

