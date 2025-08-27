## Constructor

In the Java programming language, you use constructors to construct new instances. A constructor is a special method whose purpose is to construct and initialize objects. A constructor has the same name as the class. A class can have more than one constructor. A constructor can take zero, one, or more parameters. A constructor has no return value. A constructor is always called with the new operator. All Java objects are constructed on the heap and that a constructor must be combined with new.

## Accessors and Mutators

Accessor methods (getters) return the value of a private field. They are usually named `getFieldName()` and are always public. 

```java title:"Example of Accessor"
public class Employee {
    private String name;
    private double salary;

    // Accessor methods
    public String getName() {
        return name;
    }

    public double getSalary() {
        return salary;
    }
}
```

Mutator methods (setters) modify the value of a private field. They are usually named `setFieldName()` and are always public. Return type is usually `void`.

```java title:"Example of Mutator"
public class Employee {
    private String name;
    private double salary;

    // Mutator methods
    public void setName(String n) {
        name = n;
    }

    public void setSalary(double s) {
        if (s >= 0) {
            salary = s;
        }
    }
}
```

## Implicit and Explicit parameters

Explicit parameters are the variables declared in a method's signature. They are “explicit” because they are clearly written out for you to see. When you call the method, you must provide a value (an argument) for each explicit parameter. They are written in the parentheses. 

The implicit parameter is the object an instance method is associated with. It's the object that comes before the dot (`.`) in the method call. It's "implicit" because it's not listed in the method's parentheses, but its presence is understood. Inside the method, you can access the implicit parameter using the `this` keyword.

```java title:"Example of Implicit and Explicit parameters"
public void raiseSalary(double byPercent) {
    Employee this = emp;  // implicit parameter
    double raise = this.salary * byPercent / 100;
    this.salary += raise;
}

// byPercent is explicit
```

## Final Keyword 

Final is a keyword or reserved word in Java and can be applied to member variables, methods, class and local variables in Java. Once you make a reference final you are not allowed to change that reference and compiler will verify this and raise a compilation error if you try to re-initialized final variables in Java.

Final and abstract are two opposite keywords and a final class can not be abstract.

Final methods are bonded during compile time also called static binding.

Final variables which are not initialized during declaration are called a blank final variable and must be initialized in all constructors either explicitly or by calling this(). Failure to do so compiler will complain as "final variable (name) might not be initialized".
### Benefits of final keyword

Here are a few benefits or advantages of using the final keyword in Java:
1. Final keyword improves performance. Not just JVM can cache the final variables but also applications can cache frequently use final variables.
2. Final variables are safe to share in a multi-threading  environment without additional synchronization overhead.
3. Final keyword allows JVM to an optimized method, variable or class because JVM gets an opportunity to make assumptions and optimization.
   
```java
class A {
    void greet() { System.out.println("Hi from A"); }
}

class B extends A {
    void greet() { System.out.println("Hi from B"); }
}

A obj = new B();
obj.greet();   // Which one? Depends at runtime!
```

The JVM must use **dynamic dispatch** (runtime lookup in the vtable) to figure out whether `A.greet` or `B.greet` should be called. i.e., the JVM doesn’t have to check at runtime which implementation to call. It can devirtualize the call (turn it into a direct jump instead of a vtable lookup).

### JVM Optimizations Possible

1. **Devirtualization**
   - Instead of runtime lookup → call becomes _static binding_.
   - Similar to how `private` and `static` methods are always bound directly.
2. **Inlining**
- If a method is `final`, the JIT compiler may decide to **inline** it (copy its bytecode directly into the caller).
- This avoids method call overhead entirely.
```java
final int square(int x) {
    return x * x;
}
// When you call square(5), the JIT may just replace the call with 5*5.
```

3. **Escape Analysis + Constant Folding**  
If the method body is small and predictable, the JIT can aggressively optimize because it knows the behavior won’t change later due to overriding.

### Variables

When a variable is declared as `final`, its value cannot be reassigned once initialized. A `final` variable must be initialized once (either at declaration or inside the constructor).

```java
final int x = 10;
x = 20; // Error: cannot assign a value to final variable x

// Final with primit values
final double PI = 3.14159; 
// PI always stays the same

// Final with Reference variables
final StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");   // Allowed (changing object state)
sb = new StringBuilder("Hi"); // Error (cannot reassign reference)
// You can’t reassign the reference, but you can change the object it points to. So, the reference is fixed, but the object may still be mutable.
```

### Methods

When you declare a method as `final`, it cannot be overridden in a subclass. You should make a method final in Java if you think it’s complete and its behavior should remain constant in sub-classes. In general, final methods are faster than non-final methods because they are not required to be resolved during run-time and they are bonded at compile-time

```java
class Parent {
    final void show() {
        System.out.println("This is final method.");
    }
}

class Child extends Parent {
    void show() { // Error: cannot override final method
        System.out.println("Trying to override.");
    }
}
```

### Class

When a class is declared as `final`, it cannot be extended (inherited from).

```java
final class Vehicle {
    void run() {
        System.out.println("Running...");
    }
}

// Error: cannot inherit from final class
class Car extends Vehicle {}
```

## Explicit Parameters

Inside the method, you cannot reassign the explicit parameters.

```java
void display(final int x) {
    x = 20; // Error
    System.out.println(x);
}
```


### Instance Fields

When u make an instance field final, it doesn't change after that. That is why, such a field must be initialized when the object is constructed ,i.e., you must guarantee that the field value has been set after the end of every constructor. Afterward, the field may not be modified again. The final modifier is particularly useful for fields whose type is primitive or an immutable class.

## Static keyword

### Static Fields/ Class Variables

If you define a field as static, then the field is not present in the objects of the class. There is only a single copy of each static field. You can think of static fields as belonging to the class, not to the individual objects. Read from python oops notes. 

### Static Constants

```java
public class Math
{
. . .
public static final double PI = 3.14159265358979323846;
. . .
}
```

You can access this constant in your programs as Math.PI. If the keyword static had been omitted, then PI would have been an instance field of the Math class. That is, you would need an object of this class to access PI, and every Math object would have its own copy of PI.

### Static Methods

Static methods are methods that do not operate on objects. For example, the pow method of the Math class is a static method. The expression Math.pow(x, a) computes the power $x^a$. It does not use any Math object to carry out its task. In other words, it has no implicit parameter.

Static methods are methods that don’t have a this parameter. Static methods cannot directly access instance fields or instance methods. We can call static methods using objects too.

Use static methods in two situations:
• When a method doesn’t need to access the object state because all needed parameters are supplied as explicit parameters (example: Math.pow).
• When a method only needs to access static fields of the class 

## Method Parameters 

The Java programming language always uses call by value. That means that the method gets a copy of all parameter values. In particular, the method cannot modify the contents of any parameter variables passed to it.

What changes is what the value itself represents -
- For **primitives** → the value is the actual number/boolean/char.
- For **objects** → the value is a _reference_ (a pointer-like thing) to the object’s memory location.

Primitives (`int`, `double`, `boolean`, etc.) are simple, small, fixed-size data. It’s very fast to just copy them. Each variable holds its own independent copy. So, the actual values are copied in the case of primitives. 

```java title:"Passing primitives"
public static void tripleValue(double x) // doesn't work
{
x = 3 * x;
System.out.println(x) // 30
}

double percent = 10;
tripleValue(percent);

System.out.println(x) // 10
// x is initialized with a copy of the value of percent (that is, 10). x is tripled—it is now 30. But percent is still 10. The method ends, and the parameter variable x is no longer in use.
```

Objects can be large and complex (imagine copying a giant `ArrayList` with millions of elements every time you call a method). That would be very slow (huge memory operations) and very wasteful (multiple copies of the same object). So instead of copying the whole object, Java copies just the reference (pointer). Both caller and method parameter end up referring to the same object in the heap. 

```java title:"Passing objects"
public static void swap(Employee x, Employee y) // doesn't work
{
Employee temp = x;
x = y;
y = temp;
}

// The above method does not work, i.e., after the method is run, the values contained in the object are not swapped. Example if x was alice and y was bob, after the function is run, x does not become bob and alice y. This is because the references to the objects are not passed by call by reference, the reference to the objects are called by value. So, we can change the value contained by the object as we are passing the object reference. but we cannot change the reference to point to another object as the references are passed by value.

public static void tripleSalary(Employee x) {
    x.raiseSalary(200);
    System.out.println("End of method: salary=" + x.getSalary());
}

var harry = new Employee("Harry", 50000);
System.out.println("Before: salary=" + harry.getSalary());
tripleSalary(harry);
System.out.println("After: salary=" + harry.getSalary());

// Output
// 50000
// 15000

// Objects internal state can be changes as said before.

```


## Object Construction

### Overloading

Overloading means having multiple methods in the same class with the same name but different parameter lists. The compiler decides which method to call based on the number, types, and order of arguments at compile time. For overloading, the name should be the same and number or order or type of parameters should be different. Different return types does not result into overloading. Access modifiers can be different, but that does not result into overloading. 

```java
class MathUtils {
    // Method 1: add two integers
    public int add(int a, int b) {
        return a + b;
    }

    // Method 2: add three integers
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // Method 3: add two doubles
    public double add(double a, double b) {
        return a + b;
    }
}

public class TestOverloading {
    public static void main(String[] args) {
        MathUtils m = new MathUtils();
        System.out.println(m.add(2, 3));       // calls method 1 → 5
        System.out.println(m.add(2, 3, 4));    // calls method 2 → 9
        System.out.println(m.add(2.5, 3.5));   // calls method 3 → 6.0
    }
}
```

#### Overloading Constructors

Just like methods, we can even overload constructors. 

```java title:"Overloading Constructors"
class Employee {
    private String name;
    private double salary;

    // Constructor 1
    public Employee(String n) {
        name = n;
        salary = 0; // default
    }

    // Constructor 2
    public Employee(String n, double s) {
        name = n;
        salary = s;
    }
}
```


### Overloading across Inheritance

```java title:"Overloading across Inheritance"
class A {
    void show(String s) {}
}
class B extends A {
    void show(int x) {}  // overload, not override
}
// Now B has two show methods: one from A, one new.
// If you overload with different types, both are available in the subclass.
```

### Type casting

#### Exact Match (No typecasting)

```java
class Example {  
    void print(int a) {  
        System.out.println("print(int) called");  
    }  
    void print(double a) {  
        System.out.println("print(double) called");  
    }  
  
    public static void main(String[] args) {  
        Example ex = new Example();  
        ex.print(10);    // Calls print(int)  
        ex.print(10.5);  // Calls print(double)  
    }  
}
```

#### Widening

When there’s no exact match, Java tries to promote the type to the next wider type in its type hierarchy, following this order:  
— byte → short → int → long → float → double  
— char → int

```java title:Widening
class Example {  
    void display(long a) {  
        System.out.println("display(long) called");  
    }  
    void display(double a) {  
        System.out.println("display(double) called");  
    }  
  
    public static void main(String[] args) {  
        Example ex = new Example();  
        ex.display(10);    // Promotes int to long and calls display(long)  
        ex.display(10.5f); // Promotes float to double and calls display(double)  
    }  
}
```


