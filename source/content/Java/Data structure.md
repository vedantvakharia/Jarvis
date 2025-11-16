## Stack

```java title:"Using composition ArrayList"
import java.util.ArrayList;
import java.util.EmptyStackException;

public class Stack {
    private ArrayList<Object> list;

    public MyStack() { // Constructor
        list = new ArrayList<>();
    }
    
// The end of the list represents the "top" of the stack.
  
    public boolean isEmpty() {
        return list.isEmpty();
    }
    
    public int getSize() {
        return list.size();
    }
    
    public Object push(Object o) {  // Adds element in end 
        list.add(o);
        return o;
    }

    public Object pop() { // Returns and removes the top element
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return list.remove(list.size() - 1);
    }

    public Object peek() { // Returns the top element
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return list.get(list.size() - 1);
    }

    public int search(Object o) {
// lastIndexOf finds the last occurrence, which is the one closest to the top of the stack (the end of the list).

        int index = list.lastIndexOf(o);
        
        if (index == -1) return -1; // Not found
        return list.size() - index;
    }
}
```

```java title:"Using composition linkedlist"
import java.util.LinkedList;
import java.util.EmptyStackException;

public class Stack{
	private LinkedList <Object> list;
	
	public Stack{
		list = new LinkedList <>();
	}
	
	public boolean isEmpty{
		return list.isEmpty();
	}
	
	public int getSize(){
		return list.size();
	}
	
	public Object peak(){
		if(isEmpty()) throw new EmptyStackException();
		return list.getLast();
	}
	
	public Object pop(){
		if(isEmpty()) throw new EmptyStackException();
		return list.removelast();
	}
}
```


## Compendium of the Java Collections Framework Methods

This document provides an exhaustive list of the methods available within the Java Collections Framework. It synthesizes information from conceptual lecture materials ("slides") and the comprehensive _Core Java_ textbook ("textbook").

**Formatting Convention:**

- Methods explicitly mentioned in the slides 1 are listed normally.
    
- Methods found only in the comprehensive textbook API are underlined. This highlights the full API surface area available to the professional developer beyond the introductory concepts.
    
- All examples use `Vehicle` as a class and `car` as an object instance. Static methods are prefixed with `Vehicle` (or the appropriate utility class like `Collections`). Maps, lists, sets, and queues are named `carMap`, `carList`, `carSet`, and `carQueue` for clarity.
    

## I. Core Collection Interfaces

These are the foundational interfaces from which all other collection types are derived.1

### A. The `java.lang.Iterable<E>` Interface

This is the root interface for any class that can be traversed using an iterator, most notably enabling the "for-each" loop.

- `iterator()`
    
    - _Description:_ Returns an `Iterator` object that can be used to step through the elements in the collection .
        
    - _Example:_ `Iterator<Vehicle> iter = carList.iterator();`
        
- `forEach(Consumer<? super E> action)`
    
    - _Description:_ Performs the given action (often a lambda expression) for each element of the `Iterable` .
        
    - _Example:_ `carList.forEach(v -> System.out.println(v));`
        
- `spliterator()`
    
    - _Description:_ Creates a `Spliterator` over the elements, which is a more advanced iterator that supports parallel traversal.2
        
    - _Example:_ `Spliterator<Vehicle> s = carList.spliterator();`
        

### B. The `java.util.Collection<E>` Interface

This is the primary interface for "bags" of objects. It defines the fundamental behaviors for all collections, such as adding, removing, and querying elements.1 The textbook API also includes powerful functional methods introduced in Java 8.2

- `add(E e)`
    
    - _Description:_ Adds a new element to the collection; returns `true` if the collection changed as a result .
        
    - _Example:_ `boolean changed = carList.add(car);`
        
- `size()`
    
    - _Description:_ Returns the number of elements in the collection .
        
    - _Example:_ `int count = carList.size();`
        
- `isEmpty()`
    
    - _Description:_ Checks if the collection contains no elements; returns `true` if empty .
        
    - _Example:_ `boolean b = carList.isEmpty();`
        
- `contains(Object o)`
    
    - _Description:_ Checks for membership; returns `true` if the collection contains the specified element .
        
    - _Example:_ `boolean hasCar = carList.contains(car);`
        
- `remove(Object o)`
    
    - _Description:_ Removes a single instance of the specified element from the collection; returns `true` if the element was found and removed .
        
    - _Example:_ `boolean removed = carList.remove(car);`
        
- `iterator()`
    
    - _Description:_ Returns an `Iterator` to step through the elements in the collection .
        
    - _Example:_ `Iterator<Vehicle> iter = carList.iterator();`
        
- `addAll(Collection<? extends E> c)`
    
    - _Description:_ Adds all elements from a specified collection to this collection .
        
    - _Example:_ `carList.addAll(otherVehicleList);`
        
- `clear()`
    
    - _Description:_ Removes all elements from the collection .
        
    - _Example:_ `carList.clear();`
        
- `containsAll(Collection<?> c)`
    
    - _Description:_ Checks for inclusion; returns `true` if this collection contains all elements in the specified collection .
        
    - _Example:_ `boolean hasAll = carList.containsAll(otherVehicleList);`
        
- `removeAll(Collection<?> c)`
    
    - _Description:_ Removes all elements from this collection that are also contained in the specified collection .
        
    - _Example:_ `carList.removeAll(otherVehicleList);`
        
- `retainAll(Collection<?> c)`
    
    - _Description:_ Retains _only_ the elements in this collection that are also contained in the specified collection .
        
    - _Example:_ `carList.retainAll(otherVehicleList);`
        
- `removeIf(Predicate<? super E> filter)`
    
    - _Description:_ Removes all elements from the collection that satisfy the given predicate (a test condition).2
        
    - _Example:_ `carList.removeIf(v -> v.getMileage() > 100000);`
        
- `stream()`
    
    - _Description:_ Returns a sequential `Stream` with this collection as its source.2
        
    - _Example:_ `Stream<Vehicle> s = carList.stream();`
        
- `parallelStream()`
    
    - _Description:_ Returns a (possibly) parallel `Stream` with this collection as its source.2
        
    - _Example:_ `Stream<Vehicle> ps = carList.parallelStream();`
        
- `toArray()`
    
    - _Description:_ Returns an array containing all of the elements in this collection.2
        
    - _Example:_ `Object array = carList.toArray();`
        
- `<T> T toArray(T a)` - Returns a typed array containing all elements; if the array is big enough, it's used, otherwise a new array of the same type is allocated.2
    
```java
List<String> list = List.of("A", "B", "C");
String[] arr = list.toArray(new String[0]);
```

		
- `<T> T toArray(IntFunction<T> generator)`- Returns a typed array containing all elements, using the provided generator function to allocate the array .

```java
List<String> list = List.of("A", "B", "C");
String[] arr = list.toArray(String[]::new);   // Java 11+ clean syntax
```


### C. The `java.util.Iterator<E>` Interface

An object used to traverse a collection.1 The slides cover the essential methods 1, while the textbook adds `forEachRemaining`.

- `hasNext()`- Returns `true` if the iteration has more elements .
        
    - _Example:_ `while (iter.hasNext()) {... }`
        
- `next()`
    
    - _Description:_ "Reads" and returns the next element from the collection, advancing the iterator .
        
    - _Example:_ `Vehicle v = iter.next();`
        
- `remove()`
    
    - _Description:_ Removes the element that was last returned by `next()` from the underlying collection .
        
    - _Example:_ `iter.remove();`
        
- `forEachRemaining(Consumer<? super E> action)`
    
    - _Description:_ Performs the given action on each remaining element until all elements have been processed .
        
    - _Example:_ `iter.forEachRemaining(v -> System.out.println(v));`
        

## II. Linear Collections (Lists)

The `List` interface extends `Collection` to define an _ordered_ collection that allows positional (indexed) access.1

### A. The `java.util.List<E>` Interface

Your slides introduce the key positional methods.1 The textbook API reveals a much richer interface, including methods for indexed searching, list-specific iterators, in-place modification, and creating sublist "views".1

- `add(int index, E element)`
    
    - _Description:_ Inserts the specified element at the specified position in this list.1
        
    - _Example:_ `carList.add(0, car);`
        
- `get(int index)`
    
    - _Description:_ Returns the element at the specified position in this list.1
        
    - _Example:_ `Vehicle v = carList.get(0);`
        
- `set(int index, E element)`
    
    - _Description:_ Replaces the element at the specified position in this list with the specified element.1
        
    - _Example:_ `Vehicle oldV = carList.set(0, car);`
        
- `remove(int index)`
    
    - _Description:_ Removes the element at the specified position in this list.1
        
    - _Example:_ `Vehicle removedV = carList.remove(0);`
        
- `addAll(int index, Collection<? extends E> c)`
    
    - _Description:_ Inserts all elements from another collection into this list at the specified position.2
        
    - _Example:_ `carList.addAll(0, otherVehicleList);`
        
- `indexOf(Object o)`
    
    - _Description:_ Returns the index of the _first_ occurrence of the specified element, or -1 if not found.2
        
    - _Example:_ `int i = carList.indexOf(car);`
        
- `lastIndexOf(Object o)`
    
    - _Description:_ Returns the index of the _last_ occurrence of the specified element, or -1 if not found.2
        
    - _Example:_ `int i = carList.lastIndexOf(car);`
        
- `listIterator()`
    
    - _Description:_ Returns a `ListIterator` over the elements in this list.2
        
    - _Example:_ `ListIterator<Vehicle> iter = carList.listIterator();`
        
- `listIterator(int index)`
    
    - _Description:_ Returns a `ListIterator` starting at the specified position in the list.2
        
    - _Example:_ `ListIterator<Vehicle> iter = carList.listIterator(5);`
        
- `replaceAll(UnaryOperator<E> operator)`
    
    - _Description:_ Replaces each element of this list with the result of applying the operator to that element.2
        
    - _Example:_ `carList.replaceAll(v -> v.paint("Red"));`
        
- `sort(Comparator<? super E> c)`
    
    - _Description:_ Sorts this list according to the order induced by the specified `Comparator`.5
        
    - _Example:_ `carList.sort(Comparator.comparing(Vehicle::getMileage));`
        
- `subList(int fromIndex, int toIndex)`
    
    - _Description:_ Returns a "view" of the portion of this list between the specified indices (fromIndex inclusive, toIndex exclusive).2
        
    - _Example:_ `List<Vehicle> sub = carList.subList(5, 10);`
        
- `static <E> List<E> of(E... elements)`
    
    - _Description:_ Creates an immutable list containing the specified elements.
        
    - _Example:_ `List<Vehicle> fleet = List.of(car1, car2);`
        
- `static <E> List<E> copyOf(Collection<? extends E> coll)`
    
    - _Description:_ Creates an immutable list containing the elements of the given collection.
        
    - _Example:_ `List<Vehicle> immutableFleet = List.copyOf(carSet);`
        
- _(Includes all methods from `Collection`)_
    

### B. The `java.util.ListIterator<E>` Interface

An extension of `Iterator` specifically for `List`s, allowing bidirectional traversal and modification.

- `add(E e)`
    
    - _Description:_ Inserts the specified element into the list immediately before the element that would be returned by `next()` .
        
    - _Example:_ `iter.add(car);`
        
- `hasPrevious()`
    
    - _Description:_ Returns `true` if the list iterator has more elements when traversing the list in the reverse direction .
        
    - _Example:_ `while (iter.hasPrevious()) {... }`
        
- `previous()`
    
    - _Description:_ Returns the previous element in the list and moves the cursor position backwards .
        
    - _Example:_ `Vehicle v = iter.previous();`
        
- `nextIndex()`
    
    - _Description:_ Returns the index of the element that would be returned by a subsequent call to `next()` .
        
    - _Example:_ `int i = iter.nextIndex();`
        
- `previousIndex()`
    
    - _Description:_ Returns the index of the element that would be returned by a subsequent call to `previous()` .
        
    - _Example:_ `int i = iter.previousIndex();`
        
- `set(E e)`
    
    - _Description:_ Replaces the last element returned by `next()` or `previous()` with the specified element .
        
    - _Example:_ `iter.set(car);`
        
- _(Includes all methods from `Iterator`: `hasNext()`, `next()`, `remove()`)_
    

## III. Set-Based Collections (Unique Elements)

The `Set` interface extends `Collection` and adds the semantic contract that it contains no duplicate elements.1

### A. The `java.util.Set<E>` Interface

The `Set` interface itself adds no new methods to `Collection` but specifies a stricter contract for `add()`, `equals()`, and `hashCode()`.3 The textbook also defines static factory methods for creating unmodifiable sets.1

- `add(E e)` (Behavior is modified)
    
    - _Description:_ Adds the element if not already present. Returns `false` if the element is already in the set.1
        
    - _Example:_ `boolean added = carSet.add(car);`
        
- `static <E> Set<E> of(E... elements)`
    
    - _Description:_ Creates an immutable set containing the specified elements.
        
    - _Example:_ `Set<Vehicle> fleet = Set.of(car1, car2);`
        
- `static <E> Set<E> copyOf(Collection<? extends E> coll)`
    
    - _Description:_ Creates an immutable set containing the elements of the given collection, removing duplicates.
        
    - _Example:_ `Set<Vehicle> immutableFleet = Set.copyOf(carList);`
        
- _(Includes all methods from `Collection`)_
    

### B. The `java.util.SortedSet<E>` Interface

Extends `Set` to add the contract that elements are maintained in a total ordering.1 The methods, found in the textbook, provide ways to access the first/last elements and create range-based "views" of the set.

- `comparator()`
    
    - _Description:_ Returns the `Comparator` used to order the elements in this set, or `null` if it uses natural ordering .
        
    - _Example:_ `Comparator<? super Vehicle> c = carSet.comparator();`
        
- `first()`
    
    - _Description:_ Returns the first (lowest) element currently in this set .
        
    - _Example:_ `Vehicle firstCar = carSet.first();`
        
- `last()`
    
    - _Description:_ Returns the last (highest) element currently in this set .
        
    - _Example:_ `Vehicle lastCar = carSet.last();`
        
- `headSet(E toElement)`
    
    - _Description:_ Returns a view of the portion of this set whose elements are _strictly less than_ `toElement` .
        
    - _Example:_ `SortedSet<Vehicle> frontOfLot = carSet.headSet(anotherCar);`
        
- `tailSet(E fromElement)`
    
    - _Description:_ Returns a view of the portion of this set whose elements are _greater than or equal to_ `fromElement` .
        
    - _Example:_ `SortedSet<Vehicle> backOfLot = carSet.tailSet(anotherCar);`
        
- `subSet(E fromElement, E toElement)`
    
    - _Description:_ Returns a view of the portion of this set from `fromElement` (inclusive) to `toElement` (exclusive) .
        
    - _Example:_ `SortedSet<Vehicle> section = carSet.subSet(carA, carB);`
        
- _(Includes all methods from `Set` and `Collection`)_
    

### C. The `java.util.NavigableSet<E>` Interface

This interface (from the textbook, not slides) extends `SortedSet` with sophisticated navigation methods to find elements based on proximity, and to iterate in descending order.

- `lower(E e)`
    
    - _Description:_ Returns the greatest element in this set _strictly less than_ the given element, or `null` .
        
    - _Example:_ `Vehicle v = carSet.lower(anotherCar);`
        
- `floor(E e)`
    
    - _Description:_ Returns the greatest element in this set _less than or equal to_ the given element, or `null` .
        
    - _Example:_ `Vehicle v = carSet.floor(anotherCar);`
        
- `ceiling(E e)`
    
    - _Description:_ Returns the least element in this set _greater than or equal to_ the given element, or `null` .
        
    - _Example:_ `Vehicle v = carSet.ceiling(anotherCar);`
        
- `higher(E e)`
    
    - _Description:_ Returns the least element in this set _strictly greater than_ the given element, or `null` .
        
    - _Example:_ `Vehicle v = carSet.higher(anotherCar);`
        
- `pollFirst()`
    
    - _Description:_ Retrieves and removes the first (lowest) element, or returns `null` if this set is empty .
        
    - _Example:_ `Vehicle firstCar = carSet.pollFirst();`
        
- `pollLast()`
    
    - _Description:_ Retrieves and removes the last (highest) element, or returns `null` if this set is empty .
        
    - _Example:_ `Vehicle lastCar = carSet.pollLast();`
        
- `descendingSet()`
    
    - _Description:_ Returns a reverse order view of the elements contained in this set .
        
    - _Example:_ `NavigableSet<Vehicle> reversed = carSet.descendingSet();`
        
- `descendingIterator()`
    
    - _Description:_ Returns an iterator over the elements in this set, in descending order .
        
    - _Example:_ `Iterator<Vehicle> iter = carSet.descendingIterator();`
        
- `headSet(E toElement, boolean inclusive)`
    
    - _Description:_ Returns a view of the portion of this set whose elements are less than (or equal to, if `inclusive` is true) `toElement` .
        
    - _Example:_ `NavigableSet<Vehicle> front = carSet.headSet(anotherCar, true);`
        
- `tailSet(E fromElement, boolean inclusive)`
    
    - _Description:_ Returns a view of the portion of this set whose elements are greater than (or equal to, if `inclusive` is true) `fromElement` .
        
    - _Example:_ `NavigableSet<Vehicle> back = carSet.tailSet(anotherCar, false);`
        
- `subSet(E from, boolean fromInc, E to, boolean toInc)`
    
    - _Description:_ Returns a view of the portion of this set whose elements range from `fromElement` to `toElement`, with control over endpoint inclusion .
        
    - _Example:_ `NavigableSet<Vehicle> section = carSet.subSet(carA, true, carB, false);`
        
- _(Includes all methods from `SortedSet`, `Set`, and `Collection`)_
    

## IV. Queue-Based Collections (Processing Order)

These interfaces define collections for holding elements prior to processing, typically in a FIFO (First-In, First-Out) manner.1

### A. The `java.util.Queue<E>` Interface

The `Queue` interface models a "waiting list".1 A key design pattern revealed in the textbook is its dual API: one set of methods throws an exception on failure, while the other returns a special value (`null` or `false`).1

|**Operation**|**Throws Exception**|**Returns Special Value**|
|---|---|---|
|**Insert**|`add(E e)`|`offer(E e)`|
|**Remove**|`remove()`|`poll()`|
|**Examine**|`element()`|`peek()`|

- `add(E e)`
    
    - _Description:_ Inserts the specified element into the queue. Throws an `IllegalStateException` if the queue is full.1
        
    - _Example:_ `carQueue.add(car);`
        
- `remove()`
    
    - _Description:_ Retrieves and removes the head of the queue. Throws a `NoSuchElementException` if the queue is empty.1
        
    - _Example:_ `Vehicle v = carQueue.remove();`
        
- `element()` (from textbook 6, slides call it `first()` 1)
    
    - _Description:_ Retrieves, but does not remove, the head of the queue. Throws a `NoSuchElementException` if the queue is empty.6
        
    - _Example:_ `Vehicle v = carQueue.element();`
        
- `offer(E e)`
    
    - _Description:_ Inserts the specified element into the queue. Returns `false` if the queue is full.6
        
    - _Example:_ `boolean accepted = carQueue.offer(car);`
        
- `poll()`
    
    - _Description:_ Retrieves and removes the head of the queue. Returns `null` if the queue is empty.6
        
    - _Example:_ `Vehicle v = carQueue.poll();`
        
- `peek()`
    
    - _Description:_ Retrieves, but does not remove, the head of the queue. Returns `null` if the queue is empty.6
        
    - _Example:_ `Vehicle v = carQueue.peek();`
        
- (Includes all methods from `Collection`, such as `isEmpty()` 1)
    

### B. The `java.util.Deque<E>` Interface (Double-Ended Queue)

A "deque" (pronounced "deck") extends `Queue` to support element insertion and removal at both ends.1 As detailed in the textbook, it can be used as both a FIFO (Queue) and a LIFO (Stack).7 None of these methods were in the slides.

|**Function**|**First Element (Head)**|**Last Element (Tail)**|
|---|---|---|
|**Insert** (Throws)|`addFirst(E e)`|`addLast(E e)`|
|**Insert** (Special Val)|`offerFirst(E e)`|`offerLast(E e)`|
|**Remove** (Throws)|`removeFirst()`|`removeLast()`|
|**Remove** (Special Val)|`pollFirst()`|`pollLast()`|
|**Examine** (Throws)|`getFirst()`|`getLast()`|
|**Examine** (Special Val)|`peekFirst()`|`peekLast()`|

**Stack (LIFO) Methods (All Underlined):**

- `push(E e)` (Equivalent to `addFirst`)
    
    - _Description:_ Pushes an element onto the stack (the head of the deque). Throws an exception if capacity-restricted.7
        
    - _Example:_ `carQueue.push(car);`
        
- `pop()` (Equivalent to `removeFirst`)
    
    - _Description:_ Pops an element from the stack (the head of the deque). Throws an exception if empty.7
        
    - _Example:_ `Vehicle v = carQueue.pop();`
        

**Other Methods (All Underlined):**

- `removeFirstOccurrence(Object o)`
    
    - _Description:_ Removes the first occurrence of the specified element from this deque.7
        
    - _Example:_ `carQueue.removeFirstOccurrence(car);`
        
- `removeLastOccurrence(Object o)`
    
    - _Description:_ Removes the last occurrence of the specified element from this deque.7
        
    - _Example:_ `carQueue.removeLastOccurrence(car);`
        
- `descendingIterator()`
    
    - _Description:_ Returns an iterator over the elements in this deque in reverse sequential order.7
        
    - _Example:_ `Iterator<Vehicle> iter = carQueue.descendingIterator();`
        
- _(Includes all methods from `Queue` and `Collection`)_
    

## V. Map-Based Collections (Key-Value Pairs)

The `Map` interface is not a `Collection` but is a core part of the framework.1 It defines an object that maps unique keys to values.

### A. The `java.util.Map<K, V>` Interface

The slides cover the basic operations.1 The textbook API adds the powerful "view" methods (`keySet`, `values`, `entrySet`) and a suite of Java 8 methods for atomic and functional updates (`merge`, `compute`, etc.).1

- `put(K key, V value)`
    
    - _Description:_ Associates the specified value with the specified key in this map.1
        
    - _Example:_ `Vehicle oldV = carMap.put("VIN123", car);`
        
- `get(Object key)`
    
    - _Description:_ Returns the value to which the specified key is mapped, or `null` if this map contains no mapping for the key.1
        
    - _Example:_ `Vehicle v = carMap.get("VIN123");`
        
- `remove(Object key)`
    
    - _Description:_ Removes the mapping for a key from this map if it is present.1
        
    - _Example:_ `Vehicle oldV = carMap.remove("VIN123");`
        
- `containsKey(Object key)`
    
    - _Description:_ Returns `true` if this map contains a mapping for the specified key.1
        
    - _Example:_ `boolean hasKey = carMap.containsKey("VIN123");`
        
- `containsValue(Object value)`
    
    - _Description:_ Returns `true` if this map maps one or more keys to the specified value.1
        
    - _Example:_ `boolean hasVal = carMap.containsValue(car);`
        
- `size()`
    
    - _Description:_ Returns the number of key-value mappings in this map.1
        
    - _Example:_ `int count = carMap.size();`
        
- `isEmpty()`
    
    - _Description:_ Returns `true` if this map contains no key-value mappings.1
        
    - _Example:_ `boolean empty = carMap.isEmpty();`
        
- `clear()`
    
    - _Description:_ Removes all of the mappings from this map.8
        
    - _Example:_ `carMap.clear();`
        
- `putAll(Map<? extends K,? extends V> m)`
    
    - _Description:_ Copies all of the mappings from the specified map to this map.8
        
    - _Example:_ `carMap.putAll(otherVehicleMap);`
        
- `keySet()`
    
    - _Description:_ Returns a `Set` view of the keys contained in this map .
        
    - _Example:_ `Set<String> vinSet = carMap.keySet();`
        
- `values()`
    
    - _Description:_ Returns a `Collection` view of the values contained in this map .
        
    - _Example:_ `Collection<Vehicle> fleet = carMap.values();`
        
- `entrySet()`
    
    - _Description:_ Returns a `Set` view of the mappings (key-value pairs) contained in this map .
        
    - _Example:_ `Set<Map.Entry<String, Vehicle>> entries = carMap.entrySet();`
        
- `getOrDefault(Object key, V defaultValue)`
    
    - _Description:_ Returns the value for the key, or `defaultValue` if the key is not found.8
        
    - _Example:_ `Vehicle v = carMap.getOrDefault("VIN123", defaultVehicle);`
        
- `putIfAbsent(K key, V value)`
    
    - _Description:_ If the key is not already associated with a value, associates it with the given value.8
        
    - _Example:_ `Vehicle oldV = carMap.putIfAbsent("VIN123", car);`
        
- `remove(Object key, Object value)`
    
    - _Description:_ Removes the entry for the key only if it is currently mapped to the specified value.8
        
    - _Example:_ `boolean removed = carMap.remove("VIN123", car);`
        
- `replace(K key, V value)`
    
    - _Description:_ Replaces the entry for the key only if it is currently mapped to some value.8
        
    - _Example:_ `Vehicle oldV = carMap.replace("VIN123", car);`
        
- `replace(K key, V oldValue, V newValue)`
    
    - _Description:_ Replaces the entry for the key only if it is currently mapped to the specified old value.8
        
    - _Example:_ `boolean replaced = carMap.replace("VIN123", oldCar, newCar);`
        
- `replaceAll(BiFunction<? super K,? super V,? extends V> function)`
    
    - _Description:_ Replaces each entry's value with the result of invoking the given function on that entry.8
        
    - _Example:_ `carMap.replaceAll((vin, v) -> v.paint("Red"));`
        
- `merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFunction)`
    
    - _Description:_ If the key is present, merges the new value with the old value using the function; otherwise, puts the new value.8
        
    - _Example:_ `carMap.merge("VIN123", newCount, Integer::sum);`
        
- `compute(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
    
    - _Description:_ Attempts to compute a mapping for the key and its current value (or `null` if no mapping).8
        
    - _Example:_ `carMap.compute("VIN123", (vin, v) -> (v == null)? new Vehicle() : v.update());`
        
- `computeIfAbsent(K key, Function<? super K,? extends V> mappingFunction)`
    
    - _Description:_ If the key is not present, computes its value using the function and puts it in the map.8
        
    - _Example:_ `carMap.computeIfAbsent("VIN123", vin -> new Vehicle());`
        
- `computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction)`
    
    - _Description:_ If the key is present, computes a new mapping given the key and its current value.8
        
    - _Example:_ `carMap.computeIfPresent("VIN123", (vin, v) -> v.update());`
        
- `forEach(BiConsumer<? super K,? super V> action)`
    
    - _Description:_ Performs the given action for each entry in this map.8
        
    - _Example:_ `carMap.forEach((vin, v) -> System.out.println(vin));`
        
- `static <K, V> Map<K, V> of(K k1, V v1,...)`
    
    - _Description:_ Creates an immutable map containing the given key-value pairs.
        
    - _Example:_ `Map<String, Vehicle> fleet = Map.of("VIN123", car1);`
        
- `static <K, V> Map<K, V> ofEntries(Map.Entry<? extends K,? extends V>... entries)`
    
    - _Description:_ Creates an immutable map containing entries from the provided `Map.Entry` objects.
        
    - _Example:_ `Map<String, Vehicle> fleet = Map.ofEntries(Map.entry("VIN123", car1));`
        
- `static <K, V> Map.Entry<K, V> entry(K k, V v)`
    
    - _Description:_ A static factory method to create an immutable `Map.Entry` instance.
        
    - _Example:_ `Map.Entry<String, Vehicle> e = Map.entry("VIN123", car1);`
        
- `static <K, V> Map<K, V> copyOf(Map<? extends K,? extends V> map)`
    
    - _Description:_ Creates an immutable map containing the entries of the given map.
        
    - _Example:_ `Map<String, Vehicle> immutableFleet = Map.copyOf(carMap);`
        

### B. The `java.util.Map.Entry<K, V>` Interface

This nested interface defines the objects contained in a map's `entrySet`. It is crucial for iterating over key-value pairs and provides the only way to modify a _value_ without accessing the map by its _key_.

- `getKey()`
    
    - _Description:_ Returns the key corresponding to this entry .
        
    - _Example:_ `String vin = entry.getKey();`
        
- `getValue()`
    
    - _Description:_ Returns the value corresponding to this entry .
        
    - _Example:_ `Vehicle v = entry.getValue();`
        
- `setValue(V value)`
    
    - _Description:_ Replaces the value corresponding to this entry with the specified value .
        
    - _Example:_ `Vehicle oldV = entry.setValue(newCar);`
        
- `static <K, V> Comparator<Map.Entry<K, V>> comparingByKey()`
    
    - _Description:_ Returns a comparator that compares `Map.Entry` objects in natural order on the key .
        
    - _Example:_ `entryList.sort(Map.Entry.comparingByKey());`
        
- `static <K, V> Comparator<Map.Entry<K, V>> comparingByValue()`
    
    - _Description:_ Returns a comparator that compares `Map.Entry` objects in natural order on the value .
        
    - _Example:_ `entryList.sort(Map.Entry.comparingByValue());`
        

### C. The `java.util.SortedMap<K, V>` Interface

Extends `Map` to guarantee that elements are ordered by their keys.1 The textbook API provides methods for accessing the first/last keys and creating range-based "views".

- `comparator()`
    
    - _Description:_ Returns the `Comparator` used to order the keys, or `null` if using natural ordering .
        
    - _Example:_ `Comparator<? super String> c = carMap.comparator();`
        
- `firstKey()`
    
    - _Description:_ Returns the first (lowest) key currently in this map .
        
    - _Example:_ `String firstVIN = carMap.firstKey();`
        
- `lastKey()`
    
    - _Description:_ Returns the last (highest) key currently in this map .
        
    - _Example:_ `String lastVIN = carMap.lastKey();`
        
- `headMap(K toKey)`
    
    - _Description:_ Returns a view of the portion of this map whose keys are _strictly less than_ `toKey` .
        
    - _Example:_ `SortedMap<String, Vehicle> front = carMap.headMap("VIN500");`
        
- `tailMap(K fromKey)`
    
    - _Description:_ Returns a view of the portion of this map whose keys are _greater than or equal to_ `fromKey` .
        
    - _Example:_ `SortedMap<String, Vehicle> back = carMap.tailMap("VIN500");`
        
- `subMap(K fromKey, K toKey)`
    
    - _Description:_ Returns a view of the portion of this map from `fromKey` (inclusive) to `toKey` (exclusive) .
        
    - _Example:_ `SortedMap<String, Vehicle> section = carMap.subMap("VIN100", "VIN200");`
        
- _(Includes all methods from `Map`)_
    

### D. The `java.util.NavigableMap<K, V>` Interface

This textbook-only interface extends `SortedMap` with advanced navigation methods, similar to `NavigableSet`.

- `lowerKey(K key)`
    
    - _Description:_ Returns the greatest key _strictly less than_ the given key, or `null` .
        
    - _Example:_ `String k = carMap.lowerKey("VIN123");`
        
- `floorKey(K key)`
    
    - _Description:_ Returns the greatest key _less than or equal to_ the given key, or `null` .
        
    - _Example:_ `String k = carMap.floorKey("VIN123");`
        
- `ceilingKey(K key)`
    
    - _Description:_ Returns the least key _greater than or equal to_ the given key, or `null` .
        
    - _Example:_ `String k = carMap.ceilingKey("VIN123");`
        
- `higherKey(K key)`
    
    - _Description:_ Returns the least key _strictly greater than_ the given key, or `null` .
        
    - _Example:_ `String k = carMap.higherKey("VIN123");`
        
- `lowerEntry(K key)`
    
    - _Description:_ Returns a key-value mapping associated with the greatest key _strictly less than_ the given key .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.lowerEntry("VIN123");`
        
- `floorEntry(K key)`
    
    - _Description:_ Returns a key-value mapping associated with the greatest key _less than or equal to_ the given key .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.floorEntry("VIN123");`
        
- `ceilingEntry(K key)`
    
    - _Description:_ Returns a key-value mapping associated with the least key _greater than or equal to_ the given key .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.ceilingEntry("VIN123");`
        
- `higherEntry(K key)`
    
    - _Description:_ Returns a key-value mapping associated with the least key _strictly greater than_ the given key .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.higherEntry("VIN123");`
        
- `firstEntry()`
    
    - _Description:_ Returns a key-value mapping associated with the least key in this map .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.firstEntry();`
        
- `lastEntry()`
    
    - _Description:_ Returns a key-value mapping associated with the greatest key in this map .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.lastEntry();`
        
- `pollFirstEntry()`
    
    - _Description:_ Removes and returns a key-value mapping associated with the least key in this map .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.pollFirstEntry();`
        
- `pollLastEntry()`
    
    - _Description:_ Removes and returns a key-value mapping associated with the greatest key in this map .
        
    - _Example:_ `Map.Entry<String, Vehicle> e = carMap.pollLastEntry();`
        
- `descendingMap()`
    
    - _Description:_ Returns a reverse order view of the mappings contained in this map .
        
    - _Example:_ `NavigableMap<String, Vehicle> reversed = carMap.descendingMap();`
        
- `navigableKeySet()`
    
    - _Description:_ Returns a `NavigableSet` view of the keys contained in this map .
        
    - _Example:_ `NavigableSet<String> keys = carMap.navigableKeySet();`
        
- `descendingKeySet()`
    
    - _Description:_ Returns a reverse order `NavigableSet` view of the keys .
        
    - _Example:_ `NavigableSet<String> reversedKeys = carMap.descendingKeySet();`
        
- `headMap(K toKey, boolean inclusive)`
    
    - _Description:_ Returns a view of the portion of this map whose keys are less than (or equal to, if `inclusive` is true) `toKey` .
        
    - _Example:_ `NavigableMap<String, Vehicle> front = carMap.headMap("VIN500", true);`
        
- `tailMap(K fromKey, boolean inclusive)`
    
    - _Description:_ Returns a view of the portion of this map whose keys are greater than (or equal to, if `inclusive` is true) `fromKey` .
        
    - _Example:_ `NavigableMap<String, Vehicle> back = carMap.tailMap("VIN500", false);`
        
- `subMap(K from, boolean fromInc, K to, boolean toInc)`
    
    - _Description:_ Returns a view of the portion of this map whose keys range from `fromKey` to `toKey`, with control over endpoint inclusion .
        
    - _Example:_ `NavigableMap<String, Vehicle> section = carMap.subMap("A", true, "B", false);`
        
- _(Includes all methods from `SortedMap` and `Map`)_
    

## VI. The `java.util.Collections` Utility Class

This class consists entirely of `static` methods that provide algorithms, wrappers, and other utilities for collections.1 Your slides mention `sort` and `copy` 1, but the textbook provides a vast suite of tools.1

#### A. Algorithms (Sorting, Shuffling, Searching)

- `sort(List<T> list)`
    
    - _Description:_ Sorts the specified list into ascending order, according to the _natural ordering_ of its elements.5
        
    - _Example:_ `Collections.sort(carList);`
        
- `sort(List<T> list, Comparator<? super T> c)`
    
    - _Description:_ Sorts the specified list according to the order induced by the specified comparator.9
        
    - _Example:_ `Collections.sort(carList, carComparator);`
        
- `shuffle(List<?> list)`
    
    - _Description:_ Randomly permutes (shuffles) the specified list using a default source of randomness.9
        
    - _Example:_ `Collections.shuffle(carList);`
        
- `shuffle(List<?> list, Random rnd)`
    
    - _Description:_ Randomly permutes the specified list using the specified source of randomness.9
        
    - _Example:_ `Collections.shuffle(carList, new Random());`
        
- `binarySearch(List<? extends Comparable> list, T key)`
    
    - _Description:_ Searches the sorted list for the key using the binary search algorithm (natural ordering).9
        
    - _Example:_ `int i = Collections.binarySearch(carList, car);`
        
- `binarySearch(List<? extends T> list, T key, Comparator<? super T> c)`
    
    - _Description:_ Searches the sorted list for the key using the binary search algorithm and a comparator.9
        
    - _Example:_ `int i = Collections.binarySearch(carList, car, carComparator);`
        
- `max(Collection<? extends T> coll)`
    
    - _Description:_ Returns the maximum element of the given collection, according to natural ordering.5
        
    - _Example:_ `Vehicle maxV = Collections.max(carList);`
        
- `max(Collection<? extends T> coll, Comparator<? super T> comp)`
    
    - _Description:_ Returns the maximum element of the given collection, according to the specified comparator.9
        
    - _Example:_ `Vehicle maxV = Collections.max(carList, carComparator);`
        
- `min(Collection<? extends T> coll)`
    
    - _Description:_ Returns the minimum element of the given collection, according to natural ordering.9
        
    - _Example:_ `Vehicle minV = Collections.min(carList);`
        
- `min(Collection<? extends T> coll, Comparator<? super T> comp)`
    
    - _Description:_ Returns the minimum element of the given collection, according to the specified comparator.9
        
    - _Example:_ `Vehicle minV = Collections.min(carList, carComparator);`
        
- `copy(List<? super T> dest, List<? extends T> src)`
    
    - _Description:_ Copies all of the elements from one list (src) into another (dest).5
        
    - _Example:_ `Collections.copy(destinationList, sourceList);`
        
- `fill(List<? super T> list, T obj)`
    
    - _Description:_ Replaces all of the elements of the specified list with the specified element.9
        
    - _Example:_ `Collections.fill(carList, car);`
        
- `reverse(List<?> list)`
    
    - _Description:_ Reverses the order of the elements in the specified list.9
        
    - _Example:_ `Collections.reverse(carList);`
        
- `swap(List<?> list, int i, int j)`
    
    - _Description:_ Swaps the elements at the specified positions in the specified list .
        
    - _Example:_ `Collections.swap(carList, 0, 1);`
        
- `rotate(List<?> list, int distance)`
    
    - _Description:_ Rotates the elements in the specified list by the specified distance.9
        
    - _Example:_ `Collections.rotate(carList, 3);`
        
- `replaceAll(List<T> list, T oldVal, T newVal)`
    
    - _Description:_ Replaces all occurrences of one specified value in a list with another.9
        
    - _Example:_ `Collections.replaceAll(carList, oldCar, newCar);`
        
- `frequency(Collection<?> c, Object o)`
    
    - _Description:_ Returns the number of elements in the specified collection equal to the specified object.9
        
    - _Example:_ `int count = Collections.frequency(carList, car);`
        
- `disjoint(Collection<?> c1, Collection<?> c2)`
    
    - _Description:_ Returns `true` if the two specified collections have no elements in common.9
        
    - _Example:_ `boolean noOverlap = Collections.disjoint(carList1, carList2);`
        
- `indexOfSubList(List<?> source, List<?> target)`
    
    - _Description:_ Returns the starting position of the _first_ occurrence of the target list within the source list.9
        
    - _Example:_ `int i = Collections.indexOfSubList(carList, subList);`
        
- `lastIndexOfSubList(List<?> source, List<?> target)`
    
    - _Description:_ Returns the starting position of the _last_ occurrence of the target list within the source list.9
        
    - _Example:_ `int i = Collections.lastIndexOfSubList(carList, subList);`
        
- `addAll(Collection<? super T> c, T... elements)`
    
    - _Description:_ Adds all of the specified elements (varargs) to the specified collection.9
        
    - _Example:_ `Collections.addAll(carList, car1, car2);`
        

#### B. Wrapper Views (Unmodifiable)

These methods return a "view" of the collection that throws an `UnsupportedOperationException` if modification is attempted.1

- `unmodifiableCollection(Collection<? extends T> c)`
    
    - _Description:_ Returns an unmodifiable view of the specified collection.9
        
    - _Example:_ `Collection<Vehicle> readOnly = Collections.unmodifiableCollection(carList);`
        
- `unmodifiableList(List<? extends T> list)`
    
    - _Description:_ Returns an unmodifiable view of the specified list.9
        
    - _Example:_ `List<Vehicle> readOnly = Collections.unmodifiableList(carList);`
        
- `unmodifiableSet(Set<? extends T> s)`
    
    - _Description:_ Returns an unmodifiable view of the specified set.9
        
    - _Example:_ `Set<Vehicle> readOnly = Collections.unmodifiableSet(carSet);`
        
- `unmodifiableSortedSet(SortedSet<T> s)`
    
    - _Description:_ Returns an unmodifiable view of the specified sorted set.9
        
    - _Example:_ `SortedSet<Vehicle> readOnly = Collections.unmodifiableSortedSet(carSet);`
        
- `unmodifiableNavigableSet(NavigableSet<T> s)`
    
    - _Description:_ Returns an unmodifiable view of the specified navigable set.9
        
    - _Example:_ `NavigableSet<Vehicle> readOnly = Collections.unmodifiableNavigableSet(carSet);`
        
- `unmodifiableMap(Map<? extends K,? extends V> m)`
    
    - _Description:_ Returns an unmodifiable view of the specified map.9
        
    - _Example:_ `Map<String, Vehicle> readOnly = Collections.unmodifiableMap(carMap);`
        
- `unmodifiableSortedMap(SortedMap<K,? extends V> m)`
    
    - _Description:_ Returns an unmodifiable view of the specified sorted map .
        
    - _Example:_ `SortedMap<String, Vehicle> readOnly = Collections.unmodifiableSortedMap(carMap);`
        
- `unmodifiableNavigableMap(NavigableMap<K,? extends V> m)`
    
    - _Description:_ Returns an unmodifiable view of the specified navigable map.9
        
    - _Example:_ `NavigableMap<String, Vehicle> readOnly = Collections.unmodifiableNavigableMap(carMap);`
        

#### C. Wrapper Views (Synchronized)

These methods return a thread-safe "view" of the collection where every method is synchronized.1

- `synchronizedCollection(Collection<T> c)`
    
    - _Description:_ Returns a synchronized (thread-safe) collection backed by the specified collection .
        
    - _Example:_ `Collection<Vehicle> threadSafe = Collections.synchronizedCollection(carList);`
        
- `synchronizedList(List<T> list)`
    
    - _Description:_ Returns a synchronized (thread-safe) list backed by the specified list .
        
    - _Example:_ `List<Vehicle> threadSafe = Collections.synchronizedList(carList);`
        
- `synchronizedSet(Set<T> s)`
    
    - _Description:_ Returns a synchronized (thread-safe) set backed by the specified set.9
        
    - _Example:_ `Set<Vehicle> threadSafe = Collections.synchronizedSet(carSet);`
        
- ... (and so on for `SortedSet`, `NavigableSet`, `Map`, `SortedMap`, `NavigableMap`)...
    

#### D. Wrapper Views (Checked)

These methods return a "view" that performs runtime type checking, throwing a `ClassCastException` if an object of the wrong type is added.1

- `checkedCollection(Collection<E> c, Class<E> type)`
    
    - _Description:_ Returns a dynamically typesafe view of the specified collection.9
        
    - _Example:_ `Collection<Vehicle> checked = Collections.checkedCollection(carList, Vehicle.class);`
        
- `checkedList(List<E> list, Class<E> type)`
    
    - _Description:_ Returns a dynamically typesafe view of the specified list.9
        
    - _Example:_ `List<Vehicle> checked = Collections.checkedList(carList, Vehicle.class);`
        
- ... (and so on for `Set`, `Queue`, `SortedSet`, `NavigableSet`, `Map`, `SortedMap`, `NavigableMap`)...
    

#### E. Small Collections and Utilities

- `nCopies(int n, T o)`
    
    - _Description:_ Returns an immutable list consisting of _n_ copies of the specified object.9
        
    - _Example:_ `List<Vehicle> list = Collections.nCopies(100, car);`
        
- `singleton(T o)`
    
    - _Description:_ Returns an immutable set containing only the specified object.9
        
    - _Example:_ `Set<Vehicle> s = Collections.singleton(car);`
        
- `singletonList(T o)`
    
    - _Description:_ Returns an immutable list containing only the specified object.9
        
    - _Example:_ `List<Vehicle> l = Collections.singletonList(car);`
        
- `singletonMap(K key, V value)`
    
    - _Description:_ Returns an immutable map, mapping only the specified key to the specified value.9
        
    - _Example:_ `Map<String, Vehicle> m = Collections.singletonMap("VIN123", car);`
        
- `emptyList()`
    
    - _Description:_ Returns an empty immutable list .
        
    - _Example:_ `List<Vehicle> l = Collections.emptyList();`
        
- `emptySet()`
    
    - _Description:_ Returns an empty immutable set .
        
    - _Example:_ `Set<Vehicle> s = Collections.emptySet();`
        
- `emptyMap()`
    
    - _Description:_ Returns an empty immutable map .
        
    - _Example:_ `Map<String, Vehicle> m = Collections.emptyMap();`
        
- ... (and so on for `Iterator`, `ListIterator`, `Enumeration`, etc.)...
    
- `newSetFromMap(Map<E, Boolean> map)`
    
    - _Description:_ Returns a set backed by the specified map (typically a `HashMap`).9
        
    - _Example:_ `Set<Vehicle> s = Collections.newSetFromMap(new HashMap<Vehicle, Boolean>());`
        
- `enumeration(Collection<T> c)`
    
    - _Description:_ Returns an `Enumeration` (a legacy iterator) over the specified collection.9
        
    - _Example:_ `Enumeration<Vehicle> e = Collections.enumeration(carList);`
        
- `list(Enumeration<T> e)`
    
    - _Description:_ Returns an `ArrayList` containing the elements returned by the specified `Enumeration`.9
        
    - _Example:_ `ArrayList<Vehicle> l = Collections.list(enumeration);`
        

## VII. Legacy Collections

These classes pre-date the Collections Framework (from Java 1.0) but were retrofitted to implement the interfaces. Their use is discouraged in new code.1

### A. The `java.util.Enumeration<E>` Interface

The legacy equivalent of `Iterator`.

- `hasMoreElements()`
    
    - _Description:_ Tests if this enumeration contains more elements .
        
    - _Example:_ `while (e.hasMoreElements()) {... }`
        
- `nextElement()`
    
    - _Description:_ Returns the next element of this enumeration .
        
    - _Example:_ `Vehicle v = e.nextElement();`
        

### B. The `java.util.Stack<E>` Class

A LIFO (Last-In-First-Out) collection.1 It is considered flawed because it extends `Vector`, allowing indexed access that breaks the LIFO contract. The modern replacement is a `Deque` (e.g., `ArrayDeque`).

- `push(E item)`
    
    - _Description:_ Pushes an item onto the top of this stack .
        
    - _Example:_ `carStack.push(new Vehicle());`
        
- `pop()`
    
    - _Description:_ Removes the object at the top of this stack and returns that object .
        
    - _Example:_ `Vehicle v = carStack.pop();`
        
- `peek()`
    
    - _Description:_ Looks at the object at the top of this stack without removing it .
        
    - _Example:_ `Vehicle v = carStack.peek();`
        
- `empty()` (Note: `isEmpty()` is also available, inherited from `Vector` 10)
    
    - _Description:_ Tests if this stack is empty .
        
    - _Example:_ `boolean b = carStack.empty();`
        
- `search(Object o)`
    
    - _Description:_ Returns the 1-based position where an object is on this stack (1 is the top).10
        
    - _Example:_ `int i = carStack.search(new Vehicle());`
        
- _(Includes all methods from `Vector`, `List`, and `Collection`, which are not listed here as their use is discouraged on a `Stack`)_
    

### C. The `java.util.Hashtable<K, V>` Class

The legacy, synchronized (thread-safe) equivalent of `HashMap`.1 It does not permit `null` keys or values.1

- _(Includes all `Map` methods: `put`, `get`, `remove`, `containsKey`, `containsValue`, `size`, `isEmpty`, etc. All are underlined as they are not explicitly in the slides for `Hashtable`)_
    
- `elements()`
    
    - _Description:_ Returns an `Enumeration` of the values in this hashtable .
        
    - _Example:_ `Enumeration<Vehicle> e = carMap.elements();`
        
- `keys()`
    
    - _Description:_ Returns an `Enumeration` of the keys in this hashtable .
        
    - _Example:_ `Enumeration<String> e = carMap.keys();`
        
- `contains(Object value)` (Legacy version of `containsValue` 11)
    
    - _Description:_ Tests if some key maps to the specified value in this hashtable.11
        
    - _Example:_ `boolean b = carMap.contains(car);`
        
- `rehash()`
    
    - _Description:_ Increases the capacity of and internally reorganizes this hashtable.11
        
    - _Example:_ `carMap.rehash();`
        

### D. The `java.util.Properties` Class

A legacy subclass of `Hashtable` for storing string-to-string mappings, often used for configuration files.

- `getProperty(String key)`
    
    - _Description:_ Searches for the property with the specified key in this property list (and its defaults) .
        
    - _Example:_ `String prop = carProps.getProperty("vin");`
        
- `getProperty(String key, String defaultValue)`
    
    - _Description:_ Searches for the property, returning the `defaultValue` if the key is not found .
        
    - _Example:_ `String prop = carProps.getProperty("color", "blue");`
        
- `setProperty(String key, String value)`
    
    - _Description:_ Calls the `Hashtable` method `put`, enforcing that keys and values are `String`s.12
        
    - _Example:_ `carProps.setProperty("color", "red");`
        
- `load(InputStream inStream)`
    
    - _Description:_ Reads a property list (key and element pairs) from the input byte stream.12
        
    - _Example:_ `carProps.load(fileInputStream);`
        
- `load(Reader reader)`
    
    - _Description:_ Reads a property list (key and element pairs) from the input character stream.12
        
    - _Example:_ `carProps.load(fileReader);`
        
- `store(OutputStream out, String comments)`
    
    - _Description:_ Writes this property list (key and element pairs) to the output stream.12
        
    - _Example:_ `carProps.store(fileOutputStream, "Vehicle Properties");`
        
- `store(Writer writer, String comments)`
    
    - _Description:_ Writes this property list (key and element pairs) to the output character stream.12
        
    - _Example:_ `carProps.store(fileWriter, "Vehicle Properties");`
        
- `loadFromXML(InputStream in)`
    
    - _Description:_ Loads all properties represented by the XML document on the specified input stream.12
        
    - _Example:_ `carProps.loadFromXML(fileInputStream);`
        
- `storeToXML(OutputStream os, String comment)`
    
    - _Description:_ Emits an XML document representing all of the properties contained in this table.12
        
    - _Example:_ `carProps.storeToXML(fileOutputStream, "Vehicle Properties");`
        
- `stringPropertyNames()`
    
    - _Description:_ Returns a set of keys in this property list where both the key and value are strings.12
        
    - _Example:_ `Set<String> names = carProps.stringPropertyNames();`
        
- _(Includes all (flawed) methods from `Hashtable<Object, Object>`)_