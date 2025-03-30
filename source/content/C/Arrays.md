1. **Declaring and Initializing -** `data_type array_name[size] = {};`. If we have listed the array, we don't need to need to write the size, it will be automatically detected.  
	E.g. - `int numbers[] = {10, 20, 30, 40, 50};`
2. **Accessing elements -** We can use the following things, all are equivalent
	1. `array_name[i]` - When we write this, the C compiler internally converts it to `*(array_name+i)`
	2. `*(array_name+i)`
	3. *`(i+array_name)
	4. `i[array_name]
3. **Updating array elements - 
	1. **Updating a single element -** `array_name[i] = new_value`
	2. **Updating Elements in a Loop -** 
	   `// Updating each element by multiplying by 2 
	  ` for (int i = 0; i < 5; i++) {` 
	  ` arr[i] *= 2;` 
	   }`
	3. 
4. 