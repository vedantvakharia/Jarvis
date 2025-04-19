
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


## Linked Lists

A Linked List is a linear data structure where each element (node) contains the data (value) and a pointer to the next node. Unlike arrays, linked lists don’t store elements in contiguous memory — they’re dynamically allocated.

The address of the first node a special name called HEAD. Also, the last node in the linked list can be identified because its next portion points to NULL.

**General Syntax -** 
`struct Node {`
    `int data;`
    `struct Node* next;`
};

**Single Linked Lists -** 
1. **Traverse a Linked List -** We keep moving the temp node to the next one and display its contents. When temp is NULL, we know that we have reached the end of the linked list so we get out of the while loop.
   
`struct node *temp = head;`
`printf("\n\nList elements are - \n");`
`while(temp != NULL) {`
`printf("%d --->",temp->data);`
 `temp = temp->next;`
}

2. **Insert Elements to a Linked List** - 
	1. Insert after the i node - 
	   
	   // We create a temporary pointer `temp` to walk through the list starting from the head.
	   ```cpp
void insertAfterPosition(struct Node* head, int i, int new_data) {
	   struct Node* temp = head;
```

	   
	   
	   // Traverse to the i-th node
	   ```ruby
`for (int pos = 0; pos < i; pos++) {`
		   `temp = temp->next;}`
```

	  
	   // Allocate new node
	   `struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));`
	   `new_node->data = new_data;`
	   
	   // Insert after the i-th node
	   `new_node->next = temp->next;`
	   `temp->next = new_node;`
	   }
	   
	3. Insert at beginning - 
	   Allocate memory for new node
	   Store data
	   Change next of new node to point to head
	   Change head to point to recently created node
	     `struct node *newNode;`
	     `newNode = malloc(sizeof(struct node));`
	     `newNode->data = 4;`
	     `newNode->next = head;`
	     `head = newNode;`
	4. Insert at the end - 
	   `struct node *newNode;
	   `newNode = malloc(sizeof(struct node));`
	   `newNode->data = 4;`
	   `newNode->next = NULL;`
	   
	   `struct node *temp = head;`
	   `while(temp->next != NULL){`
	   `temp = temp->next;`
	   }
	   
	   `temp->next = newNode;` 
3. Delete nodes from a linked list  - 
	1. Delete the ith node
4. 
