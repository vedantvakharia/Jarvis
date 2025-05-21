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

