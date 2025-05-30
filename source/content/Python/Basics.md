
1. Formatted strings - You’re most likely to use f-strings when formatting strings since they’re the newest form of string formatting in Python. As was the case with `format()` and `.format()`, f-strings display the informal string representation that `.__str__()` returns. 
   
   You can get the official string representation from `.__repr__()` by using the string conversion flag`"!r"` in the f-string. The conversion flag `"!r"` overrides the default for f-strings and calls the object’s `.__repr__()` method. 
   
   You can also use f-strings with an equal sign (`=`) to show both the variable name and its value.
   
```python
>>> format(today)
'2023-02-18 18:40:02.160890'

>>> "{}".format(today)
'2023-02-18 18:40:02.160890'

>>> f"{today}"
'2023-02-18 18:40:02.160890'

>>> f"{today!r}"
'datetime.datetime(2023, 2, 18, 18, 40, 2, 160890)'

>>> f"{today = }"
'today = datetime.datetime(2023, 2, 18, 18, 40, 2, 160890)'

# The above thing can be overide by using !s
>>> f"{today = !s}"
'today = 2023-02-18 18:40:02.160890'
```

2. [First Class functions in Python | GeeksforGeeks](https://www.geeksforgeeks.org/first-class-functions-python/)
3. [Python map() function | GeeksforGeeks](https://www.geeksforgeeks.org/python-map-function/)
4. [refactor](https://realpython.com/python-refactoring/)
5. 