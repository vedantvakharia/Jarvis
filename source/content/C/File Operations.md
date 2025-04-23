
1. fopen() - Responsible for opening the file when we click it. It is used to open a file for reading, writing, or appending. It returns a pointer to a FILE structure, which you can then use for file operations.
   
```c
FILE *fopen(const char *filename, const char *mode);
```

| Mode   | Meaning       | If file doesn’t exist | If file exists           |
| ------ | ------------- | --------------------- | ------------------------ |
| `"r"`  | Read          | Fails                 | Opens for reading        |
| `"w"`  | Write         | Creates new file      | Erases existing contents |
| `"a"`  | Append        | Creates new file      | Appends to end of file   |
| `"r+"` | Read + Write  | Fails                 | Opens for R/W            |
| `"w+"` | Read + Write  | Creates new file      | Erases contents          |
| `"a+"` | Read + Append | Creates new file      | Can read/append          |

filename → Name/path of the file to open.
mode → How you want to open it (read, write, append, etc.).
 1. **File Opening (System Call) -** Your program asks the OS to open a file using fopen(). As accessing file through disk and performing actions on file directly on disk is inefficient, the file is opened on buffer/ram. 
 2. **File Descriptor or File Handle -** The OS sets up a pointer that points to 1st character in buffer. After the file is opened, we no longer refer to the file by its name, but through the file pointer.
 3. **Reading a file -** Reading a file means accessing data stored on disk and loading that data into **memory (RAM)** so your program can process it.
		1. **Using `fgetc()` -** Reads a single character from a file. fegtc() reads the characyer from the current pointer position, advances the pointer position so that it points to the next character, and returns the character that is read, which is collected in the variable ch. Useful for text parsing, where you want full control over every character.

```c
int fgetc(FILE *stream);

// Syntax for reading file usinf fegtc
while ((ch = fgetc(fp)) != EOF) {
putchar(ch);  // prints each character
```
``
		2. **Using `fgets()` -** fgets() reads a line of text from a file or standard input, safely, and stores it in a character array (a string). If a newline is read (`\n`), it’s stored in `str`. If a line exceeds the buffer size, it reads part of it. You’ll need to loop or flush the buffer.

```c
char *fgets(char *str, int n, FILE *stream);

//`str`: Pointer to the array where the string will be stored.
//`n`: Maximum number of characters to read **(including `\0`)**.
//`stream`: Input source (file or `stdin`).
```
``
		3. **Using** `fscanf()` - Reads formatted text like `scanf()` but from a file. `%s` reads up to whitespace, not the full line. If your string contains spaces, use `fgets()` instead. Returns the number of items successfully read and assigned or`EOF` on error or end of file.
```c
int fscanf(FILE *stream, const char *format, text_input);
```
``
		3. **Using `fread()` -** Reads a chunk of data (like arrays or structs) from a file. `fread()` is not null-terminated like a string unless you manually add \0. `fread()` is used for reading a binary file or struct and reading large chunks of text fast and 
```c
size_t fread(void *ptr, size_t size, size_t count, FILE *stream);

// ptr: Pointer to memory buffer (where to store the read data)
// size: Size of each element
// count: Number of elements to read
// stream: File pointer

size_t readBytes = fread(buffer, sizeof(char), 100, fp);
buffer[readBytes] = '\0'; // Null-terminate for text display
```
``
	4. **Writing a file -** Writing to a file means saving data from your program (RAM) onto a storage device (disk, SSD, etc.).
		1. `fprintf()`- Write formatted strings (like `printf()` but into a file). Best for text files, structured logs and when you need formatting. 
```c
int fprintf(FILE *stream, const char *format, text_write);
```
``
		2. `fputs()` - Write a unformatted string to a file. No automatic newline ,i.e., you must add `\n` manually. Faster than `fprintf()` for simple strings.
```c
int fputs(const char *str, FILE *stream);
```
``
		3. `fputc()` - Write one character at a time to a file. Best for writing characters or building strings manually.
```c
int fputc(int char, FILE *stream);
```
``
		4. `fwrite()` - Write raw binary data (arrays and structs) to a file. Does not format or convert, just dumps memory blocks.
```c
size_t fwrite(const void *ptr, size_t size, size_t count, FILE *stream);

int arr[] = {1, 2, 3, 4};
FILE *fp = fopen("data.bin", "wb");
fwrite(arr, sizeof(int), 4, fp);
```
``
	5. Appending a file - Appending a file means adding new data to the end of an existing file without deleting or overwriting its current contents. Even if we use `fseek(fp, 0, SEEK_SET);`, it **will still write at the end** (unless you use `"r+"`, `"w+"`, etc.).  Any write operation (`fprintf`, `fputs`, etc.) starts from the end. You **can’t overwrite previous content** using `"a"` — use `"r+"` if you want to update data at a specific position. 

2. `fseek()`- Used to move the file pointer to a specific position in a file. It's used to skip, rewind, or jump to any location inside a file before reading or writing. 
```c
int fseek(FILE *stream, long offset, int origin);

// stream - File pointer
// offset - Number of bytes to move (can be positive or negative)
// origin - Starting point for the move
// Returns - 0 → Success

//Origin Options - 
SEEK_SET (0) - Start of file        // We ccan write the number instead of name
SEEK_CUR (1) - Current position
SEEK_END (2) - End of file
```

3. `rewind()` - Resets the file pointer to the beginning of a file. It’s basically a shortcut for `fseek(fp, 0, SEEK_SET)`. Clears the error and EOF flags associated with the file (unlike `fseek()`). So after we hit EOF (end-of-file) while reading, we can call `rewind()` to reset and read the file again.
   
   When you're working with files in C (`FILE *fp`), the system maintains certain status flags to keep track of what's happening with that file. When we have reached the end of the file, the `EOF` flag is set internally. If you try to read again, it will fail because that flag is now blocking further reads. 
   
```c
void rewind(FILE *stream);


#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt", "r");
    char buffer[100];

    if (!fp) {
        perror("Failed to open file");
        return 1;
    }

    // First read: read until EOF
    printf("Reading file...\n");
    while (fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }

    // Check if EOF flag is set
    if (feof(fp)) {
        printf("\n[EOF flag is set]\n");
    }

    // Rewind the file (reset pointer + clear flags)
    rewind(fp);

    // Check if EOF flag is cleared
    if (!feof(fp)) {
        printf("[EOF flag is cleared after rewind()]\n\n");
    }

    // Read again from beginning
    printf("Reading file again after rewind...\n");
    while (fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }

    fclose(fp);
    return 0;
}


Output - 
Reading file...
Line 1
Line 2
Line 3

[EOF flag is set]
[EOF flag is cleared after rewind()]

Reading file again after rewind...
Line 1
Line 2
Line 3
```

3. 


