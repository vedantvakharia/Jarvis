## Linked Lists

A Linked List is a linear data structure where each element (node) contains the data (value) and a pointer to the next node. Unlike arrays, linked lists don’t store elements in contiguous memory — they’re dynamically allocated.

The address of the first node a special name called HEAD. Also, the last node in the linked list can be identified because its next portion points to NULL.

**General Syntax -** 
```c
struct Node {
    int data;
    struct Node* next;
};
```


**Single Linked Lists -** 
1. **Traverse a Linked List -** We keep moving the temp node to the next one and display its contents. When temp is NULL, we know that we have reached the end of the linked list so we get out of the while loop.
   
```c
struct node *temp = head;
printf("\n\nList elements are - \n");
while(temp != NULL) {
printf("%d --->",temp->data);
temp = temp->next;
}
```


2. **Insert Elements to a Linked List** - 
	1. **Insert after the i node -** 
	   
	```c
	//We create a temporary pointer `temp` to walk through the list starting from the head.
	void insertAfterPosition(struct Node* head, int i, int new_data) {
	
	struct Node* temp = head;
	   
	// Traverse to the i-th node
	for (int pos = 0; pos < i; pos++) {
		   emp = temp->next;}

	  
	// Allocate new node
	struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
	new_node->data = new_data;
	   
	 // Insert after the i-th node
	 new_node->next = temp->next;
	 temp->next = new_node;
	   }
	```
	   
	2. **Insert at beginning -** 
	   Allocate memory for new node
	   Store data
	   Change next of new node to point to head
	   Change head to point to recently created node
	```c
	struct node *newNode;
	newNode = malloc(sizeof(struct node));
	newNode->data = 4;
	newNode->next = head;
	head = newNode;
	```


    3. **Insert at end -** 

	```c
	   struct node *newNode;
	   newNode = malloc(sizeof(struct node));
	   newNode->data = 4;
	   newNode->next = NULL;
	   
	   struct node *temp = head;
	   while(temp->next != NULL){
	   temp = temp->next;
	   }
	   
	   temp->next = newNode; 
	```

3. **Delete nodes from a linked list  -** 
	1. **Delete the ith node -** 
	```c
	void deleteAtPosition(struct Node** head_ref, int i) {
	
	struct Node* temp = *head_ref;
	
	// Traverse to the (i-1)th node
	for (int pos = 0; pos < i - 1; pos++) {
        if (temp == NULL || temp->next == NULL) {
            printf("Position %d is out of bounds.\n", i);
            return;
        }
        temp = temp->next;
    	}
    
    	// temp points to (i-1)th node now
    	struct Node* nodeToDelete = temp->next;

    	temp->next = nodeToDelete->next;  // Skip the i-th node
    	free(nodeToDelete);               // Free memory
	}
	```

	2.  **Delete the 1st node -** Point head to the second node
	```c
	head = head->next;
	```

	3. **Delete the last node -** 
	   Traverse to second last element
	   Change its next pointer to null
	```c
	   struct node* temp = head;
	   while(temp->next->next!=NULL){
	   temp = temp->next;
	   }
	   temp->next = NULL;
	```

4. 

## Trees

## Hash Tables

A hash table implements an associative array also called a dictionary or simply map. An associative array is an abstract data type that maps keys to values. A hash table uses a hash function to compute an index, also called a hash code, into an array of buckets or slots, from which the desired value can be found. During lookup, the key is hashed and the resulting hash indicates where the corresponding value is stored. A map implemented by a hash table is called a hash map. 

```c title:"General code for Hash Table"
// Define a key-value pair (node/item)
typedef struct{
	char* key;            // Use int instead of char* if array contains int
	char* value;          // Use int instead of char* if array contains int
	struct ht_item* next;  // For separate chaining
} HashEntry;

/*
What does struct ht_item* next do?

The code line means that each node (ht_item) in the hash table can point to another node of the same type. This enables separate chaining, a method for handling collisions in a hash table.

Think of it like this
When two or more keys hash to the same index in the array,
Instead of overwriting or rejecting them, 
You **chain** them together using this next pointer.
*/

// Define the hash table
typedef struct {
    int size;
    ht_item** buckets;  // Array of pointers to linked lists
// Each index in buckets[] is a pointer to a linked list (for handling collisions).
} hashtable;

// Create the Hash Table
hashtable* ht_create(int size) {
    hashtable* ht = malloc(sizeof(hashtable));
    ht->size = size;
    ht->buckets = calloc(size, sizeof(ht_item*));  // Initialize to NULL
    return ht;
}

// Write a Hash Function (djb2 used here)
unsigned int hash(const char* key, int size) {
    unsigned long hash = 5381;
    int c;
    while ((c = *key++)) {
        hash = ((hash << 5) + hash) + c;  // hash * 33 + c
    }
    return hash % size;
}

// Handle Collisions (Separate Chaining) - If multiple keys map to the same index, store them as a linked list.
bucket[index] -> [key1,value1] -> [key2,value2] -> NULL

// Insert operation
void ht_insert(hashtable* ht, const char* key, const char* value) {
    unsigned int index = hash(key, ht->size);
    ht_item* new_item = malloc(sizeof(ht_item));
    new_item->key = strdup(key);
    new_item->value = strdup(value);
    new_item->next = NULL;

    ht_item* current = ht->buckets[index];

    // If slot empty, directly insert
    if (!current) {
        ht->buckets[index] = new_item;
        return;
    }

    // Else traverse and check for duplicate key
    ht_item* prev = NULL;
    while (current) {
        if (strcmp(current->key, key) == 0) {
            free(current->value);
            current->value = strdup(value);  // Replace
            free(new_item->key);
            free(new_item->value);
            free(new_item);
            return;
        }
        prev = current;
        current = current->next;
    }

    // If not found, append at end
    prev->next = new_item;
}

```

### Hash Functions

A Function that translates keys to array indices (hash-code) is known as a hash function. The keys should be evenly distributed across the array via a decent hash function to reduce collisions and ensure quick lookup speeds.

Properties of a hash function

| Property                | Meaning                                                  |
| ----------------------- | -------------------------------------------------------- |
| **Deterministic**       | Same input → always same output                          |
| **Uniform**             | Spread inputs evenly across the output range             |
| **Efficient**           | Must be fast to compute                                  |
| **Minimize Collisions** | Different keys → different outputs (as much as possible) |
#### Types of Hash function

1. **Division Method -**`hash(k) = k % m` where`k` is key (must be numeric) and m which is a prime number close to the table size. It is simple but patterns in keys may lead to clustering. The table size is usually a power of 2. This gives a distribution from {0, _M_ − 1}. This gives good results over a large number of key sets. A significant drawback of division hashing is that division requires multiple cycles on most modern architectures and can be 10 times slower than multiplication. A second drawback is that it will not break up clustered keys. For example, the keys 123000, 456000, 789000, etc. modulo 1000 all map to the same address. This technique works well in practice because many key sets are sufficiently random already, and the probability that a key set will be cyclical by a large prime number is small
2. **Multiplication Method -** `hash(k) = floor(m * frac(k * A))` where `A` is a constant (typically irrational and `frac(x)` is the fractional part of x. It has better distribution than division but slightly slower. 
3. **Mid square Method -** It works because squaring tends to **spread out** patterns in the input data and extracting middle digits avoids influence of leading/trailing digits (which often repeat or are similar).
   
   **Steps -** 
   - Start with a numerical key.
   - Square the key.
   - Extract a fixed number of **middle digits** from the result.
   - Use these digits as the hash value (often `% table_size` is applied to fit it into a table).
   
   **Example -** Let’s say our table size is 100 (so we need 2 digits).
   Key = `123`
1. Square it: `123^2 = 15129`
2. Middle digits: extract 2 middle digits → `51`
3. Hash = `51`
   
```c
#include <stdio.h>
#include <math.h>

// Mid-Square Hash Function
int mid_square_hash(int key, int table_size) {
    long long square = (long long)key * key;

    // Count number of digits in table_size to decide how many mid digits to extract
    int digits_needed = 0;
    int temp = table_size;
    while (temp > 0) {
        digits_needed++;
        temp /= 10;
    }

    // Convert square to string
    char square_str[32];
    sprintf(square_str, "%lld", square);

    int len = 0;
    while (square_str[len] != '\0') len++;

    // Get middle digits
    int start = (len - digits_needed) / 2;
    char mid_digits[16] = {0};
    for (int i = 0; i < digits_needed; i++) {
        mid_digits[i] = square_str[start + i];
    }

    int hash = atoi(mid_digits) % table_size;
    return hash;
}
```

4. **Folding Method -** Split the key into equal parts, add them together, and optionally take the modulus with table size. It is better than mid square method. It can be also used for strings by converting the char into ASCII. 
   
   Steps - 
   - Represent key as a sequence of digits (or bytes).
   - Break it into **equal-sized parts** (usually 2, 3, or 4 digits).
   - Add the parts together.
   - Use the sum (or sum % table_size) as the hash.

Example - 
Key = `123456789`
Break it into chunks of 3 digits:
`123`, `456`, `789`
Add them:  
`123 + 456 + 789 = 1368`
Now:  
`Hash = 1368 % table_size`

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Folding Hash Function (works with numeric or string keys)
int folding_hash(const char *key, int group_size, int table_size) {
    int sum = 0;
    int len = strlen(key);

    for (int i = 0; i < len; i += group_size) {
        char group[16] = {0};
        int j;
        for (j = 0; j < group_size && (i + j) < len; j++) {
            group[j] = key[i + j];
        }
        group[j] = '\0';
        sum += atoi(group); // Add numeric value of the group
    }

    return sum % table_size;
}
```

5. **Universal hashing -** Universal hashing means choosing a hash function at random from a carefully designed family of hash functions, such that for any two distinct keys `x ≠ y`, the probability that they collide is **low** when the hash function is randomly chosen from the family. 
   
   Universal Hashing Formula - `h(x) = ((a * x + b) % p) % m` where:
- `x` is the key (must be an integer)
- `a` and `b` are random integers
    - `1 ≤ a < p`, `0 ≤ b < p`
- `p` is a large **prime** number larger than any key
- `m` is the size of your hash table
  
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Choose a large prime (must be > max key)
#define PRIME 7919

// Random values a and b in [1, p-1] and [0, p-1]
int universal_hash(int key, int a, int b, int m) {
    return ((a * key + b) % PRIME) % m;
}
```


6. Perfect Hashing - 
7. **djb2 -** this algorithm (k=33) was first reported by dan bernstein many years ago in comp.lang.c. The magic of number 33 (why it works better than many other constants, prime or not) has never been adequately explained.
   
```c
unsigned long
hash(unsigned char *str)
{
	unsigned long hash = 5381;
    int c;

    while (c = *str++)
        hash = ((hash << 5) + hash) + c; /* hash * 33 + c */

    return hash;
}

// If you want better entropy in short strings (e.g., 2-3 chars), use this variation where you XOR instead of adding
hash(i) = hash(i - 1) * 33 ^ str[i];`
```

   8. **SDBM -** SDBM stands for Stanford Database Manager, where this hash function was used. It's used for hashing strings into integers, especially for hash tables.

```c
unsigned long sdbm(const unsigned char *str)
{
    unsigned long hash = 0;
    int c;

    while ((c = *str++))
        hash = c + (hash << 6) + (hash << 16) - hash; // = c + hash × 65599

    return hash;
}
```

### Collision resolution
A search algorithm that uses hashing consists of two parts. The first part is computing a hash function which transforms the search key into an array index. The ideal case is such that no two search keys hash to the same array index. However, this is not always the case and impossible to guarantee for unseen given data. Hence the second part of the algorithm is collision resolution. The two common methods for collision resolution are separate chaining and open addressing.

#### Separate Chaining
In separate chaining, the process involves building a linked list with key-value pair for each search array index. The collided items are chained together through a single linked list, which can be traversed to access the item with a unique search key. Collision resolution through chaining with linked list is a common method of implementation of hash tables. If the element is comparable either numerically or lexically, and inserted into the list by maintaining the total order, it results in faster termination of the unsuccessful searches.

Let T and x be the hash table and the node respectively, the operation involves as follows:
```
Chained-Hash-Insert(_T_, _k_)
  _insert_ _x_ _at the head of linked list_ _T_[_h_(_k_)]

Chained-Hash-Search(_T_, _k_)
  _search for an element with key_ _k_ _in linked list_ _T_[_h_(_k_)]

Chained-Hash-Delete(_T_, _k_)
  _delete_ _x_ _from the linked list_ _T_[_h_(_k_)]
```

#### Open Addressing (Probing)
With this method a hash collision is resolved by probing, or searching through alternative locations in the array (the _probe sequence_) until either the target record is found, or an unused array slot is found, which indicates that there is no such key in the table. 

The performance of open addressing may be slower compared to separate chaining since the probe sequence increases when the load factor α approaches 1.  The probing results in an infinite loop if the load factor reaches 1, in the case of a completely filled table. The average cost of linear probing depends on the hash function's ability to distribute the elements uniformly throughout the table to avoid clusterin, since formation of clusters would result in increased search time.
##### Linear Probing
In Linear Probing, the data structure is an array T (the hash table) whose cells T[i] (when nonempty) each store a single key–value pair. A hash function is used to map each key into the cell of T where that key should be stored, typically scrambling the keys so that keys with similar values are not placed near each other in the table. Linear probing is a strategy for resolving collisions, by placing the new key into the closest following empty cell.

###### Searching
To search for a given key x, the cells of T are examined, beginning with the cell at index h(x) (where h is the hash function) and continuing to the adjacent cells h(x) + 1, h(x) + 2, ..., until finding either an empty cell or a cell whose stored key is x. If a cell containing the key is found, the search returns the value from that cell. Otherwise, if an empty cell is found, the key cannot be in the table, because it would have been placed in that cell in preference to any later cell that has not yet been searched. In this case, the search returns as its result that the key is not present in the dictionary.

######  Insertion
To insert a key–value pair (_x_,_v_) into the table (possibly replacing any existing pair with the same key), the insertion algorithm follows the same sequence of cells that would be followed for a search, until finding either an empty cell or a cell whose stored key is x. The new key–value pair is then placed into that cell.

https://en.wikipedia.org/wiki/Linear_probing
