
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

1. `get_double` - prompt a user for a `double`
   
2. `get_float` - prompt a user for a `float`
3. `get_int` - prompt a user for an `int`
4. `get_long` - prompt a user for an `long`
5. `get_string` - prompt a user for a `string`. `get_string()` allocates memory on the heap.