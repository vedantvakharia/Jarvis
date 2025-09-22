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

---

## Format Specifiers

   Format Specifiers - `%[argument_index$][flags][width][.precision]conversion`

1. **General**

| Conversion   | Meaning                      | Example                                 |
| ------------ | ---------------------------- | --------------------------------------- |
| `%b` or `%B` | Boolean                      | `String.format("%b", null)` → `"false"` |
| `%h` or `%H` | Hash code                    | `"7d4991a"`, etc.                       |
| `%s` or `%S` | String (calls `.toString()`) | `"hello"`                               |

2. **Character**

| Conversion   | Meaning           | Example                           |
| ------------ | ----------------- | --------------------------------- |
| `%c` or `%C` | Unicode character | `String.format("%c", 65)` → `"A"` |

3.  **Integral**

| Conversion | Meaning                 | Example |
| ---------- | ----------------------- | ------- |
| `%d`       | Decimal integer         | `123`   |
| `%o`       | Octal integer           | `"173"` |
| `%x`       | Hex integer (lowercase) | `"7b"`  |
| `%X`       | Hex integer (uppercase) | `"7B"`  |

4. **Floating-point**

| Conversion | Meaning                                         | Example          |
| ---------- | ----------------------------------------------- | ---------------- |
| `%e`       | Scientific notation (lowercase)                 | `"1.234568e+02"` |
| `%E`       | Scientific notation (uppercase)                 | `"1.234568E+02"` |
| `%f`       | Decimal (fixed-point)                           | `"123.456000"`   |
| `%g`       | General (uses `%e` or `%f`, depending on value) | `"123.456"`      |
| `%G`       | General (uppercase)                             | `"123.456"`      |
| `%a`       | Hexadecimal floating-point (lowercase)          | `"0x1.edd2f2p7"` |
| `%A`       | Hexadecimal floating-point (uppercase)          | `"0X1.EDD2F2P7"` |

5. **Date/Time**
- You must supply a date/time argument (`java.util.Date`, `Calendar`, or `long` epoch).
- Format is `%tX` or `%TX`.

| Conversion | Meaning                              | Example         |
| ---------- | ------------------------------------ | --------------- |
| `%tH`      | Hour (00–23)                         | `"09"`          |
| `%tI`      | Hour (01–12)                         | `"09"`          |
| `%tk`      | Hour (0–23, no leading zero)         | `"9"`           |
| `%tl`      | Hour (1–12, no leading zero)         | `"9"`           |
| `%tM`      | Minute (00–59)                       | `"05"`          |
| `%tS`      | Seconds (00–59)                      | `"30"`          |
| `%tL`      | Milliseconds (000–999)               | `"123"`         |
| `%tp`      | am/pm (lowercase)                    | `"pm"`          |
| `%Tp`      | AM/PM (uppercase)                    | `"PM"`          |
| `%tB`      | Full month name                      | `"August"`      |
| `%tb`      | Abbreviated month name               | `"Aug"`         |
| `%th`      | Same as `%tb`                        | `"Aug"`         |
| `%tA`      | Full weekday name                    | `"Friday"`      |
| `%ta`      | Abbreviated weekday name             | `"Fri"`         |
| `%tY`      | Year (4-digit)                       | `"2025"`        |
| `%ty`      | Year (last 2 digits)                 | `"25"`          |
| `%tj`      | Day of year (001–366)                | `"234"`         |
| `%tm`      | Month (01–12)                        | `"08"`          |
| `%td`      | Day of month (01–31)                 | `"22"`          |
| `%te`      | Day of month (1–31, no leading zero) | `"22"`          |
| `%tR`      | 24-hour hh:mm                        | `"09:30"`       |
| `%tT`      | 24-hour hh:mm:ss                     | `"09:30:45"`    |
| `%tr`      | 12-hour hh:mm:ss am/pm               | `"09:30:45 PM"` |
| `%tD`      | Date mm/dd/yy                        | `"08/22/25"`    |
| `%tF`      | ISO 8601 yyyy-mm-dd                  | `"2025-08-22"`  |

6. **Percent & Literals**

|Conversion|Meaning|Example|
|---|---|---|
|`%%`|Literal percent sign|`"%"`|
|`%n`|Platform-specific newline|Windows → `"\r\n"`, Linux → `"\n"`|


---
## Access Modifiers
Access modifiers (or access specifiers) set the accessibility of classes, methods, variables, and constructors from different parts of a program. Java has 4 access modifiers - Public, Protected, Private and Default. 

### Public

Accessible **from anywhere** (same class, same package, subclasses, different packages). It’s the most **open** access modifier.

You could use the public keyword with your instance fields, but it would be a very bad idea. Having public instance fields would allow any part of the program to read and modify the instance fields, completely ruining encapsulation.

---
## Conditional Statements

### Shadowing of variables

Java **does not allow** shadowing a local variable in the **same method scope** using the same name — even in a nested block.

```java
// Input
public class Example {
    public static void main(String[] args) {
        int x = 10;
        System.out.println(x);

        {
            int x = 20; // ❌ Compile-time error: variable x is already defined
            System.out.println(x);
        }
    }
}

// Output
Error: variable x is already defined in method main(String[])
```

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
## Type casting

### Widening and Narrowing Primitive Conversion

This situation happens in a **very specific case when we want to convert from a _byte_ to a _char_**. The first conversion is the widening of the _byte_ to _int_ and then from the _int_ it is narrowed down to _char_.

An example will clarify this point:

```java
byte myLargeValueByte = (byte) 130;   //0b10000010 -126
```

The binary representation of 130 is the same for -126, the difference is the interpretation of the signal bit. Let’s now convert from _byte_ to _char_:

```java
char myLargeValueChar = (char) myLargeValueByte;
  //0b11111111 10000010 unsigned value
int myLargeValueInt = myLargeValueChar; //0b11111111 10000010 65410
```

The _char_ representation is a Unicode value, but converting to an _int_ showed us a very large value which has the lower 8 bits exactly the same as -126.

If we convert it again to _byte_ we get:

```java
byte myOtherByte = (byte) myLargeValueInt; //0b10000010 -126
```

The original value that we used. If the whole code was starting with a _char_ the values will be different:

```java
char myLargeValueChar2 = 130; //This is an int not a byte! 
  //0b 00000000 10000010 unsigned value
        
int myLargeValueInt2 = myLargeValueChar2; //0b00000000 10000010  130
        
byte myOtherByte2 = (byte) myLargeValueInt2; //0b10000010 -126
```

Although the _byte_ representation is the same, which is -126, the _char_ representation gives us two different characters.


### String to Int

#### `Intger.parseInt()` method

The **most common** and efficient way. Works only with valid integer strings (like `"123"`, `"-45"`).`Integer.parseInt()` method will throw`NumberFormatException` if String provided is not a proper number. Same technique can be used to convert other data type like float and Double to String in Java. Java API provides static methods like `Float.parseFloat()` and `Double.parseDouble()` to perform data type conversion. 

```java title:Intger.parseInt()
String s = "123";
int num = Integer.parseInt(s);
System.out.println(num);  // 123

int binary = Integer.parseInt("1010", 2); // 10
```

#### `Integer.valueOf()` Method

Similar to `parseInt`, but returns an `Integer` object instead of primitive `int`. Same exceptions as `parseInt`. It is a static method. 

```java title:Integer.valueOf()
Integer i = Integer.valueOf("123");
System.out.println(i); // 123

// Integer.valueOf does not always create a new object. Java caches integers in the range -128 to 127. That’s why comparing Integer with == can be dangerous. Always use .equals().

Integer a = Integer.valueOf("100");
Integer b = Integer.valueOf("100");
System.out.println(a == b); // true (same cached object)

Integer x = Integer.valueOf("200");
Integer y = Integer.valueOf("200");
System.out.println(x == y); // false (new objects)

// Empty String
Integer.valueOf(""); // NumberFormatException: For input string: ""

// Null String
Integer.valueOf(null); // NumberFormatException: null

// Non-numeric Input
Integer.valueOf("abc"); // NumberFormatException: For input string: "abc"

// Whitespace
Integer.valueOf(" 123 "); // NumberFormatException (must trim manually)

// Signs
Integer.valueOf("+123"); // 123
Integer.valueOf("-123"); // -123

// Leading Zeros
Integer.valueOf("007"); // 7

// Radix version - Radix must be between 2 and 36
public static Integer valueOf(String s, int radix)
Integer.valueOf("1010", 2); // 10
Integer.valueOf("7B", 16);  // 123
```


## Int to String

#### + Operator

Use "+" concatenation operator with String to convert int variable into String object. Example - `String price = "" + 123;`. This code is translated into following `new StringBuilder().append("").append(10).toString();`

`StringBuilder(String)` constructor allocates a buffer containing 16 characters. So, appending up to 16 characters to that `StringBuilder` will not require buffer reallocation, but appending more than 16 characters will expand `StringBuider` buffer. Though it's not going to happen because `Integer.MAX_VALUE` is 2147483647, which is less than 16 characters.   
  
At the end, `StringBuilder.toString()` will create a new String object with a copy of the StringBuilder buffer. This means for converting a single integer value to String you will need to allocate: one StringBuilder, one char array char[16], one String and one char[] of appropriate size to fit your input value.   
  
If you use `String.vauleOf()` will not only benefit from a cached set of values but also you will at least avoid creating a StringBuilder.

#### `String.valueOf()`

`String.valueOf()` method is overloaded to accept almost all primitive type so you can use it convert char, double, float or any other data type into String. Example - `String price = String.valueOf(123);`

#### `String.format()`

```java
String price = String.format ("%d", **123**);
```


---
## Text Blocks

Text blocks are a modern Java feature that makes it much easier to create multi-line strings. They get rid of the clunky concatenation and excessive escape characters that were needed in the past, especially for formatted text like JSON, SQL, or HTML.

### The Problem: Multi-line Strings the Old Way

Before text blocks (which became standard in Java 15), creating a multi-line string was messy. You had to manually add newline characters (`\n`) and use the `+` operator to join lines, making the code hard to read and maintain.

For example, creating a simple JSON string looked like this:
```java
String jsonOld = "{\n" +
                 "  \"name\": \"Alex\",\n" +
                 "  \"age\": 30,\n" +
                 "  \"isStudent\": false\n" +
                 "}";
```

This is ugly, error-prone, and doesn't look like the final output.

### The Solution: Text Block Syntax

Text blocks let you write the string exactly as you want it to appear. A text block starts with three double-quotes (`"""`) followed by a newline, and ends with three double-quotes.

Here is the same JSON created with a text block:
```java
String jsonNew = """
                 {
                   "name": "Alex",
                   "age": 30,
                   "isStudent": false
                 }
                 """;
```

The result is clean, readable, and you can copy-paste formatted text directly into your code.

If you don’t want a newline after the last line, put the closing """ immediately after the last character.

### Rules and features

#### Indentation

A key feature of text blocks is how they intelligently handle indentation. The compiler automatically removes the unnecessary leading whitespace that you add just to align the text block with your code.

It follows a simple algorithm:
- **Find the Margin -** It looks at all the lines inside the block and finds the line with the least amount of leading whitespace. This line (or the position of the closing `"""`) determines the left margin.
- **Strip the Margin -** It then removes that same amount of "incidental" whitespace from every line.
- **Keep the Rest -** Any indentation to the right of this margin is considered "essential" and is preserved in the final string.

```java title:Indentation
// Input
public void printHtml() {
    String html = """
                  <html>           // This line sets the margin
                    <body>
                      <p>Hello</p>
                    </body>
                  </html>
                  """;
    System.out.println(html);
}

// Output
<html>
  <body>
    <p>Hello</p>
  </body>
</html>
```

The compiler recognized that the indentation before `<html>` was just for aligning the block in the source code and removed it from every line, while keeping the essential indentation of the nested tags

#### Line Joining with Backslash (`\`)

```java title:"Line joining using \"
// Input
String s = """
    Line 1 \
    Line 2 \
    Line 3
    """;
System.out.println(s);  

// Output
Line 1 Line 2 Line 3
```

- The `\` at end **joins this line with the next**, removing the newline.
- It lets you format your code nicely **without affecting the actual string**.

#### Trailing Whitespace and `\s`

Java **removes trailing spaces** at the end of each line in a text block.

If you really need a space at the end, use `\s`:
```java title:"Trailing Whitespace and \s"
// This keeps the space where you'd normally lose it.
String x = """
    Keep this space ->\s
    """;
```

---

## Arrays

### Declaring Arrays

Declare an array variable by specifying the array type—which is the element type followed by []—and the array variable name. For example, here is the declaration of an array a of integers:
`int[] a;`

However, this statement only declares the variable a. It does not yet initialize a with an actual array. Use the new operator to create the array. 
`int[] a = new int[100]; // or var a = new int[100];`

This statement declares and initializes an array of 100 integers. The array length need not be a constant: new int[n] creates an array of length n.

You can define an array variable either as `int[] a;`or as `int a[];`.

Java has a shortcut for creating an array object and supplying initial values:
`int[] smallPrimes = { 2, 3, 5, 7, 11, 13 };`
New keyword is not used with this syntax, and we don’t specify the length.

A comma after the last value is allowed, which can be convenient for an array to which you keep adding values over time:
```java
String[] authors =
{
"James Gosling",
"Bill Joy",
"Guy Steele",
// add more names here and put a comma after each name
};
```

You can declare an anonymous array:
`new int[] { 17, 19, 23, 29, 31, 37 }`
This expression allocates a new array and fills it with the values inside the braces. It counts the number of initial values and sets the array length accordingly. You can use this syntax to reinitialize an array without creating a new variable. 
```java
smallPrimes = new int[] { 17, 19, 23, 29, 31, 37 };
// Above is same as below
int[] anonymous = { 17, 19, 23, 29, 31, 37 };
smallPrimes = anonymous;
```

It is legal to have arrays of length 0. Such an array can be useful if you write a method that computes an array result and the result happens to be empty. An array of length 0 is not the same as null.

When you create an array of numbers, all elements are initialized with zero. Arrays of boolean are initialized with false. Arrays of objects are initialized with the special value null, which indicates that they do not (yet) hold any objects. 

### For each loop

Java has a powerful looping construct that allows you to loop through each element in an array (or any other collection of elements) without having to fuss with index values. The enhanced for loop
`for (variable : collection) statement`

sets the given variable to each element of the collection and then executes the statement (which, of course, may be a block). The collection expression must be an array or an object of a class that implements the iterable interface, such as ArrayList.

```java title:"Example of for each loop"
for (int element : a)
	System.out.println(element);
```

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

## Wrapper Class

Wrapper class is a class that encapsulates types, so that those types can be used to create object instances and methods in another class that needs those types. So a primitive wrapper class is a wrapper class that encapsulates, hides or wraps data types from the eight primitive data types so that these can be used to create instantiated objects with methods in another class or in other classes. Each primitive has a corresponding wrapper in the `java.lang` package. 

### The difference between wrapper classes and primitive types

Primitive wrapper classes are not the same thing as primitive types. Whereas variables, for example, can be declared in Java as data types double, short, int, etc., the primitive wrapper classes create instantiated objects and methods that inherit but hide the primitive data types, not like variables that are assigned the data type values.

Therefore, the term Primitive wrapper class does not mean that wrapper classes are primitive types. It should be understood to be a class that wraps primitive types. Wrapper classes can be used to store the same value as of a primitive type variable but the instances/objects of wrapper classes themselves are Non-Primitive. We cannot say that Wrapper classes themselves are Primitive types. They just wrap the primitive types.

The `Byte`, `Short`, `Integer`, `Long`, `Float`, and `Double` wrapper classes are all subclasses of the Number class.

The wrapper classes `BigDecimal` and `BigInteger` are not one of the primitive wrapper classes but are immutable.

### Primitive to Wrapper Class Conversion

```java
// Primitve to Wrapper
Integer object = new Integer(1);
Integer anotherObject = Integer.valueOf(1);

// Wrapper to Primitive
int val = object.intValue();
```

The `valueOf()` method returns an instance representing the specified _int_ value. It returns cached values which makes it efficient. It always caches values between -128 to 127 but can also cache other values outside this range. Similarly, we can also convert _boolean_ to _Boolean, byte_ to _Byte, char_ to _Character, long_ to _Long, float_ to _Float,_ and _double_ to _Double._ Though if we have to convert string to integer then we need to use `parseInt()` method because _String_ isn’t a wrapper class.

On the other hand, to convert from a wrapper object to a primitive value, we can use the corresponding method such as `intValue()`, `doubleValue()`, etc.


