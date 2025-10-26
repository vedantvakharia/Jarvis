A vector is simply a sequence of elements that you can access by an index. Vectors are basically arrays whose size is not fixed, i.e., we can change their sizes. 

```c++ title:"Initalising vector"
vector<int> v = {5, 7, 9, 4, 6, 8};       // vector of 6 ints
// We specify the type of the elements and the initial set of elements. The element type comes after vector in angle brackets (<>).

vector<int> vi(6);             // vector of 6 ints initialized to 0
vector<string> vs(4);       // vector of 4 strings initialized to ""
```


## Vector memory allocation

Just like arrays, vectors use contiguous storage locations for their elements, which means that their elements can also be accessed using offsets on regular pointers to its elements, and just as efficiently as in arrays. Internally, vectors use a dynamically allocated array to store their elements. This array may need to be reallocated in order to grow in size when new elements are inserted, which implies allocating a new array and moving all elements to it. This is a relatively expensive task in terms of processing time, and thus, vectors do not reallocate each time an element is added to the container.  
  
Instead, vector containers may allocate some extra storage to accommodate for possible growth, and thus the container may have an actual capacity greater than the storage strictly needed to contain its elements (i.e., its size). Libraries can implement different strategies for growth to balance between memory usage and reallocations, but in any case, reallocations should only happen at logarithmically growing intervals of [size](https://cplusplus.com/vector::size) so that the insertion of individual elements at the end of the vector can be provided with _amortized constant time_ complexity. Therefore, compared to arrays, vectors consume more memory in exchange for the ability to manage storage and grow dynamically in an efficient way.  
  
Compared to the other dynamic sequence containers (deques, lists and forward lists), vectors are very efficient accessing its elements (just like arrays) and relatively efficient adding or removing elements from its end. For operations that involve inserting or removing elements at positions other than the end, they perform worse than the others, and have less consistent iterators and references than lists and forward lists.

### The Two-Part Memory Layout of a Vector

Think of a `std::vector` as a "controller" object that manages a "raw" block of data.

1. **The `std::vector` Object (The "Brain") -** This is the actual `std::vector` variable you create. It lives on the stack (if you declare it normally in a function). It's a small, fixed-size object (often 24 bytes on a 64-bit system) that contains the "control data." It typically stores three pointers -

- A pointer to the beginning of the elements.
- A pointer to one-past-the-last element. (This is how it knows its `size()`. `size = end_ptr - start_ptr`).
- A pointer to one-past-the-end of all allocated memory. (This is how it knows its `capacity()`).    
2. **The Element Data (The "Brawn") -** This is a "dumb" block of raw memory, just like a C-style array. It lives on the heap so that it can be resized (deleted and re-allocated) as you add or remove elements.


Here is a diagram of what it looks like in memory when you have a `std::vector<int> vec = {10, 20, 30};` that has reserved extra space:

| On the **STACK** (The "Brain") |                 | On the **HEAP** (The "Brawn")        |
| ------------------------------ | --------------- | ------------------------------------ |
| `my_vector` (object)           |                 | `[ 10 ] [ 20 ] [ 30 ] [ -- ] [ -- ]` |
| `ptr_to_start`                 | ──►             | `^`                                  |
| `ptr_to_end (size=3)`          | ───────►        | `_ _ _ _ _ _ _ ^`                    |
| `ptr_to_capacity (cap=5)`      | ──────────────► | `_ _ _ _ _ _ _ _ _ _ _ _ _ _ _^`     |

---
## Functions

### Constructors

These are used to create a `std::vector`.

#### Constructor 

Creates an empty vector or initializes it in various ways (with a size, with a value, from a range, with an initializer list).

```cpp 
std::vector<int> v1; // Empty

std::vector<int> v2(5); // 5 elements, default initialized (usually 0)

std::vector<int> v3(5, 100); // 5 elements, all value 100

// Initializer List Constructor
std::vector<int> my_vector = { element1, element2, ... };
std::vector<int> my_vector{ element1, element2, ... };
std::vector<int> v4 = {1, 2, 3}; // From initializer list

// Copy constructor
std::vector<int> my_vector(other_vector);
std::vector<int> my_vector = other_vector;

// Move Constructor
// Instead of copying all the elements (which can be slow for large vectors), it steals the internal data (the pointer to the elements, size, capacity) from other_vector. The new my_vector takes ownership. other_vector is left empty (or in a valid but unspecified state - you shouldn't use it without resetting it). This is _much_ faster than copying.
std::vector<int> my_vector(std::move(other_vector));

std::vector<int> original = {1, 2, 3, 4, 5};
// Move the contents from original to moved_to
std::vector<int> moved_to(std::move(original));
// moved_to now contains {1, 2, 3, 4, 5}. Original is now empty (or unspecified, don't rely on its contents)
std::cout << "Original size after move: " << original.size() << std::endl; // Usually prints 0

// Range Constructor
// Creates a vector by copying elements from another sequence (like another vector, an array, or part of one). It copies everything starting from the element pointed to by first up to, but not including, the element pointed to by last.
std::vector<int> my_vector(iterator first, iterator last);
int my_array[] = {10, 20, 30, 40, 50};
// Copies elements from my_array[1] up to (but not including) my_array[4]
std::vector<int> part_of_array(my_array + 1, my_array + 4); // Contains {20, 30, 40}

std::vector<int> original = {1, 2, 3, 4};
std::vector<int> copy_of_original(original.begin(), original.end()); // Contains {1, 2, 3, 4}
```


- **`(destructor)`-** Automatically cleans up the vector's memory when it goes out of scope.
    
- **`operator=`-** Assigns the contents of one vector to another.

---
### Element Access

These functions let you get or modify individual elements. These functions return references to the elements. If the vector object is const-qualified, the function returns a const_reference. Otherwise, it returns a reference.

- **`at(index)`-**  Returns a reference to the element at position _n_ in the vector. Accesses the element at a specific index with bounds checking. Throws `std::out_of_range` if the index is invalid. This is in contrast with operator, that does not check against bounds. 
    
- **`operator[index]`-** Accesses the element at a specific index without bounds checking. Faster but unsafe if the index might be invalid. 
    
- **`front()`-** Returns a `reference` to the very first element in the vector to directly access or modify the value of the first element.
    
- **`back()`-** Returns a reference to the last element in the vector. 
    
- **`data()`-** Returns a direct pointer to the underlying array memory block. Because elements in the vector are guaranteed to be stored in contiguous storage locations in the same order as represented by the vector, the pointer retrieved can be offset to access any element in the array. Useful for interacting with C-style APIs. Not needed.

---
### Iterators

These provide a way to loop through or point to elements. Iterators are like generalized pointers. In pointers, when we do p++, it goes to the next memory point. In iterators, when we do it++, it goes to the next memory point of the data structure like it goes to the next node in a linked list, and not the next memory point in the computer which is not useful. So, for traversing a data structure, use iterators over pointers. 

- **`begin()` / `cbegin()`-** Returns an iterator pointing to the first element. (`cbegin` is the `const` version). To get the _value_ of the first element using the iterator, you need to dereference it using the `*` operator (like `*vec.begin()`). Pointer direction ->
    
- **`end()` / `cend()`-** Returns an iterator pointing one past the last element. This is used as the stopping condition in loops. (`cend` is the `const` version). Pointer direction ->
    
- **`rbegin()` / `crbegin()`-** Returns a reverse iterator pointing to the last element (for iterating backward). Reverse iterators iterate backwards: increasing them moves them towards the beginning of the container. Pointer direction <-
    
- **`rend()` / `crend()`-** Returns a _reverse_ iterator pointing one before the first element (used as the stopping condition for reverse iteration). Pointer direction <-

---
### Capacity

These functions deal with the size and memory allocation of the vector.

1. `capacity()`- Returns the number of elements the vector can hold before it needs to reallocate more memory. (`capacity() >= size()`).
2. `empty()`: Returns `true` if the vector has zero elements (`size() == 0`), `false` otherwise.
3. `size()`- Returns the number of elements currently in the vector.
4. `max_size()`- Returns the maximum possible number of elements the vector could theoretically hold (usually a very large number based on system memory). Not needed
5. `reserve(n)`: Requests that the vector's capacity be at least enough to contain `n` elements. This can prevent reallocations if you know how many elements you'll add. Note that the resulting vector capacity may be equal or greater than _n_.
   
   When we `push_back` a vector, it increases it's size by taking space from capacity but if capacity is full, and we need to `push_back`, then the vector needs to find a new, larger block of memory (often double the old capacity), copy or move all the existing elements from the old block to the new block, delete the old block and finally, add your new element. The 1st 3 steps takes a lot of time to do. So, to optimize the process, instead of letting the computer decide capacity size, we tell the computer to reserve space of n elements in the capacity beforehand, to prevent the slow process of reallocation.     
6. `void resize (size_type n, value_type val = value_type())` - Resizes the container so that it contains _n_ elements. This function changes the actual content of the container by inserting or erasing elements from it. The time complexity is linear on the number of elements inserted/erased (constructions/destructions). If a reallocation happens, the reallocation is itself up to linear in the entire vector size. 
- If _n_ is smaller than the current container size, the content is reduced to its first _n_ elements, removing those beyond (and destroying them).  
- If _n_ is greater than the current container size, the content is expanded by inserting at the end as many elements as needed to reach a size of _n_. If _val_ is specified, the new elements are initialized as copies of _val_, otherwise, they are value-initialized.  
- If _n_ is also greater than the current container capacity, an automatic reallocation of the allocated storage space takes place.  
1. `shrink_to_fit()`: Requests that the vector reduce its `capacity` to match its `size`. (Useful for saving memory after removing many elements). 
   
   The vector allocates a _new_, smaller block of memory just big enough for the current `size()`. It then moves the elements from the old large block to the new small block and deallocates the old large block. Afterward, `capacity()` would be much closer (ideally equal) to `size()`. However, this operation usually involves reallocation (allocating new memory, moving elements, deallocating old memory), which can be slow. 
   
   The request is non-binding, and the container implementation is free to optimize otherwise and leave the vector with a capacity greater than its size. This happens because of the following reasons
   - Reallocating memory (which `shrink_to_fit` usually requires) can be slow. The library implementers might decide that the potential memory saving is so small, or the current capacity matches their internal allocation strategy so well, that it's actually _faster_ overall to just keep the extra memory. For example, if the vector allocates memory in chunks of 16, and you shrink from size 10 / capacity 32 down to size 10, it might still allocate a chunk of 16 anyway, so the saving isn't huge but the cost of reallocation was paid.
   - **Avoiding Thrashing -** If the implementation suspects you might add elements again soon after shrinking, it mi```

```
ght keep the extra capacity to avoid shrinking now only to have to grow and reallocate again immediately afterward. This back-and-forth ("thrashing") would be inefficient.
   - **Implementation Freedom -** The standard generally tries to specify _what_ a function should achieve, but not always exactly how. Giving implementations the freedom to ignore `shrink_to_fit` allows them to use different memory management strategies internally without breaking the standard.

---

## Modifiers

These functions change the contents of the vector.

- `clear()`: Removes **all** elements from the vector (`size()` becomes 0).
    
- `insert(pos, ...)`: Inserts new elements **before** the specified iterator position (`pos`). Can insert single elements, multiple copies of an element, or a range of elements.
    
- `emplace(pos, ...)`: Constructs an element **in-place** (directly in the vector's memory) before the specified iterator position. Often more efficient than `insert` if you're creating complex objects.
    
- `erase(pos)` / `erase(first, last)`: Removes the element at the specified position (`pos`) or a range of elements (`[first, last)`).
    
- `push_back(value)`: Adds an element to the **end** of the vector. Might cause a reallocation if `capacity` is reached. When this _capacity_ is exhausted and more is needed, it is automatically expanded by the container (reallocating it storage space)
    
- `emplace_back(...)`: Constructs an element **in-place** at the **end** of the vector. Often more efficient than `push_back`.
    
- `pop_back()`: Removes the **last** element from the vector. (Does not return the element).
    
- `resize(n)` / `resize(n, value)`: Changes the `size()` of the vector to `n`. If `n` is larger than the current size, new elements are added (with a specific `value` or default-initialized). If `n` is smaller, elements are removed from the end.
    
- `swap(other_vector)`: Exchanges the contents of this vector with another vector of the same type. This is usually very fast (just swaps the internal pointers).