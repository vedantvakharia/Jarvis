
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

A class attribute is a variable that is shared across all instances of a class. It belongs to the class itself, not to any one object (instance). Class attributes are shared among all instances of a class and are typically used for static data that should not be changed on an instance level.Can be accessed using `object.attribute` or `class_name.attribute`. Static variables are defined inside the class definition, but outside of any method definitions. They are typically initialized with a value, just like an instance variable, but they can be accessed and modified through the class itself, rather than through an instance. 

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

1. Class Method
2. Static Method
3. Factory Method
4. Dunder Method
5. Getter and setter

### Factory Method
Factory methods are methods that return an instance of the class, often using different input parameters.
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
   
   
### Getter and Setter

Getter and setter methods allow you to access and mutate non-public attributes while maintaining encapsulation.  Getter and setter methods allow you to access and modify data attributes while maintaining encapsulation. By default, attributes in Python can be accessed directly. However, this can pose problems when attributes need validation or transformation before being assigned or retrieved.
- **Getter:** A method that allows you to access an attribute in a given class
- **Setter:** A method that allows you to _set_ or _mutate_ the value of an attribute in a class
  
  [Getters and Setters: Manage Attributes in Python – Real Python](https://realpython.com/python-getter-setter/#replacing-getters-and-setters-with-more-advanced-tools)
## Functions related to OOPS

#### Object Inspection & Introspection
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

#### Decorators
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
1. **Basic Decorator / Function Decorators -** This is the simplest form. It doesn't accept any arguments itself — it only wraps a function. Takes a function as input and returns a new function.
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
```

2. **Decorator with arguments -** 
   **Parameters -** 
   - **func -** This parameter represents the function being decorated. When you use a decorator, the decorated function is passed to this parameter.
   - **wrapper -** This is a nested function inside the decorator. It wraps the original function, adding additional functionality. The wrapper function allows the decorator to handle functions with any number and types of arguments.
   - **args:** This collects any positional arguments passed to the decorated function into a tuple.
   - **kwargs:** This collects any keyword arguments passed to the decorated function into a dictionary.
   - **@decorator_name -** This syntax applies the decorator to the `function_to_decorate` function. It is equivalent to writing `function_to_decorate = decorator_name(function_to_decorate)`.
```python
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

3. **Method Decorator -** Used to decorate methods within a class. They often handle special cases, such as the `self` argument for instance methods.
```python
def method_decorator(func):
    def wrapper(self, *args, **kwargs):
        print("Before method execution")
        res = func(self, *args, **kwargs)
        print("After method execution")
        return res
    return wrapper

class MyClass:
    @method_decorator
    def say_hello(self):
        print("Hello!")

obj = MyClass()
obj.say_hello()
```

4. **Class Decorators -** Class decorators are used to modify or enhance the behavior of a class. Like function decorators, class decorators are applied to the class definition. They work by taking the class as an argument and returning a modified version of the class.
```python
def fun(cls):
    cls.class_name = cls.__name__
    return cls

@fun
class Person:
    pass

print(Person.class_name) # Person

# Explanation 
add_class_name(cls): This decorator adds a new attribute, class_name, to the class cls. The value of class_name is set to the name of the class (cls.__name__).
@add_class_name: This applies the add_class_name decorator to the Person class.
Result: When the Person class is defined, the decorator automatically adds the class_name attribute to it.
print(Person.class_name): Accessing the class_name attribute that was added by the decorator prints the name of the class, Person.
```

   5. **Decorator factory(More research needed) -** Decorator That Takes Arguments
```python
def decorator_with_args(arg1):
    def real_decorator(func):
        def wrapper(*args, **kwargs):
            print(f"Decorator argument: {arg1}")
            return func(*args, **kwargs)
        return wrapper
    return real_decorator

```

6. **Property decorator -** The @property lets a method to be accessed as an attribute instead of as a method with a `'()'`. `@property` is a **built-in decorator** in Python that allows you to define a method that **acts like an attribute**. It lets you **get**, **set**, or **delete** values using method logic — while looking like regular attribute access from the outside.

It allows:
- **Encapsulation** – Hide internal variables and control access. In Python, you’ll typically expose attributes as part of your public API and use properties when you need attributes with functional behavior.
- **Validation** – Add checks when setting values.
- **Computed properties** – Return calculated values on access. 
- **Immutable attributes** – Make some values read-only.
  
If you change the value of an attribute inside a class, the other attributes that are derived from the attribute you just changed don’t automatically update. So, if we try to use method instead of attribute, this problem gets resolved but it will break whatever code used `self.attribute_name` attribute. @property takes care of this problem. 

   1. **Getter and Setter -** Getter allows you to access an attribute in a given class. Setter allows you to set or mutate the value of an attribute in a class. To do this, add a `@methodname.setter` decorator just before the method definition. Once you add the `@methodname.setter` decorator to it, this method will be called everytime the property is set or changed.
      
      In OOP, the getter and setter pattern suggests that public attributes should be used only when you’re sure that no one will ever need to attach behavior to them. If an attribute is likely to change its internal implementation, then you should use getter and setter methods. Implementing the getter and setter pattern requires making your attributes non-public and writing getter and setter methods for each attribute.
   2. Deleter -  
##### Defining decorators
You can define decorators either inside or outside a class, but where you define them depends on your use case.
1. **Defining decorator outside a Class -** By defining decorators outside a class, the decorator can be reused across multiple classes or modules.
```python
def logger(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

class IronMan:
    @logger
    def suit_up(self):
        print("Mark 85 online.")

```

2. Defining decorator inside a Class - This is **less common**, but can be useful if the decorator needs access to class variables or is only used within that class.
```python
class Jarvis:
    def decorator_inside(self, func):
        def wrapper(*args, **kwargs):
            print("Jarvis is assisting...")
            return func(*args, **kwargs)
        return wrapper

    @property
    def greet(self):
        @self.decorator_inside
        def inner():
            print("Hello, sir.")
        return inner()
# Note: You can't use `@self.decorator_inside` at the time of method declaration directly because `self` doesn’t exist yet. That’s why it's used **within a method** or as a `staticmethod`.
Research on this 
```


##### Common Built-in Decorators in Python

1. **@classmethod -** Class methods are methods that are bound to a particular class. These methods are not tied to any instances of the class. The @classmethod is a built-in decorator that is used to create a class method. It receives the class (`cls`) as the first argument instead of the instance (`self`).  A class method can access or modify the class state.
```python
# Syntax
class MyClass:
    @classmethod
    def class_method(cls, *args, **kwargs):
        ...


# Convert a normal function into a class method without using @classmethod, using classmethod()

class Student:
    # Class variable
    name = "Geeksforgeeks"

    # A function that expects an object (but we'll turn it into a class method)
    def print_name(obj):
        print("The name is :", obj.name)

Student.print_name = classmethod(Student.print_name)
# classmethod() is a built-in function that converts print_name into a class method.
# Now obj inside print_name actually becomes a reference to the class itself (by convention, cls is used instead of obj).   
# So now you can call Student.print_name() without creating an instance.
Student.print_name() # The name is :  Geeksforgeeks


# Factory method using a Class Method
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
# from_string is a factory method that creates an instance of the Date class from a string
    def from_string(cls, date_string):
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)

date = Date.from_string('2023-07-16')
print(date.year, date.month, date.day) # 2023 7 16


# Inheritance and @classmethod
from datetime import date

# random Person
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @staticmethod
    def from_FathersAge(name, fatherAge, fatherPersonAgeDiff):
        return Person(name, date.today().year - fatherAge + fatherPersonAgeDiff)

    @classmethod
    def from_BirthYear(cls, name, birthYear):
        return cls(name, date.today().year - birthYear)

    def display(self):
        print(self.name + "'s age is: " + str(self.age))

class Man(Person):
    sex = 'Female'

man = Man.from_BirthYear('John', 1985)
print(isinstance(man, Man)) # True

man1 = Man.from_FathersAge('John', 1965, 20)
print(isinstance(man1, Man)) # False
```

2. **@staticmethod -** In general, static methods know nothing about the class state. They are utility-type methods that take some parameters and work upon those parameters. They are used when there is some functionality that relates to the class, but does not require any instance to do some work. Static method can’t access or modify class state. 
   
   We only need to use @staticmethod when we want to call a function not taking self as a parameter from an instance. See example. 
```python
# Syntax

class ClassName(object):

    @staticmethod
    def static_method(kwarg1=None):
        '''return a value that is a function of kwarg1'''
# This is equvalent to below

class ClassName(object):

    def static_method(kwarg1=None):
        '''return a value that is a function of kwarg1'''

    static_method = staticmethod(static_method)

# Example of not needing @staticmethod
class Dog:
    count = 0 # this is a class variable
    dogs = [] # this is a class variable

    def __init__(self, name):
        self.name = name #self.name is an instance variable
        Dog.count += 1
        Dog.dogs.append(name)

    def bark(self, n): # this is an instance method
        print("{} says: {}".format(self.name, "woof! " * n))

    def rollCall(n): #this is implicitly a class method (see comments below)
        print("There are {} dogs.".format(Dog.count))
        if n >= len(Dog.dogs) or n < 0:
            print("They are:")
            for dog in Dog.dogs:
                print("  {}".format(dog))
        else:
            print("The dog indexed at {} is {}.".format(n, Dog.dogs[n]))

fido = Dog("Fido")
fido.bark(3)
Dog.rollCall(-1)
rex = Dog("Rex")
Dog.rollCall(0)

#This code works even though we have not used @staticmethod. But if we try to do rex.rollCall(-1), then it will cause an error as it will take to arguments, self and -1 while it can take only 1 input. rex.rollCall() will work as it can pass now 2 arguments but will cause an error as n be accepting self and not a numerical value. So, if want to do instance.function instead of class.function, we need to use @staticmethod

class Dog:
    count = 0 # this is a class variable
    dogs = [] # this is a class variable

    def __init__(self, name):
        self.name = name #self.name is an instance variable
        Dog.count += 1
        Dog.dogs.append(name)

    def bark(self, n): # this is an instance method
        print("{} says: {}".format(self.name, "woof! " * n))

    @staticmethod
    def rollCall(n):
        print("There are {} dogs.".format(Dog.count))
        if n >= len(Dog.dogs) or n < 0:
            print("They are:")
            for dog in Dog.dogs:
                print("  {}".format(dog))
        else:
            print("The dog indexed at {} is {}.".format(n, Dog.dogs[n]))


fido = Dog("Fido")
fido.bark(3)
Dog.rollCall(-1)
rex = Dog("Rex")
Dog.rollCall(0)
rex.rollCall(-1)
```

   3. @property - @property decorator is a built-in decorator in Python which is helpful in defining the properties which is used to return the property attributes of a class from the stated getter, setter and deleter as parameters.

 [Decorators in Python | GeeksforGeeks](https://www.geeksforgeeks.org/decorators-in-python/)
##### Decopatch (Decorators library)
[decopatch](https://smarie.github.io/python-decopatch/)

Topics to research on -
overiding getter setter in inheritance
deleter
property decorator
decorator factor
other decorator types
[Python Metaprogramming - Properties on Steroids](https://mnesarco.github.io/blog/2020/07/23/python-metaprogramming-properties-on-steroids)
[python - What's the pythonic way to use getters and setters? - Stack Overflow](https://stackoverflow.com/questions/2627002/whats-the-pythonic-way-to-use-getters-and-setters)
[Primer on Python Decorators – Real Python](https://realpython.com/primer-on-python-decorators/)
discriptors



