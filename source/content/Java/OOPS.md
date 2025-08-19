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

When you declare a method as `final`, it cannot be overridden in a subclass.

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


### Instance Fields

When u make an instance field final, it doesn't change after that. That is why, such a field must be initialized when the object is constructed ,i.e., you must guarantee that the field value has been set after the end of every constructor. Afterwards, the field may not be modified again. The final modifier is particularly useful for fields whose type is primitive or an immutable class.