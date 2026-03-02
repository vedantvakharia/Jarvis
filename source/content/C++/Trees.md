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

    if (val < root -> data) {
        root -> left = insert(root -> left, val);
    }

    if (val > root -> data) {
        root -> right = insert(root -> right, val);
    }

    return root;
}

// Searching of a value - The value we need to find is often called key.
Node * search(Node * root, int key) {
    if (root == nullptr || root -> data == key) {
        return root;
    }

    // Key is greater than root
    if (key > root -> data) {
        return search(root -> right, key);
    }

    // Key is smaller than root
    if (key < root -> data) {
        return search(root -> left, key);
    }
}

/*
 Deleting a node -
	- Case 1 - Node is a leaf (no children) — Just delete it.
    
	- Case 2 - Node has one child — Replace the node with its child.
    
	- Case 3 - Node has two children — Find the In-order Successor (the 
	  smallest value in the right subtree), replace the node's value with it, 
	  and then delete the successor.
*/
// Helper function to find minimum node - Keep on going left till we find the left node
Node * minValNode(Node * node) {
    Node * current = node;
    while (current != nullptr && current - > left != nullptr) {
        current = current -> left;
    }

    return current;
}

Node * deleteNode(Node * root, int key) {
    if (root == nullptr) {
        return root;
    }

    // Find node having the key
    if (key < root -> data) {
        root -> left = deleteNode(root -> left, key);
    } else if (key > root -> data) {
        root -> right = deleteNode(root -> right, key);
    }

    // If key found
    else {
        // Node with no child or only 1 child
        if (root -> left == nullptr) {
            Node * temp = root -> right;
            delete root;
            return temp;
        } else if (root -> right == nullptr) {
            Node * temp = root -> left;
            delete root;
            return temp;
        }

        // Node with 2 children - Get the inorder successor
        Node * temp = minValueNode(root - > right);
        root - > data = temp - > data;
        root - > right = deleteNode(root - > right, temp - > data);
    }

    return root;
}

// Sorted array to BST
Node * bst(vector <int> & nums, int l, int r) {
    if (l > r) return NULL;
    
    int mid = l + (r - l) / 2;
    
    Node * root = new Node(nums[mid]);
    
    root -> right = bst(nums, mid + 1, r);
    root -> left = bst(nums, l, mid - 1);
    
    return root;
}

// Inorder Traversal of BST
void traverse(Node* root){
	if(root == nullptr) return;
	
	traverse(root -> left);
	
	// Logic we need to check
	
	traverse(root -> right);
}
```
