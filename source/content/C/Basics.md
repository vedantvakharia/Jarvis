
## 1.  C Keywords -

1. **Basic Data Types** - 
- **`int`**: Used to declare integer variables.
- **`float`**: Used to declare floating-point variables(32 bits)
- **`double`**: Used to declare double-precision floating-point variables(64 bits)
- **`char`**: Used to declare character variables.
- **`void`**: Represents no type; used for functions that do not return a value or have no arguments.
- `size_t` : An **unsigned integer type** used to **represent the size of objects in bytes**.

2. **Type Modifiers** - 
- **`short`**: Used to declare short integers (less memory than `int`).
- **`long`**: Used to declare long integers or doubles (more memory than `int`).
- **`signed`**: Indicates that a variable can hold both positive and negative values.
- **`unsigned`**: Indicates that a variable can hold only positive values.

3. **Control Flow Keywords** - 
- **`if`**: Used to execute a block of code if a condition is true.
- **`else`**: Used to execute an alternate block of code if the `if` condition is false.
- **`switch`**: Used for multi-way branching based on the value of a variable.
- **`case`**: Defines a block of code for a specific value in a `switch` statement.
- **`default`**: Specifies the block of code to execute if no `case` matches in a `switch`.
- **`for`**: Used to create a loop with a known number of iterations.
- **`while`**: Used to create a loop that executes while a condition is true.
- **`do`**: Used with `while` to create a loop that executes at least once before checking the condition.
- **`break`**: Terminates the nearest enclosing loop or `switch` statement.
- **`continue`**: Skips the rest of the loop body and moves to the next iteration.
- **`goto`**: Transfers control to a labeled statement (not recommended in modern programming).
- **`return`**: Exits from a function and optionally returns a value.

4.  **Storage Class Specifiers** - 
- **`auto`**: The default storage class for local variables (rarely used explicitly).
- **`register`**: Suggests that the variable be stored in a CPU register for faster access.
- **`static`**: Preserves the value of a variable between function calls or restricts its scope in files.
- **`extern`**: Declares a global variable or function defined in another file.

5. **User-Defined Data Types** - 
- **`struct`**: Used to group multiple variables into a single compound data structure.
- **`union`**: Allows multiple variables to share the same memory location.
- **`enum`**: Defines a set of named integer constants.

6. **Special Keywords** - 
- **`const`**: Declares a variable whose value cannot be changed after initialization.
- **`volatile`**: Tells the compiler that the value of a variable may change unexpectedly (e.g., hardware registers).
- **`typedef`**: Used to create an alias for an existing data type

7. **Logical Keywords** - 
- **`sizeof`**: Returns the size of a variable or data type in bytes.
## 2. Operator hierarchy - 


| ****Precedence**** | ****Operator**** | ****Description****                               | ****Associativity**** |
| ------------------ | ---------------- | ------------------------------------------------- | --------------------- |
| 1                  | ()               | function call                                     | Left-to-Right         |
|                    | []               | Array Subscript                                   |                       |
|                    | .                | Dot Operator                                      |                       |
|                    | ->               | Structure Pointer Operator                        |                       |
|                    | ++, -            | Postfix increment, decrement                      |                       |
| 2                  | ++ / —           | Prefix increment, decrement                       | Right-to-Left         |
|                    | + / –            | Unary plus, minus                                 |                       |
|                    | ! , ~            | Logical NOT,  Bitwise complement                  |                       |
|                    | (type)           | Cast Operator                                     |                       |
|                    | *                | Dereference Operator                              |                       |
|                    | &                | Address of Operator                               |                       |
|                    | sizeof           | Determine size in bytes                           |                       |
| 3                  | *,/,%            | Multiplication, division, modulus                 | Left-to-Right         |
|                    | +/-              | Addition, subtraction                             |                       |
|                    | << , >>          | Bitwise shift left, Bitwise shift right           |                       |
|                    | < , <=           | Relational less than, less than or equal to       |                       |
|                    | > , >=           | Relational greater than, greater than or equal to |                       |
|                    | == , !=          | Relational is equal to, is not equal to           |                       |
|                    | &                | Bitwise AND                                       |                       |
|                    | ^                | Bitwise exclusive OR                              |                       |
|                    | \|               | Bitwise inclusive OR                              |                       |
|                    | &&               | Logical AND                                       |                       |
|                    | \|\|             | Logical OR                                        |                       |
|                    | ?:               | Ternary conditional                               | Right-to-Left         |
|                    | =                | Assignment                                        |                       |
|                    | += , -=          | Addition, subtraction assignment                  |                       |
|                    | *= , /=          | Multiplication, division assignment               |                       |
|                    | %= , &=          | Modulus, bitwise AND assignment                   |                       |
|                    | ^= , \|=         | Bitwise exclusive, inclusive OR assignment        |                       |
|                    | <<=, >>=         | Bitwise shift left, right assignment              |                       |
|                    | ,                | comma (expression separator)                      |                       |


***PUMA’S REBL TAC*** - where, P = Postfix, U = Unary, M = Multiplicative, A = Additive, S = Shift, R = Relational, E = Equality, B = Bitwise, L = Logical, T = Ternary, A = Assignment and C = Comma

C does not support chaining of comparison operators directly because C treats comparison results as integers (`1` for true, `0` for false). Instead, each comparison must be written explicitly using logical operators like `&&` (logical AND) or `||` (logical OR) to combine multiple conditions. 

If we want to write 10< x <20, then we have to write in the following manner
`if (10 < x && x < 20) {`
    `printf("x is between 10 and 20");`
}
## 3. Printf

`printf(%[flags][width][.precision][length]specifier)` -

1. **%** - The `%` character marks the start of a format specifier.
2. **Flags -** Flags modify the appearance of the output. They are optional and can be combined.

| Flags | Description                                                                               |
| ----- | ----------------------------------------------------------------------------------------- |
| -     | Left-justify within the given field width; Right justification is the default             |
| +     | Always show the sign (`+` for positive numbers).                                          |
| space | Adds a space before positive numbers (no sign for negatives).                             |
| #     |                                                                                           |
| 0     | Pads the output with zeros instead of spaces. E.g. - `%05d` (outputs `00042` for width 5) |

3. **Width and Precision -** Width specifies the minimum number of characters to be printed. Precision specifies the number of digits after the decimal for floating-point numbers or the maximum characters for strings.

| Example | Explanation                                       |
| ------- | ------------------------------------------------- |
| %5d     | Prints an integer with a minimum width of 5.      |
| %.2f    | Prints a float with 2 decimal places.             |
| %10.4f  | Prints a float with a width of 10 and 4 decimals. |
| %-5d    | Left-aligns the output within a width of 5.       |

4. **Length Modifiers -** The _length_ sub-specifier modifies the length of the data type. 

| Length Modifier | Description                            |
| --------------- | -------------------------------------- |
| h               | Short integer                          |
| l               | Long integer                           |
| ll              | Long long integer                      |
| L               | Long double for floating-point numbers |
 
5. **Specifiers** - 

| Data type                              | Format specifier |
| -------------------------------------- | ---------------- |
| int                                    | `%d` or `%i`     |
| unsigned int                           | %u               |
| Floating-point number (decimal).       | %f               |
| Floating-point in scientific notation. | %e               |
| double                                 | `%f` or `%lf`    |
| Shortest of `%f` or `%e`               | %g               |
| char                                   | %c               |
| string                                 | %s               |
| Pointer (`void*`)                      | %p               |

## 4. Control Characters 
In C, **control characters** are special **non-printable characters** in the ASCII range `0–31` and `127`. These characters were originally used to **control hardware devices** like terminals and printers, and some are still useful for formatting output or parsing input. Found in `<ctype.h>` and checked using functions like `iscntrl()`. Affect **cursor movement**, **screen display**, or **communication protocols**. 

Commonly used Control Characters

| Escape | ASCII | Name                | Description                                                                                   |
| ------ | ----- | ------------------- | --------------------------------------------------------------------------------------------- |
| \0     | 0     | Null terminator     | Marks the end of a string                                                                     |
| \b     | 8     | Backspace           | Moves cursor back, often erases a character on screen                                         |
| \t     | 9     | Horizontal Tab      | Aligns to next tab stop                                                                       |
| \n     | 10    | Line Feed / Newline | Moves to next line (new line in Unix/Linux)                                                   |
| \v     | 11    | Vertical Tab        | Skips vertically (rare)                                                                       |
| \f     | 12    | Form Feed           | Page break / clear screen in some terminals                                                   |
| \r     | 13    | Carriage Return     | Returns cursor to start of line (overwrites text)<br><br>`printf("123\rABC");` → prints `ABC` |
| \\\    | -     | Backslash           | Prints a literal backslash                                                                    |
| \\'    | -     | Single quote        | For printing a single quote                                                                   |
| \\"    | -     | Double quote        | For printing inside string                                                                    |


## 5. Loops
1. For loop - A pair of expressions separated by a comma is evaluated left to right, and the type and value of the result are the type and value of the right operand. Thus in a for statement, it is possible to place multiple expressions in the various parts, for example to process two indices in parallel. In a single for loop, we can initialize and use 2 variables.
	Instead of - `for(int i = 0; i<n; i++)`
				`for (int j = i+1; j<n; j++)`
	We can use `for(int i = 0, j = i+1; i<n, j<n, i++, j++)`
	
	For reversing a string, we can use `for(int i = 0, j = strlen(s) - 1; i<j, i++, j--)`
2. 