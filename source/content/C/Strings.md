
1. `char *strtok(char *str, const char *delim);`
2. strtol
3. isspace
4. atof - **`atof`** stands for **"ASCII to float"**. Returns a `double` representing the converted value. It is included in `<stdlib.h>`
   ```c
double atof(const char *str);
```
`str` is a pointer to a C-string (a character array) that contains a floating-point number in textual form.

```c
char str[] = "3.14159";
double num = atof(str); //Returns 3.141590

char str[] = "hello";
double val = atof(str);  // Returns 0.0


```


5. 