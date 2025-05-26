
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
### Class Method

Class methods are associated with the class rather than instances. They are defined using the `@classmethod` decorator and take the class itself as the first parameter, usually named `cls`. Class methods are useful for tasks that involve the class rather than the instance, such as creating class-specific behaviors or modifying class-level attributes.
```python
class C(object):  
    @classmethod  
    def fun(cls, arg1, arg2, ...):  
       ....  
# fun: function that needs to be converted into a class method  
# returns: a class method for function.
```


### Static Method

Static method can be called without creating an object or instance. Simply create the method and call it directly.

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

##### Object Inspection & Introspection
1. **`type(obj)` -** Returns the type (class) of the object
2. **`isinstance(obj, cls)` -** Checks if `obj` is an instance of `cls` or its subclass
3. **`issubclass(cls, parent) `-** Checks if a class is derived from another class
4. **`id(obj)` -** Returns the memory address (unique ID) of an object
5. **`vars(obj)` -** Displays the attribute of an instance in the form of an dictionary, i.e., returns the `__dict__` attribute of an object. If used without an argument, `vars()` returns the local symbol table (like `locals()`). Use `vars()` when you want to get or modify an object’s attributes.
6. **`dir(obj)` -** Displays more attributes than vars function, as it is not limited to instance. Returns a list of all attributes and methods of an object (including inherited and special ones). Use `dir()` when you want to **explore structure**
```python
class Suit:
    def __init__(self):
        self.version = "Mark 50"

tony = Suit()

print(vars(tony))  # {'version': 'Mark 50'}
print(dir(tony))   # ['__class__', '__dict__', '__dir__', ..., 'version']

```

7. **`locals()` -** Returns a dictionary of local variables (within a function). Unlike `vars()`,  inside a function, modifying the dictionary returned by `locals()`does not affect the actual variables as in function scopes, `locals()` returns a **copy** of the local symbol table, not a live reference. Use `locals()` when you want to get current **local variables** inside a function. 
8. **`globals()` -** Returns global symbol table (global variables and functions)
9. **`hasattr(obj, name)` -** Returns `True` if object has the named attribute
10. **`getattr(obj, name[, default])` -** Gets the attribute, optionally returns default if not found
11. **`setattr(obj, name, value)` -** Sets or creates an attribute dynamically
12. **`delattr(obj, name)` -** Deletes the named attribute from object
13. **`callable(obj)` -** Returns `True` if `obj` can be called like a function
14. **`repr(obj)` -** Returns a developer-readable string of the object (`__repr__`)
15. **`str(obj)` -** Returns a user-friendly string of the object (`__str__`)
16. **`help(obj)` -** Opens the help page/documentation for the object

##### Decorators
Decorators are a powerful and flexible way to modify or extend the behavior of functions or methods, without changing their actual code. A decorator is a function that takes another function (or method) as input and returns a new function with added or modified behavior. 

```python
# Syntax
def decorator_name(func):  
	def wrapper(*args, **kwargs):  
		# Add functionality before the original function call  
		result = func(*args, **kwargs)  
		# Add functionality after the original function call  
		return result  
	return wrapper

@decorator_name  
def function_to_decorate():  
	# Original function code  
	pass
```

##### Types of Decorators
1. Basic Decorator (No Arguments) - This is the **simplest** form. It doesn't accept any arguments itself — it only wraps a function. 
```python
# This is the **simplest** form. It doesn't accept any arguments itself — it only wraps a function.
def simple_decorator(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

@simple_decorator
def greet():
    print("Hello")

greet()

# Because we want our decorator to work with **any function**, even if it takes parameters:
def flexible_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper

@flexible_decorator
def add(a, b):
    return a + b

print(add(5, 7))  # ✅ Works with arguments
# args collects **positional arguments
# kwargs collects **keyword arguments
# This makes the decorator flexible for **any signature
```

2. 