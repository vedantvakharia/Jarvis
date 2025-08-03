
Packages in Java are a mechanism that encapsulates a group of classes, sub-packages, and interfaces. Classes in the same package can access each other's package-private and protected members. In general, a package can contain the following kinds of types - classes, interfaces, enumerations, records and annotation types.
### Why use Packages?
- **Avoid Class Name Conflicts** - Two classes with the same name can coexist if they’re in different packages.
- **Modular Organization** - Group related classes (e.g., `java.util`, `java.io`) for better code structure. These classes will all be related in some way – they might all have to do with a specific application or perform a specific set of tasks.
- **Access Protection** - Packages work with access modifiers (`public`, `protected`, default, `private`) to control visibility.
- **Reusability** - Code can be reused easily if properly organized in packages.
### Using Packages
In a Java source file, the package that this file's class or classes belong to is specified with the `package`keyword. The package statement must be the first line in the source file (excluding comments). At most one package declaration can appear in a source file.

`package java.awt.event;`- this creates the package
`import java.awt.event.*;`- imports all classes from the `java.awt.event` package
`import java.awt.event.ActionEvent;`- imports only the `ActionEvent` class from the package

Classes can also be used directly without an import declaration by using the fully qualified name of the class. `java.awt.event.ActionEvent myEvent = new java.awt.event.ActionEvent();`does not require a preceding import declaration.

### Package Naming Conventions
1. Reverse Domain Name: Use your domain name in reverse as the base of your package names. For example, if your domain is `example.com`, start your package with `com.example`.
2. Lowercase Names: Use lowercase letters to avoid conflicts with class names.
3. Meaningful Names: Use descriptive and meaningful names to reflect the content of the package.
   
### Static Import
Static import  allows members (fields and methods) which have been scoped within their container class as`public static`, to be used in Java code without specifying the class in which the field has been defined.

According to SUN microSystem, it will improve the code readability and enhance coding. But according to the programming experts, it will lead to confusion and not good for programming. If there is no specific requirement then we should not go for static import.

By using static import, if user wants to access any static member of class then less coding is required. However, static import makes the program unreadable and unmaintainable if you are reusing this feature, especially in large codebases or projects with multiple developers. Also, if two static members of the same name are imported from multiple different classes, the compiler will throw an error, as it will not be able to determine which member to use in the absence of class name qualification.

With the help of import, we are able to access classes and interfaces which are present in any package. But using static import, we can access all the static members (variables and methods) of a class directly without explicitly calling class name.

```java
// Calling of predefined methods without static import
class Geeks {
    public static void main(String[] args)
    {
        System.out.println(Math.sqrt(4));
        System.out.println(Math.pow(2, 2));
        System.out.println(Math.abs(6.3));
    }
}

// Calling of predefined methods without static import
import static java.lang.Math.*;
class Test2 {
    public static void main(String[] args)
    {
        System.out.println(sqrt(4));
        System.out.println(pow(2, 2));
        System.out.println(abs(6.3));
    }
}

// Calling of static member of System class without Class name
// System is a class present in java.lang package and out is a static variable present in System class.
import static java.lang.Math.*;
import static java.lang.System.*;
class Geeks {
    public static void main(String[] args)
    {
        out.println(sqrt(4));
        out.println(pow(2, 2));
        out.println(abs(6.3));
    }
}

// Ambiguity in static import
import static java.lang.Integer.*;
import static java.lang.Byte.*;
public class Geeks {
    public static void main(String[] args)
    {
        system.out.println(MAX_VALUE); // Error:Reference to MAX_VALUE is ambiguous
    }
}
// In the above program, we are trying to access MAX_VALUE variable, but Every primitive data type contains MAX_VALUE variable which is pre-declared in there Wrapper class. Here we are importing Integer and Byte class simultaneously and trying to access static variable MAX_VALUE but here compiler will be confused by seeing two import statements because both Integer and Byte class contains a static variable MAX_VALUE. Therefore here compiler throw an error saying Reference to MAX_VALUE is ambiguous.

```


### Built-in Packages

#### java.lang
Provides classes fundamental to the Java language and is automatically imported.

#### java.lang.Math

The floorMod method aims to solve a long-standing problem with integer
remainders. Consider the expression n % 2. Everyone knows that this is 0 if n
is even and 1 if n is odd. Except, of course, when n is odd and negative. Then
it is -1. Why? When the first computers were built, someone had to make
rules for how integer division and remainder should work for negative
operands. Mathematicians had known the optimal (or “Euclidean”) rule for a
few hundred years: always leave the remainder ≥ 0. But, rather than open a
math textbook, those pioneers came up with rules that seemed reasonable but
are actually inconvenient.
Consider this problem. You compute the position of the hour hand of a
clock. An adjustment is applied, and you want to normalize to a number
between 0 and 11. That is easy: (position + adjustment) % 12. But what if
the adjustment is negative? Then you might get a negative number. So you
have to introduce a branch, or use ((position + adjustment) % 12 + 12) %
12. Either way, it is a hassle.
The floorMod method makes it easier: floorMod(position + adjustment,
13) always yields a value between 0 and 11. (Unfortunately, floorMod gives
negative results for negative divisors, but that situation doesn’t often occur
in practice.)

#### java.lang.String

##### Methods

###### Instance Methods

1. `char charAt(int index)`- Returns the `char` value at the specified index. Negative index do not work