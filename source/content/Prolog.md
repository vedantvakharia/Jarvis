## Logic Symbols

| Logic       | Symbol |
| ----------- | ------ |
| And         | ,      |
| Implication | :-     |

## Relationships

To establish a relationship between 2 arguments A and B, we write using `the_relationship_name(A, B)`. 

If we were to write `parent(bob, tom).`, Prolog would simply believe that Bob is the parent of Tom, because it just follows the pattern we give it.

**`?-`** signals that you are about to ask a query, or in Prolog terms, you are giving it a goal to solve. 

```css
?- parent(bob, pat)  
// Asking if bob is the parent of pat. Replies with yes or no

?- parent(X, pat)
// Asking who is the parent of pat. Replies with the parent name.

?- parent(pat, X)
// Asking who is the son of pat. Replies with the son name.

// If there are multiple answers to the above question, it will output only 1 ansewer. For more answers, we need to type ;

?- parent(X, Y)
// Lists all the parent-child relationships
```

### Finding Composed Relations (like a Grandparent)

To find a relationship that spans two "steps" (like a grandparent), you can break the problem down.

- **Problem**: Who is Jim's grandparent? 
- **Logic**:
1. First, find a person -`Y` who is a parent of Jim. 
2. Second, find a person -`X` who is a parent of `Y`. 
- **Prolog Query**: You write this as a sequence of two goals. ',' means and, so both goals must be satisfied. 
 
``` css
?- parent(Y, jim), parent(X, Y).
```

- **Result**: Prolog finds values for `X` and `Y` that make both statements true (e.g., `X = bob`, `Y = pat`). 

---

### Finding a Common Relationship (like a Common Parent)

To find if two individuals share a relationship with the same person, you use a shared variable.

- **Problem**: Do Ann and Pat have a common parent? 
- **Logic**:
1. First, find a person`X` who is a parent of Ann. 
2. Second, check if that same `X` is also a parent of Pat. 
- **Prolog Query**: By using the same variable name `X` in both goals, you are telling Prolog that it must be the same person satisfying both conditions. 

``` css
?- parent(X, ann), parent(X, pat).
```

- **Result**: Prolog finds a single value for `X` that is the parent of both Ann and Pat (e.g., `X = bob`).

### Unary Relationships

```css
female(pat).

// This can be done using binary relationships too.
sex(pat, feminine).
```

### Implications

```css
// For all X and Y, Y is an offspring of X if X is a parent of Y.
offspring( Y, X) :- parent( X, Y).
```

### Rules

A rule is a statement that is true if  some condition is satisfied.

- **Structure of a Rule**: Rules have a conclusion part (the **head**) and a condition part (the **body**).
    - `head :- body.`
    - This is read as: "The head is true if the body is true.".

```css
// This is the rule for the offspring relationship.
offspring(Y, X) :- parent(X, Y).

?- offspring(liz, tom)
// When this is done, it substitutes Y with liz and X with tom, which turns the goal into parent(tom, liz). It then searches its database for this fact. Since the fact exists, the original goal succeeds. This process of substituting variables is called instantiation.
```

#### Rules with Multiple Conditions

Rules can have multiple conditions in their body. The conditions are connected by a **comma (,)**, which means **"and"**. Both conditions must be true for the head to be true.

```css
// X is the mother of Y if X is a parent of Y and X is female.
mother(X, Y) :- parent(X, Y), female(X).

// X is a sister of Y if they both have the same parent Z and X is female.

sister(X, Y) :-
    parent(Z, X),
    parent(Z, Y),
    female(X).
// This rule has a problem. If you ask ?- sister(X, pat), Prolog will find X = ann but also X = pat. Pat is considered her own sister because the rule does not state that X and Y must be different individuals. To fix this, u add a condition that X and Y are not same. 

sister(X, Y) :-
	parent(Z, X),
	parent(Z, Y),
	female(X),
	different(X, Y).
```
### Recursion

```css
% Recursive solution for recursion

% Rule 1: The Base Case
predecessor(X, Z) :-
    parent(X, Z).

% Rule 2: The Recursive Step
predecessor(X, Z) :-
    parent(X, Y),
    predecessor(Y, Z).
```

## Data Objects

![[Pasted image 20250922192808.png]]

Variables start with upper-case letters whereas atoms start with lower-case letter.
### Atoms

Atoms are symbolic constants, used to name objects and relationships. They can be constructed in three different ways - 
1. **Strings starting with a lower-case letter -** These are strings of letters, digits, and the underscore character (`_`) that begin with a lower-case letter. 
2. **Strings of special characters -** These are strings made up of characters like `+`, `-`, `*`, `/`, `<`, `>`, `=`, `:`, `<--->`, `=====`, `::=`. You have to be careful, as some of these have a predefined meaning in Prolog, like `:-`.
3. **Strings in single quotes -** Any sequence of characters enclosed in single quotes forms an atom88. This is useful for atoms that start with a capital letter (to distinguish them from variables) or contain spaces. Examples -`'Tom'`, `'South America'`, `'Sarah Jones'`.

---

### Numbers

Prolog supports both integers and real numbers. The syntax for integers is simple and includes positive and negative whole numbers. There is a limit to the range of integers, which depends on the specific Prolog implementation. Real numbers are not used as frequently in typical Prolog programming for two main reasons - 1. Prolog is primarily a language for symbolic computation, not heavy number-crunching. 2. Real number arithmetic can introduce rounding errors, which can affect the logical neatness of a program.

---
### Variables

Variables in Prolog are strings of letters, digits, and underscore characters. They serve as placeholders for objects that are not yet known. A variable name must start with an upper-case letter** or an underscore character (`_`). Examples - `X`, `Result`, `Object2`, `ShoppingList`, `_23`. 

#### The Anonymous Variable (`_`)

Prolog has a special variable called the anonymous variable, which is written as a single underscore `_`.

You use the anonymous variable when a variable appears only once in a clause, and u don't need to refer to its value again. This saves you from having to invent a name for a variable you don't care about. 

```css
// X has a child if X is a parent of some person
hasachild(X) :- parent(X, _).
hasachild(X) :- parent(X, Y).
// Both are equivalent
```

Each occurrence of `_` in a clause represents a new and distinct variable. `parent(_, _)` is equivalent to `parent(X, Y)`. This is very different from `parent(X, X)`, which forces both arguments to be the same object. 
#### Lexical Scope

The lexical scope of a variable's name is just one clause (a single fact or rule). This means that if a variable name like X appears in two different clauses, it signifies two different variables. 

However, every occurrence of X within the same clause refers to the same variable. This is different from constants (atoms), where an atom like tom refers to the exact same object throughout the entire program.

---
### Structures

Structures (or structured objects) are single objects that are composed of several components1. These components can be any type of Prolog object, including other structures, allowing you to create complex, hierarchical data.

Syntactically, all data objects in Prolog including simple objects like atoms, numbers, and variables, as well as complex structures are called terms.

```css
// To combine several components into a single structured object, you must choose a name called a functor.
functor(component1, component2, ...) // Syntax

// A date can be viewed as a structure with three components: day, month, and year. Using date as the functor, the date 1st May 1983 is written as
date(1, may, 1983)

// Components can be simple objects (atoms, numbers) or variables. For example, any day in May can be represented by
date(Day may, 1983)
```

#### Structures as Trees

All structured objects in Prolog can be visualized as trees. The functor is the root of the tree. The components (arguments) are the children of the root. If a component is also a structure, it forms a subtree.

**Example**: Representing geometric objects:
- A point with two coordinates: `point(1, 1)`
- A line segment defined by two points: `seg(point(1,1), point(2,3))`
- A triangle defined by three points: `triangle(point(4,2), point(6,4), point(7,1))`

#### Functor Identity: Name and Arity

Prolog identifies a functor not just by its name, but by its name and its arity (the number of arguments) combined. This means you can have different functors that share the same name as long as they have a different number of arguments.

```css
point(X, Y)       % A functor for 2D points
point(X, Y, Z)    % A different functor for 3D points
```


---

$$\frac{1}{3-4D+D^2} = \frac{1}{3}\left(\frac{1}{1 - \frac{4D-D^2}{3}}\right) \approx \frac{1}{3}\left(1 + \frac{4D}{3}\right)$$Now, apply this to $x$:$$\frac{1}{3}\left(1 + \frac{4D}{3}\right)(x) = \frac{1}{3}\left(x + \frac{4}{3}D(x)\right) = \frac{1}{3}\left(x + \frac{4}{3}\right) = \frac{x}{3} + \frac{4}{9}$$