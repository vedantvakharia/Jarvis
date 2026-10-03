# Lecture 6 (Week 5): Applications of SVD, Density Estimation & the Curse of Dimensionality

## Contents
1. [[#1. Recap and Plan]]
2. [[#2. SVD as Latent Structure]]
3. [[#3. Latent Semantic Indexing (LSI)]]
4. [[#4. Low-Rank Recommenders]]
5. [[#5. From Subspaces to Shape]]
6. [[#6. Kernel Density Estimation]]
7. [[#7. KDE Convergence Rate]]
8. [[#8. Curse of Dimensionality: Neighbourhoods]]
9. [[#9. Curse of Dimensionality: Distances Concentrate]]
10. [[#10. The Fix: Reduce Dimension First]]
11. [[#11. Case Study 1: UMAP]]
12. [[#12. Case Study 2: RAG]]
13. [[#13. RAG Training]]
14. [[#14. RAG-Token and Where RAG Breaks]]
15. [[#15. Exam Cheat Sheet]]

---

## 2. SVD as Latent Structure

$A_k=\sum_{i=1}^k\sigma_iu_iv_i^T$ replaces the raw features by $k$ **latent factors**.

> [!tip] Key idea
> Two rows are "similar" if they load similarly on the top factors, even if they share few raw features.

**What a latent factor is.** A hidden pattern (e.g. "likes sci-fi") that is not one of the raw columns but a combination of columns that tend to move together. Row $i$'s **loadings** are its coordinates along $v_1,\dots,v_k$, i.e. row $i$ of $U_k\Sigma_k$ (the projection of the row onto the top-$k$ subspace).

### Example: users and movies

Rows = 6 users, columns = 4 movies (SF1, SF2, Rom1, Rom2); entries are ratings, 0 = not rated.

| User | SF1 | SF2 | Rom1 | Rom2 |
|---|---|---|---|---|
| Alice | 5 | 0 | 0 | 0 |
| Bob | 0 | 5 | 0 | 0 |
| Cara | 4 | 4 | 0 | 0 |
| Dan | 0 | 0 | 4 | 0 |
| Eve | 0 | 0 | 0 | 5 |
| Frank | 0 | 0 | 3 | 3 |

**Problem with raw features.** Alice rated only SF1 and Bob only SF2. They share **no** movie, so their raw cosine similarity is $0$, yet both like sci-fi.

**SVD.** Singular values $7.55,\,6.29,\,5.00,\,4.41$. Keep $k=2$; the top right singular vectors are

- $v_1=(0.71,\,0.71,\,0,\,0)$: the "sci-fi" factor
- $v_2=(0,\,0,\,0.53,\,0.85)$: the "romance" factor

The sci-fi factor exists because Cara rated both SF movies, linking them (co-occurrence).

**Loadings** (rows of $U_2\Sigma_2$):

| User | Sci-fi | Romance |
|---|---|---|
| Alice | 3.54 | 0 |
| Bob | 3.54 | 0 |
| Cara | 5.66 | 0 |
| Dan | 0 | 2.10 |
| Eve | 0 | 4.25 |
| Frank | 0 | 4.13 |

Check Alice: $(5,0,0,0)\cdot v_1=5\times0.71=3.54$ ✓.

| Pair | Raw cosine | Latent cosine |
|---|---|---|
| Alice vs Bob | 0 | **1.0** |
| Dan vs Eve (both romance, no shared movie) | 0 | **1.0** |
| Alice vs Dan | 0 | 0 |

**What was dropped.** The discarded factors ($\sigma_3=5,\ \sigma_4=4.41$) are the quirks separating Alice from Bob (e.g. "Alice only rated SF1"). Truncation removes these and keeps the shared taste.

**Bonus (leads to Section 4).** The rank-2 reconstruction of Alice's row is $3.54\,v_1=(2.5,\,2.5,\,0,\,0)$: the model predicts she would rate SF2 about $2.5$ though she never rated it.

> [!tip] Exam recap
> 1. $A_k$ replaces raw features by $k$ latent factors; loadings $=U_k\Sigma_k$ (projections onto $v_1\dots v_k$).
> 2. Rows are similar if their loadings are similar, even with no raw feature in common.
> 3. Factors come from co-occurrence patterns.
> 4. This fixes synonymy, which is the idea behind LSI (Section 3).

---

## 3. Latent Semantic Indexing (LSI)

### The retrieval problem

Given a query $q$, rank the documents by relevance using only word counts.

Raw word matching fails because of:
- **Synonymy:** different words, same meaning ("car" vs "automobile").
- **Polysemy:** same word, different meanings ("bank").

**Idea:** match **latent concepts** from the SVD of the term-document matrix instead of words.

### Term-document matrix

$A\in\mathbb{R}^{n\times d}$, $A_{ij}$ = count of term $i$ in document $j$. **Rows = terms, columns = documents.** Mostly zeros (sparse).

| | D1 | D2 | D3 | D4 |
|---|---|---|---|---|
| car | 2 | 0 | 1 | 0 |
| automobile | 0 | 2 | 1 | 3 |
| loan | 5 | 0 | 0 | 1 |
| bank | 0 | 0 | 6 | 2 |

(Orientation is a convention. Using documents as rows just swaps the roles of $U$ and $V$.)

**Encoding the query.** $q\in\mathbb{R}^n$: count each term of the query in the same $n$ term slots. "car loan" $\to q=(1,0,1,0,\dots)^T$. A query is just an unseen column of $A$.

### Algorithm (LSI retrieval)

1. **Input:** $A\in\mathbb{R}^{n\times d}$, query $q\in\mathbb{R}^n$, rank $k$
2. SVD: $A=U\Sigma V^T$
3. Truncate: $U_k\leftarrow$ first $k$ columns of $U$
4. Encode query: $q_k\leftarrow U_k^Tq$
5. **for** $j=1,\dots,d$:
   - encode document: $d_j\leftarrow U_k^TA_{\cdot j}$
   - score: $s_j\leftarrow\cos(q_k,d_j)$
6. **return** documents sorted by $s_j$, descending

Here $U_k$ is used because documents are columns, so the concept directions live in term space $\mathbb{R}^n$.

### Why orthonormality makes the comparison fair

$U_k$ has orthonormal columns: $U_k^TU_k=I_k$. Let $P_k=U_kU_k^T$ be the orthogonal projector onto the concept subspace. For any $x,y\in\mathbb{R}^n$:

$$(U_k^Tx)^T(U_k^Ty)=x^TU_kU_k^Ty=(P_kx)^T(P_ky)$$

$$\lVert U_k^Tx\rVert^2=x^TU_kU_k^Tx=\lVert P_kx\rVert^2$$

So the $k$-dimensional codes $q_k$, $d_j$ have exactly the same lengths and angles as the projected vectors $P_kq$, $P_kA_{\cdot j}$. No stretching, no skew. With a non-orthonormal basis, angles between codes would not match angles between projections.

### Why it works

- **Desired property:** a term's meaning must not depend on its row index. If we permute the rows of $A$, the latent vectors should permute the same way.
- **Lemma (BHK Ch. 3):** if $A'=PA$ for a permutation $P$, then $A'=(PU)\Sigma V^T$. Same $\Sigma$, same $V$, and $U'=PU$.
- Synonyms **co-occur** with the same other words, so their rows are nearly parallel. The signal is already in $A$; SVD just names the direction $u_i$.
- $A_k$ keeps the top co-occurrence patterns and drops one-off noise. It can put a nonzero value at (car, D2) where $A$ had 0. This is **inference, not just compression**.

### Toy example: LSI finds a synonym

Only D3 uses both words:

$$A=\begin{pmatrix}2&0&1\\0&2&1\end{pmatrix}\ \begin{matrix}\text{car}\\\text{automobile}\end{matrix},\qquad AA^T=\begin{pmatrix}5&1\\1&5\end{pmatrix}$$

Columns of $U$ = eigenvectors of $AA^T$:

$$u_1=\tfrac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}\ (\sigma_1^2=6),\qquad u_2=\tfrac1{\sqrt2}\begin{pmatrix}1\\-1\end{pmatrix}\ (\sigma_2^2=4)$$

With $k=1$: a single "vehicle" factor, equal weight on both terms, inferred purely from co-occurrence in D3.

**Retrieval.** Query $q=(1,0)^T$ ("car"). Documents $D_1=(2,0)^T$, $D_2=(0,2)^T$, $D_3=(1,1)^T$.

| | D1 | D2 | D3 |
|---|---|---|---|
| Raw match $q^TD_j$ | 2 | **0 (miss)** | 1 |
| Concept code $U_1^TD_j$ | $\sqrt2$ | $\sqrt2$ | $\sqrt2$ |

Query code: $U_1^Tq=\tfrac1{\sqrt2}$.

D2 (which only says "automobile") was missed by raw matching but now scores the same as D1 and D3. They tie because every column of $A$ sums to 2.

> [!warning] Caveat
> At $k=1$ the codes are scalars, so every cosine is $\pm1$. Cosine scoring needs $k\ge2$; here we compare the codes directly.

### Fuller example: the $4\times4$ table, $k=2$

Use the term-document table above. Singular values: $6.83,\ 5.35,\ 3.10,\ 0.39$. Query "car loan": $q=(1,0,1,0)^T$.

Keep $k=2$ and score each document by $\cos(q_2,d_j)$ with $q_2=U_2^Tq=(-0.42,\,1.21)$:

| Document | Raw cosine | Concept cosine ($k=2$) |
|---|---|---|
| D1 | 0.92 | 1.00 |
| D2 (only says "automobile") | **0.00** | **0.25** |
| D3 | 0.12 | 0.09 |
| D4 | 0.19 | 0.40 |

Ranking by raw match: D1, D4, D3, D2. By concept: D1, D4, **D2**, D3. D2 moves from exactly $0$ to above D3 because "automobile" shares a concept with "car". The effect is modest because the table is tiny. (Numbers computed numerically; the sign of each column of $U$ is arbitrary but cosines do not depend on it.)

> [!tip] Exam recap
> 1. $A$ is terms $\times$ documents; encode the query as one more column.
> 2. Codes: $q_k=U_k^Tq$, $d_j=U_k^T A_{\cdot j}$; score by cosine, sort descending.
> 3. Orthonormal $U_k$ means code-space lengths and angles equal the projected ones.
> 4. Synonyms get nearly parallel rows, so SVD puts them in one concept; $A_k$ can fill in zeros (inference).
> 5. At $k=1$ cosines are $\pm1$, so use $k\ge2$ for cosine scoring.

---

## 4. Low-Rank Recommenders

- $A$: (user $\times$ item) ratings matrix, **mostly missing**.
- **Model:** the complete ratings matrix is approximately low rank. Each user and each item is described by $k$ latent factors.
- Fit $A\approx U_k\Sigma_kV_k^T$ and predict a missing rating as the entry of the rank-$k$ reconstruction:

$$\hat A_{ij}=\sum_{\ell=1}^{k}\sigma_\ell\,u_{i\ell}\,v_{j\ell}$$

Same Eckart–Young intuition: if the true preference matrix has a small singular-value tail, a few factors predict the rest.

### Toy example: the answer depends on the fill

$$A=\begin{pmatrix}5&4&3\\10&8&6\\15&12&?\end{pmatrix}$$

Row 3 is $3\times$ row 1, so the true rank-1 answer is $?=9$.

Plain SVD needs a complete matrix, so we must fill the gap first:

| Fill "?" with | Rank-1 SVD prediction for "?" |
|---|---|
| 0 | 3.28 |
| 20 | 18.19 |

> [!warning] Imputation dependent
> Plain SVD treats the filled-in value as real data, so the answer depends on what you fill. Neither gives 9.

### The correct objective (masked)

$$\min_{U,V}\sum_{(i,j)\text{ observed}}\Big(A_{ij}-(UV^T)_{ij}\Big)^2$$

- Still a rank-$k$ model $\hat A=UV^T$, but the error is scored **only where we have ground truth**. Low rank extrapolates the rest.
- No closed form and non-convex. Solved by **ALS** or gradient descent.
- This masked formulation, not a plain SVD, is what Netflix-Prize-style recommenders optimise.

### Alternating Least Squares (ALS)

Rows of $U$ are user factors $p_u\in\mathbb{R}^k$; rows of $V$ are item factors $q_i\in\mathbb{R}^k$. $\mathcal K$ = set of observed entries.

1. **Input:** $\mathcal K$, rank $k$, regularisation $\lambda$
2. Initialise $q_i\leftarrow$ small random
3. **repeat**
   - for each user $u$: $\ p_u\leftarrow\arg\min_p\sum_{i:(u,i)\in\mathcal K}(A_{ui}-p\cdot q_i)^2+\lambda\lVert p\rVert^2$
   - for each item $i$: $\ q_i\leftarrow\arg\min_q\sum_{u:(u,i)\in\mathcal K}(A_{ui}-p_u\cdot q)^2+\lambda\lVert q\rVert^2$
4. **until** error on $\mathcal K$ stops improving
5. **return** $\hat A_{ui}=p_u\cdot q_i$

- Each update is one **ridge regression** with a closed-form solution.
- The problem is non-convex jointly, but **convex in $U$ alone or $V$ alone**.
- Guaranteed only to reach a stationary point. Hence random, not zero, initialisation (zero init would stay at zero).

---

## 5. From Subspaces to Shape

- Both applications **assume** the data lies in a $k$-dimensional subspace.
- A rank-$k$ model of an $m\times n$ matrix has $k(m+n-k)$ numbers to fit. The ambient dimension $d$ never enters.
- Both end with a nearest-neighbour search done **after** truncation, in $k$ dimensions rather than $d$.

Next: drop the subspace assumption. Estimate density and neighbours directly from samples.

> [!tip]
> Weaker assumptions need more samples. That cost is the curse of dimensionality.

---

## 6. Kernel Density Estimation

**Goal:** estimate the density $p(x)$ directly from samples $x^{(1)},\dots,x^{(n)}\in\mathbb{R}^d$.

$$\hat p(x)=\frac{1}{n\,h^d}\sum_{i=1}^{n}K\!\left(\frac{x-x^{(i)}}{h}\right)$$

- $K$: **kernel** (e.g. Gaussian).
- $h$: **bandwidth** = width of each bump (the standard deviation for a Gaussian kernel). It is the continuous version of histogram bin width.
- In words: place a small bump at each sample and add them up.
- The $1/h^d$ keeps each bump's total mass equal to 1.

### Bandwidth trade-off

| $h$ | Estimate | Bias | Variance | Effect |
|---|---|---|---|---|
| Small | spiky | low | high | overfits the sample, hallucinates spikes |
| Large | smooth | high | low | washes out real structure, merges modes |

The optimal $h$ balances the two (bias–variance trade-off):

$$h^*\propto n^{-1/(d+4)}$$

(for a density with a square-integrable second derivative).

---

## 7. KDE Convergence Rate

> [!note] Theorem (easiest case)
> Let the truth be $p=N(0,I_d)$ and estimate it with a Gaussian kernel at its centre $x=0$. With $\mathrm{MSE}(\hat p(0))=E[(\hat p(0)-p(0))^2]$ and optimal $h$:
> $$\mathrm{MSE}(\hat p(0))\propto n^{-4/(d+4)}$$

More samples always help, but each extra dimension slows the help down, even for the easiest density there is.

Note: the estimator is **never told** $p$ is Gaussian. If you assume the Gaussian form you only fit $d+1$ numbers and are back to Week 3's cost of $O(d)$.

### Proof idea: balance bias and variance

$$\text{bias}^2(h)\propto h^4\qquad(\text{smoothing blurs the peak})$$

$$\text{var}(h)\propto\frac{1}{n\,h^d}\qquad(\text{a ball of radius }h\text{ holds about }nh^d\text{ samples})$$

$$\mathrm{MSE}(h)\propto h^4+\frac{1}{nh^d}$$

Set $\dfrac{d}{dh}=0$: $\ 4h^3=\dfrac{d}{n\,h^{d+1}}\Rightarrow h^{d+4}\propto\dfrac1n$

$$h^*\propto n^{-\frac{1}{d+4}},\qquad\mathrm{MSE}(h^*)\propto(h^*)^4=n^{-\frac{4}{d+4}}$$

> [!tip]
> The $h^d$ in the variance is exactly where $d$ enters. It is the volume-of-a-ball term behind the curse.

### How many samples does this cost?

**Step 1.** Relative error:

$$\varepsilon:=\frac{\mathrm{MSE}(\hat p(0))}{p(0)^2}\propto n^{-4/(d+4)}$$

**Step 2.** Invert for a target $\varepsilon$:

$$n\propto\varepsilon^{-(d+4)/4}=\underbrace{\varepsilon^{-1}}_{\text{accuracy}}\cdot\underbrace{c^{\,d}}_{\text{dimension}},\qquad c=\varepsilon^{-1/4}>1$$

Every added dimension **multiplies** $n$ by $c$. Compare with $n\propto\varepsilon^{-1}$ (no $d$) for a fixed-form (parametric) fit.

### The curse in numbers

Samples needed for relative error $\le0.1$ at the centre of a standard Gaussian with optimal $h$ (Silverman 1986):

| $d$ | 1 | 2 | 4 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|
| $n$ | 4 | 19 | 223 | 2,790 | 43,700 | 842,000 |

4 samples suffice on a line; $d=10$ needs about $10^6$. Rougher densities need even more.

> [!warning]
> This is **not** the cost of fitting a Gaussian. It is the cost of **not assuming** the Gaussian form.

---

## 8. Curse of Dimensionality: Neighbourhoods

### k-NN

To classify or retrieve $x$: find its $k$ closest sample points and aggregate (vote / average). Purely geometric, no training. It lives or dies by what "closest" means.

### How wide must a "local" neighbourhood be?

Uniform data in $[0,1]^d$. A box of side $e$ has volume $e^d$. To capture a fraction $r$ of the data:

$$e_d(r)=r^{1/d}$$

Example: $d=10$, $r=0.01$: $e=0.01^{1/10}\approx0.63$. Seeing just **1%** of the data needs **63% of every axis**.

- "Local" and "enough samples" stop being compatible.
- $e_d(r)\to1$ within a few dozen dimensions for every $r$; shrinking $r$ by $100\times$ barely helps.
- Reading: with $r=k/n$, $e_d$ is k-NN's radius.

### The same curve is the bandwidth

A kernel of width $h$ covers a fraction $r=h^d$ of the data, so $h=e_d(r)=r^{1/d}$. At the optimal bandwidth, the expected number of points under one bump is

$$n\,(h^*)^d\propto n\cdot n^{-d/(d+4)}=n^{4/(d+4)}\xrightarrow{d\to\infty}n^0=1$$

Each bump averages only a handful of points, however large $n$ is.

**In numbers** ($n=10^6$, constant set to 1, $h^*=n^{-1/(d+4)}$):

| $d$ | 1 | 2 | 5 | 10 | 20 | 50 | 100 |
|---|---|---|---|---|---|---|---|
| $h^*$ | 0.06 | 0.10 | 0.22 | 0.37 | 0.56 | 0.77 | 0.88 |
| $n(h^*)^d$ | 63,000 | 10,000 | 464 | 52 | 10 | 2.8 | 1.7 |

The bump swells to most of the range and still ends up nearly empty. (Read the trend, not the exact digits.)

---

## 9. Curse of Dimensionality: Distances Concentrate

**Setup.** Samples $x^{(1)},\dots,x^{(n)}\in\mathbb{R}^d$ and one query $x$.

$$\text{dist}_{\min}(x)=\min_{i\le n}\lVert x-x^{(i)}\rVert,\qquad\text{dist}_{\max}(x)=\max_{i\le n}\lVert x-x^{(i)}\rVert$$

The **relative gap** is what matters, because absolute distances all grow with $d$.

> [!note] Theorem
> For $n$ points from a broad class of distributions in $\mathbb{R}^d$, as $d\to\infty$:
> $$\frac{\text{dist}_{\max}(x)-\text{dist}_{\min}(x)}{\text{dist}_{\min}(x)}\to0\quad\text{in probability}$$
> The nearest and farthest points become equidistant.

**Proof sketch.**
- $\lVert x-x^{(i)}\rVert^2$ is a sum of $d$ i.i.d. coordinate terms.
- By concentration (Week 3) it lies within $O(\sqrt d)$ of its mean, which is $\Theta(d)$.
- So every distance is $\approx\sqrt{\Theta(d)}$ with relative spread $O(\sqrt d)/\Theta(d)=O(1/\sqrt d)\to0$.

**Experiment** (200 uniform points, random query): at $d=2$ the farthest point is about $30\times$ farther than the nearest; at $d=3000$ only about 6% farther. "Nearest" has lost its meaning.

### Why KDE and k-NN both suffer

One cause: in high dimensions a small region is **empty**, and every point is about **equally far away**.

| Method | Needs | Problem in high $d$ |
|---|---|---|
| KDE | points near $x$ | there are none |
| k-NN | a nearest point | there is no meaningfully nearest one |

Both ask "what is close by?". In high dimensions, nothing is.

---

## 10. The Fix: Reduce Dimension First

**Right question:** which coordinates should we measure distance in?

Two problems and two fixes:

| Problem | Fix |
|---|---|
| Useless coordinates lengthen every distance equally | throw away the useless coordinates |
| The data bends, so a straight line is not the real path | measure distance only between close points |

> [!warning] JL vs PCA
> - **JL** (Week 2) keeps every distance, so it buys **speed, not meaning**. Keeping distances unchanged does not help; something must be dropped.
> - **PCA** (Week 4) keeps the directions the data varies in and **drops the rest**. It fails when it drops the wrong ones.

Pipeline for the rest of the course:

$$\text{high-}d\ \xrightarrow{\text{PCA / JL}}\ \text{low-}k\ \xrightarrow{\text{k-NN, KDE, clustering}}\ \text{answer}$$

### Experiment: burying the signal in noise

Two easily separable classes in 2-D. Append $m$ junk coordinates (noise s.d. 0.4, $n=1000$), then classify with 5-NN, with and without PCA back to 2 dimensions.

- Without PCA: error rises $0.4\%\to22\%$. Fraction of neighbours with the same label falls $0.99\to0.68$.
- With PCA: error stays near $0.4\%$.
- Nothing changed except the dimension.
- At $m=1000$ PCA's error also rises: PCA helps only while the signal outweighs the junk.

### Where these fixes reappear in UMAP

| This week | Role in UMAP |
|---|---|
| JL | random-projection trees seed the k-NN graph (speed) |
| PCA | preprocessing: reduce to about 50 dimensions, then build the graph (removes junk coordinates) |
| KDE bandwidth $h$ | per-point, density-adaptive $\sigma_i$ (weights) |

Why any of it can work: the rate $n^{-4/(d+4)}$ uses the ambient $d$, but for data on a manifold the **intrinsic dimension** governs.

---

## 11. Case Study 1: UMAP

### The problem

PCA finds only **flat** subspaces. Data often lies on a curved surface, a **manifold**.

**Where a straight line fails.** 150 points along one curve, PCA to 1-D: two points 4.4 radians apart along the curve land 0.002 apart on PC1. A line folds the curve onto itself. Only 54% of each point's true neighbours survive.

### The idea

- **Only short distances are trustworthy.** Locally the surface is approximately flat.
- Keep each point's $k$ nearest neighbours and discard the coordinate frame.
- Build a k-NN graph in high $d$, then lay it out in 2–3 dimensions so that neighbours stay neighbours.
- In high $d$: reduce first with PCA (to about 50, not 2), then build the graph.
- Sparse regions need a wider radius than dense ones, hence a per-point scale $\sigma_i$.

### Part 1: building the fuzzy graph

1. **Input:** points $x_1,\dots,x_n$, neighbours $k$
2. **k-NN graph:** for each $i$, find its $k$ nearest neighbours $N_i$; set
$$\rho_i=\min_{j\in N_i}d(x_i,x_j)\quad(\text{distance to the nearest neighbour})$$
3. **Calibrate $\sigma_i$:** solve
$$\sum_{j\in N_i}\exp\!\left(-\frac{\max(0,\ d(x_i,x_j)-\rho_i)}{\sigma_i}\right)=\log_2k$$
4. **Weights:** $w_{i|j}=\exp\!\left(-\dfrac{\max(0,\ d(x_i,x_j)-\rho_i)}{\sigma_i}\right)$ for $j\in N_i$
5. **Symmetrise (fuzzy union):** $w_{ij}=w_{i|j}+w_{j|i}-w_{i|j}w_{j|i}$

**What step 3 does.** It rescales distances around every point so all neighbourhoods are on the same scale (dense and sparse regions are treated alike).
- The left side lies between 1 and $k$: the nearest neighbour always contributes $e^0=1$, and each term is at most 1.
- The left side increases with $\sigma_i$, so the equation is solved by **bisection**.
- For $k=2$: $\log_22=1$, already supplied by the nearest neighbour, so the second term must be 0, forcing $\sigma_i\to0$.

Fuzzy union = probability that at least one of the two directed edges exists: $a+b-ab$.

### Detour: graph Laplacian and spectral embedding

For symmetric weights $W$ with degrees $d_i=\sum_jw_{ij}$:

$$L=D-W,\qquad D=\mathrm{diag}(d_1,\dots,d_n)$$

$L$ measures how much a placement $y\in\mathbb{R}^n$ stretches heavy edges:

$$y^TLy=\frac12\sum_{i,j}w_{ij}(y_i-y_j)^2\ \ge0$$

**Spectral embedding into $\mathbb{R}^m$:** take the eigenvectors of $L$ for the $m$ **smallest nonzero** eigenvalues. Row $i$ of these $m$ columns is $y_i$. This is the cheapest non-constant placement: neighbours land close together.

Why discard eigenvalue 0: $L\mathbf 1=0$ always (each row of $L$ sums to zero). The constant vector puts every point at the same location, which is useless.

### Part 2: attract–repel layout

1. Initialise $y_i\in\mathbb{R}^m$ with the spectral embedding of $W$'s graph Laplacian
2. **for** each epoch:
   - sample an edge $(i,j)$ with probability $\propto w_{ij}$: **attract** $y_i,y_j$ (gradient of $-\log q_{ij}$)
   - sample a random pair $(i,j)$: **repel** $y_i,y_j$ (gradient of $-\log(1-q_{ij})$)
3. **return** $y_1,\dots,y_n$, where
$$q_{ij}=\left(1+a\lVert y_i-y_j\rVert^{2b}\right)^{-1}$$

$a,b>0$ are fitted once so $q$ tracks $\exp(-(\lVert y_i-y_j\rVert-\text{min\_dist}))$. With $a=b=1$ this is t-SNE's Cauchy kernel.

**Why start from the spectral embedding.** Neighbours kept in the curve example: 4% (random positions), 89% (spectral start), 93% (after attract/repel). From a random start the curve tears into pieces. Overall $54\%$ (PCA) $\to93\%$ (UMAP), same data, same $k$.

### UMAP vs PCA

| Method | Structure | Preserves | Cost |
|---|---|---|---|
| PCA | linear subspace | global variance | SVD, cheap |
| UMAP | nonlinear manifold | local neighbours | k-NN graph |

UMAP is built on k-NN and typically runs on PCA-reduced input. It breaks on pure noise (no real neighbour structure to preserve).

---

## 12. Case Study 2: RAG

### From retrieval to answering

LSI returns relevant passages, but a user asking "What is the capital of Australia?" wants an **answer**.

$$q\ \to\ \text{encode}\ \to\ \text{top-}k\ \to\ \text{generator}\ \to\ y$$

**RAG = retrieval + generation** (Lewis et al., NeurIPS 2020). The first three boxes are Application 1 again; only the generator is new.

### Same search, new encoder, new output

| | LSI | RAG |
|---|---|---|
| Corpus | documents $A_{\cdot j}$ | passages $c_i$ |
| Encoder reads | word counts | words in order, in context |
| Encoder | $U_k^T$, from the SVD of $A$ | DPR's neural networks $E_p$, $E_q$ |
| Score | $\cos(q_k,d_j)$ | $s_i=\langle z_q,z_i\rangle$ |
| Output | ranked documents | generated answer $y$ |
| Learned from | co-occurrence in $A$ | $(q,y)$ pairs |

Top four rows: the same k-NN search with a stronger encoder. Bottom two: what RAG adds.

Top-20 hit rate: DPR 78% vs word counts (BM25) 59%. Word counts ignore order: "dog bites man" and "man bites dog" get the same vector.

### Toy example: four-passage corpus

| Passage | $z_i=E_p(c_i)$ |
|---|---|
| $c_1$ "Canberra is the capital of Australia." | $(0.8,0.6)$ |
| $c_2$ "Sydney is Australia's largest city." | $(0.6,0.8)$ |
| $c_3$ "Melbourne hosted the 1956 Olympics." | $(0.0,1.0)$ |
| $c_4$ "Bananas are rich in potassium." | $(-0.6,0.8)$ |

Query: $z_q=E_q(q)=(0.7,0.7)$. The $z_i$ are computed once, offline: the **index**.

$$s=\big(\langle z_q,z_i\rangle\big)_{i=1}^4=(0.98,\ 0.98,\ 0.70,\ 0.14)\ \Rightarrow\ Z_2=\{c_1,c_2\}$$

Feed $[q\,;c_1\,;c_2]$ to the generator $\to y=$ "Canberra".

> [!warning] Similar is not the same as useful
> $c_2$ ties with $c_1$ in score but holds no answer.

### Why not the generator alone?

Goal: answer $q$ from a corpus $C=\{c_1,\dots,c_N\}$ the generator never saw in training.

| Approach | Model | Problem |
|---|---|---|
| Generator alone | $y\sim p_\theta(y\mid q)$ | knows only what $\theta$ stores |
| Whole corpus | $y\sim p_\theta(y\mid q,C)$ | $N$ too large to read |
| RAG | $y\sim p_\theta(y\mid q,c_i),\ i\in Z_k$ | one passage per pass |

Swap the corpus, keep $\theta$: no retraining needed.

### How the generator generates

Tokens $y=(y_1,\dots,y_T)$, $y_t\in V$, $\lvert V\rvert\approx5\times10^4$. Chain rule (exact):

$$p_\theta(y\mid x)=\prod_{t=1}^{T}p_\theta(y_t\mid x,y_{<t})$$

One network gives every factor as a softmax over the vocabulary:

$$p_\theta(\,\cdot\mid x,y_{<t})=\mathrm{softmax}\big(f_\theta(x,y_{<t})\big)\in\mathbb{R}^{\lvert V\rvert}$$

**Conditioning** = writing $q$ and $c_i$ into the input: $x=[q\,;c_i]$. (BART: an encoder reads $x$; a decoder reads $y_{<t}$ and attends to the encoded $x$.)

**Toy: generating "Canberra".** $x$ = question + passage $c_1$.

| $t$ | read so far | softmax | pick |
|---|---|---|---|
| 1 | `<s>` | "Canberra" 0.95, "Sydney" 0.02, ... | "Canberra" |
| 2 | `<s>` "Canberra" | `</s>` 0.95, "," 0.01, ... | stop |

$$p_\theta(\text{"Canberra"}\mid x)=0.95\times0.95\approx0.90$$

- **Generating:** pick each token by sampling, by arg max (greedy), or by beam search.
- **Training** runs it backwards: feed in the true $y$ and raise $\log p_\theta(y\mid x)$.

### Beam search

Want $\arg\max_yp_\theta(y\mid x)$ without scoring all $\lvert V\rvert^T$ strings.

**Beam search, width $B$:** extend each of the $B$ best prefixes by every token, keep the $B$ best. ($B\lvert V\rvert$ candidates per step.)

Example: "Who was Australia's first prime minister?", $B=2$:

| $t$ | prefix | probability | |
|---|---|---|---|
| 1 | "Robert" | 0.50 | keep |
| 1 | "Edmund" | 0.40 | keep |
| 1 | "John" | 0.10 | drop |
| 2 | "Edmund Barton" | $0.40\times0.95=0.38$ | keep |
| 2 | "Robert Menzies" | $0.50\times0.60=0.30$ | keep |
| 2 | "Robert Hawke" | $0.50\times0.30=0.15$ | drop |

Greedy ($B=1$) commits to "Robert" and ends with 0.30, missing the better 0.38.

### Why the whole corpus will not fit

Wikipedia in the paper: $N=21\times10^6$ passages $\times$ 100 words $\approx2\times10^9$ words.

- **All in one input:** length $L\gtrsim2\times10^9$ tokens vs BART's limit of 1,024; attention cost $L^2\approx4\times10^{18}$ pairs per layer per question.
- **One passage per pass, all passages:** $N=2.1\times10^7$ generator passes per question, vs $k=10$ with retrieval.

Either way the cost grows with $N$. Retrieval makes it grow with $k$. The search itself is cheap: approximate nearest-neighbour search (FAISS) is sublinear in $N$.

### RAG-Sequence at query time

1. **Input:** corpus $\{c_i\}_{i=1}^N$, query $q$, encoders $E_p,E_q$, generator $p_\theta$, $k$, temperature $\tau$
2. **Index (offline):** $z_i\leftarrow E_p(c_i)\in\mathbb{R}^d$ for all $i$
3. **Encode query:** $z_q\leftarrow E_q(q)$
4. **Retrieve:** $Z_k\leftarrow$ the $k$ passages maximising $s_i=\langle z_q,z_i\rangle$
5. **Weigh:** $w_i\leftarrow\dfrac{e^{s_i/\tau}}{\sum_{j\in Z_k}e^{s_j/\tau}}$ for $i\in Z_k$
6. **Generate:** $Y_i\leftarrow$ beam search on $[q\,;c_i]$ for each $i\in Z_k$
7. **return** $\arg\max_{y\in\cup_iY_i}\sum_{i\in Z_k}w_i\,p_\theta(y\mid q,c_i)$

- Steps 2–4 are LSI with $U_k^T$ replaced by $E_p,E_q$. Steps 5–7 are new.
- Step 7 needs $p_\theta(y\mid q,c_i)$ for a $y$ found by another passage's beam: one extra pass each.
- Today's LLM RAG pastes all $k$ passages into one input: simpler, but no $w_i$ to train through.

---

## 13. RAG Training

### Passage as a latent variable

Training data are pairs $(q,y)$. Nobody labels which passage was useful. So treat the passage as a **latent variable** $z$ and sum it out (RAG-Sequence):

$$p(y\mid q)=\sum_{z\in Z_k}p_\eta(z\mid q)\,p_\theta(y\mid q,z)$$

$$p_\eta(z_i\mid q)\propto e^{s_i/\tau}\text{ on }Z_k,\qquad p_\theta(y\mid q,z)=\prod_tp_\theta(y_t\mid q,z,y_{<t})$$

One passage explains the whole answer. ($\eta$ = parameters of $E_q$, $\theta$ = generator parameters; the paper uses $\tau=1$.)

### Why reading only k passages is enough

Let $g_i:=p_\theta(y\mid q,c_i)$ and $w_i:=e^{s_i/\tau}\big/\sum_{j=1}^Ne^{s_j/\tau}$ (weights over **all** $N$).

$$\text{all }N:\ p(y\mid q)=\sum_{i=1}^Nw_ig_i\qquad\text{top-}k:\ \hat p(y\mid q)=\sum_{i\in Z_k}w_ig_i$$

Since $0\le g_i\le1$:

$$0\le p-\hat p\le\sum_{i\notin Z_k}w_i=:\varepsilon_k$$

The error is at most the total weight of the passages left out.

**Toy corpus,** $\tau=0.05$: $w\approx(0.499,\ 0.499,\ 0.002,\ 10^{-8})$, so $\varepsilon_2\approx0.002$.

- Smaller $\tau$ or a larger score gap $s_1-s_3$ makes $\varepsilon_k$ smaller.
- Distance concentration (Section 9) **closes that gap** in high dimensions, which makes $\varepsilon_k$ larger.

### Training loop

Minimise the negative marginal log-likelihood $\mathcal L=-\log p(y\mid q)$.

1. **Input:** pairs $(q,y)$, frozen index $\{z_i=E_p(c_i)\}$, $E_q$ (params $\eta$), $p_\theta$, $k$, $\tau$
2. **repeat**
   - take a pair $(q,y)$; $z_q\leftarrow E_q(q)$
   - $Z_k\leftarrow$ top-$k$ by $s_i=\langle z_q,z_i\rangle$ (the *choice* of $Z_k$ carries no gradient)
   - $w_i\leftarrow e^{s_i/\tau}\big/\sum_{j\in Z_k}e^{s_j/\tau}$ ($\eta$ learns through $s_i$)
   - $g_i\leftarrow p_\theta(y\mid q,c_i)$ for $i\in Z_k$ ($k$ generator passes)
   - $\mathcal L\leftarrow-\log\sum_{i\in Z_k}w_ig_i$
   - gradient step on $\mathcal L$ in $\eta$ and $\theta$
3. **until** validation loss stops improving

**Frozen:** $E_p$ and the index. Updating $E_p$ would mean re-embedding all 21M passages.

### Where does the learning signal go?

> [!note] Lemma
> Let $p:=\sum_{j\in Z_k}w_jg_j$ and $r_i:=\dfrac{w_ig_i}{p}$. Then
> $$\frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}{\tau}$$

**Proof.**

$$\log p=\log\sum_je^{s_j/\tau}g_j-\log\sum_je^{s_j/\tau}$$

$$\frac{\partial\log p}{\partial s_i}=\frac1\tau\left(\frac{e^{s_i/\tau}g_i}{\sum_je^{s_j/\tau}g_j}-\frac{e^{s_i/\tau}}{\sum_je^{s_j/\tau}}\right)=\frac{r_i-w_i}{\tau}$$

**Interpretation.**
- $w_i$ = **prior** belief that passage $i$ is the right one (before seeing $y$).
- $r_i$ = **posterior** (Bayes' rule) after seeing how well each passage explains $y$.
- A score rises iff its passage explains $y$ better than believed: $r_i>w_i$.
- Generator side: $\nabla_\theta\log p=\sum_ir_i\,\nabla_\theta\log g_i$.

### Toy example: which passage explained "Canberra"?

$s_1=s_2=0.98\Rightarrow w=(0.5,0.5)$ on $Z_2=\{c_1,c_2\}$. Generator: $g=(0.9,0.1)$.

$$p=w_1g_1+w_2g_2=0.45+0.05=0.5$$

$$r=\left(\frac{0.45}{0.5},\frac{0.05}{0.5}\right)=(0.9,0.1)$$

$$\frac{\partial\log p}{\partial s}=\frac{r-w}{\tau}=\frac{(+0.4,\,-0.4)}{\tau}$$

Before seeing $y$: $w=(0.5,0.5)$. After: $r=(0.9,0.1)$.

### Toy example: the answer trains the retriever

Since $s_i=\langle z_q,z_i\rangle$, $\ \partial s_i/\partial z_q=z_i$. Chain rule:

$$\frac{\partial\log p}{\partial z_q}=\sum_i\frac{\partial\log p}{\partial s_i}z_i=\frac{0.4}{\tau}(z_1-z_2)$$

One gradient step with learning rate $\alpha$ (up $\log p$, down $\mathcal L$):

$$\Delta z_q=\alpha\frac{0.4}{\tau}(z_1-z_2),\qquad z_1-z_2=(0.2,-0.2)$$

$$\Delta(s_1-s_2)=\langle\Delta z_q,\ z_1-z_2\rangle=\alpha\frac{0.4}{\tau}\lVert z_1-z_2\rVert^2=\alpha\frac{0.4}{\tau}\times0.08=\frac{0.032\,\alpha}{\tau}>0$$

The query embedding moves toward $c_1$ and away from $c_2$. Nobody labelled $c_1$ as relevant; the answer "Canberra" did. (The real step is taken on $\eta$, not directly on $z_q$.)

### Aside: DPR, the retriever RAG starts from

- $E_p,E_q$ are two copies of BERT-base. DPR trains them on **labelled** pairs $(q,c^+)$.
- Negatives $c_j^-$: other questions' positives in the batch, plus a keyword (BM25) hit that lacks the answer.
- RAG then freezes $E_p$ and fine-tunes $E_q$.

$$\mathcal L_{\text{DPR}}=-\log\frac{e^{s_+}}{e^{s_+}+\sum_je^{s_j^-}},\qquad s=\langle z_q,z\rangle$$

$$-\frac{\partial\mathcal L_{\text{DPR}}}{\partial s_i}=\mathbf 1[i=+]-w_i\qquad\text{vs. RAG's}\qquad r_i-w_i$$

DPR's target is a hard label ("contains the answer"). RAG replaces it with the soft posterior $r_i$ ("helps generate $y$").

---

## 14. RAG-Token and Where RAG Breaks

### RAG-Token: move the sum inside

Query: "Which city is Australia's capital, and which is its largest?" Answer: "Canberra, Sydney". No single passage holds both.

$$\textbf{RAG-Sequence:}\quad p(y\mid q)=\sum_{z\in Z_k}p_\eta(z\mid q)\prod_tp_\theta(y_t\mid q,z,y_{<t})$$

$$\textbf{RAG-Token:}\quad p(y\mid q)=\prod_t\sum_{z\in Z_k}p_\eta(z\mid q)\,p_\theta(y_t\mid q,z,y_{<t})$$

- Sequence: one passage per **answer**.
- Token: one passage per **token**.
- Same retriever, generator, $Z_k$ and training loop. Only the position of the sum changes.

**Example.** $Z_2=\{c_1,c_2\}$, $w=(0.5,0.5)$:

| | $y_1$ = "Canberra" | $y_2$ = "Sydney" |
|---|---|---|
| $c_1$ | 0.9 | 0.1 |
| $c_2$ | 0.1 | 0.9 |

$$\text{Sequence: }0.5(0.9\times0.1)+0.5(0.1\times0.9)=0.09$$

$$\text{Token: }(0.5\times0.9+0.5\times0.1)(0.5\times0.1+0.5\times0.9)=0.5\times0.5=0.25$$

Token reads "Canberra" from $c_1$ and "Sydney" from $c_2$.

### Where it breaks 1: retrieval is not optional

- In $\hat p(y\mid q)=\sum_{i\in Z_k}w_ig_i$ the no-retrieval term $p_\theta(y\mid q)$ never appears. The model always retrieves.
- The weights see only score **differences**, never their level:
$$w_i(s+c\mathbf 1)=w_i(s),\qquad\sum_iw_i=1\ \text{ even if }\max_is_i\ll0$$
So even when every passage is irrelevant, the weights still sum to 1.
- The bound $\lvert p-\hat p\rvert\le\varepsilon_k$ constrains the sum, not what is generated: $g_i=p_\theta(y\mid q,c_i)$ has no term checking that $y$ is actually **supported** by $c_i$.

Never asked: was retrieval necessary, relevant, or used correctly? (This is the gap Self-RAG targets.)

### Where it breaks 2: training sees only the top-k

- If $E_q$ initially ranks the right passage $c_1$ outside the top $k$, then $s_1$ is absent from $\mathcal L$ and nothing pulls $z_q$ toward $z_1$.
- With $E_p$ frozen, a badly placed $z_i$ stays badly placed. Only $z_q$ moves.

> [!warning]
> Learning **re-ranks** what retrieval already finds. It cannot find what retrieval misses.

(REALM re-embeds the corpus periodically during training, which is very expensive at $N=21$M.)

---

## 15. Exam Cheat Sheet

| Item | Formula / fact |
|---|---|
| LSI query code | $q_k=U_k^Tq$, document code $d_j=U_k^TA_{\cdot j}$, score $\cos(q_k,d_j)$ |
| Projector | $P_k=U_kU_k^T$; $(U_k^Tx)^T(U_k^Ty)=(P_kx)^T(P_ky)$ |
| Permutation lemma | $PA=(PU)\Sigma V^T$ |
| Recommender prediction | $\hat A_{ij}=\sum_{\ell\le k}\sigma_\ell u_{i\ell}v_{j\ell}$ |
| Masked objective | $\min_{U,V}\sum_{(i,j)\text{ obs}}(A_{ij}-(UV^T)_{ij})^2$ |
| ALS | alternate ridge regressions; convex in $U$ or $V$ alone |
| Rank-$k$ parameter count | $k(m+n-k)$ |
| KDE | $\hat p(x)=\frac{1}{nh^d}\sum_iK\!\left(\frac{x-x^{(i)}}{h}\right)$ |
| Bias / variance | $\text{bias}^2\propto h^4$, $\ \text{var}\propto\frac{1}{nh^d}$ |
| Optimal bandwidth | $h^*\propto n^{-1/(d+4)}$ |
| KDE rate | $\mathrm{MSE}\propto n^{-4/(d+4)}$ |
| Samples needed | $n\propto\varepsilon^{-(d+4)/4}=\varepsilon^{-1}c^d$, $c=\varepsilon^{-1/4}$ |
| Neighbourhood side | $e_d(r)=r^{1/d}$ ($d=10,r=0.01\Rightarrow0.63$) |
| Points per bump | $n(h^*)^d\propto n^{4/(d+4)}\to1$ |
| Distance concentration | $\frac{\text{dist}_{\max}-\text{dist}_{\min}}{\text{dist}_{\min}}\to0$ |
| UMAP calibration | $\sum_{j\in N_i}\exp(-\max(0,d_{ij}-\rho_i)/\sigma_i)=\log_2k$ |
| Fuzzy union | $w_{ij}=w_{i\mid j}+w_{j\mid i}-w_{i\mid j}w_{j\mid i}$ |
| Laplacian | $L=D-W$, $\ y^TLy=\frac12\sum_{i,j}w_{ij}(y_i-y_j)^2$ |
| UMAP low-dim similarity | $q_{ij}=(1+a\lVert y_i-y_j\rVert^{2b})^{-1}$ |
| RAG weights | $w_i=e^{s_i/\tau}/\sum_je^{s_j/\tau}$, $\ s_i=\langle z_q,z_i\rangle$ |
| RAG-Sequence | $p(y\mid q)=\sum_zp(z\mid q)\prod_tp(y_t\mid q,z,y_{<t})$ |
| RAG-Token | $p(y\mid q)=\prod_t\sum_zp(z\mid q)\,p(y_t\mid q,z,y_{<t})$ |
| Top-$k$ error | $0\le p-\hat p\le\sum_{i\notin Z_k}w_i=\varepsilon_k$ |
| Retriever gradient | $\frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}{\tau}$, $\ r_i=\frac{w_ig_i}{p}$ |
| DPR gradient | $-\frac{\partial\mathcal L}{\partial s_i}=\mathbf 1[i=+]-w_i$ |

**Common traps**
- LSI with terms as rows uses $U_k$ (term space) to encode both queries and documents.
- Plain SVD on a ratings matrix depends on how missing entries are filled. Use the masked objective.
- ALS needs random (non-zero) initialisation and reaches only a stationary point.
- JL preserves distances, so it does **not** cure the curse; it only buys speed. PCA cures it by dropping directions.
- The KDE sample cost is the price of making **no** assumption about the form of $p$, not the cost of fitting a Gaussian.
- In UMAP, discard the constant eigenvector of $L$ (eigenvalue 0).
- RAG-Sequence uses one passage for the whole answer; when the answer needs facts from several passages, RAG-Token gives it a higher probability (0.25 vs 0.09 in the example).
- RAG training cannot recover a passage that never enters the top-$k$.
