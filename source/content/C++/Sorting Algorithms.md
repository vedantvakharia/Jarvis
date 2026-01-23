## $O(n^2)$ Time Complexity Algorithms

### Insertion Sort
When the array is **"nearly sorted"** (only a few elements out of place). In a nearly-sorted array, Insertion Sort performs in O(N) time, which is faster than even the best O(NlogN) algorithms

```c++
void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

### Selection Sort
Always takes the same amount of time regardless of data order.

```c++
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx]) min_idx = j;
        swap(arr[min_idx], arr[i]);
    }
}
```

### Bubble Sort

```c++
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization
    }
}
```



## $O(N \log N)$ Time Complexity Algorithm

### QuickSort

```c++
#include <vector>
#include <algorithm>

using namespace std;

// The heart of QuickSort: Partitioning the array
int partition(vector<int>& arr, int low, int high) {
    // Picking the middle element as pivot to avoid O(N^2) on sorted arrays
    int pivot = arr[low + (high - low) / 2];
    int i = low - 1;
    int j = high + 1;

    while (true) {
        // Move i to the right until we find an element >= pivot
        do { i++; } while (arr[i] < pivot);
        // Move j to the left until we find an element <= pivot
        do { j--; } while (arr[j] > pivot);

        // If indices cross, the partition is done
        if (i >= j) return j;

        swap(arr[i], arr[j]);
    }
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p);      // Sort the left side
        quickSort(arr, p + 1, high);  // Sort the right side
    }
}
```

#### MergeSort (`std::stable_sort(v.begin(), v.end())`)

MergeSort is great for Linked Lists and when you need a Stable Sort. Is in algorithm header as `stable_sort`.

`stable_sort` has 2 time complexity scenarios - 
1. $O(NlogN)$ (The Ideal Case) - If the system has enough extra memory (specifically O(N) extra space), `std::stable_sort` uses a standard Merge Sort.
	- **How it works -** It creates a temporary buffer (a second array) of the same size as your input. It then recursively splits the array and merges the pieces back into the buffer in sorted order.
	- **Result -** Because merging two sorted arrays takes linear time (O(N)), the total time is a clean $O(NlogN)$.
2. $O(Nlog^2N)$ (The Memory-Constrained Case) - If the system cannot allocate that extra O(N) memory, the algorithm doesn't just crash. It switches to an in-place merge strategy.
	- **How it works:** Without a second array to help, the merge step becomes much harder. It has to move elements around within the original array using a more complex logic (similar to a binary search for every merge).
	- **The Cost:** Each "merge" now takes $O(NlogN)$ instead of $O(N)$. Since there are $logN$ levels of merging, the total time becomes $O(N⋅logN⋅logN)$, or $O(Nlog2N)$.

```c++
void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
```

### HeapSort (`std::partial_sort)

```c++
void heapify(vector<int>& arr, int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

### Introsort
It begins with quicksort, it switches to heapsort when the recursion depth exceeds a level based on (the logarithm of) the number of elements being sorted and it switches to insertion sort when the number of elements is below some threshold. This combines the good parts of the three algorithms, with practical performance comparable to quicksort on typical data sets and worst-case $O(n logn)$ runtime due to the heap sort. 

```c++ title:Pseudocode
procedure sort(A : array):
    maxdepth ← ⌊log2(length(A))⌋ × 2
    introsort(A, maxdepth)

procedure introsort(A, maxdepth):
    n ← length(A)
    if n < 16:
        insertionsort(A)
    else if maxdepth = 0:
        heapsort(A)
    else:
        p ← partition(A) 
// assume this function does pivot selection, p is the final position of the pivot
        introsort(A[1:p-1], maxdepth - 1)
        introsort(A[p+1:n], maxdepth - 1)

// Implementation
#include <vector>
#include <cmath>
#include <algorithm>

using namespace std;

// Helper: Standard Insertion Sort for small partitions
void insertionSort(vector<int>& arr, int left, int right) {
    for (int i = left + 1; i <= right; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Introsort Core logic
void introsortUtil(vector<int>& arr, int begin, int end, int depthLimit) {
    int size = end - begin;

    // Phase 1: Switch to Insertion Sort for very small arrays
    if (size < 16) {
        insertionSort(arr, begin, end);
        return;
    }

    // Phase 2: Switch to HeapSort if QuickSort recursion is too deep
    if (depthLimit == 0) {
        make_heap(arr.begin() + begin, arr.begin() + end + 1);
        sort_heap(arr.begin() + begin, arr.begin() + end + 1);
        return;
    }

    // Phase 3: Standard QuickSort partitioning
    int p = partition(arr, begin, end);
    introsortUtil(arr, begin, p, depthLimit - 1);
    introsortUtil(arr, p + 1, end, depthLimit - 1);
}

void introsort(vector<int>& arr) {
    if (arr.empty()) return;
    int depthLimit = 2 * log(arr.size());
    introsortUtil(arr, 0, arr.size() - 1, depthLimit);
}

// STL library
// Sorting vector and string
vector<int> v = {4,2,5,3,5,8,3};
sort(v.begin(),v.end()); // Sorts in ascending order
sort(v.rbegin(),v.rend()); // Sorts in descending order

// Sorting arrayint n = 7; // array size
int a[] = {4,2,5,3,5,8,3};
sort(a,a+n);
```



---

## $O(N)$ Linear Sorts (Non-Comparison)

These only work if the data has specific properties (like a small range of integers).

### Counting Sort

Best for small ranges ($0$ to $K$).

```c++
void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> count(maxVal + 1, 0);
    for (int x : arr) count[x]++;
    int idx = 0;
    for (int i = 0; i <= maxVal; i++) {
        while (count[i]--) arr[idx++] = i;
    }
}
```

### Radix Sort

Uses Counting Sort as a subroutine to sort numbers digit by digit.

```c++
void countForRadix(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n), count(10, 0);
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    arr = output;
}

void radixSort(vector<int>& arr) {
    int m = *max_element(arr.begin(), arr.end());
    for (int exp = 1; m / exp > 0; exp *= 10) countForRadix(arr, exp);
}
```

### Bucket Sort

Best when input is uniformly distributed over a range (like floating point numbers).

```c++
void bucketSort(vector<float>& arr) {
    int n = arr.size();
    vector<vector<float>> b(n);
    for (int i = 0; i < n; i++) {
        int bi = n * arr[i]; // Assuming range [0, 1)
        b[bi].push_back(arr[i]);
    }
    for (int i = 0; i < n; i++) sort(b[i].begin(), b[i].end());
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (float x : b[i]) arr[index++] = x;
    }
}
```


## User-defined structs

The function sort requires that a comparison operator is defined for the data type of the elements to be sorted. When sorting, this operator will be used whenever it is necessary to find out the order of two elements. Most C++ data types have a built-in comparison operator, and elements
of those types can be sorted automatically. For example, numbers are sorted according to their values and strings are sorted in alphabetical order.

User-defined structs do not have a comparison operator automatically. The operator should be defined inside the struct as a function operator<, whose parameter is another element of the same type. The operator should return true if the element is smaller than the parameter, and false otherwise. For example, the following struct P contains the x and y coordinates of a point.
The comparison operator is defined so that the points are sorted primarily by the x coordinate and secondarily by the y coordinate.
```c++
struct P {
	int x, y;
	bool operator<(const P &p) {
		if (x != p.x) return x < p.x;
		else return y < p.y;
	}
};
```

## Comparison functions

It is also possible to give an external comparison function to the sort function as a callback function. For example, the following comparison function comp sorts strings primarily by length and secondarily by alphabetical order:
```c++
bool comp(string a, string b) {
	if (a.size() != b.size()) return a.size() < b.size();
		return a < b;
}
// Now a vector of strings can be sorted as follows:
sort(v.begin(), v.end(), comp);
```
