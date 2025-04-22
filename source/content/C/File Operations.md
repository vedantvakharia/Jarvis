
1. fopen() - Responsible for opening the file when we click it. It is used to open a file for reading, writing, or appending. It returns a pointer to a FILE structure, which you can then use for file operations.
   
```c
FILE *fopen(const char *filename, const char *mode);
```

filename → Name/path of the file to open.
mode → How you want to open it (read, write, append, etc.).
	1. Reading a file - Reading a file means accessing data stored on disk and loading that data into **memory (RAM)** so your program can process it.
		1. File Opening (System Call) -** Your program asks the OS to open a file using fopen(). 
		2. **File Descriptor or File Handle -** The OS sets up a pointer that points to 1st character in buffer. After the file is opened, we no longer refer to the file by its name, but through the file pointer.
		3. Reading data - 
			1. **Using fgetc() -** Reads a single character from a file. fegtc() reads the characyer from the current pointer position, advances the pointer position so that it points to the next character, and returns the character that is read, which is collected in the variable ch. Useful for text parsing, where you want full control over every character.
			2. **Using fgets() -** fgets() reads a line of text from a file or standard input, safely, and stores it in a character array (a string).
			3. **Using fread() -** Reads a chunk of data (like arrays or structs) from a file. fread() is not null-terminated like a string unless you manually add \0. fread() is used for reading a binary file or struct and reading large chunks of text fast and 
		4. 
	2. 
2. 

