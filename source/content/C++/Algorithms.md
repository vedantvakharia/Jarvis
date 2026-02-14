## Virtual indexing



## Dutch national flag problem

It uses three indices i, j and k, maintaining the invariant that _i_ ≤ _j_ ≤ _k_.
- Entries from 0 up to (but not including) i are values less than mid,
- entries from i up to (but not including) j are values equal to mid,
- entries from j up to (and including) k are values not yet sorted, and
- entries from k + 1 to the end of the array are values greater than mid.

```c
three-way-partition(A : array of values, mid : value):
    i ← 0
    j ← 0
    k ← size of A - 1

    while j <= k:
        if A[j] < mid:
            swap A[i] and A[j]
            i ← i + 1
            j ← j + 1
        else if A[j] > mid:
            swap A[j] and A[k]
            k ← k - 1
        else:
            j ← j + 1
```

## Binary Search 

For search array, worst time complexity is $O(n)$. If the array is sorted, worst time complexity becomes $O(log n)$ by using binary search. 

#### Method 1

```c++
// Pseudo code
function binary_search(A, n, T) is
    L := 0
    R := n − 1
    while L ≤ R do
        m := L + floor((R - L) / 2)
        if A[m] < T then
            L := m + 1
        else if A[m] > T then
            R := m − 1
        else:
            return m
    return unsuccessful

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // prevents integer overflow
        if (arr[mid] == target)
            return mid; // Target found
        else if (arr[mid] < target)
            low = mid + 1; // Search right half
        else
            high = mid - 1; // Search left half
    }
    return -1; // Target not found
}
```

#### Method 2 - Hermann Bottenbruch

In Method 1, the algorithm checks whether the middle element m is equal to the target T in every iteration. Some implementations leave out this check during each iteration. The algorithm would perform this check only when one element is left (when L = R). This results in a faster comparison loop, as one comparison is eliminated per iteration, while it requires only one more iteration on average.

```c++
// Pseudo code
function binary_search_alternative(A, n, T) is
    L := 0
    R := n − 1
    while L != R do
        m := L + ceil((R - L) / 2)
        if A[m] > T then
            R := m − 1
        else:
            L := m
    if A[L] = T then
        return L
    return unsuccessful

int binarySearchCeil(int arr[], int n, int target) {
    int L = 0;
    int R = n - 1;

    while (L != R) {
        int m = L + (R - L + 1) / 2;

        if (arr[m] > target)
            R = m - 1;
        else
            L = m;
    }

    if (arr[L] == target)
        return L;
    
    return -1;
}
```

#### Method 3 - Binary Lifting or Jump-Based Binary Search

The idea is to make jumps and slow the speed when we get closer to the target element. The search goes through the array from left to right, and the initial jump length is n/2. At each step, the jump length will be halved: first n/4, then n/8, n/16, etc., until finally the length is 1. After the jumps, either the target element has been found or we know that it does not appear in the array.

```c++
// Determination of value of a
// Leetcode - 1<<20 as max no 2 which leetcode can handle
// Calculated start
int b = 1; 
while (b * 2 <= n) b *= 2;

//



int k = 0;
for (int b = a; b >= 1; b /= 2) { // b = current jump length
	while (k+b < n && array[k+b] <= x) k += b;
}
if (array[k] == x) {
	// x found at index k
}
```

