## Assignment: Building a Neural Network for Classification with NumPy

### Objective

The goal of this assignment is to build a **Neural Network from scratch using only NumPy** to solve a binary classification problem. You will implement the entire neural network architecture, including forward propagation, backpropagation, and training.

---

### Core Requirements

1. **NumPy Only:** All parts of the neural network model implementation—including layer creation, activation functions, loss calculation, forward pass, backpropagation, gradient descent, and evaluation metrics—**must be done using only NumPy**. You may not use high-level libraries like PyTorch, TensorFlow, Keras, or scikit-learn for the modeling components.
2. **Google Colab:** You must complete your work in a Google Colab notebook. This will be your final submission file.
3. **Dataset Setup:** You are required to handle the data manually. The steps are:
    - Download the dataset's CSV file from Kaggle.
    - Upload the `heart.csv` file to your Google Drive.
    - Mount your Google Drive within your Colab notebook.
    - Load the data into your notebook from your mounted Drive using Pandas. After loading, you should convert the data into NumPy arrays for the rest of the assignment.

---

### Dataset

We will be using the **Heart Disease UCI** dataset from Kaggle.

- **Link:** [https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
- **Target Variable:** `target` (0 for no heart disease, 1 for heart disease).

---

### Learning Resources

These resources will help you understand the theory and implementation details:

- **Video: What is a Neural Network? (by Codebasics):** [https://www.youtube.com/watch?v=w8yWXqWQYmU](https://www.youtube.com/watch?v=w8yWXqWQYmU)
- **Blog Post: A Neural Network from Scratch in Python and NumPy (by Victor Zhou):** [https://victorzhou.com/blog/intro-to-neural-networks/](https://victorzhou.com/blog/intro-to-neural-networks/)
- **General Machine Learning Resource (Machine Learning Mastery):** [https://machinelearningmastery.com/](https://machinelearningmastery.com/) (This is a fantastic resource. Use the search bar on the site to find articles on topics like "backpropagation," "activation functions," "binary cross-entropy," or "gradient descent" for deeper dives.)
- **3Blue1Brown’s Guide on Neural Networks (First 4 Videos):** [https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)
- **Logistic Regression Introductory Video (by Codebasics):** [https://www.youtube.com/watch?v=CA-DR44QHZQ](https://www.youtube.com/watch?v=CA-DR44QHZQ) (Understanding the sigmoid function and binary classification.)
- https://madewithml.com/courses/foundations/logistic-regression/


---

### Assignment Tasks

This assignment is structured to build your neural network incrementally.

#### Part 1: Data Preparation and Preprocessing

1. **Load and Inspect Data:**
    
    - Load the `heart.csv` dataset into a Pandas DataFrame.
    - Display the first 5 rows, check for missing values, and print `df.info()`.
    - Separate features (`X`) from the target (`y`). Convert both to NumPy arrays.
      
2. **Train-Test Split (NumPy Only):**
    
    - Implement a function to split your data into training (80%) and testing (20%) sets.

3. **Feature Scaling (NumPy Only):**
    
    - Implement Standardization (Z-score normalization) from scratch using NumPy. Apply this only to the **numerical features** of your training and testing sets. Be careful not to scale categorical features. (Hint: Identify which features are numerical and which are categorical first.)

#### Part 2: Building the Neural Network Core

1. **Initialize Parameters:**
    
    - Write a function to initialize the weights and biases for a multi-layered neural network with random values. You'll need to define the number of input features, the number of neurons in each hidden layer, and the number of output neurons.
    
2. **Activation Functions and Derivatives:**
    
    - Implement the **Sigmoid** activation function and its derivative.
    - Implement the **ReLU** activation function and its derivative.
    
3. **Forward Propagation:**
    
    - Implement the full forward pass for a neural network with at least **one hidden layer**. This involves calculating weighted sums and applying activation functions for each layer. The output layer should use the sigmoid function for binary classification.
    
4. **Binary Cross-Entropy Loss:**
    
    - Implement the Binary Cross-Entropy (BCE) loss function, which is suitable for binary classification.


#### Part 3: Learning with Backpropagation and Training

#### Part 4: Prediction and Evaluation

1. **Prediction Function:**
    
    - Create a function that takes your trained model parameters and a new `X` (e.g., your test set) and outputs the predicted probabilities.
    - Convert these probabilities into binary class predictions (0 or 1) using a threshold (e.g., 0.5).
    
2. **Evaluation Metrics (NumPy Only):**
    
    - Implement functions to calculate:
        - **Accuracy Score**
        - **Precision Score**
        - **Recall Score** (Optional)
        - **F1-Score** (Optional)
    - Calculate these metrics on your **test set** using your model's predictions.
    
3. **Visualization:**
    - Plot the **loss curve** over epochs to show how your model learned.