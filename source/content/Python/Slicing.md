
1. Using ****[:]**** without specifying start, end, or step returns all elements of the list.
2. The slice a[2:] starts from index 2 (third element) and continues to the end.
3. The slice a[:3] includes elements from the start up to index 3 (excluding 3).
4. The slice a[1:4] starts at index 1 and ends at index 4 (excluding 4).
5. The slice a[::2] takes every second element from the list, starting from the beginning.
6. **Out of bound slicing -** In Python, list slicing allows out-of-bound indexing without raising errors. If we specify indices beyond the list length, Python will simply return the available items. Example - If array contains only 3 elements, and if we do a[1:10] which starts at index 1 and attempts to reach index 10, but since the list ends at index 2, it returns only the available elements.
7. **### Reverse a list using slicing** - If array a is given, and we want the reverse array b, then b = a[::-1].
8. 