

## CHAPTER 10: Elementary Data Structures

### 10.1 Stacks and Queues

#### Stack (LIFO)
- **Array implementation**: S[1..n], attribute S.top
- **Empty condition**: S.top == 0
- **Underflow**: pop on empty stack (error)
- **Overflow**: S.top exceeds n

**Operations (all O(1)):**

```
STACK-EMPTY(S):
  if S.top == 0: return TRUE
  else return FALSE

PUSH(S, x):
  S.top = S.top + 1
  S[S.top] = x

POP(S):
  if STACK-EMPTY(S): error "underflow"
  else:
    S.top = S.top - 1
    return S[S.top + 1]
```

#### Queue (FIFO)
- **Array implementation**: Q[1..n], attributes Q.head and Q.tail
- **Empty condition**: Q.head == Q.tail
- **Full condition**: Q.head == Q.tail + 1 (circular)
- **Wraps around**: location 1 follows location n

**Operations (all O(1)):**

```
ENQUEUE(Q, x):
  Q[Q.tail] = x
  if Q.tail == Q.length: Q.tail = 1
  else: Q.tail = Q.tail + 1

DEQUEUE(Q):
  x = Q[Q.head]
  if Q.head == Q.length: Q.head = 1
  else: Q.head = Q.head + 1
  return x
```

**Key exam facts:**
- Two stacks in one array A[1..n]: Stack 1 grows from left (index 1 up), Stack 2 grows from right (index n down). Neither overflows unless total elements = n.
- Queue using two stacks: ENQUEUE is O(1), DEQUEUE is amortized O(1).
- Stack using two queues: PUSH is O(1), POP is O(n).

---

### 10.2 Linked Lists

#### Doubly Linked List
- Each element has: `key`, `next`, `prev`
- `L.head` points to first element
- `x.prev == NIL` => x is head
- `x.next == NIL` => x is tail
- `L.head == NIL` => list is empty

**Operations:**

```
LIST-SEARCH(L, k):            -- Theta(n) worst case
  x = L.head
  while x != NIL and x.key != k:
    x = x.next
  return x

LIST-INSERT(L, x):            -- O(1)
  x.next = L.head
  if L.head != NIL: L.head.prev = x
  L.head = x
  x.prev = NIL

LIST-DELETE(L, x):            -- O(1) given pointer to x
  if x.prev != NIL: x.prev.next = x.next
  else: L.head = x.next
  if x.next != NIL: x.next.prev = x.prev
```

**Delete by key = O(n)** because you must first call LIST-SEARCH.

#### Sentinels (L.nil)
- Dummy object replacing NIL
- Converts doubly linked list into **circular doubly linked list with sentinel**
- L.nil.next = head, L.nil.prev = tail
- Simplifies boundary conditions but does NOT change asymptotic complexity
- Memory cost: extra object per list - bad when many small lists

```
LIST-DELETE'(L, x):           -- simplified with sentinel
  x.prev.next = x.next
  x.next.prev = x.prev

LIST-INSERT'(L, x):
  x.next = L.nil.next
  L.nil.next.prev = x
  L.nil.next = x
  x.prev = L.nil
```

#### XOR Linked List (Exercise 10.2-8)
- Store only one pointer per node: `x.np = x.next XOR x.prev`
- Need to know head AND one pointer to traverse
- Can reverse in O(1) by swapping head and tail pointers
- All operations supported in O(1) per step

---

### 10.3 Implementing Pointers and Objects

#### Multiple-Array Representation
- Separate arrays: `key[]`, `next[]`, `prev[]`
- A pointer x is an index into these arrays
- `key[x]`, `next[x]`, `prev[x]` together represent one object

#### Single-Array Representation
- Object occupies contiguous subarray A[j..k]
- Pointer = index j of first element
- Offsets: key=0, next=1, prev=2 (for linked list)
- More flexible (heterogeneous objects) but harder to manage

#### Free List (Allocate/Free)
- Free objects maintained as a singly linked list using only the `next` array
- Acts like a **stack**: last freed = next allocated

```
ALLOCATE-OBJECT():            -- O(1)
  if free == NIL: error "out of space"
  x = free
  free = x.next
  return x

FREE-OBJECT(x):               -- O(1)
  x.next = free
  free = x
```

**Why no need to reset `prev`?**
The free list only uses `next`. The `prev` field is irrelevant for free list management - it gets properly set when the object is inserted into a real list.

**One free list can serve multiple linked lists** (Figure 10.8).

---

### 10.4 Representing Rooted Trees

#### Binary Tree
- Each node x has: `x.p` (parent), `x.left`, `x.right`
- `x.p == NIL` => x is root
- `T.root == NIL` => empty tree

#### Left-Child, Right-Sibling Representation
- For trees with **unbounded branching**
- Each node has: `x.p`, `x.left-child`, `x.right-sibling`
- Space: **O(n)** for any n-node rooted tree
- `x.left-child == NIL` => x has no children
- `x.right-sibling == NIL` => x is rightmost child

**Key insight**: This maps any rooted tree to a binary tree structure.

#### Other Representations
- **Heap** (Ch. 6): complete binary tree stored in array + heap-size attribute
- **Union-Find** (Ch. 21): only parent pointers, no child pointers

---

## CHAPTER 11: Hash Tables

---

### 11.1 Direct-Address Tables

- Universe U = {0, 1, ..., m-1}, no two elements have same key
- Table T[0..m-1], slot k points to element with key k
- T[k] = NIL if no element with key k

**All operations O(1):**
```
DIRECT-ADDRESS-SEARCH(T, k): return T[k]
DIRECT-ADDRESS-INSERT(T, x): T[x.key] = x
DIRECT-ADDRESS-DELETE(T, x): T[x.key] = NIL
```

**Problem**: If |U| is huge, impractical to store T of size |U|.

**Trick (Ex 11.1-4)**: Huge uninitialized array + auxiliary stack of size = actual keys stored. Stack validates whether a huge-array entry is genuine.

---

### 11.2 Hash Tables

#### Core Idea
- Hash function h: U -> {0, 1, ..., m-1}
- Element with key k goes to slot h(k)
- m << |U|, storage = Theta(|K|)

#### Collision
- When h(k1) == h(k2) for k1 != k2
- Unavoidable when |U| > m (pigeonhole)

#### Load Factor
**alpha = n/m** (average elements per slot)
- n = number of keys stored
- m = number of slots
- For chaining: alpha can exceed 1
- For open addressing: alpha <= 1 always

#### Chaining (Collision Resolution)
- Each slot holds a **linked list** of elements hashing there

```
CHAINED-HASH-INSERT(T, x):   -- O(1) worst case
  insert x at head of T[h(x.key)]

CHAINED-HASH-SEARCH(T, k):   -- O(1+alpha) average
  search list T[h(k)]

CHAINED-HASH-DELETE(T, x):   -- O(1) if doubly linked
  delete x from T[h(x.key)]
```

**Deletion note**: Use doubly linked lists for O(1) delete. Singly linked requires O(n) to find predecessor.

---

### THEOREM 11.1 (Unsuccessful Search - Chaining)
**Statement**: Under simple uniform hashing, an unsuccessful search takes **Theta(1 + alpha)** average-case time.

**Proof sketch**:
- Any key k not in table hashes to any of m slots equally likely
- Expected length of list T[h(k)] = E[n_{h(k)}] = alpha
- Total time = O(1) for hash computation + alpha for list traversal = Theta(1 + alpha). []

---

### THEOREM 11.2 (Successful Search - Chaining)
**Statement**: Under simple uniform hashing, a successful search takes **Theta(1 + alpha)** average-case time.

**Proof sketch**:
- Define X_ij = I{h(k_i) = h(k_j)} for i < j (indicator: do keys i and j collide?)
- Under simple uniform hashing: Pr{h(k_i) = h(k_j)} = 1/m, so E[X_ij] = 1/m
- Elements before x in x's list were inserted AFTER x (new elements go to head)
- Expected elements examined in successful search:

E[(1/n) * sum_{i=1}^{n} (1 + sum_{j=i+1}^{n} X_ij)]
= 1 + (n-1)/(2m)
= 1 + alpha/2 - alpha/(2n)

- Total time = Theta(2 + alpha/2 - alpha/2n) = **Theta(1 + alpha)**. []

**Key consequence**: If n = O(m), then alpha = O(1), so all dictionary operations are O(1) average.

---

### 11.3 Hash Functions

#### Simple Uniform Hashing Assumption
Each key equally likely to hash to any of m slots, independently. (Usually cannot verify in practice.)

#### 11.3.1 Division Method
**h(k) = k mod m**

- Fast: single division
- Avoid m = power of 2 (h(k) = just p low-order bits of k)
- Avoid m = 2^p - 1 for strings in radix 2^p (permutations of chars give same hash)
- **Good choice**: m = prime not close to a power of 2
- Example: n = 2000 strings, want alpha <= 3 => m = 701 (prime near 2000/3, not near power of 2)

#### 11.3.2 Multiplication Method
**h(k) = floor(m * (kA mod 1))**, where 0 < A < 1

- m not critical; typically choose m = 2^p
- Implementation: multiply k by s = A * 2^w (w = word size), take p high bits of low-order word
- **Knuth's suggestion**: A ≈ (sqrt(5) - 1)/2 = 0.6180339887...
- Advantage: value of m not critical (unlike division method)

#### 11.3.3 Universal Hashing
**Definition**: A collection H of hash functions is **universal** if for each pair of distinct keys k, l in U:
  |{h in H : h(k) = h(l)}| <= |H|/m

Equivalently: Prob(collision) <= 1/m when h chosen randomly from H.

**Why**: No fixed adversarial input can force worst-case; randomization helps.

---

### THEOREM 11.3 (Universal Hashing Performance)
**Statement**: With h chosen randomly from a universal collection, hashing n keys into table of size m with chaining:
- If key k NOT in table: E[n_{h(k)}] <= alpha = n/m
- If key k IS in table: E[n_{h(k)}] <= 1 + alpha

**Proof sketch**:
- Define Y_k = number of keys other than k that hash to same slot as k
- Y_k = sum_{l in T, l != k} X_{kl} where X_{kl} = I{h(k) = h(l)}
- By universality: E[X_{kl}] <= 1/m
- By linearity of expectation: E[Y_k] <= (# other keys)/m
- If k not in T: E[n_{h(k)}] = E[Y_k] <= n/m = alpha
- If k in T: E[n_{h(k)}] = E[Y_k] + 1 <= (n-1)/m + 1 = 1 + alpha - 1/m < 1 + alpha. []

---

### COROLLARY 11.4
Using universal hashing with chaining in an initially empty table with m slots, handling any sequence of n INSERT, SEARCH, DELETE ops with O(m) INSERTs takes **expected time Theta(n)** total.

---

### THEOREM 11.5 (Hpm is Universal)
**Definition of Hpm**: For prime p > max key, a, b in Zp (a != 0):
  h_{ab}(k) = ((ak + b) mod p) mod m

The class **Hpm = {h_{ab} : a in Zp*, b in Zp}** contains p(p-1) functions.

**Statement**: Hpm is universal.

**Proof sketch**:
- For distinct keys k, l: let r = (ak+b) mod p, s = (al+b) mod p
- r != s because r - s ≡ a(k-l) (mod p), and p is prime, a != 0, k != l (mod p), so product != 0 (Thm 31.6)
- The p(p-1) choices of (a,b) yield all p(p-1) ordered pairs (r,s) with r != s - one-to-one correspondence
- For a random (a,b), (r,s) is uniformly distributed over distinct pairs mod p
- Number of s with s != r and s ≡ r (mod m): at most ceil(p/m) - 1 <= (p-1)/m
- Prob(collision mod m) <= ((p-1)/m)/(p-1) = 1/m. []

---

### 11.4 Open Addressing

All elements stored **in the table itself** (no external lists). Load factor alpha <= 1 always.

**Hash function**: h: U x {0,...,m-1} -> {0,...,m-1}

**Probe sequence for key k**: <h(k,0), h(k,1), ..., h(k,m-1)> must be a permutation of <0,1,...,m-1>.

```
HASH-INSERT(T, k):
  i = 0
  repeat:
    j = h(k, i)
    if T[j] == NIL: T[j] = k; return j
    else: i = i + 1
  until i == m
  error "hash table overflow"

HASH-SEARCH(T, k):
  i = 0
  repeat:
    j = h(k, i)
    if T[j] == k: return j
    i = i + 1
  until T[j] == NIL or i == m
  return NIL
```

**Deletion problem**: Cannot just set T[i] = NIL (breaks search chains). Use special value DELETED instead. Modify INSERT to treat DELETED as empty. SEARCH skips over DELETED. **Downside**: search time no longer depends on alpha => chaining preferred when deletion needed.

#### Linear Probing
h(k, i) = (h'(k) + i) mod m

- Only m distinct probe sequences
- **Primary clustering**: long runs of occupied slots build up
- Easy to implement

#### Quadratic Probing
h(k, i) = (h'(k) + c1*i + c2*i^2) mod m

- Better than linear, but **secondary clustering**: same initial probe => same sequence
- Still only m distinct sequences
- c1, c2, m must be chosen carefully

#### Double Hashing
h(k, i) = (h1(k) + i*h2(k)) mod m

- **Best open-addressing method** in practice
- h2(k) must be **relatively prime to m** for full table coverage
- Achieves Theta(m^2) distinct probe sequences (vs Theta(m) for linear/quadratic)
- Typical: m prime, h1(k) = k mod m, h2(k) = 1 + (k mod m'), m' slightly < m
- h2(k) must never be 0

---

### THEOREM 11.6 (Unsuccessful Search - Open Addressing)
**Statement**: With load factor alpha = n/m < 1 and uniform hashing, expected probes in an **unsuccessful search** is at most **1/(1 - alpha)**.

**Proof**:
- Define A_i = event that ith probe hits an occupied slot
- Pr{A1} = n/m = alpha
- Pr{A_j | A_1 ^ ... ^ A_{j-1}} = (n-j+1)/(m-j+1) <= n/m = alpha (since n < m)
- Pr{X >= i} <= alpha^{i-1}
- E[X] = sum_{i=1}^{inf} Pr{X >= i} <= sum_{i=0}^{inf} alpha^i = 1/(1-alpha). []

**Intuition**: 1/(1-alpha) = 1 + alpha + alpha^2 + ...
- alpha = 0.5 => at most 2 probes
- alpha = 0.9 => at most 10 probes
- alpha = 0.99 => at most 100 probes

---

### COROLLARY 11.7
Inserting into an open-address table with load factor alpha requires at most **1/(1-alpha)** probes on average (uniform hashing).

---

### THEOREM 11.8 (Successful Search - Open Addressing)
**Statement**: With load factor alpha < 1 and uniform hashing, expected probes in a **successful search** is at most:

**(1/alpha) * ln(1/(1-alpha))**

**Proof sketch**:
- Search for k reproduces insertion probe sequence for k
- If k was (i+1)th key inserted, expected probes = at most 1/(1 - i/m) = m/(m-i) (by Corollary 11.7)
- Average over all n keys:
  (1/n) * sum_{i=0}^{n-1} m/(m-i) = (1/alpha) * sum_{k=m-n+1}^{m} 1/k
  <= (1/alpha) * integral_{m-n}^{m} (1/x)dx = (1/alpha) * ln(m/(m-n)) = (1/alpha)*ln(1/(1-alpha)). []

**Examples**:
- alpha = 0.5: expected probes <= (1/0.5)*ln(2) ≈ 1.387
- alpha = 0.9: expected probes <= (1/0.9)*ln(10) ≈ 2.559

---

### 11.5 Perfect Hashing

**Goal**: O(1) worst-case search for **static** key sets.

**Two-level scheme**:
1. Level 1: Hash n keys into m = n slots using h from universal family
2. Level 2: For slot j with n_j keys, use secondary table S_j of size **m_j = n_j^2** with its own universal hash h_j

**Result**: No collisions at secondary level, O(1) worst-case search.

---

### THEOREM 11.9 (No Collisions with m = n^2)
**Statement**: Store n keys in table of size m = n^2 using random h from universal family. Then Pr{any collision} < 1/2.

**Proof**:
- C(n,2) pairs of keys, each collides with prob <= 1/m = 1/n^2
- E[# collisions] = C(n,2) * (1/n^2) = (n^2 - n)/(2n^2) < 1/2
- By Markov's inequality: Pr{X >= 1} <= E[X]/1 < 1/2. []

---

### THEOREM 11.10 (Expected Secondary Storage)
**Statement**: Store n keys in table of size m = n using random h from universal family. Then:

E[sum_{j=0}^{m-1} n_j^2] < 2n

**Proof**:
- Identity: a^2 = a + 2*C(a,2)
- sum n_j^2 = sum n_j + 2 * sum C(n_j, 2) = n + 2 * (total collisions)
- E[total collisions] <= C(n,2) * (1/m) = n(n-1)/(2n) = (n-1)/2
- E[sum n_j^2] <= n + 2*(n-1)/2 = 2n - 1 < 2n. []

---

### COROLLARY 11.11
With m_j = n_j^2 for all j, expected total secondary storage < 2n.

### COROLLARY 11.12
Prob{total secondary storage >= 4n} < 1/2.
(Apply Markov to Theorem 11.10 result with t = 4n.)

**Construction algorithm**: Keep trying random h until secondary storage < 4n. Expected attempts = 2 (geometric with p > 1/2).

---

## SUMMARY TABLE: Complexity Comparison

### Linked Lists (Problem 10-1)

| Operation        | Unsorted Singly | Sorted Singly | Unsorted Doubly | Sorted Doubly |
|-----------------|-----------------|---------------|-----------------|---------------|
| SEARCH(L, k)    | Theta(n)        | Theta(n)      | Theta(n)        | Theta(n)      |
| INSERT(L, x)    | O(1)            | Theta(n)      | O(1)            | Theta(n)      |
| DELETE(L, x)*   | Theta(n)        | Theta(n)      | O(1)            | O(1)          |
| SUCCESSOR(L, x) | Theta(n)        | O(1)          | Theta(n)        | O(1)          |
| PREDECESSOR(L,x)| Theta(n)        | Theta(n)      | Theta(n)        | O(1)          |
| MINIMUM(L)      | Theta(n)        | O(1)          | Theta(n)        | O(1)          |
| MAXIMUM(L)      | Theta(n)        | Theta(n)**    | Theta(n)        | Theta(n)**    |

*DELETE given pointer to element
**O(1) if tail pointer maintained

### Hash Table Performance

| Scheme               | Search (avg)    | Insert (avg)    | Delete (avg)    |
|---------------------|-----------------|-----------------|-----------------|
| Direct Addressing   | O(1) worst case | O(1) worst case | O(1) worst case |
| Chaining            | Theta(1+alpha)  | O(1)            | O(1) dbl-linked |
| Open Addressing     | 1/(1-alpha)     | 1/(1-alpha)     | tricky          |
| Perfect Hashing     | O(1) worst case | N/A (static)    | N/A (static)    |

---

## KEY EXAM TRICKS AND PITFALLS

### Chapter 10

1. **Two stacks in one array**: Stack 1 from left (S1.top starts at 0), Stack 2 from right (S2.top starts at n+1). Overflow only when they meet.

2. **Queue from two stacks**: 
   - ENQUEUE: push to stack1 - O(1)
   - DEQUEUE: if stack2 empty, pop all from stack1 and push to stack2, then pop stack2 - O(n) worst case but O(1) amortized

3. **Stack from two queues**: 
   - PUSH: enqueue to Q1 - O(1)
   - POP: dequeue all but last from Q1 into Q2, dequeue last (that's the answer), swap Q1/Q2 - O(n)

4. **Sentinel trick**: L.nil.key can be set to search target, eliminating the `x != NIL` check (Exercise 10.2-4). Loop terminates naturally.

5. **XOR list reversal**: O(1) - just swap the head and tail pointer values.

6. **Why FREE-OBJECT doesn't reset prev**: The free list uses only `next`. `prev` fields are don't-care in freed objects and get properly initialized when re-allocated into a real list.

### Chapter 11

7. **Division method - what to avoid**:
   - m = 2^p: hash = just p lowest bits (ignores high bits)
   - m = 2^p - 1 with radix-2^p strings: character permutations give same hash

8. **Double hashing - h2(k) must be coprime to m**. If gcd(h2(k), m) = d > 1, only 1/d of table is probed. Ensure coprimality by: (a) m = power of 2, h2 always odd, or (b) m = prime, h2 always in {1,...,m-1}.

9. **Open addressing deletion**: Cannot write NIL - corrupts chains. Must use DELETED sentinel. This means search time loses its alpha-dependence guarantee => prefer chaining when deletions are needed.

10. **Load factor intuition for open addressing**:
    - Unsuccessful: 1/(1-alpha) -- blows up as alpha -> 1
    - Successful: (1/alpha) * ln(1/(1-alpha))
    - At alpha = 0.5: unsuccessful = 2, successful ≈ 1.39
    - At alpha = 0.9: unsuccessful = 10, successful ≈ 2.56

11. **Universal hashing key formula**: h_{ab}(k) = ((ak + b) mod p) mod m. Proof of universality uses the fact that p is prime => no zero divisors => r != s at "mod p level" => uniform distribution over distinct (r,s) pairs.

12. **Perfect hashing storage**: Primary = O(n), Secondary = expected O(n) total. Finding a good secondary function per slot takes expected O(1) tries (Theorem 11.9 gives < 1/2 failure probability).

13. **COMPACT-LIST-SEARCH** (Problem 10-3): Expected O(sqrt(n)) time via random skips in a sorted compact list. Optimal t = sqrt(n) in COMPACT-LIST-SEARCH' balances O(t + n/t) = O(sqrt(n)).

14. **Chaining vs Open Addressing**:
    - Chaining: simpler, works with alpha > 1, deletion easy, but pointer overhead
    - Open addressing: no pointer storage, better cache performance, deletion hard, alpha strictly < 1

15. **Simple uniform hashing assumption** is unverifiable in practice - we rarely know the key distribution. Universal hashing provides provable guarantees WITHOUT this assumption.
