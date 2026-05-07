
# CHAPTER 12: Binary Search Trees

## 12.1 BST Property

**Definition:** For any node x in a BST:
- Every key in the **left subtree** of x is **<= x.key**
- Every key in the **right subtree** of x is **>= x.key**

**Representation:** Each node has fields: `key`, `left`, `right`, `p` (parent). Missing child/parent = NIL. Root's parent = NIL.

---

## 12.1 Tree Walks

| Walk Type | Order |
|---|---|
| Inorder | left, root, right -- prints keys in **sorted order** |
| Preorder | root, left, right |
| Postorder | left, right, root |

### Theorem 12.1 - Inorder Walk Runtime
**Statement:** INORDER-TREE-WALK on root of an n-node subtree takes Theta(n) time.

**Proof (substitution method):**
- Let T(n) = time for walk on n-node subtree.
- T(0) = c (constant for NIL check).
- For n > 0, with left subtree of size k and right of size n-k-1:
  - T(n) <= T(k) + T(n-k-1) + d
- Claim: T(n) <= (c+d)n + c. Verify:
  - Base: (c+d)*0 + c = c = T(0). Holds.
  - Inductive step:
    - T(n) <= ((c+d)k + c) + ((c+d)(n-k-1) + c) + d
    - = (c+d)n + c - (c+d) + c + d
    - = (c+d)n + c. QED.

---

## 12.2 Querying a BST

All operations run in **O(h)** where h = height of tree.

### TREE-SEARCH(x, k)
- Recursive: compare k with x.key, go left or right.
- Iterative version (ITERATIVE-TREE-SEARCH) is more efficient in practice.

### TREE-MINIMUM(x)
- Follow left child pointers until NIL.
- Returns leftmost node.

### TREE-MAXIMUM(x)
- Follow right child pointers until NIL.

### TREE-SUCCESSOR(x)
Two cases:
1. If x has a right subtree: successor = TREE-MINIMUM(x.right)
2. If x has no right subtree: go up until you find a node that is a LEFT child of its parent; that parent is the successor.

### TREE-PREDECESSOR(x)
Symmetric to TREE-SUCCESSOR.

### Theorem 12.2
**Statement:** SEARCH, MINIMUM, MAXIMUM, SUCCESSOR, PREDECESSOR all run in **O(h)** on a BST of height h.

---

## 12.3 Insertion and Deletion

### TREE-INSERT(T, z)
- Trace path from root, find NIL position.
- Maintain trailing pointer y (parent of x).
- Set z.p = y, attach z as left or right child.
- Runs in **O(h)**.

### TREE-DELETE(T, z) - 3 Cases
1. **z has no left child:** Replace z by z.right (may be NIL).
2. **z has no right child:** Replace z by z.left.
3. **z has two children:** Find successor y = TREE-MINIMUM(z.right). y has no left child.
   - If y is z's right child: replace z by y directly.
   - Else: first replace y by y.right, then replace z by y.

**TRANSPLANT(T, u, v):** Replaces subtree rooted at u with subtree rooted at v. Updates u's parent to point to v. Does NOT update v.left or v.right.

### Theorem 12.3
**Statement:** INSERT and DELETE each run in **O(h)** on a BST of height h.

---

## 12.4 Randomly Built BSTs

**Definition:** A randomly built BST on n keys = insert keys in uniformly random order (each of the n! permutations equally likely).

### Theorem 12.4
**Statement:** The expected height of a randomly built BST on n distinct keys is **O(lg n)**.

**Proof sketch:**
- Define Xn = height, Yn = 2^Xn (exponential height).
- Let Rn = rank of root key. If Rn = i:
  - Left subtree: randomly built BST on i-1 keys.
  - Right subtree: randomly built BST on n-i keys.
  - Yn = 2 * max(Y_{i-1}, Y_{n-i})
- Using indicator variables Z_{n,i} = I{Rn = i}, E[Z_{n,i}] = 1/n.
- Derive recurrence: E[Yn] <= (4/n) * sum_{i=0}^{n-1} E[Yi]
- Solve by substitution: E[Yn] <= (1/4) * C(n+3, 3)
- Apply Jensen's inequality (f(x)=2^x is convex):
  - 2^{E[Xn]} <= E[2^Xn] = E[Yn] <= (1/4)*C(n+3,3)
  - = (n^3 + 6n^2 + 11n + 6)/24
- Taking log: **E[Xn] = O(lg n)**. QED.

**Key identity used (12.3):**
sum_{i=0}^{n-1} C(i+3, 3) = C(n+3, 4)

---

## Chapter 12 Key Facts for Exam

- BST height h: operations are O(h). Worst case h = n-1 (sorted input). Best case h = floor(lg n).
- Inorder walk = sorted order. Time = Theta(n).
- Deletion is the most complex operation; uses TRANSPLANT subroutine.
- Randomly built BST has expected height O(lg n), analogous to quicksort.
- BST construction from n elements requires Omega(n lg n) comparisons in worst case (since inorder walk would sort, violating Omega(n lg n) lower bound for comparison-based sorting).
- If n items inserted in strictly increasing order: chain of height n-1 (worst case).
- Exercise 12.2-1 check: search path must be monotonically constrained -- once you go left (visiting a node with key < current), all future visited keys must be < that node. Sequence (c) 925,202,911,240,912,245,363 is invalid because after 240 you visit 912 > 240 but you went left from 911; contradiction.
- Exercise 12.2-8: k successive TREE-SUCCESSOR calls from any starting node take O(k+h) total time.
- Exercise 12.1-5: constructing a BST from n elements takes Omega(n lg n) in worst case.

---

---

# CHAPTER 13: Red-Black Trees

## 13.1 Red-Black Properties

A red-black tree is a BST with one extra bit per node (color: RED or BLACK) satisfying:

| Property | Statement |
|---|---|
| 1 | Every node is RED or BLACK. |
| 2 | The root is BLACK. |
| 3 | Every leaf (NIL) is BLACK. |
| 4 | If a node is RED, both its children are BLACK. (No two consecutive red nodes.) |
| 5 | For each node, all simple paths from the node to descendant leaves contain the same number of BLACK nodes. |

**Black-height bh(x):** Number of black nodes on any simple path from x (not including x) down to a leaf.

**Sentinel T.nil:** Single sentinel object representing all NILs. Color = BLACK. All leaf pointers and root's parent point to T.nil.

### Lemma 13.1 - Height Bound
**Statement:** A red-black tree with n internal nodes has height **h <= 2 lg(n+1)**.

**Proof:**
- **Claim:** Subtree rooted at x contains at least 2^{bh(x)} - 1 internal nodes.
  - Base: x is a leaf (T.nil), bh = 0, subtree has 0 = 2^0 - 1 nodes. Holds.
  - Inductive: x has two children, each with black-height bh(x) or bh(x)-1 (depending on color).
    - Each child has at least 2^{bh(x)-1} - 1 internal nodes.
    - Subtree at x has at least (2^{bh(x)-1}-1) + (2^{bh(x)-1}-1) + 1 = 2^{bh(x)} - 1 nodes. Holds.
- By property 4: at least half the nodes on any root-to-leaf path (excluding root) must be BLACK.
  - => bh(root) >= h/2
- From claim: n >= 2^{h/2} - 1
  - => lg(n+1) >= h/2
  - => **h <= 2 lg(n+1)**. QED.

**Consequence:** All of SEARCH, MINIMUM, MAXIMUM, SUCCESSOR, PREDECESSOR run in **O(lg n)** on a red-black tree.

---

## 13.2 Rotations

Rotations preserve the BST property. Run in **O(1)** (only pointer changes).

### LEFT-ROTATE(T, x)
- Precondition: x.right != T.nil
- y = x.right
- x.right = y.left; if y.left != T.nil: y.left.p = x
- y.p = x.p; update parent's child pointer to y
- y.left = x; x.p = y
- Result: y becomes the new subtree root, x becomes y's left child.

### RIGHT-ROTATE(T, y)
- Symmetric to LEFT-ROTATE.

**Key fact:** In any n-node BST, there are exactly **n-1** possible rotations (one per internal edge).

**Key fact:** Any n-node BST can be transformed into any other n-node BST using **O(n) rotations**.

---

## 13.3 RB-INSERT

### Algorithm
1. Insert z as in ordinary BST (using T.nil instead of NIL).
2. Set z.left = z.right = T.nil.
3. Color z **RED**.
4. Call RB-INSERT-FIXUP(T, z) to restore red-black properties.

**Why color z RED (not BLACK)?**
Inserting BLACK would violate property 5 on every path through z (increases black-height). Inserting RED can only violate property 2 (if z is root) or property 4 (if z's parent is red) -- both easier to fix.

### RB-INSERT-FIXUP - Loop Invariant
At start of each iteration:
- (a) z is RED.
- (b) If z.p is root, z.p is BLACK.
- (c) At most one property is violated: either property 2 (z is root and red) or property 4 (z and z.p are both red).

### RB-INSERT-FIXUP - Cases
(Assuming z.p is a LEFT child of z.p.p -- symmetric cases exist for right child)

**Case 1: z's uncle y is RED**
- Action: Color z.p and y BLACK; color z.p.p RED; set z = z.p.p (move up 2 levels).
- Effect: Pushes the violation up the tree.

**Case 2: z's uncle y is BLACK, z is a RIGHT child**
- Action: z = z.p; LEFT-ROTATE(T, z).
- Effect: Transforms into Case 3.
- Cases 2 and 3 are not mutually exclusive (2 falls through to 3).

**Case 3: z's uncle y is BLACK, z is a LEFT child**
- Action: Color z.p BLACK; color z.p.p RED; RIGHT-ROTATE(T, z.p.p).
- Effect: Loop terminates (z.p is now black).

**After loop:** Set T.root.color = BLACK (fixes potential property 2 violation).

### RB-INSERT Analysis
- BST insertion: O(lg n)
- FIXUP: while loop repeats only in Case 1 (z moves up 2 levels). Total iterations: O(lg n).
- **At most 2 rotations** performed (Cases 2 and 3, each at most once).
- **Total: O(lg n)**

---

## 13.4 RB-DELETE

### Algorithm
Extends TREE-DELETE. Key additions:
- Track node y (node removed or moved) and its original color.
- Track node x (moves into y's original position).
- If y-original-color == BLACK: call RB-DELETE-FIXUP(T, x).

**RB-TRANSPLANT** differs from TRANSPLANT: assigns v.p = u.p unconditionally (even if v = T.nil).

**Why only fixup when y was BLACK?**
If y was RED:
1. No black-heights changed.
2. No two red nodes become adjacent (y takes z's color).
3. Root remains black (y was not root if it was red).

If y was BLACK: can violate properties 2, 4, 5. We conceptually give x an "extra black." x is now "doubly black" (if originally BLACK) or "red-and-black" (if originally RED).

### RB-DELETE-FIXUP - Goal
Move the extra black up the tree until:
1. x is a "red-and-black" node (color it singly BLACK, done), or
2. x is the root (remove the extra black, done), or
3. Rotations/recolorings fix everything and loop exits.

### RB-DELETE-FIXUP - Cases
(x is a LEFT child; symmetric cases for right child)

Let w = x's sibling.

**Case 1: w is RED**
- w must have BLACK children (property 4).
- Action: Color w BLACK; color x.p RED; LEFT-ROTATE(T, x.p); w = x.p.right.
- Effect: Converts to Case 2, 3, or 4. (w is now black.)

**Case 2: w is BLACK, both w's children are BLACK**
- Action: Color w RED; x = x.p (move extra black up).
- Effect: x.p absorbs the extra black. If x.p was RED (red-and-black), loop terminates on next check.

**Case 3: w is BLACK, w.left is RED, w.right is BLACK**
- Action: Color w.left BLACK; color w RED; RIGHT-ROTATE(T, w); w = x.p.right.
- Effect: Converts to Case 4. (w now has a red right child.)

**Case 4: w is BLACK, w.right is RED**
- Action: w.color = x.p.color; color x.p BLACK; color w.right BLACK; LEFT-ROTATE(T, x.p); x = T.root.
- Effect: Loop terminates. Extra black is removed.

### RB-DELETE Analysis
- Without fixup: O(lg n)
- Fixup: Cases 1, 3, 4 terminate after O(1) rotations. Only Case 2 repeats (x moves up).
- **At most 3 rotations** total.
- **Total: O(lg n)**

---

## Chapter 13 Key Facts for Exam

### Property Violations on Insert
- Inserting z (colored RED) can only violate: **property 2** (z is root) or **property 4** (z.p is red).
- Properties 1, 3, 5 are never violated by RB-INSERT.

### Property Violations on Delete
- Removing a BLACK node can violate: **properties 1, 2, 4, 5**.
- Removing a RED node violates nothing.

### Rotation Count Bounds
| Operation | Max Rotations |
|---|---|
| RB-INSERT | 2 |
| RB-DELETE | 3 |

### Height Bounds (Red-Black)
| Quantity | Bound |
|---|---|
| Height h | h <= 2 lg(n+1) |
| Black-height bh | bh >= h/2 |
| Min internal nodes for bh=k | 2^k - 1 |
| Max internal nodes for bh=k | 4^k - 1 (alternating red/black) |

### Ratio of Red to Black Nodes
- **Max ratio (red:black):** 1:1 (alternating levels). Largest possible ratio is **1** (equal counts).
- **Min ratio:** 0 (all black nodes only).

### Other Structures Mentioned
- **AVL trees:** Height-balanced; |left.h - right.h| <= 1 per node. Height O(lg n). Covered in Problem 13-3.
- **Treaps:** BST property on keys + min-heap property on random priorities. Expected height Theta(lg n). Expected rotations per insert < 2.
- **Persistent BSTs:** Copy only O(h) nodes per insert/delete by sharing unchanged subtrees. O(lg n) time/space with red-black trees.
- **Skip lists:** Alternative to balanced BSTs. Expected O(lg n) per operation.

### Key Comparisons: BST vs RB-Tree
| Property | BST | Red-Black Tree |
|---|---|---|
| Height (worst) | O(n) | O(lg n) |
| Search | O(h) | O(lg n) |
| Insert | O(h) | O(lg n) |
| Delete | O(h) | O(lg n) |
| Insert rotations | 0 | <= 2 |
| Delete rotations | 0 | <= 3 |

---

## Exercises Worth Knowing

### Ch12
- **12.1-2:** Min-heap property cannot sort in O(n) -- it doesn't order left/right children relative to each other, only parent-child.
- **12.1-5:** Building a BST from n elements: Omega(n lg n) worst case (inorder walk = free sort => violates lower bound).
- **12.2-5:** If node has two children, its successor has no left child; its predecessor has no right child.
- **12.2-8:** k successive TREE-SUCCESSOR calls: O(k+h) total.
- **12.3-4:** Deletion is NOT commutative (delete x then y != delete y then x in general).
- **12.3-3:** Tree-sort (insert + inorder walk): O(n^2) worst case, O(n lg n) best case.

### Ch13
- **13.1-5:** Longest root-to-leaf path <= 2x shortest root-to-leaf path (due to property 4 and 5).
- **13.1-6:** Max internal nodes with black-height k: 4^k - 1. Min: 2^k - 1.
- **13.2-2:** Exactly n-1 rotations possible in n-node BST.
- **13.3-1:** Coloring z BLACK on insert would violate property 5 on every path through z.
- **13.4-7:** Insert then immediately delete does NOT necessarily yield the same tree (recolorings may differ).

---

## Quick Pseudocode Recall

### TREE-SUCCESSOR(x)
```
if x.right != NIL
    return TREE-MINIMUM(x.right)
y = x.p
while y != NIL and x == y.right
    x = y
    y = y.p
return y
```

### RB-INSERT-FIXUP Cases (z.p is left child branch)
```
y = z.p.p.right  (uncle)
if y.color == RED          --> Case 1: recolor, z = z.p.p
else
    if z == z.p.right      --> Case 2: z = z.p, LEFT-ROTATE
    z.p.color = BLACK      --> Case 3: recolor, RIGHT-ROTATE(z.p.p)
    z.p.p.color = RED
    RIGHT-ROTATE(T, z.p.p)
```

### RB-DELETE-FIXUP Cases (x is left child branch)
```
w = x.p.right  (sibling)
if w.color == RED                           --> Case 1: rotate, new w
if w.left.color==BLACK and w.right.color==BLACK  --> Case 2: w=RED, x=x.p
else
    if w.right.color == BLACK               --> Case 3: rotate, new w
    w.color = x.p.color                     --> Case 4: recolor, rotate, done
    x.p.color = BLACK
    w.right.color = BLACK
    LEFT-ROTATE(T, x.p)
    x = T.root
```

---

*Source: CLRS 3rd Edition, Chapters 12-13*
