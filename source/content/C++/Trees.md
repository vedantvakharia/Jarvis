## Binary Search Tree

```c++ title:"Binary Search Tree"
// Structure of a single node
struct Node {
    int data;
    Node * left;
    Node * right;

    Node(int val) {
        data = val;
        left = right = nullptr;
    }
}

// Insertion of a node - If the value is smaller than the root, we go left else right. We repeat this untill we find an empty/nullptr slot.
Node * insert(Node * root, int val) {
    if (root == nullptr) {
        return new Node(val);
    }

    if (val < root - > data) {
        root - > left = insert(root - > left, val);
    }

    if (val > root - > data) {
        root - > right = insert(root - > right, val);
    }

    return root;
}

// Searching of a value - The value we need to find is often called key.
Node * search(Node * root, int key) {
    if (root == nullptr || root - > data == key) {
        return root;
    }
}
```
