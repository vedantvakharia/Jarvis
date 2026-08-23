1. **Dereferencing operator (*) -** used to declare pointer variable and access the value stored in the address.
2. **Address operator (&)** - used to returns the address of a variable or to access the address of a variable to a pointer.
3. **%p format specifier** is used to print the address stored in pointer variables.- Printing a pointer with %d format specifier may result in a warning or undefined behaviour because the size of a pointer (usually 4 or 8 bytes) may not match that of an integer.
4. The memory address format will always be in hexadecimal format (starting with 0x). In C and most programming languages, **`0x` is a prefix** that indicates a **hexadecimal (base 16) number**. 
	
	Reasons for using hexadecimal and not decimal - 
		1. Memory addresses are **large numbers**. Hexadecimal **compresses** them into a shorter format.
		2. Memory storages are 8 bits, 16 bits, 32 bits which perfectly aligns with the hexadecimal system. 
5. **Types of Pointers - **
	1. ****Integer Pointers****
6. 
7. **Call by value -** In **Call by Value**, a **copy of the actual arguments** is passed to the function. The **original variables remain unchanged** because the function operates on a separate copy. It is inefficient for large data as passing large structs or arrays **copies all elements**, using extra memory.
8. `char a[] = char *a`
9. 