**Recursion -** Recursion is the process of a function calling itself repeatedly till the given condition is satisfied. A function that calls itself directly or indirectly is called a recursive function and such kind of function calls are called recursive calls.


1. **Structure of Recursion - 
	1. **Recursion Case -** The function calls itself with a smaller problem size.
	2. **Base Condition -** The base condition specifies when the recursion is going to terminate. It is the condition that determines the exit point of the recursion. It is important to define the base condition before the recursive case otherwise, the base condition may never encountered and recursion might continue till infinity.
	   
	   **General Syntax -** 
	`void recursiveFunction() {`
    `if (base_condition) {`
        `return;  // Base case to stop recursion`
    `} else {`
        `recursiveFunction();  // Recursive call`
    `}`
	`}`
2. **Types of Recursion - 
	1. **Direct Recursion -** Direct recursion is the most common type of recursion, where a function calls itself directly within its own body.
		1. **Head Recursion -** Head recursion is a type of recursion where the recursive call happens first before any operations are performed in the function. That means the function calls itself at the beginning and performs computations after returning from the recursive call.
		 **General syntax** - 
		`void function(int n) {`
	    `if (n <= 0)  // Base case to stop recursion`
        `return;`
	    `function(n - 1);  // Recursive call (happens first)`
	    `// Processing after the recursive call`
	    `printf("%d ", n);`
		}
		1.  **Tail Recursion -** Tail recursion is a type of recursion where the recursive call is the last operation** performed by the function before returning. Unlike head recursion, no additional computation occurs after the recursive call, making it more memory-efficient because some compilers optimize tail recursion by converting it into a loop. 
		**Reason of Tail recursion being more efficient** - In normal recursion, Each function call **adds a new stack frame**.
- Once the base case is reached, **all frames are popped** one by one.

In tail recursion:

- Since the function **does not perform further operations after recursion**, the compiler **reuses the same stack frame** instead of creating a new one.
		1. 