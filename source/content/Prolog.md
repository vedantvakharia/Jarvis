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