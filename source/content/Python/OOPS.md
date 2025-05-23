
## Python Assertions

 Assertions are mainly assumptions that a programmer knows or always wants to be true and hence puts them in code so that failure of these doesn't allow the code to execute further. 
 
 In Python, the **assert** keyword helps in achieving this task. This statement takes as input a Boolean condition, which when returns true doesn't do anything and continues the normal flow of execution, but if it is computed to be false, then it raises an Assertion Error along with the optional message provided.

**Syntax :** `assert condition, error_message(optional)` 
- **condition :** The boolean condition returning true or false. 
- **error_message :** The optional argument to be printed in console in case of AssertionError

**Returns:** Returns AssertionError, in case the condition evaluates to false along with the error message which when provided.

## Attributes

Attributes are variables that belong to an object or class. They store data or state about an object. 
Attributes can be accessed by using dot notation ,i.e., object.attribute. 

##### Instance attributes

##### Class attributes

A **class attribute** is a variable that is **shared across all instances** of a class. It belongs to the **class itself**, not to any one object (instance). Can be accessed using object.attribute or class_name.attribute. 

```python
class Car:
    wheels = 4  # class attribute

    def __init__(self, brand):
        self.brand = brand  # instance attribute

```

## Dunder Methods / Python Magic methods

**Dunder methods** are special methods in Python that start and end with double underscores. Python automatically **calls these methods in special situations** (like printing an object, adding two objects, or comparing them).

##### Initialization and Construction 
1. **`__init__`  -** `__init__` method in Python is used to initialize objects of a class. Whenever you call a class, Python will construct a new instance of that class, and then call that class' `__init__` method, passing in the newly constructed instance as the first argument (`self`).
2. 

##### String Magic Methods
1. **`__str__` -** The str() takes an object as input and returns its string representation. It can be used to convert various data types into strings, which can then be used for printing, concatenation, and formatting. 
   ```python
str(object, encoding='utf-8', errors='strict')
```

1. 2