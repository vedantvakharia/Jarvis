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

Under Java, the ranges of the integer types do not depend on the machine on which you will be running the Java code. Java doesn't have unsigned.

Long integer numbers have a suffix L or l (for example, 4000000000L).
Hexadecimal numbers have a prefix 0x or 0X (for example, 0xCAFE). 
Octal numbers have a prefix 0 (for example, 010 is 8)
You can write numbers in binary, with a prefix 0b or 0B. For example, 0b1001 is 9. You can add underscores to number literals, such as 1_000_000 (or 0b1111_0100_0010_0100_0000) to denote one million. The underscores are for human eyes only. The Java compiler simply removes them.

Numbers of type float have a suffix F or f (for example, 3.14F). Floating-point numbers without an F suffix (such as 3.14) are always considered to be of type double. You can optionally supply the D or d suffix (for example,3.14D).
An E or e denotes a decimal exponent. In hexadecimal notation, you use a p, not an e, to denote the exponent. 

In Java, the char type describes a code unit in the UTF-16 encoding.

You cannot convert between integers and Boolean values. In C++, numbers and even pointers can be used in place of Boolean values. The value 0 is equivalent to the bool value false, and a nonzero value is equivalent to true. This is not the case in Java. Thus, Java programmers are
shielded from accidents such as
`if (x = 0) // oops... meant x == 0`
In C++, this test compiles and runs, always evaluating to false. In Java, the test does not compile because the integer expression x = 0 cannot be converted to a Boolean value.

Starting with Java 10, you do not need to declare the types of local variables if they can be inferred from the initial value. Simply use the keyword var instead of the type:
`var vacationDays = 12; // vacationDays is an int`
`var greeting = "Hello"; // greeting is a String`

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
   
---
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

The `>>>` operator in Java is the **unsigned right shift** operator, often called the "zero-fill right shift." It works directly on the binary representation of a number. In short, it shifts all bits in a number to the right by a specified amount and fills the new bits on the left side with **zeros**, regardless of the number's original sign.

For positive numbers, `>>` and `>>>` behave exactly the same. Let's take the number `20` and shift it right by 2 positions (`20 / 4 = 5`). The binary representation of `20` (as a 32-bit `int`) is: `00000000 00000000 00000000 00010100`.
- **`20 >> 2` (Signed Shift):** The sign bit is 0. The two rightmost bits (`00`) are dropped, and two **0s** are added to the left. `00000000 00000000 00000000 00000101` This is the binary for `5`.
- **`20 >>> 2` (Unsigned Shift):** The operator adds two **0s** to the left. `00000000 00000000 00000000 00000101` This is also the binary for `5`.

**Result:** For any positive number, `>>` and `>>>` produce the same result.


Negative numbers in Java are stored using a format called **two's complement**. The binary for `-20` is: `11111111 11111111 11111111 11101100` Notice the leftmost bit is `1`, indicating a negative number.
- **`-20 >> 2` (Signed Shift):** The sign bit is `1`. The two rightmost bits (`00`) are dropped, and two **1s** are added to the left to preserve the sign. `11111111 11111111 11111111 11111011` This is the binary for `-5`. The sign is correctly preserved.
- **`-20 >>> 2` (Unsigned Shift):** This operator **always** fills with **0s**. The two rightmost bits are dropped, and two **0s** are added to the left. `00111111 11111111 11111111 11111011` The result is a huge positive number (`1,073,741,819`). Because the sign bit was replaced with a `0`, the number is now interpreted as positive.

Common use cases of `>>>` include:
- **Color Calculation:** In graphics, colors are often packed into a single integer (e.g., ARGB - Alpha, Red, Green, Blue, 8 bits each). To extract the red component, you might shift the bits right, and you'd want the new bits to be zeros, not ones.
- **Hashing Algorithms:** When implementing algorithms like hash maps, you often manipulate bit patterns where the sign is irrelevant. `>>>` ensures predictable, consistent behavior.
- **Interpreting Unsigned Data:** When working with data from other systems that use unsigned integers, `>>>` helps to correctly manipulate the bit patterns without Java's signed interpretation getting in the way.

In C/C++, there is no guarantee as to whether >> performs an arithmetic shift (extending the sign bit) or a logical shift (filling in with zeroes). Implementors are free to choose whichever is more efficient. That means the C/C++ >> operator may yield implementation-dependent results for negative numbers. Java removes that uncertainty.

---
## Escape Sequences
| Escape Sequence | Name              | Unicode Value | Description                                                                   |
| --------------- | ----------------- | ------------- | ----------------------------------------------------------------------------- |
| `\n`            | New Line          | \u000a        | Moves the cursor to a new line                                                |
| `\t`            | Horizontal Tab    | \u0009        | Inserts a tab (usually 4 or 8 spaces)                                         |
| `\b`            | Backspace         | \u0008        | Deletes one character before it                                               |
| `\r`            | Carriage Return   | \u000d        | Moves cursor to the beginning of the line (may overwrite depending on system) |
| `\f`            | Form Feed         | \u000c        | Advances to the next "page" (used in printers, rarely used now)               |
| `\'`            | Single Quote      | \u0027        | Represents `'` inside a character or string literal                           |
| `\"`            | Double Quote      | \u0022        | Represents `"` inside a string                                                |
| `\\`            | Backslash         | \u005c        | Inserts a literal backslash                                                   |
| `\s`            | Space             | \u0020        |                                                                               |
| `\uXXXX`        | Unicode Character |               | Inserts a Unicode character using 4-digit hex code                            |
## Access Modifiers
Access modifiers (or access specifiers) set the accessibility of classes, methods, variables, and constructors from different parts of a program. Java has 4 access modifiers - Public, Protected, Private and Default. 

### Public

---
## Conditional Statements

### Switch statements

#### 1. Traditional `switch` statement

```java
switch (value) {
    case A:
        // code
        break;
    case B:
        // code
        break;
    default:
        // code
}

```

##### Characteristics:
- Statements only — **can’t return a value**.
- `break` required to avoid **fall-through**.
- Very **imperative** in style.

##### Problems:
- Easy to forget `break`, leading to bugs.
- Verbose, especially when assigning values.
- Not expression-friendly (can’t use in `return` or assignment).

#### 2. Enhanced `switch` statement (Java 12+ preview, Java 14 stable)

```java
switch (value) {
    case A -> doSomething();
    case B -> doSomethingElse();
    default -> handleDefault();
}
```

##### Characteristics:
- **No fall-through**; each case is a single action.
- Cleaner and **less error-prone**.
- Still a **statement**, not an expression (can't return value directly).
  
#### 3.`switch` as an expression (Java 14)
```java
String result = switch (value) {
    case A -> "Alpha";
    case B -> "Beta";
    default -> "Unknown";
};
```

##### Characteristics:
- **Expression form**: switch returns a value.
- Each case **must** produce a value.
- The entire block is **assignable** (e.g., in `String result = ...`).
- Great for functional or expression-oriented code.

#### 4.`switch` expression with block (`yield`) (Java 14)

If you need more logic in each case, you can use **blocks** and `yield`.

```java
String result = switch (value) {
    case A -> {
        log("processing A");
        yield "Alpha";
    }
    case B -> {
        String s = compute();
        yield s;
    }
    default -> "Unknown";
};

public static String formatObject(Object obj) {
    // This is a switch expression with pattern matching
    return switch (obj) {
        // Case 1: Handle null explicitly
        case null -> "Object is null";
        
        // Case 2: If obj is an Integer, cast it to i
        case Integer i -> String.format("Integer value: %d", i);
        
        // Case 3: If obj is a Double, cast it to d
        case Double d -> String.format("Double value: %.2f", d);
        
        // Case 4: If obj is a String, cast it to s
        // This includes a "guarded pattern" with a 'when' clause
        case String s when s.length() > 10 -> "A long string: " + s.substring(0, 10) + "...";
        case String s -> "A string: " + s;
        
        // Case 5: The default case for any other type
        default -> "Unknown object type";
    };
}

public static void main(String[] args) {
    System.out.println(formatObject(123));          // Output: Integer value: 123
    System.out.println(formatObject("Hello, Java!"));// Output: A long string: Hello, Jav...
    System.out.println(formatObject("Hi"));           // Output: A string: Hi
    System.out.println(formatObject(null));           // Output: Object is null
    System.out.println(formatObject(45.678));       // Output: Double value: 45.68
}
```

##### Characteristics:
- Inside a block, use `yield` to produce the value.
- Supports **multi-line case logic**.
- Combines **conciseness** and **power**.

---
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



in Java all functions are methods of some class. Thus, in Java you must have a shell class for the main method. The main method in Java is always static. Unlike C/C++, the main method does not
return an “exit code” to the operating system. If the main method exits normally, the Java program has the exit code 0, indicating successful completion. To terminate the program with a different exit code, use the System.exit method

Java uses the general syntax object.method(parameters) as its equivalent of a function call.