# Topic 19: Graph Representations

**[3 marks each for MCQs, rest as specified]**

---

**Q1. [3 marks]** Consider a directed graph G = (V, E) with |V| = n and |E| = m represented as an adjacency list. Which of the following operations has the worst-case time complexity that DIFFERS between the adjacency-list and adjacency-matrix representations?

(A) Checking whether edge (u, v) exists (B) Listing all vertices in V (C) Finding the in-degree of a vertex u in a directed graph (D) Both (A) and (C)

---

**Q2. [3 marks]** Let G be an undirected graph with n vertices and m edges, represented using an adjacency matrix. The transpose G^T (reverse all edges) can be computed in:

(A) O(1), since the adjacency matrix is symmetric for undirected graphs (B) O(n + m) (C) O(n^2) (D) O(m log n)

---

**Q3. [3 marks]** You are given the following adjacency-matrix representation of a graph G:

```
  1 2 3 4
1[0 1 0 1]
2[0 0 1 0]
3[0 0 0 1]
4[0 0 1 0]
```

Which of the following is TRUE?

(A) G is undirected and has 4 edges (B) G is directed and has a cycle (C) G is directed, acyclic, and has 5 edges (D) G is undirected and has no cycles

---

**Q4. [6 marks]** Consider a directed graph G = (V, E) where V = {1, 2, 3, 4, 5} and the edge list is: (1,2), (1,3), (2,4), (3,2), (4,5), (5,3).

(a) **[3 marks]** Draw the adjacency-list representation of G. Compute |E| and the sum of all adjacency-list lengths. State the general relationship between the two for directed graphs.

(b) **[3 marks]** Write the adjacency matrix of G. What is the space complexity of the adjacency-matrix representation in terms of |V| and |E|? In what graph-density regime is the adjacency matrix wasteful, and why?

---

**Q5. [4 marks]** A DAG (Directed Acyclic Graph) G has vertex set V = {a, b, c, d, e} and edge set E = {(a,b), (a,c), (b,d), (c,d), (d,e)}.

(a) **[2 marks]** Draw the adjacency-list representation. For each vertex, list the out-degree and in-degree.

(b) **[2 marks]** Using the adjacency matrix, show how to compute the number of paths of length exactly 2 from vertex a to every other vertex. State the general result for paths of length k.

---

**Q6. [5 marks]** Consider the following claim: _"For a sparse graph with |E| = O(|V|), the adjacency-list representation uses asymptotically less space than the adjacency-matrix representation."_

(a) **[2 marks]** Prove or disprove this claim with an asymptotic argument.

(b) **[3 marks]** Now suppose you need to support the operation: _"Given vertex u, find all vertices v such that edge (v, u) exists"_ (i.e., find all predecessors of u). Compare the time complexity of this operation under both representations for a directed graph. Which representation is better, and by how much?

---

**Q7. [3 marks]** Which of the following is FALSE about weighted graph representations?

(A) In an adjacency list, edge weights can be stored as additional fields in the list nodes. (B) In an adjacency matrix W, W[i][j] = infinity represents no edge from i to j. (C) For a weighted directed graph with n vertices and m edges, the adjacency-list representation uses Theta(n + m) space regardless of edge weights. (D) The adjacency-matrix representation of a weighted undirected graph is always symmetric, so the transpose operation changes W[i][j] for i != j.

---

**Q8. [4 marks]** Suppose G = (V, E) is a directed multigraph (multiple edges allowed between the same pair of vertices). You want to represent it such that:

- You can iterate over all edges from a vertex u in O(out-degree(u)) time.
- You can determine whether at least one edge from u to v exists in O(1) time.

(a) **[2 marks]** Show that neither a pure adjacency list nor a pure adjacency matrix achieves both goals simultaneously on general graphs.

(b) **[2 marks]** Propose a hybrid data structure that achieves both. State its space complexity.

---

**Q9. [3 marks]** Let A be the adjacency matrix of an undirected graph G. Consider the matrix product B = A^2. Which of the following correctly describes B[i][i] (the diagonal entries)?

(A) B[i][i] = degree(i) for all i (B) B[i][i] = degree(i)^2 for all i (C) B[i][i] = the number of triangles containing vertex i (D) B[i][i] = the number of walks of length 2 from i back to i, which equals degree(i)

---

**Q10. [5 marks]** You are given two graph representations of the same undirected graph G:

- An adjacency list Adj
- An adjacency matrix M

Both are for G with n = 6 vertices. Adj[3] = {1, 4, 5}. M[3][2] = 1.

(a) **[2 marks]** Write all edges incident to vertex 3 using both representations. Are the two representations consistent with each other? If not, identify the discrepancy. (Assume 1-indexed.)

(b) **[3 marks]** You are now told G is undirected and the total number of edges is 7. What is the sum of all adjacency list lengths? How many entries equal 1 in the adjacency matrix (excluding diagonal)? Using these, verify the formula relating the two.

---

---

# Topic 20: BFS and DFS

---

**Q11. [3 marks]** BFS is run on an undirected graph G starting from source s. Which of the following is always TRUE?

(A) The BFS tree is unique regardless of adjacency list ordering (B) For any vertex v reachable from s, d[v] = delta(s, v), the true shortest-path distance in terms of edge count (C) BFS runs in O(V) time when the graph is represented as an adjacency matrix (D) A vertex can be enqueued more than once during BFS

---

**Q12. [3 marks]** DFS is run on a directed graph G. Which of the following about DFS timestamps d[v] (discovery) and f[v] (finish) is FALSE?

(A) For any two vertices u and v, their timestamp intervals are either completely disjoint or one is nested inside the other (Parenthesis Theorem) (B) v is an ancestor of u in the DFS forest if and only if d[v] < d[u] < f[u] < f[v] (C) If (u, v) is a back edge, then d[v] < d[u] < f[u] < f[v] (D) If (u, v) is a cross edge, then d[u] < d[v] < f[v] < f[u]

---

**Q13. [7 marks]** Consider the directed graph G with vertices {a, b, c, d, e, f} and edges: (a,b), (a,d), (b,c), (c,a), (d,e), (e,f), (f,d), (b,e).

Adjacency list order (alphabetical within each list).

(a) **[3 marks]** Run DFS on G starting from vertex a (then b, c, ... in order for unvisited). Record d[v] and f[v] for all vertices. Show the DFS forest.

(b) **[2 marks]** Classify every edge as Tree, Back, Forward, or Cross edge. Show your reasoning using timestamps.

(c) **[2 marks]** Does G contain a cycle? Identify all cycles using only your edge classification from (b). What is the general theorem that connects back edges and cycles in directed graphs?

---

**Q14. [6 marks]** Run BFS on the following undirected graph G starting from vertex 1. Vertices: {1,2,3,4,5,6}. Edges: (1,2),(1,3),(2,4),(2,5),(3,5),(4,6),(5,6). Adjacency lists are in increasing order.

(a) **[3 marks]** Show the state of the queue and the d[] and pi[] arrays after each dequeue operation. Present as a table with columns: dequeued vertex, queue after dequeue, updated d[] values, updated pi[] values.

(b) **[2 marks]** Draw the BFS tree. List all shortest-path distances d[v] from source 1.

(c) **[1 mark]** Is the BFS tree unique for this graph and source? Briefly justify.

---

**Q15. [3 marks]** Which of the following is TRUE about DFS on an UNDIRECTED graph?

(A) Cross edges can occur in DFS on undirected graphs (B) Forward edges can occur in DFS on undirected graphs (C) Every non-tree edge in DFS on an undirected graph is a back edge (D) DFS on an undirected graph always produces a single DFS tree (connected or not)

---

**Q16. [4 marks]** Consider DFS on a directed graph. Prove the following:

**Claim:** Edge (u, v) is a back edge if and only if v is gray (currently being explored) when (u, v) is examined.

Your proof must use the formal definition of DFS colors (white/gray/black) and DFS timestamps. You must prove both directions of the "if and only if."

---

**Q17. [5 marks]** You are given the BFS tree produced by running BFS from source s on an undirected graph G. A fellow student claims: _"If edge (u, v) is NOT in the BFS tree and both u and v are at the same BFS level, then d[u] = d[v] and |d[u] - d[v]| = 0, so BFS shortest path estimates are still correct even if we ignore this edge."_

(a) **[2 marks]** Is the student's claim about d[u] = d[v] for same-level non-tree edges always true? Prove or give a counterexample.

(b) **[3 marks]** More generally, prove that for any non-tree edge (u, v) in BFS on an undirected graph, |d[u] - d[v]| <= 1. Use the BFS algorithm properties and the definition of d[] values.

---

**Q18. [3 marks]** DFS is run on a DAG G. Let f[v] denote the finish time of vertex v. Which of the following is TRUE?

(A) If (u, v) is an edge in G, then f[u] < f[v] (B) If (u, v) is an edge in G, then f[u] > f[v] (C) Vertices can be topologically sorted by increasing finish time (D) Both (B) and (C) are correct, but (A) is false only when u = v

---

**Q19. [6 marks]** Consider STACK-SORT (from Q14 in your midsem) as a conceptual cousin of DFS. Now consider the following modified DFS that uses an explicit stack instead of recursion:

```
ITERATIVE-DFS(G, s)
1. for each vertex u: color[u] = WHITE
2. S = empty stack
3. push(S, s), color[s] = GRAY
4. while S is not empty
5.   u = top(S)
6.   if there exists a white neighbor v of u (in adj list order)
7.     color[v] = GRAY
8.     push(S, v)
9.   else
10.    pop(S)
11.    color[u] = BLACK
```

(a) **[3 marks]** Does ITERATIVE-DFS produce identical discovery and finish orders as recursive DFS? Prove your answer or give a counterexample with a specific graph and adjacency list ordering.

(b) **[3 marks]** What is the time complexity of ITERATIVE-DFS on a graph G = (V, E) represented as an adjacency list? Justify carefully - in particular, argue about how many times each vertex can be on top of the stack.

---

**Q20. [5 marks]** Let G = (V, E) be a connected undirected graph. Prove that G is bipartite if and only if BFS from any source s produces no "same-level" edges that connect two vertices of the same color in the 2-coloring produced by BFS layers (even layers = color A, odd layers = color B).

Formally: (a) **[2 marks]** Prove: if G is bipartite, then no edge connects two vertices at the same BFS level. (b) **[3 marks]** Prove: if BFS produces no same-level edges (i.e., all non-tree edges connect adjacent BFS levels), then G is bipartite. Construct the explicit 2-coloring and prove it is valid.

---

A few notes on difficulty:

- Q16 and Q20 are proof-heavy and will separate students who have actually understood the material from those who memorized.
- Q13 is a full DFS trace + classification - typically where partial credit gets lost on missing a cross edge.
- Q19 is a trap: iterative DFS does NOT always produce identical ordering as recursive DFS depending on implementation - make sure you work this out before the exam.
- Q4(b) and Q6(b) will catch you if you have fuzzy intuitions about when adjacency matrix is actually better.

Let me work through all 20 solutions carefully.

---

# Solutions: Topic 19 - Graph Representations

---

**Q1. Answer: (D)**

- Checking edge (u,v): adj-list = O(degree(u)), adj-matrix = O(1). DIFFERS.
- Listing all vertices: O(n) for both. SAME.
- Finding in-degree of u in a directed graph: adj-list = O(V + E) (must scan all lists), adj-matrix = O(V) (scan column u). DIFFERS.

So both (A) and (C) differ. Answer: **(D)**.

---

**Q2. Answer: (A)**

For an undirected graph, the adjacency matrix is symmetric by definition: A[i] [j] = A[j] [i] for all i,j. Therefore G^T has the exact same adjacency matrix as G. No computation needed. Answer: **(A)**.

---

**Q3. Answer: (B)**

The matrix is not symmetric (e.g. A[1][2]=1 but A[2][1]=0), so G is directed. Check for cycles: 2->3->4->3 is a cycle (A[2][3]=1, A[3][4]=1, A[4][3]=1). Edge count: count all 1s = positions (1,2),(1,4),(2,3),(3,4),(4,3) = 5 edges, but we need to check for cycle first. Cycle 3->4->3 exists. Answer: **(B)**.

---

**Q4.**

**(a)** Adjacency lists:

```
1: -> 2 -> 3
2: -> 4
3: -> 2
4: -> 5
5: -> 3
```

|E| = 6. Sum of all adjacency list lengths = 6.

General relationship for directed graphs: sum of all adjacency list lengths = |E|. Each directed edge (u,v) contributes exactly once, to Adj[u].

**(b)** Adjacency matrix (rows/cols = vertices 1..5):

```
  1 2 3 4 5
1[0 1 1 0 0]
2[0 0 0 1 0]
3[0 1 0 0 0]
4[0 0 0 0 1]
5[0 0 1 0 0]
```

Space complexity: Theta(V^2), regardless of |E|.

The adjacency matrix is wasteful when the graph is sparse, i.e., |E| << |V|^2 (e.g., |E| = O(|V|)). In that case, most matrix entries are 0, wasting Theta(V^2) space when Theta(V + E) = Theta(V) would suffice with adjacency lists.

---

**Q5.**

**(a)**

```
a: -> b -> c
b: -> d
c: -> d
d: -> e
e: (empty)
```

|Vertex|Out-degree|In-degree|
|---|---|---|
|a|2|0|
|b|1|1|
|c|1|1|
|d|1|2|
|e|0|1|

**(b)** Adjacency matrix A (order a,b,c,d,e):

```
  a b c d e
a[0 1 1 0 0]
b[0 0 0 1 0]
c[0 0 0 1 0]
d[0 0 0 0 1]
e[0 0 0 0 0]
```

B = A^2. B[i][j] = number of paths of length exactly 2 from i to j.

Row a of B: a can reach b,c in 1 step. b reaches d, c reaches d. So B[a][d] = 2 (via b and via c), all other entries in row a = 0.

General result: (A^k)[i][j] = number of walks of length exactly k from vertex i to vertex j.

---

**Q6.**

**(a)** Adjacency list space: Theta(V + E). For sparse graph with |E| = O(|V|), this is Theta(V). Adjacency matrix space: Theta(V^2) always.

Since Theta(V) = o(V^2), the adjacency list uses asymptotically less space. Claim is TRUE.

**(b)** Operation: find all predecessors of u (all v such that edge (v,u) exists).

- Adjacency list: Must scan ALL adjacency lists of ALL vertices to find who points to u. Time = O(V + E). There is no direct predecessor index unless you build a separate reverse-adjacency list.
- Adjacency matrix: Scan column u. Time = O(V).

For this specific operation, the adjacency matrix is better by a factor of Theta(E/V) in sparse graphs and up to Theta(V) in the worst case (dense graphs where E = Theta(V^2) makes both O(V^2) equivalent). For general sparse graphs with E >> V, the matrix wins here: O(V) vs O(V+E).

---

**Q7. Answer: (D)**

(A) TRUE - standard weighted adj list stores (neighbor, weight) pairs. (B) TRUE - standard convention for "no edge" in a weight matrix. (C) TRUE - adjacency list space is Theta(V + E) regardless of whether you store extra weight fields (constants don't affect asymptotics). (D) FALSE. For a weighted undirected graph, W[i][j] = W[j][i] always (symmetry). The transpose is identical to the original - W^T = W. So the transpose operation changes NOTHING. (D) is false because it claims entries change.

Answer: **(D)**.

---

**Q8.**

**(a)**

- Pure adjacency list: iterating edges from u in O(out-degree(u)) - YES. But checking whether at least one edge (u,v) exists requires scanning u's list: O(out-degree(u)) in worst case, not O(1). FAILS second goal.
- Pure adjacency matrix: O(1) edge existence check - YES. But iterating all edges from u requires scanning the entire row: O(V), not O(out-degree(u)) for sparse graphs. FAILS first goal.

Neither achieves both simultaneously in general.

**(b)** Hybrid: Use an adjacency list for iteration + a hash set per vertex for O(1) lookup.

```
For each vertex u:
  - Adj[u]: linked list of neighbors (for iteration)
  - AdjSet[u]: hash set of neighbors (for O(1) existence check)
```

- Iterate from u: O(out-degree(u)) via Adj[u]. CHECK.
- Check edge (u,v): O(1) expected via AdjSet[u].contains(v). CHECK.

Space complexity: Theta(V + E) for both structures combined (each edge stored twice - once in list, once in set).

---

**Q9. Answer: (D)**

B = A^2. B[i][i] = sum over all k of A[i][k] * A[k][i].

For an undirected graph, A[i][k] = A[k][i]. So B[i][i] = sum_k (A[i][k])^2 = sum_k A[i][k] (since A[i][k] is 0 or 1, squaring doesn't change it) = degree(i).

This counts walks of length 2 from i back to i: go from i to some neighbor k (A[i][k]=1), then return from k to i (A[k][i]=1). The number of such walks = degree(i).

Note: (C) is wrong - triangles through i are counted by (A^3)[i][i]/2, not A^2. (A) states the correct value but misidentifies what it counts. (D) correctly states both the value AND the correct interpretation.

Answer: **(D)**.

---

**Q10.**

**(a)** From Adj[3] = {1, 4, 5}: edges incident to vertex 3 are (3,1), (3,4), (3,5). From M[3][2] = 1: edge (3,2) exists.

Since G is undirected, M[2][3] must also = 1. But Adj[3] = {1,4,5} does not contain vertex 2.

The two representations are INCONSISTENT. M[3][2] = 1 implies edge (3,2) exists, but this edge is absent from Adj[3]. Either the matrix has a spurious entry, or the adjacency list is missing vertex 2.

**(b)** For an undirected graph with n vertices and m edges:

- Sum of all adjacency list lengths = 2m = 2 x 7 = **14**.
- Number of 1-entries in the adjacency matrix (excluding diagonal) = 2m = **14** (each undirected edge (u,v) contributes M[u][v]=1 and M[v][u]=1).

Verification of formula: Sum of adjacency list lengths = number of 1-entries in adjacency matrix (off-diagonal) = 2|E|.

Both equal 14 here, confirming the relationship.

---

---

# Solutions: Topic 20 - BFS and DFS

---

**Q11. Answer: (B)**

(A) FALSE - BFS tree depends on adjacency list ordering. Different orderings yield different trees. (B) TRUE - This is the core BFS correctness theorem (CLRS Theorem 22.5): BFS correctly computes shortest-path distances. (C) FALSE - BFS on an adjacency matrix runs in O(V^2) because checking all neighbors of a vertex takes O(V) time per vertex. (D) FALSE - BFS colors vertices gray when first discovered and enqueues them. A vertex is enqueued exactly once (when it transitions from WHITE to GRAY) and never re-enqueued.

Answer: **(B)**.

---

**Q12. Answer: (D)**

(A) TRUE - Parenthesis Theorem, proven in CLRS. (B) TRUE - definition of ancestor using timestamps. (C) TRUE - if (u,v) is a back edge, v is an ancestor of u, so d[v] < d[u], and u finishes before v: d[v] < d[u] < f[u] < f[v]. Correct. (D) FALSE. For a cross edge (u,v) in a directed graph, v is already BLACK when u discovers it, meaning v was discovered and finished before u discovered v. So: d[v] < f[v] < d[u] < f[u]. The statement in (D) claims d[u] < d[v] < f[v] < f[u], which would make v a descendant of u - that would be a tree/forward edge, NOT a cross edge.

Answer: **(D)**.

---

**Q13.**

Graph: V = {a,b,c,d,e,f}, E = {(a,b),(a,d),(b,c),(c,a),(d,e),(e,f),(f,d),(b,e)}.

Adjacency lists (alphabetical):

```
a: b, d
b: c, e
c: a
d: e
e: f
f: d
```

**(a) DFS from a (global order: a,b,c,d,e,f for unvisited)**

Use timer starting at 1.

- Visit a: d[a]=1. Explore b.
    - Visit b: d[b]=2. Explore c.
        - Visit c: d[c]=3. Explore a. a is GRAY -> back edge. c done: f[c]=4.
    - b: next neighbor e.
        - Visit e: d[e]=5. Explore f.
            - Visit f: d[f]=6. Explore d.
                - Visit d: d[d]=7. Explore e. e is GRAY -> back edge. d done: f[d]=8.
            - f done: f[f]=9.
        - e done: f[e]=10.
    - b done: f[b]=11.
- a: next neighbor d. d is BLACK -> cross/forward edge.
- a done: f[a]=12.

Timestamps:

|Vertex|d|f|
|---|---|---|
|a|1|12|
|b|2|11|
|c|3|4|
|d|7|8|
|e|5|10|
|f|6|9|

DFS Forest: single tree rooted at a.

```
a -> b -> c
     b -> e -> f -> d
```

**(b) Edge classification:**

|Edge|d[u], d[v], f[v], f[u]|Classification|
|---|---|---|
|(a,b)|d[a]=1 < d[b]=2, b descendant of a|Tree|
|(a,d)|d[a]=1, d[d]=7, f[d]=8 < f[a]=12, d descendant of a|Forward|
|(b,c)|d[b]=2 < d[c]=3, c descendant of b|Tree|
|(c,a)|d[a]=1 < d[c]=3, a is ancestor, a still GRAY at d[c]|Back|
|(b,e)|d[b]=2 < d[e]=5, e descendant of b|Tree|
|(d,e)|d[e]=5 < d[d]=7: e discovered before d, f[e]=10 > f[d]=8, so e is not ancestor of d, and d[e]<d[d] with f[e]>f[d] ... wait, let me recheck.||

Recheck (d,e): d[d]=7, d[e]=5, f[e]=10, f[d]=8. d[e]=5 < d[d]=7 < f[d]=8 < f[e]=10. So e's interval [5,10] contains d's interval [7,8]. That means e is an ANCESTOR of d. But the edge goes (d,e), from d to its ancestor e. That makes it a **Back edge**.

Wait - but e was discovered via b->e before d was ever visited. Let me recheck the DFS trace.

When we visit d (d[d]=7), we explore d's neighbor e. At that point, e has d[e]=5, f[e]=10... but f[e]=10 means e is not yet finished when d is visited (timer is at 7 when d is discovered, f[e] is assigned later).

Actually e is GRAY when d visits it (e was discovered at 5, finished at 10, and d is discovered at 7 which is between 5 and 10). So e is gray when (d,e) is examined -> **Back edge**.

|Edge|Classification|Reasoning|
|---|---|---|
|(a,b)|Tree|b white when examined|
|(a,d)|Forward|d is BLACK descendant of a when examined (d[a]<d[d]<f[d]<f[a])|
|(b,c)|Tree|c white when examined|
|(c,a)|Back|a is GRAY when examined (ancestor of c)|
|(b,e)|Tree|e white when examined|
|(d,e)|Back|e is GRAY when examined (e is ancestor of d)|
|(e,f)|Tree|f white when examined|
|(f,d)|Back|d is GRAY when examined (d is ancestor of f)|

**(c) Cycles:**

Yes, G contains cycles. Back edges directly indicate cycles (CLRS Theorem 22.11: a directed graph has a cycle iff DFS produces a back edge).

Cycles identified:

- (c,a) back edge -> cycle: a -> b -> c -> a
- (d,e) back edge and (f,d) back edge -> cycle: d -> e -> f -> d

General theorem: A directed graph G is acyclic if and only if DFS of G produces no back edges.

---

**Q14.**

Graph: V={1..6}, E={(1,2),(1,3),(2,4),(2,5),(3,5),(4,6),(5,6)}. Adj lists (increasing order):

```
1: 2,3  |  2: 1,4,5  |  3: 1,5  |  4: 2,6  |  5: 2,3,6  |  6: 4,5
```

BFS from source s=1.

Initial: d[1]=0, d[all others]=inf, pi[all]=NIL. Queue: [1]. Color[1]=GRAY.

**(a) BFS trace:**

|Dequeued|Queue after|Newly discovered (d, pi updates)|
|---|---|---|
|1|[2,3]|d[2]=1,pi[2]=1; d[3]=1,pi[3]=1|
|2|[3,4,5]|d[4]=2,pi[4]=2; d[5]=2,pi[5]=2 (1 already BLACK, skip)|
|3|[4,5,6]...|wait - 3's neighbors: 1 (BLACK, skip), 5 (already GRAY, skip). Nothing new. Queue stays [4,5]|
|4|[5,6]|d[6]=3,pi[6]=4 (2 already BLACK)|
|5|[6]|2 BLACK skip, 3 BLACK skip, 6 already GRAY skip. Nothing new.|
|6|[]|4 BLACK skip, 5 BLACK skip. Done.|

Final d[]: d[1]=0, d[2]=1, d[3]=1, d[4]=2, d[5]=2, d[6]=3. Final pi[]: pi[1]=NIL, pi[2]=1, pi[3]=1, pi[4]=2, pi[5]=2, pi[6]=4.

**(b) BFS tree:**

```
        1
       / \
      2   3
     / \
    4   5
    |
    6
```

Shortest distances: d[1]=0, d[2]=1, d[3]=1, d[4]=2, d[5]=2, d[6]=3.

**(c)** The BFS tree is NOT unique. For example, when processing vertex 4, its neighbor 6 gets d[6]=3 and pi[6]=4. But when we later process vertex 5, vertex 6 is already GRAY, so pi[6] stays 4. However, if adjacency lists were ordered differently (e.g., 5 was dequeued before 4), pi[6] could become 5. Different orderings yield different BFS trees with the same d[] values.

---

**Q15. Answer: (C)**

(A) FALSE - cross edges do NOT occur in DFS on undirected graphs. When DFS examines edge (u,v) and v is already discovered, v must be an ancestor of u (gray), making it a back edge. In undirected graphs, when you see a visited neighbor, it's always your ancestor.

(B) FALSE - forward edges also do NOT occur in DFS on undirected graphs. A forward edge (u,v) means v is a descendant of u already colored BLACK. But in undirected graphs, when DFS first processed v, it would have seen the edge (v,u) and classified it as a back edge from v to u. So the edge (u,v) would have already been classified as a back edge (u,v) = back edge (v,u), and cannot be a forward edge.

(C) TRUE. Every non-tree edge in an undirected DFS is a back edge.

(D) FALSE - if G is disconnected, DFS produces a DFS forest with multiple trees.

Answer: **(C)**.

---

**Q16.**

**Claim:** Edge (u,v) is a back edge iff v is GRAY when (u,v) is first examined.

**Proof (=>): If (u,v) is a back edge, then v is GRAY when (u,v) is examined.**

By definition, a back edge (u,v) means v is an ancestor of u in the DFS forest. Since v is an ancestor of u, DFS discovered v before u: d[v] < d[u]. DFS is currently exploring u (u is GRAY), which means we are inside the recursive call for v (since u is a descendant of v). Therefore v's recursive call has not yet returned, so f[v] has not been assigned yet, meaning v is still GRAY. Hence v is GRAY when (u,v) is examined.

**Proof (<=): If v is GRAY when (u,v) is examined, then (u,v) is a back edge.**

v is GRAY means v has been discovered but not yet finished: d[v] has been assigned but f[v] has not. Since u is currently being processed (we are examining u's adjacency list), u is also GRAY with d[u] assigned. We are in u's DFS call INSIDE v's DFS call (because v is still open/gray). This means v was discovered before u: d[v] < d[u]. By the DFS structure (specifically the Parenthesis Theorem), since d[v] < d[u] and v is still open when u is being processed, u's interval [d[u], f[u]] is nested inside v's interval [d[v], f[v]]. Therefore u is a descendant of v in the DFS forest, making v an ancestor of u. By definition, edge (u,v) going from a vertex to its ancestor is a **back edge**. QED.

---

**Q17.**

**(a)** The claim is TRUE for BFS: if (u,v) is a non-tree edge and u and v are at the same BFS level, then d[u] = d[v].

Proof: Suppose WLOG u is dequeued first (or simultaneously). When u is dequeued and we examine neighbor v: if d[v] = infinity, we would set d[v] = d[u]+1 and add (u,v) to the BFS tree - contradiction since (u,v) is a non-tree edge. So d[v] != infinity, meaning v was already discovered. Since we assumed they are at the same level, d[v] = d[u]. So yes, d[u] = d[v] holds.

However, the student's conclusion that "BFS is still correct even if we ignore this edge" is vacuously true since BFS already computed correct distances before examining this edge - the distances aren't affected by non-tree edges, they're determined when vertices are first discovered.

**(b) Proof that |d[u] - d[v]| <= 1 for any non-tree edge (u,v) in BFS on an undirected graph:**

Assume WLOG d[u] <= d[v] (if d[u] > d[v] just swap labels).

Since (u,v) is an edge in G, when u was dequeued and v was WHITE, BFS would have set d[v] = d[u]+1 (tree edge case). Since (u,v) is NOT a tree edge, v was NOT white when u processed it - v was already discovered.

v must have been discovered from some other vertex w with d[w] <= d[u] (since v was already in the queue or processed by the time u examined it, and BFS processes vertices in non-decreasing order of distance).

Therefore d[v] <= d[u] + 1.

Combined with our assumption d[u] <= d[v], we get: d[u] <= d[v] <= d[u] + 1, which gives |d[u] - d[v]| <= 1. QED.

---

**Q18. Answer: (B) - but the full correct answer requires both (B) and (C).**

Wait - re-reading the options: (D) says "Both (B) and (C) are correct, but (A) is false only when u=v."

Let me re-evaluate:

(A) FALSE. If (u,v) is an edge in a DAG and DFS processes u first, then v is discovered and finished inside u's call, so f[v] < f[u], not f[u] < f[v].

(B) TRUE. For a DAG, if (u,v) is an edge, v is a descendant of u (or at least finishes before u), so f[u] > f[v].

(C) TRUE. Topological sort by DECREASING finish time is correct (CLRS Theorem 22.12). Increasing finish time gives reverse topological order.

Wait - (C) says "increasing finish time" which is REVERSE topological order, making (C) FALSE. Topological sort uses DECREASING finish time.

So: (A) FALSE, (B) TRUE, (C) FALSE, (D) FALSE (since (C) is false).

Answer: **(B)**.

---

**Q19.**

**(a)** ITERATIVE-DFS does NOT always produce identical discovery/finish orders as recursive DFS.

Counterexample: Graph with vertices {1,2,3} and edges (1,2),(1,3). Adj[1]={2,3}.

Recursive DFS from 1:

- Discover 1, explore first neighbor 2: discover 2, no neighbors, finish 2. Back to 1, explore next neighbor 3: discover 3, finish 3. Finish 1.
- Discovery order: 1,2,3. Finish order: 2,3,1.

Iterative DFS from 1:

- Push 1. Top=1, first white neighbor=2, push 2.
- Top=2, no white neighbors, pop 2 (finish 2).
- Top=1, next white neighbor=3, push 3.
- Top=3, no white neighbors, pop 3 (finish 3).
- Pop 1 (finish 1).
- Discovery order: 1,2,3. Finish order: 2,3,1.

This matches! Let me try a case where it might not match.

Graph: {1,2,3}, edges (1,2),(1,3),(2,3). Adj[1]={2,3}, Adj[2]={3}, Adj[3]={}.

Recursive DFS: discover 1 -> discover 2 -> discover 3, finish 3, finish 2, finish 1. Order: 1,2,3.

Iterative DFS: Push 1. Top=1, first white neighbor=2, push 2. Top=2, first white neighbor=3, push 3. Top=3, no white neighbors, pop/finish 3. Top=2, next neighbor: 3 is BLACK, no more. Pop/finish 2. Top=1, next neighbor: 2 BLACK, 3 BLACK. Pop/finish 1. Order: 1,2,3.

Same again. The iterative version shown actually DOES replicate recursive DFS because it processes the FIRST unvisited neighbor at each step (not the full neighbor list), which mimics the recursive call stack exactly.

Actually the ITERATIVE-DFS given in Q19 is equivalent to recursive DFS in terms of discovery and finish order because: at each step, it finds the first white neighbor and pushes it (mimicking the first recursive call), and only pops when no white neighbors remain (mimicking return from recursion). This is structurally identical to recursive DFS.

**Conclusion: Yes, ITERATIVE-DFS as written produces identical discovery and finish orders as recursive DFS**, assuming "first white neighbor in adj list order" is the same in both.

Proof sketch: By induction on the call depth. At each step, the stack in ITERATIVE-DFS mirrors the recursion stack in recursive DFS exactly. The top of the stack is always the "currently active" vertex, which is the deepest recursive call. Finding the first white neighbor and pushing it = making the next recursive call. Popping when no white neighbors remain = returning from the recursive call. The bijection is exact.

**(b) Time complexity: O(V + E).**

Each vertex u is pushed onto the stack exactly once (when it turns GRAY). While u is on top of the stack, the algorithm scans neighbors until it finds a white one or exhausts the list.

Key concern: does each adjacency list entry get examined more than once? In the pseudocode as written, line 6 says "if there exists a white neighbor v" - if this scans from the beginning of the list each time u is on top, then a vertex u with degree d could be on top O(d) times (once per neighbor examined), each scan potentially re-examining previous BLACK/GRAY neighbors. This gives O(degree(u)^2) per vertex in the worst case and O(E * V) total - BAD.

However, the standard correct implementation maintains a pointer/iterator into each vertex's adjacency list, so each edge is examined exactly once across all times u is on top. With that implementation:

- Each vertex enters and exits the stack exactly once: O(V) push/pop operations.
- Each adjacency list entry is examined exactly once across all iterations: O(E) total neighbor checks.
- Total: **O(V + E)**.

---

**Q20.**

**Claim:** G is bipartite iff BFS produces no same-level edges connecting same-color vertices (even level = A, odd level = B).

**(a) => direction: G bipartite => no edge between same BFS level.**

Assume G is bipartite with parts X and Y (every edge goes between X and Y, none within X or Y).

BFS from s: assign s to level 0. Level 0 vertices go to part, say X (level 0 = even = color A). All neighbors of level-0 vertices are at level 1 = odd = color B, so they go to Y. All neighbors of level-1 vertices are at level 2 = even = color A, so they go to X. By induction, all even-level vertices are in one part and all odd-level vertices in the other.

Now suppose edge (u,v) connects two vertices at the same BFS level k. Both are in the same color class (both A if k even, both B if k odd). But G is bipartite, so edges only go between color classes - contradiction. Therefore no edge can connect two same-level vertices. QED.

**(b) <= direction: No same-level edges => G is bipartite.**

Assume BFS produces no edges between same-level vertices (all non-tree edges connect vertices at adjacent levels, i.e., |d[u]-d[v]| = 1, not 0, using the result from Q17b which shows |d[u]-d[v]| <= 1 for all non-tree edges, so the only remaining case is difference of exactly 1).

Construct 2-coloring: color vertex v with color A if d[v] is even, color B if d[v] is odd.

We must show every edge goes between A and B (no monochromatic edge).

Consider any edge (u,v) in G:

- Case 1: (u,v) is a BFS tree edge. Then d[v] = d[u]+1 (parent-child), so one has even distance and the other odd. They get different colors. OK.
- Case 2: (u,v) is a non-tree edge. By assumption, no same-level non-tree edges exist, and by Q17(b), |d[u]-d[v]| <= 1. So |d[u]-d[v]| must equal 1. Hence one has even distance and the other odd -> different colors. OK.

In all cases, every edge connects one A-vertex to one B-vertex. Therefore the 2-coloring is valid and G is bipartite. QED.

---

A few things to flag before you walk into the exam:

- Q13(b): the forward edge (a,d) is the one most students miss. They see "d is already visited" and reflexively write "cross edge" without checking whether d is a descendant. Always check timestamps.
- Q16: you need BOTH directions. Writing only one direction for an "iff" proof is an automatic partial mark at best.
- Q19(a): the iterative DFS given is subtly different from the naive version that pushes ALL neighbors at once. Make sure you understand why the given version is equivalent to recursive DFS while the push-all-neighbors version is not.
- Q20: the two directions are not symmetric in difficulty. The (b) direction is harder and where most students lose marks - you need to explicitly use the |d[u]-d[v]| <= 1 result and case-split on tree vs non-tree edges.

Let me check the relevant CLRS sections first.Good, I have the full CLRS content. Now generating the questions.

---

# Topic 21: Red-Black Tree Properties (Black Height)

---

**Q1. [3 marks]** Which of the following is a valid red-black tree property violation that CAN occur immediately after RB-INSERT colors the new node red, before RB-INSERT-FIXUP runs?

(A) Property 3 (leaves are black) is violated because the new node has no children (B) Property 4 (red node cannot have red child) is violated if the new node's parent is red (C) Property 5 (equal black-height on all paths) is violated because the new red node adds to the black-height (D) Property 2 (root is black) is violated only if the tree was previously empty and the new node becomes the root, AND Property 5 is simultaneously violated

---

**Q2. [3 marks]** A red-black tree has black-height bh(root) = 3. What is the minimum and maximum number of INTERNAL nodes this tree can have?

(A) Min = 7, Max = 63 (B) Min = 7, Max = 127 (C) Min = 15, Max = 63 (D) Min = 14, Max = 126

---

**Q3. [3 marks]** Consider the following sequence of node colors on a root-to-NIL path in a claimed red-black tree (NIL sentinel is black): BLACK, RED, RED, BLACK, BLACK, NIL. Which property is violated?

(A) Property 2 (B) Property 4 (C) Property 5 (D) No property is violated; this is a valid root-to-NIL path

---

**Q4. [5 marks]** Consider the following claimed red-black tree:

```
        10 (B)
       /      \
    5 (R)    15 (R)
    /  \     /   \
 3(B) 7(B) 12(B) 20(B)
              \
             13(R)
```

All NIL sentinels are black.

(a) **[2 marks]** Compute bh(x) for every internal node x. Is this a valid red-black tree? If not, identify ALL violated properties with justification.

(b) **[3 marks]** The node 13(R) is inserted legitimately - meaning it was the result of RB-INSERT on key 13 into a valid RB tree and FIXUP has already run. Yet a student claims the tree above (with 13 present) is invalid. Is the student right? Identify specifically what went wrong and what the tree should look like after correct insertion of 13.

---

**Q5. [4 marks]** Prove the following lemma (from CLRS): A red-black tree with n internal nodes has height h <= 2 * lg(n+1).

Your proof must proceed in two steps:

- Step 1: Show that the subtree rooted at any node x contains at least 2^bh(x) - 1 internal nodes.
- Step 2: Use Step 1 to derive the height bound.

---

**Q6. [3 marks]** Which of the following statements about the sentinel T.nil in a red-black tree is FALSE?

(A) T.nil.color = BLACK always (B) T.nil is a single shared node used for all NIL references in the tree (C) bh(T.nil) = 0 by definition (D) T.nil.p, T.nil.left, T.nil.right are always set to meaningful values pointing to actual internal nodes

---

**Q7. [4 marks]** A red-black tree has exactly 7 internal nodes.

(a) **[2 marks]** What are the possible black-heights of this tree? For each valid black-height, state whether a valid RB tree with 7 nodes and that black-height exists.

(b) **[2 marks]** Draw a valid red-black tree with 7 internal nodes that achieves the maximum possible black-height. Label each node with its key (your choice) and color.

---

**Q8. [3 marks]** Let T be a red-black tree and let x be an internal node at depth d (root is depth 0). Which of the following is a tight bound on bh(x)?

(A) bh(x) >= (h - d) / 2, where h is the height of T (B) bh(x) >= d / 2 (C) bh(x) >= (h - d + 1) / 2 (D) bh(x) = h - d exactly

---

**Q9. [5 marks]** A student proposes the following "relaxed red-black tree": all standard RB properties hold EXCEPT that the root may be red.

(a) **[2 marks]** If the root is red in a relaxed RB tree with black-height bh (counting only black internal nodes on root-to-leaf paths, excluding the root itself if it's red), what is the tightest upper bound on height? Compare to the standard bound.

(b) **[1 mark]** If we simply recolor the red root to black, does the result always satisfy all 5 RB properties? Justify.

(c) **[2 marks]** Does recoloring the root to black change the black-height of the tree? Specifically: what is bh(root) before and after the recolor, and does this violate Property 5?

---

**Q10. [4 marks]** You are given a red-black tree with black-height k. A new node is inserted using RB-INSERT. Answer the following:

(a) **[2 marks]** After RB-INSERT-FIXUP completes, can the black-height of the tree increase? Can it decrease? Justify both answers.

(b) **[2 marks]** After RB-INSERT-FIXUP completes, which case(s) of FIXUP (Case 1, 2, or 3) can cause the black-height to change? Be precise.

---

---

# Topic 22: RB Rotations and Insertion

---

**Q11. [3 marks]** LEFT-ROTATE(T, x) is called on node x. Which of the following preconditions MUST hold for the operation to be valid?

(A) x.left != T.nil (B) x.right != T.nil (C) x.p != T.nil (x is not the root) (D) x.color == RED

---

**Q12. [3 marks]** After LEFT-ROTATE(T, x), which of the following correctly describes what changes? (y = x.right before the rotation)

(A) y becomes x's parent; x becomes y's right child; y's old left child becomes x's right child (B) y becomes x's parent; x becomes y's left child; y's old left child becomes x's right child (C) x becomes y's parent; y becomes x's right child; x's old right child becomes y's left child (D) y becomes the root of the subtree; x becomes y's left child; y's old right child becomes x's left child

---

**Q13. [6 marks]** Trace LEFT-ROTATE(T, x) on the following tree where x has key 11:

```
        7
       / \
      4   11 (x)
     / \  / \
    3   6 9  18 (y)
             / \
            14  19
           /  \
          12   17
```

(a) **[3 marks]** Draw the resulting tree after LEFT-ROTATE(T, 11). Label all nodes and show all parent pointers that change. List every pointer assignment made (in order) by the LEFT-ROTATE pseudocode.

(b) **[2 marks]** Verify that the BST property is preserved after the rotation by listing the inorder traversal before and after.

(c) **[1 mark]** How many pointer changes does LEFT-ROTATE make in total? Does this depend on the size of the subtrees alpha, beta, gamma?

---

**Q14. [4 marks]** A student writes the following buggy RIGHT-ROTATE:

```
RIGHT-ROTATE(T, y)
1  x = y.left
2  y.left = x.right
3  if x.right != T.nil
4      x.right.p = x          // <-- BUG HERE
5  x.p = y.p
6  if y.p == T.nil
7      T.root = x
8  elseif y == y.p.left
9      y.p.left = x
10 else y.p.right = x
11 x.right = y
12 y.p = x
```

(a) **[2 marks]** Identify exactly what the bug is on line 4 and what the correct assignment should be.

(b) **[2 marks]** Give a concrete example (a specific tree) where this bug causes incorrect behavior. Show what the parent pointer of x.right points to after the buggy rotation vs. the correct rotation.

---

**Q15. [7 marks]** Insert the keys 41, 38, 31, 12, 19, 8 into an initially empty red-black tree using RB-INSERT. Show the tree after EACH insertion (after FIXUP completes). For each insertion that triggers FIXUP, identify which case(s) apply.

---

**Q16. [4 marks]** Consider RB-INSERT-FIXUP. A student claims: _"Case 2 always immediately leads to Case 3 in the same iteration of the while loop, with no possibility of looping back to Case 1."_

(a) **[2 marks]** Is this claim correct? Justify by tracing the control flow of RB-INSERT-FIXUP after Case 2 executes.

(b) **[2 marks]** After Case 3 executes (right-rotation at grandparent + recoloring), why does the while loop ALWAYS terminate? Prove it cannot loop again.

---

**Q17. [3 marks]** In RB-INSERT-FIXUP, why is the newly inserted node z colored RED and not BLACK? Which property would be hardest to fix if z were colored BLACK instead?

(A) Property 2 would be violated if z is the root (B) Property 4 would be violated since z's parent might be red (C) Property 5 would be violated on every path through z, and fixing it would require restructuring the entire tree (D) Property 3 would be violated since z has no children initially

---

**Q18. [5 marks]** Consider the following red-black tree:

```
         13 (B)
        /       \
     8 (R)      17 (R)
    /    \      /    \
  1(B)  11(B) 15(B) 25(B)
    \              /
    6(R)         22(R)
```

Insert key 27 using RB-INSERT. Show every step of RB-INSERT-FIXUP:

- State the current z and its uncle y at each iteration
- Identify which case applies
- Draw the tree after each case executes
- State final tree

---

**Q19. [3 marks]** RB-INSERT-FIXUP ends with the line `T.root.color = BLACK`. Which of the following correctly explains why this line is necessary and sufficient?

(A) It is only needed when Case 1 propagates z all the way up to the root, making the root red (B) It is only needed when the tree was empty before insertion (z becomes the root) (C) It handles both: when z becomes the root (empty tree), and when Case 1 moves z to the root making it red; setting root to black fixes Property 2 without violating Property 5 (D) It is always executed but only actually changes anything in Case 3 when a rotation makes z the new root

---

**Q20. [6 marks]** Consider RB-INSERT-FIXUP when z's parent is a RIGHT child of the grandparent (the "else" symmetric branch, line 15 of CLRS pseudocode).

(a) **[2 marks]** Write the complete pseudocode for this symmetric else branch. Be precise - do NOT just write "symmetric to the if branch." Explicitly state left/right swaps.

(b) **[2 marks]** In the symmetric case, Case 2 involves z being a LEFT child (instead of right child). What rotation is performed and on which node? Draw a before/after diagram.

(c) **[2 marks]** A student claims the symmetric cases are truly perfectly symmetric - that is, swapping every "left" with "right" and "right" with "left" in the original code gives correct code. Is this exactly true? Verify by checking whether any line in the original if-branch uses left/right in a way that does NOT get swapped in the else-branch.

---

Now, the most common mistakes I see students make on these topics, so you know where to focus:

**RB Properties:**

- Confusing bh(x) counting: black-height does NOT count x itself, and does NOT count the NIL sentinels in most formulations. CLRS counts T.nil as black with bh=0 and does NOT count the starting node. Know exactly which convention your professor uses.
- Q2 is a classic trap. Min nodes in a tree of black-height k = 2^k - 1 (all black). Max = 2^(2k) - 1 (alternating). With bh=3: min = 7, max = 63. Many students compute 2^(2*3+1)-1 = 127 wrongly.
- Q4 is the most dangerous question here - a tree that LOOKS valid at first glance but has an asymmetric bh.

**RB Rotations and Insertion:**

- Q14 is the exact bug students write when they memorize the pseudocode without understanding it. Line 4 should update x.right.p to point to y (the node that is NOW its parent after y.left = x.right), not to x.
- Q15: the sequence 41,38,31,12,19,8 is specifically chosen to trigger all three FIXUP cases. Work it out on paper before the exam.
- Q16(b): Case 3 terminates the loop because after the rotation, z's new parent is BLACK (it was the grandparent which was recolored black). So the while condition `z.p.color == RED` is immediately false.
- Q20: Many students write the symmetric branch from memory and subtly swap the wrong direction in Case 2. The rotation in Case 2 for the else-branch is RIGHT-ROTATE, not LEFT-ROTATE.



# Practice Questions: Chapter 23 - Minimum Spanning Trees


**Q1. [7 marks]** Consider the weighted undirected graph G = (V, E) where V = {a, b, c, d, e} and edges: (a,b)=3, (a,c)=6, (b,c)=4, (b,d)=5, (b,e)=11, (c,d)=2, (c,e)=8, (d,e)=7

**(a) [3 marks]** Run Kruskal's algorithm on G. Show each step: which edge is considered, whether it is accepted or rejected, and the current state of the disjoint sets (UNION-FIND). What is the final MST and its total weight?

**(b) [2 marks]** Run Prim's algorithm starting from vertex a. At each step show the priority queue (key values of all non-tree vertices) and the vertex extracted. What is the MST produced?

**(c) [2 marks]** Is the MST unique? Justify your answer using Theorem 23.1 (the safe-edge theorem). If it is unique, explain why. If not, give another MST.

---

**Q2. [6 marks]** Let G = (V, E) be a connected weighted undirected graph. Suppose you modify the weight of every edge by adding a constant c to it, giving w'(u,v) = w(u,v) + c for all (u,v) in E.

**(a) [2 marks]** Prove that any MST of G under w is also an MST of G under w'. Does this hold for negative c? State any conditions.

**(b) [2 marks]** Now suppose instead you multiply every edge weight by a constant c > 0, giving w'(u,v) = c * w(u,v). Does every MST of G under w remain an MST under w'? Prove or disprove.

**(c) [2 marks]** Give a concrete counterexample to show that the conclusion of (a) fails if you add different constants to different edges (i.e., each edge gets a distinct additive perturbation).

---

**Q3. [7 marks]** The GENERIC-MST algorithm maintains the invariant: "A is a subset of some MST."

**(a) [2 marks]** State precisely what a "cut" is, what it means for a cut to "respect" a set A, and what a "light edge" crossing a cut is.

**(b) [3 marks]** State and prove Theorem 23.1 (the safe-edge theorem). Your proof must use the cut-and-paste technique and show both that T' is an MST and that (u,v) is safe for A.

**(c) [2 marks]** Corollary 23.2 says: if C is a connected component in the forest G_A = (V, A), and (u,v) is a light edge connecting C to some other component, then (u,v) is safe for A. Prove this corollary directly from Theorem 23.1 in two or three sentences.

---

**Q4. [6 marks]** Consider the following claim: _"If (u,v) is the unique minimum-weight edge in G, then it belongs to every MST of G."_

**(a) [2 marks]** Prove this claim using the safe-edge theorem.

**(b) [2 marks]** Now consider the converse: _"If (u,v) belongs to every MST of G, then (u,v) is the unique minimum-weight edge in G."_ Is this true? Prove it or give a counterexample.

**(c) [2 marks]** Prove that if all edge weights in G are distinct, then G has a unique MST. (Hint: suppose two different MSTs T and T' exist and derive a contradiction using the light-edge argument.)

---

**Q5. [7 marks]** In Kruskal's algorithm, the disjoint-set (UNION-FIND) data structure is critical.

**(a) [2 marks]** Kruskal's algorithm runs in O(E log E) time overall. Break down where each cost comes from and justify why sorting dominates when using union by rank with path compression.

**(b) [3 marks]** Trace Kruskal's algorithm on the graph: V = {1, 2, 3, 4, 5}, edges: (1,2)=10, (1,3)=6, (1,4)=5, (2,4)=15, (3,4)=4, (2,5)=12, (4,5)=8

Show the sorted edge list, and for each edge in sorted order: whether it is added or rejected, and the connected components after each step.

**(c) [2 marks]** Suppose G has n vertices and all edge weights are distinct integers in the range [1, n^2]. Describe how to sort the edges faster than O(E log E) and state what the resulting overall running time of Kruskal becomes. (Hint: counting sort.)

---

**Q6. [7 marks]** Consider Prim's algorithm using a binary min-heap as the priority queue.

**(a) [2 marks]** State clearly what key[v] represents for a non-tree vertex v in Prim's algorithm at any point during execution. Why is this the correct quantity to minimize?

**(b) [3 marks]** Prim's algorithm runs in O(E log V) with a binary heap. Write the pseudocode for the DECREASE-KEY step inside Prim's inner loop and carefully account for the O(log V) cost. How many times total is DECREASE-KEY called across the entire execution, and why?

**(c) [2 marks]** With a Fibonacci heap, Prim runs in O(E + V log V). Explain why DECREASE-KEY costs O(1) amortized in a Fibonacci heap and when this improvement over the binary heap version actually matters asymptotically (give a condition on E and V).

---

**Q7. [6 marks]** Let T be an MST of G. Suppose the weight of an edge e NOT in T decreases to some new value w'.

**(a) [3 marks]** Describe a precise algorithm to determine whether T remains an MST after this decrease, and if not, how to update T to restore the MST property. What is the running time of your update algorithm?

**(b) [3 marks]** Now suppose the weight of an edge e IN T increases to some new value w'. Describe an O(V + E)-time algorithm to determine whether T remains an MST, and if not, produce the new MST.

---

**Q8. [6 marks]** Let G = (V, E) be a connected undirected graph where all edge weights are equal (say, all edges have weight 1).

**(a) [2 marks]** How many distinct MSTs does G have? Express your answer in terms of a property of G and justify it.

**(b) [2 marks]** Does Prim's algorithm starting from any source vertex always produce the same MST in this case? Does Kruskal's algorithm always produce the same MST? Explain briefly for each.

**(c) [2 marks]** Is every spanning tree of G an MST in this setting? Prove your answer.

---

**Q9. [7 marks]** Consider the following claim about Prim's algorithm: _"At every step of Prim's algorithm, the set of tree vertices S and the set of edges selected so far form the unique MST of the subgraph induced by S."_

**(a) [3 marks]** Is this claim true? If yes, prove it using the safe-edge theorem (Theorem 23.1). If no, give a counterexample.

**(b) [2 marks]** State the loop invariant for Prim's algorithm precisely. What property does the set A of selected edges maintain throughout the algorithm?

**(c) [2 marks]** Prim and Dijkstra look structurally similar. Identify exactly where they differ in their key-update rule and explain why Prim's key update cannot be used to find shortest paths and Dijkstra's key update cannot be used to find MSTs.

---

**Q10. [6 marks]** This question tests your understanding of when greedy MST algorithms can fail.

**(a) [2 marks]** The safe-edge theorem requires G to be connected. Construct a small example of a disconnected graph where GENERIC-MST runs forever (never terminates). What does the algorithm produce on a disconnected graph if we run it anyway?

**(b) [2 marks]** Suppose someone proposes the following algorithm: "Repeatedly remove the maximum-weight edge from G as long as the graph remains connected." Prove or disprove that this always produces an MST.

**(c) [2 marks]** Suppose someone proposes: "Repeatedly add the minimum-weight edge that does NOT create a cycle." This is exactly Kruskal's. Now modify it: "Repeatedly add the minimum-weight edge connecting two different connected components, without checking the global minimum -- just pick any unvisited vertex and take the cheapest edge from it." This is Prim's. Are there graphs where Prim started from a bad source vertex produces a different MST than Prim started from a good source vertex? Can both still be valid MSTs?

---

---

# Practice Questions: Chapter 24.3 + 24.5 - Dijkstra's Algorithm and Shortest Path Properties

**10 questions, difficulty 9/10**

---

**Q1. [7 marks]** Consider the directed weighted graph G with vertices {s, a, b, c, d} and edges: (s,a)=3, (s,c)=5, (a,b)=6, (a,c)=2, (b,d)=1, (c,a)=1, (c,b)=4, (c,d)=8, (d,b)=3

**(a) [4 marks]** Run Dijkstra's algorithm from source s. Show the state of the priority queue (all d-values) at the start of each iteration, which vertex is extracted, and which edges are relaxed. Present as a table with columns: extracted vertex, d[s], d[a], d[b], d[c], d[d].

**(b) [3 marks]** Trace INITIALIZE-SINGLE-SOURCE and identify exactly which d[v] values change during the execution and why. What are the final shortest path estimates? Write out the predecessor subgraph (pi values) and draw the shortest-paths tree.

---

**Q2. [6 marks]** Dijkstra's algorithm requires non-negative edge weights.

**(a) [3 marks]** Construct a specific directed graph with a negative edge (but no negative cycle) on which Dijkstra's algorithm produces an incorrect answer when run from some source s. Show explicitly which d[v] value is wrong and what the correct delta(s,v) is.

**(b) [3 marks]** Explain precisely which property of Dijkstra's correctness proof breaks down on your counterexample. Be specific about which invariant ("once a vertex is extracted from Q, its d-value equals delta(s,v)") fails, and at which extraction step.

---

**Q3. [7 marks]** This question is about the six shortest-path properties from Section 24.5.

**(a) [2 marks]** State the Triangle Inequality. Now give a directed graph example where the triangle inequality holds with strict inequality for some triple (s, u, v), and another where it holds with equality. Explain what each case tells you about the graph's structure.

**(b) [3 marks]** State and prove the Upper-Bound Property (Lemma 24.11): for all v, v.d >= delta(s,v) always, and once v.d = delta(s,v) it never changes. Your proof must handle both the initialization step (after INITIALIZE-SINGLE-SOURCE) and the inductive step (any relaxation cannot decrease v.d below delta(s,v)).

**(c) [2 marks]** State the No-Path Property. Give a proof sketch of why v.d = infinity = delta(s,v) when there is no path from s to v, assuming no negative-weight cycles.

---

**Q4. [6 marks]** This question is about the Convergence Property (Lemma 24.14).

**(a) [3 marks]** State the Convergence Property precisely. Then prove it: if s ->...-> u -> v is a shortest path, and at some point u.d = delta(s,u), then after relaxing edge (u,v) we have v.d = delta(s,v) and this value never changes.

**(b) [3 marks]** Give an example showing that the Convergence Property can FAIL if you relax (u,v) before u.d has converged to delta(s,u). Construct a 4-vertex graph and a specific relaxation order to show the failure. What is the key lesson this teaches about Dijkstra's correctness?

---

**Q5. [7 marks]** Consider the Path-Relaxation Property (Lemma 24.15).

**(a) [3 marks]** State the Path-Relaxation Property. Prove it by induction on the length k of the shortest path p = <v0, v1, ..., vk> from s = v0 to vk. Your induction must clearly state the inductive hypothesis and use the Convergence Property.

**(b) [2 marks]** The Path-Relaxation Property says the result holds "regardless of any other relaxation steps that occur, even if they are intermixed." Why does this NOT contradict your example in Q4(b)? Identify the crucial distinction.

**(c) [2 marks]** Use the Path-Relaxation Property to argue directly (in 3-4 sentences) why the Bellman-Ford algorithm, after |V|-1 passes, correctly computes delta(s,v) for all reachable v (no negative cycles).

---

**Q6. [6 marks]** Dijkstra's algorithm using a binary min-heap runs in O((V + E) log V) = O(E log V) for connected graphs.

**(a) [2 marks]** Write pseudocode for Dijkstra's algorithm. Identify each operation on the priority queue (INSERT, EXTRACT-MIN, DECREASE-KEY) and state how many times each is called in terms of V and E.

**(b) [2 marks]** With a Fibonacci heap, Dijkstra runs in O(E + V log V). Identify the exact bottleneck that the Fibonacci heap fixes compared to the binary heap version, and state the condition on E relative to V under which the Fibonacci heap version is asymptotically faster.

**(c) [2 marks]** Suppose all edge weights are integers in [0, W] for some small W. Describe an O(VW + E)-time implementation of Dijkstra using a bucket queue (array of |V| * W + 1 buckets). Is this always faster than O(E log V)? Give a condition.

---

**Q7. [7 marks]** Let G = (V, E, w) be a directed graph with non-negative weights and source s. Let p = <v0, v1, ..., vk> be a shortest path from s = v0 to vk.

**(a) [2 marks]** Prove the optimal substructure of shortest paths: any subpath of a shortest path is also a shortest path. Be precise; use contradiction.

**(b) [3 marks]** State and prove the Predecessor-Subgraph Property (Lemma 24.17): once v.d = delta(s,v) for all v in V, the predecessor subgraph G_pi is a shortest-paths tree rooted at s. Your proof must show G_pi is a tree (connected, no cycles, V-1 edges) and that it encodes a shortest path to every reachable vertex.

**(c) [2 marks]** Can G_pi be a DAG even if G contains cycles? Explain. Does Dijkstra always produce the same predecessor subgraph on a given graph (i.e., is the shortest-paths tree unique)?

---

**Q8. [6 marks]** This question probes the interaction between negative weights and Dijkstra's algorithm.

**(a) [2 marks]** Dijkstra fails on graphs with negative edges. However, consider the "reweighting trick": add a constant c to every edge to make all weights non-negative. Does running Dijkstra on the reweighted graph and subtracting c*(path length) from each d[v] give correct shortest paths? Prove or disprove.

**(b) [2 marks]** Johnson's algorithm uses Bellman-Ford to compute a potential function h(v) and reweights each edge as w'(u,v) = w(u,v) + h(u) - h(v). State what property h must satisfy for w' to be non-negative. Show that shortest paths are preserved under this reweighting (i.e., the shortest path in w and in w' have the same vertex sequence).

**(c) [2 marks]** Why does the naive "add constant c to all edges" fail while Johnson's potential-based reweighting works? Give a specific 3-vertex example to illustrate the failure of the naive approach.

---

**Q9. [6 marks]** RELAX(u, v, w) is defined as:

```
if v.d > u.d + w(u,v)
    v.d = u.d + w(u,v)
    v.pi = u
```

**(a) [2 marks]** Prove that RELAX never causes v.d to go BELOW delta(s,v) (Upper-Bound Property, inductive step). Assume u.d >= delta(s,u) and that delta satisfies the triangle inequality.

**(b) [2 marks]** Consider a graph where you relax all edges in a single arbitrary order. After one full pass of relaxing every edge once, is it guaranteed that every d[v] = delta(s,v)? If yes prove it; if no, construct a 3-vertex counterexample and explain which property (Convergence or Path-Relaxation) is not satisfied.

**(c) [2 marks]** Define what it means for an edge (u,v) to be "tense" (i.e., v.d > u.d + w(u,v)). Prove that when Dijkstra terminates, no edge in the graph is tense. Use this to conclude that the final d-values satisfy all relaxation constraints simultaneously.

---

**Q10. [7 marks]** This is a combined design + proof question.

**(a) [3 marks]** You are given a directed graph G = (V, E) with non-negative integer weights and a source s. Describe an O(V + E)-time algorithm that checks whether a given vector of values {d[v]} for all v in V represents the correct shortest-path distances from s (i.e., d[v] = delta(s,v) for all v). Your algorithm should not re-run Dijkstra. Justify correctness using the shortest-path properties.

(Hint: think about what conditions {d[v]} must satisfy if and only if they are correct shortest-path distances.)

**(b) [2 marks]** INITIALIZE-SINGLE-SOURCE sets s.d = 0 and v.d = infinity for all v != s. Suppose instead you initialize with s.d = 0 and v.d = some arbitrary finite value for each v. Under what conditions on these initial values will Dijkstra still produce correct shortest-path distances? Prove your claim.

**(c) [2 marks]** Suppose Dijkstra's algorithm is modified to re-insert a vertex back into the priority queue (allow a vertex to be extracted more than once). Does this modified algorithm still correctly compute shortest paths on graphs with non-negative weights? Does it terminate? Analyze running time in the worst case.

---

**A note on difficulty:** Several of these (Q3b, Q5a, Q7b, Q10a) require proof construction from definitions -- not just "trace the algorithm." That is what 9/10 means here. Q10(a) in particular is the kind of question that separates students who understand the properties from those who have just memorized the algorithms. If you can't do Q10(a) cleanly in under 10 minutes, you don't actually understand Section 24.5 -- you've just memorized the property names.