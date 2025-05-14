
## cs50.h (-lcs50)

1. **`get_char`** - prompt a user for a `char`. If the user inputs more or less than one `char`, the function prompts the user again.
```c
char get_char(const char *prompt)
{
    while (true)
    {
        char *input = get_string(prompt);

        if (input != NULL && strlen(input) == 1)
        {
            char c = input[0];
            free(input);
            return c;
        }

        free(input);
    }
}
```

2. **`get_double`** - prompt a user for a `double`
```c
#include <stdlib.h>

double get_double(const char *prompt)
{
    while (true)
    {
        char *input = get_string(prompt);
        if (input != NULL)
        {
            char *end;
            double value = strtod(input, &end);
            if (*end == '\0')
            {
                free(input);
                return value;
            }
        }
        free(input);
    }
}

```

3. **`get_float`** - prompt a user for a `float`
```c
#include <stdlib.h>

float get_float(const char *prompt)
{
    while (true)
    {
        char *input = get_string(prompt);
        if (input != NULL)
        {
            char *end;
            float value = strtof(input, &end);
            if (*end == '\0')
            {
                free(input);
                return value;
            }
        }
        free(input);
    }
}

```

4. **`get_int`** - prompt a user for an `int`
```c
#include <stdlib.h>
#include <stdbool.h>
#include <ctype.h>

bool is_valid_int(const char *s)
{
    if (*s == '-' || *s == '+') s++; // allow sign
    if (*s == '\0') return false;

    while (*s)
    {
        if (!isdigit(*s++)) return false;
    }
    return true;
}

int get_int(const char *prompt)
{
    while (true)
    {
        char *input = get_string(prompt);
        if (input != NULL && is_valid_int(input))
        {
            int value = atoi(input);
            free(input);
            return value;
        }
        free(input);
    }
}

```

5. **`get_long`** - prompt a user for an `long`
```c
#include <stdlib.h>

long get_long(const char *prompt)
{
    while (true)
    {
        char *input = get_string(prompt);
        if (input != NULL)
        {
            char *end;
            long value = strtol(input, &end, 10);
            if (*end == '\0')
            {
                free(input);
                return value;
            }
        }
        free(input);
    }
}
```

6. **`get_string`** - prompt a user for a  `string`. `get_string()` allocates memory on the heap.
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *get_string(const char *prompt)
{
    if (prompt != NULL)
    {
        printf("%s", prompt);
    }

    size_t size = 64;  // Initial buffer size
    char *buffer = malloc(size);
    if (buffer == NULL)
    {
        return NULL;
    }

    size_t length = 0;

    int c;
    while ((c = getchar()) != '\n' && c != EOF)
    {
        if (length + 1 >= size)
        {
            // Need more space — double the buffer
            size *= 2;
            char *temp = realloc(buffer, size);
            if (temp == NULL)
            {
                free(buffer);
                return NULL;
            }
            buffer = temp;
        }

        buffer[length++] = c;
    }

    buffer[length] = '\0'; // Null-terminate string
    return buffer;
}

```

## ctype.h

**Character Classification Functions -** These return a nonzero (true) value if the condition is met, otherwise 0 (false).
1. **`int isalnum(int c)`**- If character is **alphanumeric** (a–z, A–Z, 0–9).
2. **`int isalpha(int c)`** - If character is **alphabetic** (a–z, A–Z).
3. **`int isblank(int c)`** - If character is **space or tab** (' ' or '\t').
4. **`int iscntrl(int c)`** -If character is a **control character.**
5. **`int isdigit(int c)`** - If character is a **decimal digit** (0–9).
6. **`int isgraph(int c)`** - If character has **visible representation** (non-space printable chars).
7. **`int islower(int c)`** - If character is **lowercase letter** (a–z).
8. **`int isprint(int c)`** - If character is **printable**, including space (' ' to '~').
9. **`int ispunct(int c)`** - If character is a **punctuation mark** (not **`alnum**` or space).
10. **`int isspace(int c)`** - If character is a **whitespace** (' ', '\t', '\n', '\r', '\f', '\v').
11. **`int isupper(int c)`** - If character is **uppercase** (A–Z).
12. **`int isxdigit(int c)`** - If character is a **hexadecimal digit** (0–9, a–f, A–F).

## string.h

##### String Manipulation

1. **`char *strcpy(char *dest, const char *src)**`** - Copies one string to another
2. **`char *strncpy(char *dest, const char *src, size_t n)**`** - Writes exactly n bytes, copying from source or adding nulls
3. **`char *strcat(char *dest, const char *src)**`** - Appends `src` to the end of `dest`.
4. **`char *strncat(char *dest, const char *src, size_t n)`** - 
5. **`size_t strxfrm(char *dest, const char *src, size_t n)**`** (Not needed)
6. **`char *strdup(const char *s)`** - Allocates memory and copies string `s` into it. You must`free()` the returned pointer. 
   
```c
char *strdup(const char *s) {
    size_t len = strlen(s) + 1;
    char *copy = malloc(len);
    if (copy != NULL)
        memcpy(copy, s, len);  // or strcpy(copy, s)
    return copy;
}
```

| Feature     | **`strdup`**                                                     | **`strcpy`**                        |
| ----------- | ---------------------------------------------------------------- | ----------------------------------- |
| **Header**  | POSIX: `<string.h>` or `<string.h>` (non-standard in strict C89) | Standard: `<string.h>`              |
| **Memory**  | Allocates memory automatically using `malloc`                    | You must allocate memory yourself   |
| **Return**  | Pointer to new string on heap                                    | Pointer to `dest` buffer            |
| **Usage**   | When you need a new heap copy of string                          | When you already have a buffer      |
| **Freeing** | You must call `free()` manually                                  | No `free()` needed (unless dynamic) |

7. **`char *strndup( const char *src, size_t size )`**
   
##### String Examination

1. **`size_t strlen(const char *str)`** - Returns the **length of a string**, excluding the null terminator `\0`.
2. **`int strcmp(const char *s1, const char *s2)`** - Compares two strings. The sign of the result is the sign of the difference between the values of the first pair of characters (both interpreted as unsigned char) that differ in the strings being compared. It is case sensitive. 
   Returns 
   0 if equal
   < 0 if s1 < s2
   0 if s1 > s2 
3. **`int strncmp(const char *s1, const char *s2, size_t n)`**
4. `int strcoll(const char *s1, const char *s2)`(Not important)
5. **`char *strchr(const char *str, int c)` -** Returns pointer to first occurrence of `c` in `s`, or `NULL` if not found. If `c == '\0'`, returns pointer to null terminator.
6. **`char *strrchr(const char *str, int c)` -** Returns pointer to last occurrence of c. 
