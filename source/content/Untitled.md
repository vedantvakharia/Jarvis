	1. **Reading a file -** Reading a file means **accessing data stored on disk** (or another storage device) and loading that data into **memory (RAM)** so your program can process it.
		1. **File Opening (System Call) -** Your program asks the OS to open a file using fopen()
		2. **File Descriptor or File Handle -** The OS sets up a pointer that points to 1st character in buffer. After the file is opened, we no longer refer to the file by its name, but through the file pointer. 
		3. **Reading data -**
			1. **Using fgetc() -** Reads a single character from a file. fegtc() reads the characyer from the current pointer position, advances the pointer position so that it points to the next character, and returns the character that is read, which is collected in the variable ch. Useful for text parsing, where you want full control over every character.
			```c
			int fgetc(FILE *stream);

			// Syntax for reading file usinf fegtc
			while ((ch = fgetc(fp)) != EOF) {
			putchar(ch);  // prints each character
			```
			2.  **Using fgets() -** fgets() reads a line of text from a file or standard input, safely, and stores it in a character array (a string). 
2. 			3. **Using fread() -** Reads a chunk of data (like arrays or structs) from a file. fread() is not null-terminated like a string unless you manually add \0. fread() is used for reading a binary file or struct and reading large chunks of text fast and 
			```c
			size_t fread(void *ptr, size_t size, size_t count, FILE *stream);

			\\ ptr: Pointer to memory buffer (where to store the read data)
			\\ size: Size of each element
			\\ count: Number of elements to read
			\\ stream: File pointer
			
			size_t readBytes = fread(buffer, sizeof(char), 100, fp);
			buffer[readBytes] = '\0'; // Null-terminate for text display
			```


			
	2. 
3. 
   
| Mode   | Meaning       | If file doesn’t exist | If file exists           |
| ------ | ------------- | --------------------- | ------------------------ |
| `"r"`  | Read          | Fails                 | Opens for reading        |
| `"w"`  | Write         | Creates new file      | Erases existing contents |
| `"a"`  | Append        | Creates new file      | Appends to end of file   |
| `"r+"` | Read + Write  | Fails                 | Opens for R/W            |
| `"w+"` | Read + Write  | Creates new file      | Erases contents          |
| `"a+"` | Read + Append | Creates new file      | Can read/append          |
