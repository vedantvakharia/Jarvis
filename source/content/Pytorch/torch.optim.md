
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
The issue with learning rate schedules is that they all depend on hyperparameters that must be manually chosen for each given learning session and may vary greatly depending on the problem at hand or the model used. To combat this, there are many different types of adaptive gradient descent algorithms such as Adagrad, Adadelta, RMSprop, and Adam.
### Momentum
Momentum is an extension to the gradient descent optimization algorithm, often referred to as gradient descent with momentum. It is designed to accelerate the optimization process, e.g. decrease the number of function evaluations required to reach the optima, or to improve the capability of the optimization algorithm, e.g. result in a better final result.

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
#### The need of Momentum
With gradient descent, a weight update at time _t_ is given by the learning rate and gradient at that exact moment. This means that the previous steps are not considered when searching for the next iteration's solution.

This results in two issues:

1. Unlike convex functions, a non-convex cost function can have many local minima's meaning the first local minima found is not guaranteed to be the global minima. At the local minima, the gradient of the cost function will be very small resulting in no weight updates. Because of this, gradient descent will get stuck and fail to find the global optimal solution.
2. Gradient descent can be noisy with many oscillations which results in a larger number of iterations needed to reach convergence.
3. A problem with the gradient descent algorithm is that the progression of the search can bounce around the search space based on the gradient. For example, the search may progress downhill towards the minima, but during this progression, it may move in another direction, even uphill, depending on the gradient of specific points (sets of parameters) encountered during the search. This can slow down the progress of the search, especially for those optimization problems where the broader trend or shape of the search space is more useful than specific gradients along the way.

Momentum is able to solve these issues buy using an exponentially weighted average of the gradients to update the weights at each iteration. This method also prevents gradients of previous iterations to be weighted equally. With an exponential weighted average, recent gradients are given more weight than previous gradients.

Let $f(\mathbf{x}) = 0.1x_1^2 + 2 x_2^2$. f has its minimum at (0,0). This function is _very_ flat in the direction of . Let’s see what happens when we perform gradient descent. We pick a learning rate of 0.4
```python
import torch
from d2l import torch as d2l

eta = 0.4
def f_2d(x1, x2):
    return 0.1 * x1 ** 2 + 2 * x2 ** 2
def gd_2d(x1, x2, s1, s2):
    return (x1 - eta * 0.2 * x1, x2 - eta * 4 * x2, 0, 0)

d2l.show_trace_2d(f_2d, d2l.train_2d(gd_2d))

# epoch 20, x1: -0.943467, x2: -0.000073
```

![[output_momentum_e3683f_3_1.svg]]
By construction, the gradient in the direction $x_2$ is _much_ higher and changes much more rapidly than in the horizontal $x_1$ direction. Thus we are stuck between two undesirable choices: if we pick a small learning rate we ensure that the solution does not diverge in the direction but we are saddled with slow convergence in the direction. Conversely, with a large learning rate we progress rapidly in the direction but diverge in . The example below illustrates what happens even after a slight increase in learning rate from to . Convergence in the direction improves but the overall solution quality is much worse.


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

#### What is Mini-Batch Stochastic Gradient Descent
Mini-batch SGD is an optimization technique that updates model parameters by computing the gradient of the loss function over a small, randomly selected subset of the training data, known as a mini-batch. The process involves:

1. **Random Sampling**: Select a mini-batch of size b b b (e.g., 32, 64) from the training dataset, ensuring randomness to maintain representativeness.
2. **Forward Pass**: Compute predictions for the mini-batch using the current model parameters.
3. **Loss Computation**: Calculate the loss (e.g., mean squared error, cross-entropy) between predictions and true labels for the mini-batch.
4. **Backward Pass**: Compute the gradients of the loss with respect to model parameters using backpropagation.
5. **Parameter Update**: Update the parameters using the computed gradients and a learning rate η, typically via the rule θ=θ−η⋅gradient
6. **Iteration**: Repeat the process until convergence or for a fixed number of epochs (passes through the dataset).

This approach introduces controlled stochasticity, which can help escape local minima and accelerate convergence compared to batch gradient descent. 

#### Mathematical Formulation
$$ \mathbf{g}_t = \partial_{\mathbf{w}} \frac{1}{|\mathcal{B}_t|} \sum_{i \in \mathcal{B}_t} f(\mathbf{x}_{i}, \mathbf{w})$$

Where ${B}_t$ is the sample size. $$ θ=\theta - \eta \cdot \frac{1}{b} \sum_{i \in B} \nabla_\theta J_i(\theta)$$
If we compare Mini-Batch SGD with GD, then since both $\mathbf{x}_t$ and also all elements of the minibatch $\mathcal{B}_t$ are drawn uniformly at random from the training set, the expectation of the gradient remains unchanged. The variance, on the other hand, is reduced significantly. Since the minibatch gradient is composed of $b \stackrel{\textrm{def}}{=} |\mathcal{B}_t|$ independent gradients which are being averaged, its standard deviation is reduced by a factor of $b^{-\frac{1}{2}}$ . This, by itself, is a good thing, since it means that the updates are more reliably aligned with the full gradient.

Naively this would indicate that choosing a large minibatch $\mathcal{B}_t$ would be universally desirable. Alas, after some point, the additional reduction in standard deviation is minimal when compared to the linear increase in computational cost. In practice we pick a minibatch that is large enough to offer good computational efficiency while still fitting into the memory of a GPU.

#### Mini-Batch SGD vs SGD vs GD

```python title:"Mini-Batch SGD vs SGD vs GD"
def sgd(params, states, hyperparams):
    for p in params:
        p.data.sub_(hyperparams['lr'] * p.grad)
        p.grad.data.zero_()

# We implement a generic training function to facilitate the use of the other optimization algorithms introduced later in this chapter. It initializes a linear regression model and can be used to train the model with minibatch stochastic gradient descent and other algorithms introduced subsequently.

def train_ch11(trainer_fn, states, hyperparams, data_iter,
               feature_dim, num_epochs=2):
    # Initialization
    w = torch.normal(mean=0.0, std=0.01, size=(feature_dim, 1),
                     requires_grad=True)
    b = torch.zeros((1), requires_grad=True)
    net, loss = lambda X: d2l.linreg(X, w, b), d2l.squared_loss
    # Train
    animator = d2l.Animator(xlabel='epoch', ylabel='loss',
                            xlim=[0, num_epochs], ylim=[0.22, 0.35])
    n, timer = 0, d2l.Timer()
    for _ in range(num_epochs):
        for X, y in data_iter:
            l = loss(net(X), y).mean()
            l.backward()
            trainer_fn([w, b], states, hyperparams)
            n += X.shape[0]
            if n % 200 == 0:
                timer.stop()
                animator.add(n/X.shape[0]/len(data_iter),
                             (d2l.evaluate_loss(net, data_iter, loss),))
                timer.start()
    print(f'loss: {animator.Y[0][-1]:.3f}, {timer.sum()/num_epochs:.3f} sec/epoch')
    return timer.cumsum(), animator.Y[0]

def train_sgd(lr, batch_size, num_epochs=2):
    data_iter, feature_dim = get_data_ch11(batch_size)
    return train_ch11(
        sgd, None, {'lr': lr}, data_iter, feature_dim, num_epochs)

gd_res = train_sgd(1, 1500, 10) # loss: 0.247, 0.020 sec/epoch 
sgd_res = train_sgd(0.005, 1) # loss: 0.245, 0.685 sec/epoch
mini1_res = train_sgd(.4, 100) # loss: 0.246, 0.025 sec/epoch
mini2_res = train_sgd(.05, 10) # loss: 0.246, 0.090 sec/epoch
```

![[output_minibatch-sgd_f4d60f_111_1 1.svg]]
When the batch size equals 1, we use stochastic gradient descent for optimization. For simplicity of implementation we picked a constant (albeit small) learning rate. In stochastic gradient descent, the model parameters are updated whenever an example is processed. In our case this amounts to 1500 updates per epoch. As we can see, the decline in the value of the objective function slows down after one epoch. Although both the procedures processed 1500 examples within one epoch, stochastic gradient descent consumes more time than gradient descent in our experiment. This is because stochastic gradient descent updated the parameters more frequently and since it is less efficient to process single observations one at a time.

![[output_minibatch-sgd_f4d60f_123_1.svg]]
Finally, when the batch size equals 100, we use minibatch stochastic gradient descent for optimization. The time required per epoch is shorter than the time needed for stochastic gradient descent and the time for batch gradient descent.

![[output_minibatch-sgd_f4d60f_135_1.svg]]
Reducing the batch size to 10, the time for each epoch increases because the workload for each batch is less efficient to execute.
![[output_minibatch-sgd_f4d60f_147_1.svg]]
Now we can compare the time vs. loss for the previous four experiments. As can be seen, although stochastic gradient descent converges faster than GD in terms of number of examples processed, it uses more time to reach the same loss than GD because computing the gradient example by example is not as efficient. Minibatch stochastic gradient descent is able to trade-off convergence speed and computation efficiency. A minibatch size of 10 is more efficient than stochastic gradient descent; a minibatch size of 100 even outperforms GD in terms of runtime.
![[output_minibatch-sgd_f4d60f_159_0.svg]]

#### Implementation

##### 1. Dataset and DataLoader
PyTorch's `DataLoader` is the workhorse that handles mini-batch creation
```python
from torch.utils.data import DataLoader, TensorDataset
import torch

# Create a dataset
dataset = TensorDataset(X_train, y_train)

# Create DataLoader with specific batch size
# shuffle=True ensures different mini-batches each epoch. Without shuffling, consecutive mini-batches might contain similar samples, leading to biased gradient estimates.
# drop_last=True ensures consistent batch sizes
dataloader = DataLoader(
    dataset, 
    batch_size=64, 
    shuffle=True, 
    drop_last=True
)
```

##### 2. The Training Loop Architecture
```python
def train_one_epoch(model, dataloader, optimizer, criterion):
    model.train()  # Set model to training mode
    total_loss = 0.0
    
    for batch_idx, (data, targets) in enumerate(dataloader):
        # Zero gradients from previous iteration
        # This is crucial - PyTorch accumulates gradients by default
        optimizer.zero_grad()
        
        # Forward pass: compute predictions for this mini-batch
        outputs = model(data)
        
        # Compute loss for this mini-batch
        loss = criterion(outputs, targets)
        
        # Backward pass: compute gradients
        loss.backward()
        
        # Update parameters using computed gradients
        optimizer.step()
        
        total_loss += loss.item()
    
    return total_loss / len(dataloader)
```

#### Batch Size: The Critical Hyperparameter
The choice of batch size profoundly impacts your model's training behavior:

**Small Batches (8-32 samples)**:
- Higher gradient noise leads to better exploration of the loss landscape
- Can escape local minima more easily
- Requires more iterations to converge
- Better generalization in many cases
- More frequent parameter updates

**Large Batches (256-1024+ samples)**:
- More stable gradient estimates
- Faster convergence per epoch
- Better computational efficiency on modern hardware
- Risk of getting stuck in sharp minima
- May lead to overfitting
  
Interestingly, smaller batches often lead to better generalization performance. The noise introduced by smaller batches acts as a form of regularization, preventing the model from fitting too precisely to the training data. This is one of the counterintuitive aspects of deep learning - sometimes being less precise during training leads to better test performance.

Your batch size is often constrained by GPU memory. Larger batches require more memory to store activations during the forward pass and gradients during the backward pass. If you get "out of memory" errors, reducing batch size is usually the first solution to try 

#### Gradient Accumulation
When you want the stability of large batches but are limited by memory, use gradient accumulation. This technique accumulates gradients across multiple mini-batches before updating parameters, effectively simulating a larger batch size.

```python
# Simulate batch size of 256 using 4 mini-batches of size 64
accumulation_steps = 4
optimizer.zero_grad()

for i, (data, targets) in enumerate(dataloader):
    outputs = model(data)
    loss = criterion(outputs, targets)
    
    # Scale loss by accumulation steps
    loss = loss / accumulation_steps
    loss.backward()
    
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

In typical training, you do:
```python
loss.backward() 
optimizer.step() 
optimizer.zero_grad()
```

In gradient accumulation, you delay the `optimizer.step()` call and let `.grad` **accumulate** over multiple smaller mini-batches:
```python
loss.backward()  # multiple times 
optimizer.step() # only after a few backward()s`
```

**Why Scale the Loss?**

To make sure each accumulated gradient is properly **averaged**, you scale the loss:$$
\text{loss} = \frac{1}{k} \sum_{i=1}^{k} \ell_i \quad \Rightarrow \quad \text{gradients are average per-sample}$$


This makes it **mathematically equivalent** to doing a forward + backward pass on a single batch of size k × mini-batch-size.

#### Common Pitfalls and Solutions

##### The Shuffling Trap
Forgetting to shuffle your data can lead to systematic biases. If your dataset is ordered (e.g., all samples of class A come before class B), consecutive mini-batches might contain samples from only one class, leading to poor gradient estimates.

##### The Last Batch Problem
The final mini-batch of each epoch might be smaller than your specified batch size. This can cause issues with batch normalization or when you expect consistent batch sizes. Use `drop_last=True` in DataLoader to avoid this, or handle variable batch sizes explicitly in your code.

##### Learning Rate and Batch Size Relationship
There's a general rule of thumb: when you increase batch size, you should proportionally increase learning rate. This is because larger batches provide more accurate gradients, allowing for larger parameter updates. However, this relationship isn't always linear and requires experimentation.