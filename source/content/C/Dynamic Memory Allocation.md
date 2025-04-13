
## Static memory 
Static Memory stores temporary variables created by a function. In stack, variables are declared, stored, and initialized during runtime. It follows the First in last out method, that means whatever element is going to store last is going to delete first when it’s not in use. Size is fixed at compile-time.
## Heap/Dynamic Memory
Size is **decided at runtime** (while your program is running). More flexible and efficient.
1. **malloc(memory allocation)** - Allocates a block of memory of given size but doesn’t initialize it (contains garbage).
   
   `ptr = (data_type *) malloc(size_in_bytes);`

2. calloc(contiguous allocation) -  it initializes the allocated memory to zero 
   
   `ptr = (data_type *) calloc(num_elements, size_of_each);`

3. realloc - realloc() function is used to resize a previously allocated memory block. It allows you to change the size of an existing memory allocation without needing to free the old memory and allocate a new block.
   
   `ptr = (data_type *) realloc(ptr, new size);`
   
   Eg - `int *ptr = (int *)malloc(5 * sizeof(int));` 
	   `ptr = (int *)realloc(ptr, 10 * sizeof(int));`
4. Free() - The memory allocated using functions malloc() and calloc() is not de-allocated on their own. The free() function is used to release dynamically allocated memory back to the operating system. It is essential to free memory that is no longer needed to avoid memory leaks.