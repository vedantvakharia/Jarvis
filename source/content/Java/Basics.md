## Java Keywords
#### Data Types 
1. **`int`-** 32-bit integer
2. **`long`-** 64-bit integer
3. **`short`-** 16-bit integer
4. **`byte`-** 8-bit integer
5. **`float`-** 32-bit decimal
6. **`double`-** 64-biit decimal
7. **`boolean`-** true/false
8. **`char`-** 16-bit Unicode char

#### Access Modifiers 
Control the visibility of classes, methods, and variables.

1. **`public`-** Accessible from anywhere
2. **`private`-** Accessible only within the class
3. **`protected`-** Accessible within package and subclasses
#### Variable Modifiers
1. **`final`-** Makes variable a constant
2. **`transient`-** Excludes variable from serialization
3. **`volatile`-** Prevents thread-local caching (used in concurrency)
4. **`static`-** Belongs to class, not instance
#### Flow Control
1. **`if`-** Used to execute a block of code if a condition is true.
2. **`else`-** Used to execute an alternate block of code if the `if` condition is false.
3. **`switch`-** Used for multi-way branching based on the value of a variable.
4. **`case`-** Defines a block of code for a specific value in a `switch` statement.
5. **`default`-** Specifies the block of code to execute if no `case` matches in a `switch`.
6. **`for`-** Used to create a loop with a known number of iterations.
7. **`while`-** Used to create a loop that executes while a condition is true.
8. **`do`-** Used with `while` to create a loop that executes at least once before checking the condition.
9. **`break`-** Terminates the nearest enclosing loop or `switch` statement.
10. **`continue`-** Skips the rest of the loop body and moves to the next iteration.
11. **`return`-** Exits from a function and optionally returns a value.

#### Exception Handling
1. **`try`-** Defines block that might throw an exception
2. **`catch`-** Catches and handles the exception
3. **`finally`-** Always runs after `try` or `catch`
4. **`throw`-** Manually throws an exception
5. **`throws`-** Declares exceptions that method might throw
6. **`assert`-** Tests assumptions during debugging
   
#### Packages & Imports
1. **`package`-** Declares package name (namespace)
2. **`import`-** Brings other packages/classes
   
#### Concurrency / Multithreading
1. **`synchronized`-** Prevents concurrent access to a method/block
2. **`volatile`-** Ensures variable is read from main memory
   
#### Special Use
1. **`instanceof`-** Tests object type
2. **`enum`-** Defines set of named constants
3. **`native`-** Links to non-Java (native) method implementation
4. **`strictfp`-** Forces floating-point precision to be platform independent
5. **`null`-** Represents no object/reference
   
#### Reserved but Unused
1. **`const`-** Reserved (use`final`)
2. **`goto`-** Reserved (not used)
   

## Operator Precedence
| Precedence      | Operator(s)                                        | Description                                        | Associativity |
| --------------- | -------------------------------------------------- | -------------------------------------------------- | ------------- |
| **1 (highest)** | ()                                                 | Parentheses                                        | Left to right |
|                 | []                                                 | Array access                                       |               |
|                 | new                                                | object creation                                    |               |
|                 | .                                                  | Member access                                      |               |
|                 | ::                                                 | Method reference                                   |               |
| **2**           | ++, --                                             | Post-increment, Post-decrement                     | Left to right |
| **3**           | +, -                                               | Unary plus/minus                                   | Right to left |
|                 | ~, !                                               | Bitwise NOT, logical NOT                           |               |
|                 | ++, --                                             | Pre-increment, Pre-decrement                       |               |
| **4**           | ()                                                 | Type cast                                          | Right to left |
| **5**           | *, /, %                                            | Multiplication, division, modulus                  | Left to right |
| **6**           | +, -                                               | Addition, subtraction                              | Left to right |
|                 | +                                                  | Additive  <br>string concatenation                 |               |
| **7**           | <<, >>, >>>                                        | Bitwise shift (left, signed right, unsigned right) | Left to right |
| **8**           | <, <=, >, >=                                       | Relational                                         | Left to right |
|                 | instanceof                                         | Type comparison                                    |               |
| **9**           | == , !=                                            | Equality and inequality                            | Left to right |
| **10**          | &                                                  | Bitwise AND                                        | Left to right |
| **11**          | ^                                                  | Bitwise XOR                                        | Left to right |
| **12**          | \|                                                 | Bitwise OR                                         | Left to right |
| **13**          | &&                                                 | Logical AND                                        | Left to right |
| **14**          | \|\|                                               | Logical OR                                         | Left to right |
| **14**          | ?:                                                 | Ternary conditional                                | Right to left |
| **16**          | =, +=, -=, *=, /=, %=, &=, ^=, \|=, <<=, >>=, >>>= | Assignment and compound assignment                 | Right to left |
| **17 (lowest)** | ->  <br>->                                         | Lambda expression  <br>Switch expression           | Right to left |
## Escape Sequences
| Escape Sequence | Name              | Description                                                                   |
| --------------- | ----------------- | ----------------------------------------------------------------------------- |
| `\n`            | New Line          | Moves the cursor to a new line                                                |
| `\t`            | Horizontal Tab    | Inserts a tab (usually 4 or 8 spaces)                                         |
| `\b`            | Backspace         | Deletes one character before it                                               |
| `\r`            | Carriage Return   | Moves cursor to the beginning of the line (may overwrite depending on system) |
| `\f`            | Form Feed         | Advances to the next "page" (used in printers, rarely used now)               |
| `\'`            | Single Quote      | Represents `'` inside a character or string literal                           |
| `\"`            | Double Quote      | Represents `"` inside a string                                                |
| `\\`            | Backslash         | Inserts a literal backslash                                                   |
| `\uXXXX`        | Unicode Character | Inserts a Unicode character using 4-digit hex code                            |
## Access Modifiers
Access modifiers (or access specifiers) set the accessibility of classes, methods, variables, and constructors from different parts of a program. Java has 4 access modifiers - Public, Protected, Private and Default. 

### Public


## Conditional Statements


## Static
When you declare a variable or a method as static, it belongs to the class, rather than a specific instance. So, you don’t need to create an object to access a `static` member. This means that only one instance of a static member exists, even if you create multiple objects of the class, or if you don’t create any. It will be shared by all objects.

The static keyword can be used with variables, methods, code blocks and nested classes.
### Static Variables
These are shared across all instances of a class.
### Static Methods
A static method belongs to the class rather than instances. Thus, it can be called without creating instance of class. Static methods can also be called from instance of the class. It is used for altering static contents of the class. You can't access non-static members from a static method. Static methods can't be overridden in the same sense as instance methods. They're hidden, not overridden (this is called _method hiding_). There are some restrictions of static methods :

1. Static method can not use non-static members (variables or functions) of the class.
2. Static method can not use `this` or `super` keywords.
### Static Blocks / Static Clause
Static code blocks are used to initialize static variables. These blocks are executed immediately after declaration of static variables. Static blocks run only once — when the class is first loaded.

### Static Nested Class 
Java allows **nested classes**, and if declared `static`, it doesn't need an instance of the outer class.
```java
class Outer {
    static class Inner {
        void display() {
            System.out.println("Inside static nested class");
        }
    }
}
```
