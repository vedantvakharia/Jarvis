   
   ```c
void *memset(void *ptr, int value, size_t num);
```

   ptr - Pointer to the starting memory block
   value - Value to set (in **bytes**, only the lower 8 bits are used)
   num - Number of **bytes** to set
   	1. **Uses of memset() -** 
		1. **Used with malloc** - malloc + memset gives the same effect of calloc when memset initializes each element to 0.
		2. **Used with strings and arrays** - It can initialize the whole array or string to the character or integer. 
	2. **Problems with memset() -** 
		1. Initializing to int -  As `memset()` works bitwise and not element wise, it creates errors when we try to initialize it to numbers as OS works 			on hex.
		   - So for example if we try to this, 
		    `memset(arr, 5, sizeof(arr));`
		    memset fills **every byte** of the memory block with the value 5 i.e., `0x05` in hex. 

		- Byte-wise memory becomes - 
		    `[0x05, 0x05, 0x05, 0x05,  |  0x05, 0x05, 0x05, 0x05,  | ... 20 times total]`

		- Now, when the computer reads the first 4 bytes (as an `int`), it sees:
		`[0x05, 0x05, 0x05, 0x05] = 0x05050505 = 84215045`

		- Since an `int` in C is usually 4 bytes, each int in memory becomes 0x05050505 which equals 84215045. So instead of an array initialized to 5, 			we get 
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