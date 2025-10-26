
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

The std:: in std::cout says that the cout is to be found in the standard library that we made accessible with import std.

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




## import and include

In C++, **`#include`** and **`import`** both bring in code from other files, but:
- `#include` belongs to the **preprocessor** era (C-style).
- `import` belongs to the **modern module system** (C++20).


### include

`#include` is a preprocessor directive. It copies entire contents of the header file and pastes those contents directly into your `.cpp` file, right where you wrote `#include`.

#### The Problems with `#include`

This copy-paste method causes several famous and frustrating problems.

1. **Slow Compilation:** If you have 100 different `.cpp` files in your project, and every single one of them does `#include <iostream>`, the compiler will read, parse, and compile the _entire_ massive `<iostream>` header 100 separate times. This is the main reason C++ projects can take so long to build.
    
2. **Macro Pollution:** If a header file defines a macro, that macro now exists in your file and can break your code. 

```C++ title:bad_header.h
# define max(a, b) ((a) > (b) ? (a) : (b)) 
```
    
```C++ title:my_code.cpp
#include "bad_header.h"
#include <algorithm> // This header also defines a std::max

int main() {
	int my_variable_max = 10; // ERROR!
	// The preprocessor changes this line to:
	// int my_variable_((a, b) ((a) > (b) ? (a) : (b))) = 10;
	// This is complete gibberish to the compiler.
}
```
    
3. **Header Guards:** What happens if you include the same header twice?
    
```C++ title:main.cpp
#include "my_math.h" // Pastes "int add(int a, int b);"
#include "my_math.h" // Pastes "int add(int a, int b);" again!

// The compiler sees:
// int add(int a, int b);
// int add(int a, int b); // ERROR: Redefinition of 'add'
```
    
```C++ title:my_math.h
#ifndef MY_MATH_H // "if not defined MY_MATH_H"
#define MY_MATH_H // "then define MY_MATH_H"

int add(int a, int b);

#endif // "end of the 'if'"

// The first time this file is included, MY_MATH_H is not defined, so the preprocessor defines it and pastes the code. The second time, MY_MATH_H is defined, so the preprocessor skips the entire file.
```


### `import` (C++20 Modules)

`import` is a brand-new C++20 language keyword. It is _not_ a preprocessor directive. The C++ compiler understands it directly. It is designed to replace `#include` and solve all of its problems.

#### How It Works

Think of `import my_module;` as connecting to a secure API:

1. The module `my_module` is compiled _once_, on its own.
2. This compilation produces a normal object file _and_ a small "Binary Module Interface" (`.bmi`) file. This `.bmi` file is a "public menu" that semantically describes _only_ the functions and types the module wants to share (the ones marked `export`).
3. When your code does `import my_module;`, the compiler _only_ reads the tiny `.bmi` file. It doesn't have to re-read and re-compile the module's entire source code.

#### Example


```C++ title:my_math.cppm
// The .cppm extension often means C++ module
export module my_math; // Declares this file as a module

export int add(int a, int b) { // "export" makes this visible
    return a + b;
}
```

```C++ title:main.cpp
import <iostream>; // Imports the standard library iostream module
import my_math;    // Imports our module

int main() {
    std::cout << add(2, 2);
}
```

#### Benefits

1. **Massively Faster Compilation -** If you `import <iostream>;` in 100 files, the compiler _does not_ re-compile `<iostream>` 100 times. It just reads the small, pre-compiled `<iostream>.bmi` file 100 times, which is incredibly fast.
    
2. **No Macro Pollution:** Macros are _never_ exported from a module. If `my_math.cppm` defined a macro, it would stay private to that file and would never affect your `main.cpp`. This is a huge improvement in safety.
    
3. **No Namespace Pollution:** A module only makes the names you explicitly `export` visible. All internal helper functions, global variables, etc., stay private.
    
4. **No Header Guards:** Header guards are completely unnecessary. The module system is smart enough to handle importing the same module multiple times.

| **Feature**       | #include (Headers)                                                    | **import (C++20 Modules)**                                                     |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **What it is**    | Preprocessor Directive                                                | C++20 Language Keyword                                                         |
| **How it works**  | Textual copy-paste                                                    | Semantic, binary interface                                                     |
| **Compilation**   | **Very Slow.** Parses the same header in every file that includes it. | **Very Fast.** Parses the module once, then just reads a small interface file. |
| **Macros**        | **Dangerous.** Macros "pollute" every file that includes them.        | **Safe.** Macros are not exported and stay private to the module.              |
| **Namespaces**    | Dumps all declarations into your file's scope.                        | **Clean.** Only imports names explicitly marked with `export`.                 |
| **Header Guards** | **Required.** A manual hack (`#ifndef...`) to prevent errors.         | **Not Needed.** The system handles it automatically.                           |
| **Availability**  | All C++ versions                                                      | **C++20 and later.**                                                           |
