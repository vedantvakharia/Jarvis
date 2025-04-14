
## Static memory 
Static Memory stores temporary variables created by a function. In stack, variables are declared, stored, and initialized during runtime. It follows the First in last out method, that means whatever element is going to store last is going to delete first when it’s not in use. Size is fixed at compile-time.
## Heap/Dynamic Memory
Size is **decided at runtime** (while your program is running). More flexible and efficient.
1. **malloc(memory allocation)** - Allocates a block of memory of given size but doesn’t initialize it (contains garbage).
   
   `ptr = (data_type *) malloc(size_in_bytes);`

2. calloc(contiguous allocation) -  it initializes the allocated memory to zero 
   
   `ptr = (data_type *) calloc(num_elements, size_of_each);`

3. `realloc()` - realloc() function is used to resize a previously allocated memory block. It allows you to change the size of an existing memory allocation without needing to free the old memory and allocate a new block.
   
   `ptr = (data_type *) realloc(ptr, new size);`
   
   Eg - `int *ptr = (int *)malloc(5 * sizeof(int));` 
	   `ptr = (int *)realloc(ptr, 10 * sizeof(int));`
4. `free()` - The memory allocated using functions malloc() and calloc() is not de-allocated on their own. The free() function is used to release dynamically allocated memory back to the operating system. It is essential to free memory that is no longer needed to avoid memory leaks.
5. `memset()` - Fills a block of memory with a specified byte value. `memset` works **byte-by-byte** and not element wise. It is included in `string.h` 
   
   `void *memset(void *ptr, int value, size_t num);`
   ptr - Pointer to the starting memory block
   value - Value to set (in **bytes**, only the lower 8 bits are used)
   num - Number of **bytes** to set
	1. **Uses of `memset()` -** 
		1. **Used with malloc** - malloc + memset gives the same effect of calloc when memset initializes each element to 0.
		2. **Used with strings and arrays** - It can initialize the whole array or string to the character or integer. 
	2. **Problems with `memset()` -** 
		1. Initializing to int -  As `memset()` works bitwise and not element wise, it creates errors when we try to initialize it to numbers as OS works on hex.
		   - So for example if we try to this, 
		    `memset(arr, 5, sizeof(arr));`
		    memset fills **every byte** of the memory block with the value 5 i.e., `0x05` in hex. 

		- Byte-wise memory becomes:
		    `[0x05, 0x05, 0x05, 0x05,  |  0x05, 0x05, 0x05, 0x05,  | ... 20 times total]`

		- Now, when the computer reads the first 4 bytes (as an `int`), it sees:
		`[0x05, 0x05, 0x05, 0x05] = 0x05050505 = 84215045`

		- Since an `int` in C is usually 4 bytes, each int in memory becomes 0x05050505 which equals 84215045. So instead of an array initialized to 5, we get 
		    `[84215045, 84215045, 84215045, 84215045, 84215045]`
		
		- So, for integers, we need to use a for loop and manually set each element to the integer. 

		- Now it works for 0 and -1(sort of) 
			- It works for 0 as hex of 0 is also 0.
			- When we pass -1, it is passed as an `int`, but only the **lower 8 bits are used**. So `-1` becomes `0xFF` (i.e., 255 in unsigned byte form). Each byte becomes `0xFF`. This results in 
			  `int = [0xFF, 0xFF, 0xFF, 0xFF] = 0xFFFFFFFF`
			  Which is in **two's complement**, `0xFFFFFFFF` = `-1` for a 32-bit `int`. 
			  So, it works !!
		2. 
	3. 
6. Malloc vs Calloc - 
   [c - Why malloc+memset is slower than calloc? - Stack Overflow](https://stackoverflow.com/questions/2688466/why-mallocmemset-is-slower-than-calloc)
   [Why does calloc exist? — njs blog](https://vorpus.org/blog/why-does-calloc-exist/)
   [c - Difference between malloc and calloc? - Stack Overflow](https://stackoverflow.com/questions/1538420/difference-between-malloc-and-calloc)
   [c - calloc v/s malloc and time efficiency - Stack Overflow](https://stackoverflow.com/questions/2605476/calloc-v-s-malloc-and-time-efficiency)
   