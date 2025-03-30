

## Torch.nn

Contains all of the building blocks for computational graphs (essentially a series of computations executed in a particular way). Almost everything in a PyTorch neural network comes from `torch.nn`. 

1. **Loss functions -** These measure the difference between the network's predictions and the actual target values. Loss functions in PyTorch are crucial for training neural networks, as they measure how well or poorly a model is performing. Different types of loss functions are used based on the nature of the task, such as regression, classification, or probabilistic modeling. 
	1.   **Regression Loss Functions -** Used when the model is predicting continuous values.
		1. `torch.nn.L1Loss(reduction)` - Creates a criterion that measures the mean absolute error (**MAE**) between each element in the input x and target y. More robust to outliers than MSE because it doesn’t square the error.
		   The reduction parameter specifies how the loss is reduced over the batch. Reduction parameter has 3 options 
		   - `'mean'` (default): Returns the average loss.
		   - `'sum'`: Returns the total sum of errors.
		   - `'none'`: Returns loss per element without reduction.
	   $$MAE = \frac{1}{N} \sum_{i=1}^{N} | y_i - \hat{y}_i |$$
		2. `torch.nn.MSELoss(size_average=None,reduce=None,reduction='mean')` - Creates a criterion that measures the mean squared error (squared L2 norm) between each element in the input x and target y. Penalizes large errors more than small errors due to the squared term. Works best when the data has normally distributed errors$$MSE = \frac{1}{N} \sum_{i=1}^{N} | y_i - \hat{y}_i |^2$$
		3. 
	2.   
2. **Forward Pass -** The forward pass is the process of passing input data through the layers of a neural network to obtain an output. In PyTorch, this is implemented through the forward() method of a model class that inherits from torch.nn.Module. The forward pass is essential for both training and inference, as it computes the predictions of the model given a set of inputs.
   
   The forward() function defines the computation performed at every call and must be overridden by all subclasses of torch.nn.Module. This function takes input data, processes it through the network's layers, and returns the output. The output can be logits, probabilities, or any other form of processed data, depending on the final layer of the network and the task at hand.
	1. Why Not Call `forward` Directly?
	   You should **never call `model.forward()` directly**. Instead, use `model(input)`, which automatically applies hooks (e.g., `register_forward_hook`). Supports additional PyTorch features like `autograd`. Ensures proper behavior in model training and inference.
	2. Forward function outputs - 
		1. Output as Logits (Raw Scores) - 
	3. 
2. 