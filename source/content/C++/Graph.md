## Types of graphs

### Dense graphs
A **dense graph** is one where the number of edges ($E$) is close to the maximum possible number of edges. In these graphs, almost every node is connected to every other node.
- **Mathematical Context -** If $V$ is the number of vertices, the maximum number of edges in a simple undirected graph is $\frac{V(V-1)}{2}$. A dense graph has $E$ approaching $V^2$.
- **Best Representation -** **Adjacency Matrices** are usually preferred. Since most entries in the matrix will be non-zero, the $O(V^2)$ space complexity is justified.
### Sparse Graphs
A **sparse graph** is one where the number of edges is much smaller than the maximum possible. Specifically, $E$ is usually closer to the number of vertices ($V$).
- **Mathematical Context -** $E = O(V)$ or $E = O(V \log V)$. Most potential connections between nodes do not exist.
- **Best Representation -** **Adjacency Lists** are much more efficient. They save space by only storing the connections that actually exist, rather than many 0. Space complexity is $O(V + E)$

### Bipartite Graphs
1. A graph is bipartite if 
	- it is possible to color it using two colors
	- When it does not contain a cycle with an odd number of edges

## Representation of Graphs

### Adjacency Matrix

1. Undirected Graphs - 

### Adjacency List

1. Directed Graphs - The sum of the lengths of all the adjacency lists is |E|, since an edge of the form (u,v) is represented by having v appear in Adj[u].
2. Undirected Graphs -  The sum of the lengths of all the adjacency lists is 2|E|, since if (u,v) is an undirected edge, then u appears in v’s adjacency list and vice versa.
3. 