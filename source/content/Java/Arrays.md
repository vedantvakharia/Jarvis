## Declaring Arrays

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

## For each loop

Java has a powerful looping construct that allows you to loop through each element in an array (or any other collection of elements) without having to fuss with index values. The enhanced for loop
`for (variable : collection) statement`

sets the given variable to each element of the collection and then executes the statement (which, of course, may be a block). The collection expression must be an array or an object of a class that implements the iterable interface, such as ArrayList.

```java title:"Example of for each loop"
for (int element : a)
	System.out.println(element);
```
