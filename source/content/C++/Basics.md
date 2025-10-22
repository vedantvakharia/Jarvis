
## C++ Keywords

### Data Types 

| Keyword         | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| **`int`**       | Defines a standard integer (whole number).                               |
| **`double`**    | Defines a double-precision floating-point (decimal) number.              |
| **`char`**      | Defines a single character or byte.                                      |
| **`bool`**      | Defines a boolean value, which can be **`true`** or **`false`**.         |
| **`void`**      | Specifies an absence of type or information.                             |
| **`float`**     | Defines a single-precision floating-point number.                        |
| **`short`**     | A modifier to request a shorter version of an integer type.              |
| **`long`**      | A modifier to request a longer version of an integer type.               |
| **`signed`**    | A modifier to specify a type can hold both positive and negative values. |
| **`unsigned`**  | A modifier to specify a type can only hold non-negative values.          |
| **`const`**     | Specifies that a variable's value cannot be changed.                     |
| **`constexpr`** | Specifies that an expression can be evaluated at compile time.           |
| **`auto`**      | Deduces the type of a variable from its initializer.                     |
| **`decltype`**  | Inspects the declared type of an entity.                                 |

| Data Type       | Typical 32-bit Size | Typical 64-bit Size |
| --------------- | ------------------- | ------------------- |
| `char`          | 1 byte              | 1 byte              |
| `short`         | 2 bytes             | 2 bytes             |
| `int`           | 4 bytes             | 4 bytes             |
| `long int`      | 4 bytes             | 8 bytes             |
| `long long int` | 8 bytes             | 8 bytes             |
| `float`         | 4 bytes             | 4 bytes             |
| `double`        | 8 bytes             | 8 bytes             |
| `bool`          | 1 byte              | 1 byte              |
| `pointer`       | 4 bytes             | 8 bytes             |
### Control Flow

|Keyword|Description|
|---|---|
|**`if`**|Executes code if a condition is true.|
|**`else`**|Executes code if the `if` condition is false.|
|**`for`**|Creates a loop for a specified number of iterations.|
|**`while`**|Creates a loop that runs as long as a condition is true.|
|**`do`**|Part of a `do-while` loop, which executes at least once.|
|**`switch`**|Selects a block of code to execute from a list of **`case`** labels.|
|**`case`**|A label inside a `switch` statement.|
|**`default`**|The default label in a `switch` statement if no `case` matches.|
|**`break`**|Exits a loop or `switch` statement immediately.|
|**`continue`**|Skips the current iteration of a loop and moves to the next.|
|**`return`**|Exits a function and optionally returns a value.|
|**`goto`**|Unconditionally transfers control to a labeled statement (use with caution).|
### Structuring & Classes

| Keyword         | Description                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| **`class`**     | Declares a user-defined data type (a class).                                                |
| **`struct`**    | Declares a user-defined data type similar to a class (members are public by default).       |
| **`enum`**      | Declares an enumeration, a set of named integer constants.                                  |
| **`namespace`** | Provides a scope to prevent name conflicts.                                                 |
| **`template`**  | Creates a generic class or function that can work with different data types.                |
| **`typename`**  | Refers to a type within a template.                                                         |
| **`using`**     | Brings a name from a namespace into the current scope or creates a type alias.              |
| **`public`**    | A class member access specifier (accessible from anywhere).                                 |
| **`private`**   | A class member access specifier (accessible only by the class itself).                      |
| **`protected`** | A class member access specifier (accessible by the class and its subclasses).               |
| **`virtual`**   | Creates a function in a base class that can be overridden by a derived class.               |
| **`override`**  | Specifies that a function is meant to override a `virtual` function.                        |
| **`final`**     | Specifies that a class cannot be inherited from or a virtual function cannot be overridden. |
| **`friend`**    | Grants a function or class access to `private` and `protected` members.                     |
| **`this`**      | A pointer to the current object instance.                                                   |
| **`new`**       | Allocates memory dynamically on the heap.                                                   |
| **`delete`**    | Deallocates memory that was allocated with `new`.                                           |
| **`operator`**  | Overloads an operator for a custom type (e.g., `+`, `-`, `==`).                             |
| **`static`**    | Creates a variable or function that belongs to the class, not an object instance.           |
| **`explicit`**  | Prevents a constructor from being used for implicit type conversions.                       |

### Advanced & Modern C++

This group includes keywords for error handling, modern features, and more specialized tasks.

|Keyword|Description|
|---|---|
|**`try`**|Starts a block of code to be checked for exceptions.|
|**`catch`**|Catches and handles an exception thrown by a `try` block.|
|**`throw`**|Throws an exception.|
|**`nullptr`**|A keyword representing a null pointer (safer than using `0` or `NULL`).|
|**`noexcept`**|Specifies that a function will not throw exceptions.|
|**`static_assert`**|Performs an assertion check at compile time.|
|**`extern`**|Declares a variable or function that is defined in another translation unit.|
|**`typedef`**|Creates an alias for a data type (less common in modern C++).|
|**`union`**|A data structure that allows storing different data types in the same memory location.|
|**`volatile`**|Tells the compiler that a variable's value can change unexpectedly.|
|**`mutable`**|Allows a member of a `const` object to be modified.|
|**`register`**|A hint to the compiler to store a variable in a CPU register (mostly ignored now).|
|**`asm`**|Embeds assembly language code directly into your program.|

### C++20 and Beyond

These are very modern keywords related to major new features like modules, concepts, and coroutines. 

|Keyword|Description|
|---|---|
|**`import`**|Imports a module.|
|**`module`**|Declares a source file as a module unit.|
|**`export`**|Makes names from a module available for `import`.|
|**`concept`**|Defines a set of requirements for a template type.|
|**`requires`**|Specifies constraints on a template, often using a `concept`.|
|**`co_await`**|Suspends a coroutine and awaits a result.|
|**`co_return`**|Completes a coroutine by returning a value.|
|**`co_yield`**|Pauses a coroutine and yields a value.|

---
## Operator Precedence

| Precedence | Operator(s)                                                                                                      | Meaning                                                                                                                                                                                                                  | Associativity        |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| **1**      | a :: b                                                                                                           | Scope resolution                                                                                                                                                                                                         | Left-to-right        |
| **2**      | a++ a--<br><br>type(a)  type{a}<br>a()<br>a[]<br>a.b a->b                                                        | Postfix increment and decrement<br>Functional cast<br>Function Call<br>Subscript<br>Member Access                                                                                                                        | Left-to-right        |
| **3**      | ++a --a<br>+a -a<br>!a ~a<br>(type)a<br>`*a`<br>&a<br>`sizeof`<br>`co_await`<br>new-new[]<br>delete-delete[]<br> | Prefix increment and decrement<br>Unary plus and minus<br>Logical and Binary NOT<br>C-style cast<br>Dereference<br>Address of<br>Size of<br>Await expression<br>Dynamic memory allocation<br>Dynamic memory deallocation | Right-to-left        |
| **4**      | `a.*b` `a->*b`                                                                                                   | Pointer-to-member                                                                                                                                                                                                        | Left-to-right        |
| **5**      | `a*b` `a/b` `a%b`                                                                                                | Multiplication, division, modulo                                                                                                                                                                                         | Left-to-right        |
| **6**      | `a+b` `a-b`                                                                                                      | Addition, subtraction                                                                                                                                                                                                    | Left-to-right        |
| **7**      | `a<<b` `>>`                                                                                                      | Bitwise shift left/right, also stream operators                                                                                                                                                                          | Left-to-right        |
| **8**      | a <=> b                                                                                                          | Three-way comparison operator                                                                                                                                                                                            |                      |
| **8**      | `<` `<=` `>` `>=`                                                                                                | Relational (less/greater)                                                                                                                                                                                                | Left-to-right        |
| **9**      | `==` `!=`                                                                                                        | Equality / inequality                                                                                                                                                                                                    | Left-to-right        |
| **10**     | `&`                                                                                                              | Bitwise AND                                                                                                                                                                                                              | Left-to-right        |
| **11**     | `^`                                                                                                              | Bitwise XOR                                                                                                                                                                                                              | Left-to-right        |
| **12**     | \|                                                                                                               | Bitwise OR                                                                                                                                                                                                               | Left-to-right        |
| **13**     | `&&`                                                                                                             | Logical AND                                                                                                                                                                                                              | Left-to-right        |
| **14**     | \|\|                                                                                                             | Logical OR                                                                                                                                                                                                               | Left-to-right        |
| **15**     | `?:`                                                                                                             | Ternary conditional operator                                                                                                                                                                                             | Right-to-left        |
| **16**     | `=` `+=` `-=` `*=` `/=` `%=` `<<=` `>>=` `&=` `^=` `                                                             | =`                                                                                                                                                                                                                       | Assignment operators |
| **17**     | `throw`, `co_yield`, `co_return`                                                                                 | Exception/coroutine operators                                                                                                                                                                                            | Right-to-left        |
| **18**     | `,`                                                                                                              | Comma (sequencing)                                                                                                                                                                                                       | Left-to-right        |

---

## Variables

### Declaring 

C++ allows definition of variables at the point where they are used. C++ does not require declaring all variables before their first executable statement unlike C. 

---
## Input Output

In C++, input and output (I/O) are handled using a concept called streams. There are input and output streams. To use these streams, you must include the `<iostream>` header file at the top of your code.

### Output Stream

#### `cout`

`cout` stands for character output. It’s a global object of type `std::ostream` defined in `<iostream>`. It represents the standard output stream, usually the console/terminal screen. It lives in the `std` namespace: you access it as `std::cout` (or just `cout` if you do `using namespace std;`). The `<<` symbol is called the stream insertion or put to operator. It's like an arrow pointing to `cout`, showing that we're sending data to be displayed.

```cpp title:"Printing using cout"
// Printing numbers and texts 
cout << "I love C++";

// To print multiple outputs on the same line
cout << 20;
cout << 40;
// This will output: 2040

cout << 20 << 40;
// This will also output: 2040

// To print on separate lines, we use endl(end line).
cout << 20 << endl;
cout << 40 << endl;
// This will output:
// 20
// 40

// Combining Text and Numbers
cout << "I am " << 25 << " years old.";
// This will output: I am 25 years old


```

