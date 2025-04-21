##
1. fopen() - Responsible for opening the file when we click it. It is used to open a file for reading, writing, or appending. It returns a pointer to a FILE structure, which you can then use for file operations.

```c
FILE *fopen(const char *filename, const char *mode);
```

filename → Name/path of the file to open.

mode → How you want to open it (read, write, append, etc.).

