
## cs50.h

1. `get_char` - prompt a user for a `char`. If the user inputs more or less than one `char`, the function prompts the user again.
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

2. `get_double` - prompt a user for a `double`
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

3. `get_float` - prompt a user for a `float`
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

4. `get_int` - prompt a user for an `int`
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

5. `get_long` - prompt a user for an `long`
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

6. `get_string` - prompt a user for a `string`. `get_string()` allocates memory on the heap.
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
