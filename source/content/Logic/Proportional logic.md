## Proportional Formulas

Propositions are the _atomic_ statements. A proposition is a declarative sentence that must be either True or False, but not both. We represent them with lowercase letters like p,q,r.

If `q` is in $\mathbb{F}$, then `(¬q)` is also in $\mathbb{F}$.

### Formulas as Trees

A formula in propositional logic is a tree defined recursively:
• A formula is a leaf labeled by an atomic proposition.
• A formula is a node labeled by ¬ with a single child that is a formula.
• A formula is a node labeled by one of the binary operators with two children both
of which are formulas

| Operation    | Symbol | Read as |
| ------------ | ------ | ------- |
| negation     | ¬      | Not     |
| conjunction  | ∧      | And     |
| nand         | ↑      |         |
| disjunction  | ∨      | Or      |
| nor          | ↓      |         |
| implication  | →      | Implies |
| equivalence  | ↔      | Iff     |
| exclusive or | ⊕      |         |

### Formulas as Strings

#### Inorder Traversal Algorithm

```css
Inorder(F)
if F is a leaf
write its label
return
let F1 and F2 be the left and right subtrees of F
Inorder(F1)
write the label of the root of F
Inorder(F2)

If the root of F is labeled by negation, the left subtree is considered to be empty and
the step Inorder(F1) is skipped.
```

##### Steps

1. **Base case — if F is a leaf**
- A leaf means it’s an **atomic proposition** (p, q, r, etc.).
- If so → just write its label (e.g., `p`) and **stop**.

1. **Recursive case — if F has children**
- Let $F_1$​ = left subtree, $F_2$​ = right subtree.
- **First**: Call $Inorder(F_1)$ → this prints the left part of the formula.
- **Second**: Write the label of the root node (the operator, e.g., `∧`).
- **Third**: Call $Inorder(F_2)$ → this prints the right part of the formula.

3. **Special rule for negation (¬)**
- Negation is a **unary operator** → it has **only a right subtree**.
- So the left subtree is treated as empty → skip $Inorder(F_1)$ and:
   - Write `¬`
   - Then $Inorder(F_2)$ for the operand.


##### Example

Formula
(p→q)↔(¬q→¬p)

Tree

```css
           ↔
        /     \
      →         →
    /   \     /   \
   p     q   ¬q   ¬p

```

#### Resolving Ambiguity in the String Representation

##### 1. Using Parentheses

```css
Inorder(F)
if F is a leaf
write its label
return
let F1 and F2 be the left and right subtrees of F
write a left parenthesis ’(’
Inorder(F1)
write the label of the root of F
Inorder(F2)
write a right parenthesis ’)’

If the root of F is labeled by negation, the left subtree is considered to be empty and
the step Inorder(F1) is skipped.
```


##### 2. Precedence

The second way of resolving ambiguous formulas is to define precedence and associativity conventions among the operator.

The Boolean operators ∧, ∨, ↔, ⊕ are associative so we will often omit parentheses in formulas that have repeated occurrences of these operators: p ∨ q ∨ r ∨ s. Note that →, ↓, ↑ are not associative, so parentheses must be used to avoid confusion. Although the implication operator is assumed to be right associative, so that p → q → r unambiguously means p → (q → r), we will write the formula with parentheses to avoid confusion with (p → q) → r.

##### 3. Polish Notation

```css
Call the recursive procedure Preorder(A):
Preorder(F)
write the label of the root of F
if F is a leaf
return
let F1 and F2 be the left and right subtrees of F
Preorder(F1)
Preorder(F2)

If the root of F is labeled by negation, the left subtree is considered to be empty and the step Preorder(F1) is skipped.
```

(p→q)↔(¬q→¬p) can be written as ↔ → p q → ¬ p¬ q. 

Polish notation is normally used only in the internal representation of arithmetic and logical expressions in a computer. The advantage of Polish notation is that the expression can be evaluated in the linear order that the symbols appear using a stack.

If we rewrite the first formula backwards (reverse Polish notation) q¬ p¬ → qp → ↔, it can be directly compiled to the following sequence of instructions of an assembly language.


### Structural Induction

#### Definition 
Let A ∈ $\mathbb{F}$ . If A is not an atom, the operator labeling the root of the formula A is the principal operator of the A.

Structural induction is used to prove that a property holds for all formulas. This form of induction is similar to the familiar numerical induction that is used to prove that a property holds for all natural numbers. In numerical induction, the base case is to prove the property for 0 and then to prove the inductive step, assume that the property holds for arbitrary n and then show that it holds for n + 1. A formula is either a leaf labeled by an atom or it is a tree with a principal operator and one or two subtrees. The base case of structural induction is to prove the property for a leaf and the inductive step is to prove the property for the formula obtained by applying the principal operator to the subtrees, assuming that the property holds for the subtrees.

#### Theorem 
To show that a property holds for all formulas A ∈ $\mathbb{F}$ :
1. Prove that the property holds all atoms p.
2. Assume that the property holds for a formula A and prove that the property holds for ¬ A.
3. Assume that the property holds for formulas A1 and A2 and prove that the property holds for $A_1$ op $A_2$, for each of the binary operators. Here, op is just a placeholder meaning “any binary logical operator” from the set used in propositional logic.
##### Proof 
Let A be an arbitrary formula and suppose that (1), (2), (3) have been shown for some property. We show that the property holds for A by numerical induction on n, the height of the tree for A. For n = 0, the tree is a leaf and A is an atom p, so the property holds by (1). Let n > 0. The subtrees A are of height n − 1, so by numerical induction, the property holds for these formulas. The principal operator of A is either negation or one of the binary operators, so by (2) or (3), the property
holds for A.

### A Formal Grammar for Formulas

The productions of the grammar are:
fml ::= p for any p ∈ $\mathbb{P}$
fml ::= ¬ fml
fml ::= fml op fml
op ::= ∨ | ∧ | → | ↔ | ⊕ | ↑ | ↓


## Interpretations

An interpretation I is simply a function $I : \mathcal{P} \rightarrow \{\mathbf{T}, \mathbf{F}\}$

That means:
- It takes each propositional variable from the set $\mathcal{P}$ (like _p_, _q_, _r_)
- And assigns it either True (T) or False (F).

### Partial Interpretations

Let $A \in \mathcal{F}$. A partial interpretation for $A$ is a partial function $\mathcal{I}_A : \mathcal{P}_A \mapsto \{T, F\}$ that assigns one of the truth values $T$ or $F$ to some of the atoms in $\mathcal{P}_A$. 




