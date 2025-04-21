
1. fopen() - Responsible for opening the file when we click it. It is used to open a file for reading, writing, or appending. It returns a pointer to a FILE structure, which you can then use for file operations.

```c
FILE *fopen(const char *filename, const char *mode);
```

filename → Name/path of the file to open.
mode → How you want to open it (read, write, append, etc.).

| Mode   | Meaning       | If file doesn’t exist | If file exists               |
| ------ | ------------- | --------------------- | ---------------------------- |
| `"r"`  | Read          | Fails                 | Opens for reading            |
| `"w"`  | Write         | Creates new file      | **Erases** existing contents |
| `"a"`  | Append        | Creates new file      | Appends to end of file       |
| `"r+"` | Read + Write  | Fails                 | Opens for R/W                |
| `"w+"` | Read + Write  | Creates new file      | Erases contents              |
| `"a+"` | Read + Append | Creates new file      | Can read/append              |

	1. **Reading a file -** Reading a file means **accessing data stored on disk** (or another storage device) and loading that data into **memory (RAM)** so your program can process it.
		1. **File Opening (System Call) -** Your program asks the OS to open a file using fopen()
		2. **File Descriptor or File Handle -** The OS sets up a pointer that points to 1st character in buffer. After the file is opened, we no longer refer to the file by its name, but through the file pointer. 
		3. **Reading data -**
			1. **Using fgetc() -** Reads a single character from a file.
			```c
			int fgetc(FILE *stream);

			// Syntax for reading file usinf fegtc
   			while ((ch = fgetc(fp)) != EOF) {
			putchar(ch);  // prints each character
			}
			```

   			fegtc() reads the characyer from the current pointer position, advances the pointer position so that it points to the next character, and returns the character that is read, which is collected in the variable ch. Useful for text parsing, where you want full control over every character.
			2. **Using fread() -** Reads a chunk of data (like arrays or structs) from a file.
		4. 
	2. 
2. 

