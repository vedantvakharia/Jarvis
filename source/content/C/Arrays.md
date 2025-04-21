1. **Declaring and Initializing -** `data_type array_name[size] = {};`. If we have listed the array, we don't need to need to write the size, it will be automatically detected.  
	E.g. - `int numbers[] = {10, 20, 30, 40, 50};`
2. **Accessing elements -** We can use the following things, all are equivalent
	1. `array_name[i]` - When we write this, the C compiler internally converts it to `*(array_name+i)`
	2. `*(array_name+i)`
	3. `*(i+array_name)`
	4. `i[array_name]`
	5. Negative indexing - `a[] = *a`. So when we do a[-1], it may give error as memory before pointer a may not exist. But the below works as memory before a[2] exists. 
	```c
	int *ptr = &arr[2];     // Points to value 30
	printf("%d\n", ptr[-2]); // OK! Same as arr[0] → 10
	```
	6. 
 	7.  
4. **Updating array elements - 
	1. **Updating a single element -** `array_name[i] = new_value`
	2. **Updating Elements in a Loop -** 
	```c
	// Updating each element by multiplying by 2 
	for (int i = 0; i < 5; i++) { 
	arr[i] *= 2;
	```

	3. 
4. 
