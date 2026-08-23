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

1. **Declaring -** C++ allows definition of variables at the point where they are used. C++ does not require declaring all variables before their first executable statement unlike C. 
2. **Initializing -** double d2 {2.3} same as double d2 = 2.3. When we use the curly bracket method, it doesn't convert the variables from 1 type to another. E.g. - int i{2.3} will cause an error, and i will not become 2.  Use the curly bracket method when we don't want the variables to be typecast. 
3. **Static Variables -** When you put `static` inside a function, it means one copy for the whole program, but it is hidden inside that function. It is initialized exactly **once** the first time the function is called and remembers it's value between calls.
4. **Pointer -** There is only one `nullptr` shared by all pointer types - `double∗ pd = nullptr;`. In older code, 0 or NULL is typically used instead of `nullptr`. However, using `nullptr` eliminates potential confusion between integers (such as 0 or NULL) and pointers (such as `nullptr`).
5. **References -** In C++, when you pass a variable to a function "by value," the program creates a completely new copy of that variable in memory for the function to use. For a `std::vector<int>` with 106 elements, the program must allocate new memory and copy every single one of those million integers. This takes O(N) time. If your function is called inside a loop that runs 105 times, and each time it copies a vector of size 106, your program will try to perform 1011 operations. Most competitive programming judges only allow 108 operations per second. When you use `&` (e.g., `void func(vector<int>& vec)`), the function does not create a copy. It simply receives the "address" of the original vector. No matter how large the vector is, passing that address takes the same tiny amount of time—O(1).
6. **Auto type -** With auto, we use the = syntax because there is no type conversion involved that might cause problems.  Using auto, we avoid redundancy and writing long type names. This is especially important in generic programming where the exact type of an object can be hard for the programmer to know and the type names can be quite long .
   
   We use auto where we don’t have a specific reason to mention the type explicitly. ‘‘Specific reasons’’ include:
	-  The definition is in a large scope where we want to make the type clearly visible to readers
	  of our code.
	- We want to be explicit about a variable’s range or precision (e.g., double rather than float).
  
### Placeholder variables / Name-independent declarations

Introduced in C++26, they allow you to declare multiple variables using the underscore `_` as a name within the same scope without causing a naming conflict. You generally cannot have multiple name-independent declarations at the global or namespace level; they are meant for Block Scope.

In versions before C++26, if you tried to declare two variables named `_` in the same block, the compiler would throw a "Redefinition Error" because of the **Name Conflict** rules we discussed earlier.
In **C++26**, if you name a variable `_`, it is treated as name-independent. This means:
- You can have multiple variables named `_` in the same scope.
- The compiler essentially "ignores" the name for the purpose of conflict checking.

```c++
// C++20 and below
// If you only need the second value of a pair, you still have to give the first one a unique name.
auto [unused, value] = get_pair();
// If you do it again:
auto [unused2, value2] = get_another_pair(); // You have to keep coming up with names like unused2

// C++26
// You can use _ every single time.
auto [_, score] = get_player_data();
auto [_, weight] = get_item_data(); // No conflict! Both use _
```



### Scope 

Each declaration that appears in a C++ program is only visible in some possibly discontiguous scopes ﻿. Within a scope, unqualified name lookup can be used to associate a name with its declaration. Each program has a global scope ﻿, which _contains_ the entire program. Every other scope `S` is introduced by a declaration, a parameter in parameter list, a statement, a handler or a contract assertion.`S` always appear in another scope, which thereby _contains_ `S`.

An enclosing scope at a program point is any scope that contains it; the smallest such scope is said to be the immediate scope at that point.

A scope intervenes between a program point `P` and a scope `S` (that does not contain `P`) if it is or contains `S` but does not contain `P`.

The parent scope of any scope `S` is the smallest scope that contains `S`.

Unless otherwise specified:
- A declaration _inhabits_ the immediate scope at its locus.
- A declaration’s _target scope_ is the scope it inhabits.
- Any names (re)introduced by a declaration are _bound_ to it in its target scope.

An entity _belongs_ to a scope `S` if `S` is the target scope of a declaration of the entity.

```c++
//                global  scope  scope
//                scope     S      T
int x;         //   ─┐                 // program point X
               //    │
{              //    │     ─┐
    {          //    │      │     ─┐
        int y; //    │      │      │   // program point Y
    }          //    │      │     ─┘
}              //   ─┘     ─┘
```

In the program above
- The global scope, scope `S` and scope `T` contains program point `Y`.
- In other words, these three scopes are all enclosing scopes at program point `Y`.
- The global scope contains scopes `S` and `T`, and scope `S` contains scope `T`.
- Therefore, scope `T` is the smallest scope among all three, which means:
- Scope `T` is the immediate scope at program point `Y`.
- The declaration of the variable `y` inhabits scope `T` at its locus.
- Scope `T` is the target scope of the declaration of `y`.
- The variable y belongs to scope `T`.
- Scope `S` is the parent scope of scope `T`, and the global scope is the parent scope of scope `S`.
- Scope `S` intervenes between program point `X` and scope `T`

### Block scope

Each selection statement (if, switch), iteration statement or compound statement (block) introduces a block scope that includes the statement or handler. A variable that belongs to a block scope is a _block variable_ ﻿ (also known as local variable).

```c++
int i = 42;
int a[10];
 
for (int i = 0; i < 10; i++) // inner “i” inhabits the block scope
    a[i] = i;                // introduced by the for-statement
 
int j = i; // j = 42

if (int x = f())  // declares “x”
{ // the if-block is a substatement of the if-statement
    int x;        // error: redeclaration of “x”
}
else
{ // the else-block is also a substatement of the if-statement
    int x;        // error: redeclaration of “x”
}
 
void g(int i)
{
    extern int i; // error: redeclaration of “i”
}
```

### Function parameter scope

Each [parameter declaration](https://en.cppreference.com/w/cpp/language/function.html#Parameter_list "cpp/language/function") `P` introduces a _function parameter scope_ that includes `P`.

- If the declared parameter is of the parameter list of a [function declaration](https://en.cppreference.com/w/cpp/language/function.html "cpp/language/function"):

- If the function declaration is a [function definition](https://en.cppreference.com/w/cpp/language/function.html#Function_definition "cpp/language/function"), the scope introduced is extended to the end of the function definition.
- Otherwise (the function declaration is a function prototype), the scope introduced is extended to the end of the function declarator.
- In both cases, the scope does not include the [locus](https://en.cppreference.com/w/cpp/language/scope.html#Point_of_declaration) of the function declaration.

|   |   |
|---|---|
|- If the declared parameter is of the parameter list of a [lambda expression](https://en.cppreference.com/w/cpp/language/lambda.html "cpp/language/lambda"), the scope introduced is extended to the end of `**{**` body `**}**`.|(since C++11)|
|- If the declared parameter is of the parameter list of a [deduction guide](https://en.cppreference.com/w/cpp/language/deduction_guide.html "cpp/language/deduction guide"), the scope introduced is extended to the end of that deduction guide.|(since C++17)|
|- If the declared parameter is of the parameter list of a [requires expression](https://en.cppreference.com/w/cpp/language/requires.html "cpp/language/requires"), the scope introduced is extended to the end of `**{**` requirement-seq `**}**`.|(since C++20)|

int f(int n) // the declaration of the parameter “n”
{            // introduces a function parameter scope
    /* ... */
}            // the function parameter scope ends here

|   |   |
|---|---|
|### Lambda scope<br><br>Each [lambda expression](https://en.cppreference.com/w/cpp/language/lambda.html "cpp/language/lambda") introduces a _lambda scope_ that starts immediately after `**[**`captures ﻿`**]**` and extends to the end of `**{**` body `**}**`.<br><br>The [captures](https://en.cppreference.com/w/cpp/language/lambda.html#Lambda_captures "cpp/language/lambda") with initializers of a lambda expression E inhabit the lambda scope introduced by E.<br><br>auto lambda = [x = 1, y]() // this lambda expression introduces a lambda scope,<br>{                          // it is the target scope of capture “x”<br>    /* ... */<br>};                         // the lambda scope ends before the semicolon|(since C++14)|

### Namespace scope

Every [namespace definition](https://en.cppreference.com/w/cpp/language/namespace.html "cpp/language/namespace") for a namespace `N` introduces a _namespace scope_ `S` that includes the declarations for every namespace definition for `N`.

For each non-friend redeclaration or specialization whose target scope is `S` or is contained by `S`, the following portions are also included in scope `S`:

- For a [class](https://en.cppreference.com/w/cpp/language/class.html "cpp/language/class") (template) redeclaration or class template specialization, the portion after its class-head-name.
- For a [enumeration](https://en.cppreference.com/w/cpp/language/enum.html "cpp/language/enum") redeclaration, the portion after its enum-head-name.
- For any other redeclaration or specialization, the portion after the unqualified-id or qualified-id of the [declarator](https://en.cppreference.com/w/cpp/language/declarations.html#Declarators "cpp/language/declarations").

The [global scope](https://en.cppreference.com/w/cpp/language/scope.html#General) is the namespace scope of the [global namespace](https://en.cppreference.com/w/cpp/language/namespace.html "cpp/language/namespace").

namespace V   // the namespace definition of “V”
{             // introduces a namespace scope “S”
    // the first part of scope “S” begins here
    void f();
    // the first part of scope “S” ends here
}
 
void V::f()   // the portion after “f” is also a part of scope “S”
{
    void h(); // declares V::h
}             // the second part of scope “S” ends here

### Class scope

Each declaration of a class or class template `C` introduces a _class scope_ `S` that includes the member-specification of the [class definition](https://en.cppreference.com/w/cpp/language/class.html "cpp/language/class") of `C`.

For each non-friend redeclaration or specialization whose target scope is `S` or is contained by `S`, the following portions are also included in scope `S`:

- For a [class](https://en.cppreference.com/w/cpp/language/class.html "cpp/language/class") (template) redeclaration or class template specialization, the portion after its class-head-name.
- For a [enumeration](https://en.cppreference.com/w/cpp/language/enum.html "cpp/language/enum") redeclaration, the portion after its enum-head-name.
- For any other redeclaration or specialization, the portion after the unqualified-id or qualified-id of the [declarator](https://en.cppreference.com/w/cpp/language/declarations.html#Declarators "cpp/language/declarations").

class C       // the class definition of “C”
{             // introduces a class scope “S”
    // the first part of scope “S” begins here
    void f();
    // the first part of scope “S” ends here
}
 
void C::f()   // the portion after “f” is also a part of scope “S”
{
    /* ... */
}             // the second part of scope “S” ends here

### Enumeration scope

Each declaration of an enumeration `E` introduces an _enumeration scope_ that includes the enumerator-list of the non-opaque(since C++11) [enumeration declaration](https://en.cppreference.com/w/cpp/language/enum.html "cpp/language/enum") of `E` (if present).

enum class E // the enumeration declaration of “E”
{            // introduces an enumeration scope “S”
    // scope “S” begins here
    e1, e2, e3
    // scope “S” ends here
}


---
## Constants

### `const`
Means "read-only." It's a promise that you won't change the value _after_ it's been initialized. However, that initialization can happen at runtime (e.g., getting a number from a user).This is used primarily to specify interfaces, so that data can be passed to functions without fear of it being modified. The compiler enforces the promise made by const.

### `constexpr` 
Means "compile-time constant." It implies `const`, but it also guarantees that the value must be known at the moment the code is compiled. This is used primarily to specify constants, to allow placement of data in memory where it is unlikely to be corrupted, and for performance. So, unlike `const` where we can initialize it at runtime, `constexpr` cannot be done. 

```c++
const int dmv = 17; // dmv is a named constant
int var = 17; // var is not a constant
constexpr double max1 = 1.4∗square(dmv); // OK if square(17) is a constant expression
constexpr double max2 = 1.4∗square(var); // error : var is not a constant expression
const double max3 = 1.4∗square(var); // OK, may be evaluated at run time
double sum(const vector<double>&); // sum will not modify its argument (§2.2.5)
vector<double> v {1.2, 3.4, 4.5}; // v is not a constant
const double s1 = sum(v); // OK: evaluated at run time
constexpr double s2 = sum(v); // error : sum(v) not constant expression
```

#### `constexpr` Variables
When you mark a variable as `constexpr`, you are telling the compiler to replace every usage of that variable with its actual value, similar to a `#define` macro but much safer because it follows C++ scope and type rules.

A variable or variable template(since C++14) can be declared `constexpr` if all following conditions are satisfied:
- The declaration is a definition.
- It is of a literal type. 
- It is initialized (by the declaration).
- The full-expression of its initialization is a constant expression.
- It is constant-initializable.
- It has constant destruction. If the variable is an object (like a `struct`), its destructor must also be able to run at compile time. This is crucial for using things like `std::vector` inside `constexpr` functions in modern C++ which means one of the following conditions needs to be satisfied:
	- It is not of class type nor (possibly multi-dimensional) array thereof.
	- It is of a class type with a `constexpr` destructor or (possibly multi-dimensional) array thereof, and for a hypothetical expression e whose only effect is to destroy the object, e would be a core constant expression if the lifetime of the object and its non-mutable subobjects (but not its mutable subobjects) were considered to start within e.

```c++
constexpr double PI = 3.14159;
constexpr int MAX_STUDENTS = 30;
constexpr int TOTAL_CAPACITY = MAX_STUDENTS * 2; // OK: calculated by compiler
```

##### Difference between `constexpr` and `#define`
`#define` (The Preprocessor) is a "dumb" text substitution tool. It runs before the compiler even sees your code. It simply finds the name and replaces it with the value, like a "Find and Replace" in a text editor.`constexpr` (The Compiler) understands types, scopes, and C++ rules.

| **Feature**     | **#define**                                                               | **constexpr**                                              |
| --------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Type Safety** | **None.** It’s just text.                                                 | **Strong.** It has a specific type (int, double, etc.).    |
| **Scope**       | **Global.** Once defined, it stays until the end of the file.             | **Respects Scope.** Can be local to a function or a class. |
| **Evaluation**  | Simple substitution.                                                      | Can perform complex logic and loops at compile-time.       |
| **Namespace**   | Ignores namespaces (can cause name clashes).                              | Follows namespace rules perfectly.                         |

#### `constexpr` Functions
A `constexpr` function is a function that can be executed by the compiler and can be invoked within a constant expression. 

- A constexpr specifier used in the first declaration of a function or static data member(since C++17) implies inline. 
- If any declaration of a function or function template has a `constexpr` specifier, then every declaration must contain that specifier. 
- You cannot use `rand()` or `mt19937` inside a `constexpr` function because the result must be "constant" (the same every time).

**Requirements**
- If it is a constructor or destructor(since C++20), its class does not have any [virtual base class](https://en.cppreference.com/w/cpp/language/derived_class.html#Virtual_base_classes "cpp/language/derived class").
- It is not a [virtual](https://en.cppreference.com/w/cpp/language/virtual.html "cpp/language/virtual") function.(Not relevant)
- You cannot use `goto` or assembly code inside the function.
- **Arguments & Return Type**: Must be "literal types" (simple types like `int`, `double`, `char`, or simple structs).
- **No "Side Effects"**: You can't change global variables or do I/O (like `std::cout`) inside them because the console doesn't exist yet during compilation.
- **No `try-catch` blocks (Until C++20):** In C++20 and later, you _can_ have `try-catch`, but you cannot throw an exception that isn't caught within the function during compile-time evaluation.


**Inside the function -**
- **C++11 -** Only allowed a single `return` statement.
- **C++14 onwards -** You can use loops (`for`, `while`), `if` statements, and local variables.
- **Local Variables -** You can declare and modify local variables, provided they are literal types.
- **Memory Allocation (Since C++20) -** You can use `std::vector` or `std::string` inside a `constexpr` function. The catch is that any memory allocated must be freed before the function returns. For example, you can use a vector to help calculate a result at compile time, but you cannot return that vector as a `constexpr` object.

```c++
// If you call a constexpr function where a constant is required (like an array size), the arguments you pass to it must also be constant expressions.
constexpr int square(int n) {
    return n * n;
}

int main() {
    constexpr int res = square(5); // OK: 5 is a constant. Compiler does the math.
    
    int x; cin >> x;
    int runtime_res = square(x);   // OK: Acts like a normal function at runtime.
    
    // constexpr int error = square(x); // ERROR: 'x' is not known at compile time.
}
```

#### `if constexpr` (The "Static If")
Introduced in C++17, it allows the compiler to discard branches of code entirely during compilation.

If you use the result to initialize a `constexpr` variable, it must run at compile-time.

You can have recursive `constexpr` functions (like calculating Factorial or Fibonacci). However, compilers have a "recursion limit" (usually around 512 or 1024 calls). If your compile-time calculation is too deep, the compiler will throw an error.

You can use pointers in `constexpr`, but they must point to objects with **static storage duration** (like global variables). You cannot point to a local variable that won't exist once compilation finishes.

```c++
template <typename T>
void print_value(T value) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "This is an integer: " << value << "\n";
    } else {
        std::cout << "This is not an integer.\n";
    }
}
// If you call print_value(10), the compiler sees that T is an int, keeps the first block, and completely deletes the else block from the final program.
```


---

## User Defined Types

### Structures

The first step in building a new type is often to organize the elements it needs into a data structure, a struct:
```c++
struct Vector {
int sz; //
number of elements
double∗ elem; //
pointer to elements
};

// This first version of Vector consists of an int and a double∗.
// A variable of type Vector can be defined like this:
Vector v;

// However, by itself that is not of much use because v’s elem pointer doesn’t point to anything. To be useful, we must give v some elements to point to. For example, we can construct a Vector like this:
void vector_init(Vector& v, int s)
{
v.elem = new double[s]; //
allocate an array of s doubles
v.sz = s;
}
// That is, v’s elem member gets a pointer produced by the new operator and v’s size member gets the number of elements. The & in Vector& indicates that we pass v by non-const reference; that way, vector_init() can modify the vector passed to it.
// The new operator allocates memory from an area called the free store (also known as dynamic memory and heap.
```

### Enumerations

```c++
enum class Color { red, blue, green };
enum class Traffic_light { green, yellow, red };
Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

Note that enumerators (e.g., red) are in the scope of their enum class, so that they can be used
repeatedly in different enum classes without confusion. For example, Color::red is Color’s red
which is different from Traffic_light::red.
Enumerations are used to represent small sets of integer values. They are used to make code
more readable and less error-prone than it would have been had the symbolic (and mnemonic) enumerator names not been used.
The class after the `enum` specifies that an enumeration is strongly typed and that its enumerators are scoped. Being separate types, `enum` classes help prevent accidental misuses of constants. In
particular, we cannot mix Traffic_light and Color values:
```c++
Color x = red; // error : which red?
Color y = Traffic_light::red; // error : that red is not a Color
Color z = Color::red; // OK

// Similarly, we cannot implicitly mix Color and integer values:
int i = Color::red; // error : Color ::red is not an int
Color c = 2; // error : 2 is not a Color
```

If you don’t want to explicitly qualify enumerator names and want enumerator values to be ints
(without the need for an explicit conversion), you can remove the class from enum class to get a
‘‘plain enum’’.

By default, an `enum` class has only assignment, initialization, and comparisons (e.g., == and <) defined. However, an enumeration is a user-defined type so we can define operators for it:

```c++
Traffic_light& operator++(Traffic_light& t)
//prefix increment: ++
{
switch (t) {
case Traffic_light::green: return t=Traffic_light::yellow;
case Traffic_light::yellow: return t=Traffic_light::red;
case Traffic_light::red: return t=Traffic_light::green;
}
}
Traffic_light next = ++light; //next becomes Traffic_light::green
```

---

## Name Lookup

Name lookup is the process the C++ compiler uses to figure out what a "name" (like a variable, function, or class) refers to when it sees it in your code. Think of it as the compiler’s "Search Engine." If you type `cout`, the compiler has to search through your code and included libraries to find where `cout` was defined.
### Unqualified Name Lookup
This happens when you use a name without specifying its namespace or class (no `::` operator).

The compiler searches "outwards" starting from the current scope. The order of search is
1. **Local Scope:** Inside the current function or block `{}`.
2. **Class Scope:** If the code is inside a class method.
3. **Namespace Scope:** Inside the current namespace.
4. **Global Scope:** The very top level of the file.

- If you define a global variable `int n` and then define another `int n` inside your `main` function, the compiler's unqualified lookup will find the local one first. This "shadowing" is a common source of bugs where you accidentally update the wrong variable.
- If you use `sort(v.begin(), v.end())` without `using namespace std;`, the unqualified lookup will fail. Understanding lookup tells you that you must either use Qualified Lookup (`std::sort`) or a`using` declaration.
- In constructors, if your parameter has the same name as a class member (`int val`), you use `this->val` (qualified) to distinguish it from the parameter `val` (unqualified).

#### Advanced Type: Argument-Dependent Lookup (ADL)

Argument-Dependent Lookup (ADL), also known as Koenig Lookup, is a set of rules in C++ that allows the compiler to find a function's definition based on the namespaces of its arguments. In short: If you call a function without a prefix (like `std::`), the compiler will look for that function in the namespaces where the arguments "live".

ADL works only for functions and does not work for variables or classes. You cannot use it to find a `std::vector` without the `std::` prefix.


```c++
// Swapping
using std::swap; // 1. Bring the standard swap into scope
swap(obj1, obj2); // 2. Call swap without a prefix

// If obj1 and obj2 have a custom, optimized swap function in their own namespace, ADL will find that custom one and use it (which is faster).
// If no custom swap exists, the compiler falls back to the std::swap you brought into scope.


#include <iostream>
 
int main()
{
// There is no operator<< in global namespace, but ADL examines std namespace because the left argument is in std and finds std::operator<<(std::ostream&, const char*)    
    std::cout << "Test\n"; 
    
// Same, using function call notation    
    operator<<(std::cout, "Test\n"); 
    
// Error: “endl” is not declared in this namespace.
// This is not a function call to endl(), so ADL does not apply 
    std::cout << endl; 

// OK: this is a function call: ADL examines std namespace because the argument of endl is in std, and finds std::endl 
    endl(std::cout); 
    
// If you put parentheses around the function name, ADL is disabled. 
    (endl)(std::cout);  // Error: “endl” is not declared in this namespace.
```


##### The Problem

Without ADL, C++ would be incredibly annoying to write. Consider the most common line in C++:

```c++
std::cout << "Hello World";
```

Here, `<<` is actually a function call: `operator<<(std::cout, "Hello World")`.
- The first argument (`std::cout`) is in the **`std`** namespace.
- The function `operator<<` is also defined inside the **`std`** namespace.

If C++ didn't have ADL, the compiler wouldn't find the operator unless you wrote:

```c++
std::operator<<(std::cout, "Hello World");
```

ADL tells the compiler: "Since one of the arguments is a `std::ostream`, you should also check the `std` namespace for a matching function name".

##### How it works (The Search Logic)

When the compiler encounters a function call like `func(arg1, arg2)`:
1. **Normal Lookup:** It looks in the current scope, then parent scopes (standard **Unqualified Lookup**).
2. **ADL Kick-in:** If it hasn't found a match yet (or to find better overloads), it looks into the **associated namespaces** of the arguments' types.
### Qualified Name Lookup
This happens when you use the scope resolution operator (`::`).
- **Example:** `std::vector<int> v;`
- **How it works:** The compiler does not search outwards. It goes directly to the specified scope (in this case, the `std` namespace) and looks for the name there. If it's not in that specific container, it throws a "Not Declared" error



---

## Namespace

Namespaces provide a method for preventing name conflicts in large projects.

Entities declared inside a namespace block are placed in a namespace scope, which prevents them from being mistaken for identically-named entities in other scopes.

Entities declared outside all namespace blocks belong to the _global namespace_. The global namespace belongs to the [global scope](https://en.cppreference.com/w/cpp/language/scope.html "cpp/language/scope"), and can be referred to explicitly with a leading `::`. While it has no declaration, the global namespace is not an [unnamed namespace](https://en.cppreference.com/w/cpp/language/namespace.html#Unnamed_namespaces).

Multiple namespace blocks with the same name are allowed. All declarations within these blocks are declared in the same namespace scope.

#### **What is an "Associated Namespace"?**

- If the argument is a class member, the namespace of the class is associated.
    
- If the argument is a template (like `std::vector<MyType>`), both the namespace of the template (`std`) and the namespace of the type (`MyType`) are associated.

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
