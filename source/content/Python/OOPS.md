decorators, 
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

##### 1. Instance attributes
Instance attributes are those attributes that are not shared by objects. Every object has its own copy of the instance attribute. An instance attribute refers to the properties of that particular object. They are created inside methods (typically `__init__()`).

##### 2. Class / Static attributes

A class attribute is a variable that is shared across all instances of a class. It belongs to the class itself, not to any one object (instance). Can be accessed using `object.attribute` or `class_name.attribute`. Static variables are defined inside the class definition, but outside of any method definitions. They are typically initialized with a value, just like an instance variable, but they can be accessed and modified through the class itself, rather than through an instance. 

If you modify a class variable through an instance, a new instance variable is created. This separates the modified value from the original class variable, which remains unchanged for other instances.

```python
class Car:
    wheels = 4  # class attribute

    def __init__(self, brand):
        self.brand = brand  # instance attribute

```

##### 3. `__dict__` attribute

This attribute holds a dictionary containing the writable members of the underlying class or instance. 
- For **instances**, `obj.__dict__` contains the attributes specific to that object.
- For **classes**, `ClassName.__dict__` contains attributes and methods defined in the class.

When you access a class member through the class object, Python automatically searches for the member’s name in the class `.__dict__`. If the name isn’t there, then you get an `AttributeError`.

Similarly, when you access an instance member through a concrete instance of a class, Python looks for the member’s name in the instance `.__dict__`. If the name doesn’t appear there, then Python looks in the class `.__dict__`. If the name isn’t found, then you get a `NameError`.

```python
class Hero:
    def __init__(self, name, power):
        self.name = name
        self.power = power

ironman = Hero("Iron Man", "AI Suit")

print(ironman.__dict__)
print(Hero.__dict__)

# Output
{'name': 'Iron Man', 'power': 'AI Suit'}
{
 '__module__': '__main__',
 '__init__': <function Hero.__init__ at 0x...>,
 '__dict__': <attribute '__dict__' of 'Hero' objects>,
 '__weakref__': <attribute '__weakref__' of 'Hero' objects>,
 '__doc__': None
}

# You can update or add attributes dynamically
ironman.__dict__['suit_version'] = 'Mark 85'

print(ironman.suit_version)  # Mark 85

```


##### 4. Managed Attribute (Don't need)
A **managed attribute** is a class attribute whose access (get, set, delete) is **controlled by special methods** instead of being accessed or modified directly. 
This is useful for:
- Adding validation logic
- Controlling access (read-only or write-only attributes)
- Automatically updating related attributes
- Logging and debugging attribute access

## Method
### Instance Method
### Dunder Methods / Python Magic methods

**Dunder methods** are special methods in Python that start and end with double underscores. Python automatically **calls these methods in special situations** (like printing an object, adding two objects, or comparing them).

##### Initialization and Construction 
1. **`__init__`  -** `__init__` method in Python is used to initialize objects of a class. Whenever you call a class, Python will construct a new instance of that class, and then call that class' `__init__` method, passing in the newly constructed instance as the first argument (`self`).
2. 

##### String Magic Methods
1. **`__str__` -** The str() takes an object as input and returns its string representation. It can be used to convert various data types into strings, which can then be used for printing, concatenation, and formatting. 
   
   **Syntax - **`str(object, encoding='utf-8', errors='strict')`
   - **object (optional):** The value to be converted
   - ****encoding (optional):**** Used only when converting from bytes. Default is 'utf-8'.
   - ****errors (optional):**** Specifies how to handle decoding errors:
	   - 'strict': Raises an error (default).
	   - 'ignore': Skips invalid characters.
	   - 'replace': Replaces invalid characters with ?.
```python
s = 'Hello, Geeks.'
print (str(s))
print (str(2.0/11.0))

# Output
Hello, Geeks.
0.181818181818
```

2. `__repr__` -`repr()` is used to return a string representation of an object that can be used to recreate the object when passed to eval(). It is mainly used for debugging and logging because it provides and unambiguous representation of an object.  `repr()` is the blueprint of object while `str()` is the user friendly description of it. 
   
   You define the return value for `.__repr__()` to include the name of the class followed by parentheses (`()`) and the two arguments required to initialize the class. This format is ideal for the official string representation since it represents a valid Python expression that can re-create an object equal to the original one. Whenever possible, you should use this format for the official string representation.
   
   **Syntax -** `repr(object)`
```python
s = 'Hello, Geeks.'
print (repr(s))
print (repr(2.0/11.0))

# Output
'Hello, Geeks.'
0.18181818181818182

# Examples of difference between __str__ and __repr__

import datetime
today = datetime.datetime.now()

# Prints readable format for date-time object
print(str(today)) # 2016-02-22 19:32:04.078030

# prints the official format of date-time object
print(repr(today)) # datetime.datetime(2016, 2, 22, 19, 32, 4, 78030)


# We have to customise __str__ and __repr__ to what the programmer and the user wants

class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

odyssey = Book("The Odyssey", "Homer")

print(odyssey)
print(repr(odyssey))
print(str(odyssey))

# All the 3 print the same thing <__main__.Book object at 0x100d046d0> as only the default representation is available at the moment. Now, when we customize __repr__, we get different output. 
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __repr__(self):
        class_name = type(self).__name__
        return f"{class_name}(title={self.title!r}, author={self.author!r})"

odyssey = Book("The Odyssey", "Homer")

print(repr(odyssey))
print(str(odyssey))
print(odyssey)

# Now, all 3 print the same thing Book(title='The Odyssey', author='Homer'). This shows that the repr() function ca;;s object's __repr__ method. If a class doesn’t have a .__str__() method defined, then str() will also default to the object’s .__repr__() method. So, __str__() will only have it's onw custum output when we will customise it. 
```

2. 
   
   
## Functions related to OOPS

1. **`vars()` -** Displays the attribute of an instance in the form of an dictionary, i.e., returns the `__dict__` attribute of an object. If used without an argument, `vars()` returns the local symbol table (like `locals()`). Use `vars()` when you want **values**. 
2. **`dir()` -** Displays more attributes than vars function, as it is not limited to instance. Returns a list of all attributes and methods of an object (including inherited and special ones). Use `dir()` when you want to **explore structure**
```python
class Suit:
    def __init__(self):
        self.version = "Mark 50"

tony = Suit()

print(vars(tony))  # {'version': 'Mark 50'}
print(dir(tony))   # ['__class__', '__dict__', '__dir__', ..., 'version']

```
3. 