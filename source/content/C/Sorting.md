
## Bubble Sort

```c
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
```

## Selection Sort

Finds the minimum element and swaps it with the first element.

```c
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // Swap
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
}
```

## Insertion Sort

Picks elements and inserts them in their correct position. O(n2)

```c
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

## Quick Sort

```c
#include <stdio.h>

// Function to swap two integers
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Partition function (Lomuto scheme)
int partition(int arr[], int low, int high) {
    int pivot = arr[high];     // Choose the last element as pivot
    int i = low - 1;           // Index of smaller element

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);  // Move smaller element to left
        }
    }

    swap(&arr[i + 1], &arr[high]);  // Place pivot in correct position
    return i + 1;  // Return pivot index
}

// QuickSort function
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);  // pi is partition index

        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

## Merge sort

```c
#include <stdlib.h>

// Merge two sorted subarrays into a single sorted array
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;    // Size of left subarray
    int n2 = right - mid;       // Size of right subarray

    // Create temporary arrays
    int *L = (int *)malloc(n1 * sizeof(int));
    int *R = (int *)malloc(n2 * sizeof(int));

    // Copy data to temporary arrays L[] and R[]
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    // Merge the two temporary arrays back into arr[left..right]
    int i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {     // Use <= to make it stable
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }

    // Copy remaining elements of L[], if any
    while (i < n1)
        arr[k++] = L[i++];

    // Copy remaining elements of R[], if any
    while (j < n2)
        arr[k++] = R[j++];

    // Free temporary arrays
    free(L);
    free(R);
}

// Merge Sort function
void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        // Merge sorted halves
        merge(arr, left, mid, right);
    }
}
```


## Binary Search

##### Procedure

1. **First procedure -**  Given an array A of n elements with values or records ![{\displaystyle A_{0},A_{1},A_{2},\ldots ,A_{n-1}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/6d8d813e3e6d50ef13e04948e72fcacaf43b7d5c)sorted such that ![{\displaystyle A_{0}\leq A_{1}\leq A_{2}\leq \cdots \leq A_{n-1}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/13c473f721041f872e852b4ad816f5ee77b1681d), and target value T.
```c
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

// Code in c
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

2. Alternative procedure (Hermann Bottenbruch) - 
```c
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

// Code in C
#include <stdio.h>

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
