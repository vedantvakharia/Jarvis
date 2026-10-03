# Lecture 5 (Week 4): Best-Fit Subspaces & the SVD

## Contents
1. [[#1. Recap and Motivation]]
2. [[#2. Best-Fit Line]]
3. [[#3. Singular Vectors and the Greedy Construction]]
4. [[#4. The Singular Value Decomposition]]
5. [[#5. Toy Example: Full SVD by Hand]]
6. [[#6. The Power Method]]
7. [[#7. Why a Random Start Works]]
8. [[#8. Getting k Vectors: Deflation]]
9. [[#9. Block Iteration, Lanczos, Randomized SVD]]
10. [[#10. Comparing the Four Methods]]
11. [[#11. Low-Rank Approximation and Eckart–Young]]
12. [[#12. PCA]]
13. [[#13. Choosing k]]
14. [[#14. Case Study: LoRA]]
15. [[#15. Exam Cheat Sheet]]

---

## 2. Best-Fit Line

**Setup.** Data points $a_1,\dots,a_n \in \mathbb{R}^d$ are the **rows** of $A \in \mathbb{R}^{n\times d}$.

**Best-fit line through the origin:** the unit vector $v$ that minimises the total squared distance from the points to the line.

**Pythagoras** for each point:

$$\lVert a_i\rVert^2 = \underbrace{\langle a_i, v\rangle^2}_{\text{projection onto } v} + \underbrace{\text{dist}(a_i, v)^2}_{\text{distance to line}}$$

$\sum_i \lVert a_i\rVert^2$ is fixed (it does not depend on $v$), so

$$\min_{\lVert v\rVert=1}\sum_i \text{dist}(a_i,v)^2 \iff \max_{\lVert v\rVert=1}\sum_i \langle a_i,v\rangle^2 = \max_{\lVert v\rVert=1}\lVert Av\rVert_2^2$$

> [!tip] Key idea
> Minimise residual $\iff$ maximise projection. The $i$-th entry of $Av$ is $\langle a_i, v\rangle$, so $\lVert Av\rVert^2$ is the total squared projection length.

> [!warning] Through the origin
> The best-fit line here passes through the origin. This is **not** least-squares regression (which measures vertical distance); it measures perpendicular distance.

---

## 3. Singular Vectors and the Greedy Construction

#### Step 1: the first direction
The best-fit line is the unit direction v that makes ‖Av‖ as large as possible. Each entry of Av is the projection of one data point onto v, so ‖Av‖² is the total squared projection length of all the points.
  - v₁ (first right singular vector) is the direction the data "leans along" most. $v_1 = \arg\max_{\lVert v\rVert=1}\lVert Av\rVert_2$
  - σ₁ = ‖Av₁‖ (first singular value) measures how strongly the data leans that way $\qquad \sigma_1 = \lVert Av_1\rVert_2$

####  Step 2: the next directions (greedy)
To get a second direction, repeat the same search, but only among directions perpendicular to v₁. That gives v₂ and σ₂ = ‖Av₂‖. For v₃, search among directions perpendicular to both v₁ and v₂, and so on. Each vₖ is the best direction left over after the earlier ones are taken. That is why σ₁ ≥ σ₂ ≥ σ₃ ≥ …: each new   direction captures less than the one before. After finding $v_1,\dots,v_{k-1}$:

$$v_k = \arg\max_{\substack{\lVert v\rVert=1 \\ v\perp v_1,\dots,v_{k-1}}}\lVert Av\rVert_2, \qquad \sigma_k = \lVert Av_k\rVert_2$$

> [!note] Key fact (greedy = optimal)
> For **every** $k$, the span of the greedy vectors $v_1,\dots,v_k$ is the globally best-fit $k$-dimensional subspace. Picking one direction at a time loses nothing.

### How to compute it

$$\lVert Av\rVert_2^2 = v^T(A^TA)v$$

(because $\lVert Av\rVert^2=(Av)^T(Av)=v^TA^TAv$.)

We do not search over directions by hand. $A^TA$ is a symmetric $d\times d$ matrix, so by the Spectral Theorem it has orthonormal eigenvectors $v_1,\dots,v_d$ with eigenvalues $\lambda_1\ge\dots\ge\lambda_d\ge0$.

**Why the top eigenvector wins.** Write any unit vector as $v=\sum_i c_iv_i$ with $\sum_i c_i^2=1$. Then

$$v^T(A^TA)v=\sum_i\lambda_ic_i^2\ \le\ \lambda_1\sum_ic_i^2=\lambda_1$$

This is a weighted average of the eigenvalues, so it is largest when all the weight sits on $\lambda_1$, i.e. $v=v_1$. The maximum value is $\lambda_1$, so $\sigma_1^2=\lambda_1$.

**Next directions.** Restricting to $v\perp v_1$ forces $c_1=0$, so the best achievable value is $\lambda_2$, reached at $v=v_2$. Repeating gives every $v_k$.

$$v_i = \text{eigenvectors of } A^TA, \qquad \sigma_i^2 = \text{eigenvalues of } A^TA,\qquad \sigma_i=\sqrt{\lambda_i}$$

> [!warning] Do not forget the square root
> Singular values are the **square roots** of the eigenvalues of $A^TA$.

### Toy example: best-fit line by hand

Rows $a_1=(1,0),\ a_2=(0,1),\ a_3=(1,1)$:

$$A=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix},\qquad A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix}$$

Eigenvalues of $A^TA$: $3$ and $1$.

$$v_1=\tfrac{1}{\sqrt2}(1,1)^T,\ \sigma_1=\sqrt3 \qquad v_2=\tfrac{1}{\sqrt2}(1,-1)^T,\ \sigma_2=1$$

Sanity check: the diagonal direction $(1,1)$ is where the three points lean. $v_2$ is the orthogonal leftover.

---

## 4. The Singular Value Decomposition

> [!note] Theorem (SVD)
> Every $A\in\mathbb{R}^{n\times d}$ of rank $r$ factors as
> $$A = U\Sigma V^T = \sum_{i=1}^{r}\sigma_i\,u_i v_i^T$$
> - $\sigma_1\ge\sigma_2\ge\dots\ge\sigma_r>0$ : **singular values**
> - $\{v_i\}\subset\mathbb{R}^d$ orthonormal : **right singular vectors**
> - $\{u_i\}\subset\mathbb{R}^n$ orthonormal : **left singular vectors**, with
> $$u_i = \frac{Av_i}{\sigma_i}$$

### Link to the Spectral Theorem: deriving $A^TA = V\Sigma^2V^T$

$$A^TA = (U\Sigma V^T)^T(U\Sigma V^T) = V\Sigma^T U^TU\,\Sigma V^T = V\Sigma^2V^T = \sum_{i=1}^r \sigma_i^2\, v_iv_i^T$$

using $U^TU = I$ and $\Sigma^T=\Sigma$.

This is the spectral decomposition of the symmetric matrix $A^TA$: eigenvectors $v_i$, eigenvalues $\sigma_i^2$.

> [!tip] One line to remember
> SVD = Spectral Theorem applied to $A^TA$. Similarly $AA^T = U\Sigma^2U^T$, so the $u_i$ are eigenvectors of $AA^T$.

### Reading the SVD geometrically

$A=\sum_i\sigma_iu_iv_i^T$ writes $A$ as a sum of **rank-1 layers**, ordered by importance.

| Symbol | Lives in | Meaning |
|---|---|---|
| $v_i$ | input space $\mathbb{R}^d$ | a pattern across the $d$ features |
| $u_i$ | output space $\mathbb{R}^n$ | how strongly each of the $n$ rows loads on that pattern |
| $\sigma_i$ | scalar | how much of the data's "energy" the layer carries |

Keeping only the first $k$ layers gives the **low-rank approximation** $A_k$.

---

## 5. Toy Example: Full SVD by Hand

Same $A=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}$, with $\sigma_1=\sqrt3,\ v_1=\tfrac1{\sqrt2}(1,1)^T$ and $\sigma_2=1,\ v_2=\tfrac1{\sqrt2}(1,-1)^T$.

**Left singular vectors** from $u_i = Av_i/\sigma_i$:

$$u_1=\frac{1}{\sqrt3}\cdot\frac{1}{\sqrt2}(1,1,2)^T=\frac{1}{\sqrt6}(1,1,2)^T,\qquad u_2=\frac{1}{\sqrt2}(1,-1,0)^T$$

**Verify** the layers add back up:

$$\sigma_1u_1v_1^T+\sigma_2u_2v_2^T=\frac12\begin{pmatrix}1&1\\1&1\\2&2\end{pmatrix}+\frac12\begin{pmatrix}1&-1\\-1&1\\0&0\end{pmatrix}=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}=A\ \checkmark$$

> [!tip] Recipe for SVD by hand
> 1. Compute $A^TA$.
> 2. Find its eigenvalues $\lambda_i$ and unit eigenvectors $v_i$.
> 3. $\sigma_i=\sqrt{\lambda_i}$.
> 4. $u_i = Av_i/\sigma_i$.

---

## 6. The Power Method

We rarely need the full SVD, only the top few $(\sigma_i, v_i)$.

**Idea.** Let $B = A^TA=\sum_i\sigma_i^2v_iv_i^T$. Multiplying a vector by $B$ again and again stretches the $v_1$ component the most (because $\sigma_1^2$ is the largest).

Write $x=\sum_i\langle x,v_i\rangle v_i$. Then

$$B^tx=\sum_i\sigma_i^{2t}\langle x,v_i\rangle v_i\ \approx\ \sigma_1^{2t}\langle x,v_1\rangle v_1$$

Every other component is suppressed relative to $v_1$ by a factor

$$\left(\frac{\sigma_2}{\sigma_1}\right)^{2t}\to 0$$

### Algorithm

1. **Input:** $A\in\mathbb{R}^{n\times d}$, tolerance $\varepsilon$, patience $k$, max iterations $T$
2. $B\leftarrow A^TA$; $x\leftarrow$ random unit vector in $\mathbb{R}^d$; $c\leftarrow 0$
3. **for** $j=1$ to $T$:
   - $x_{\text{old}}\leftarrow x$; $\ x\leftarrow \dfrac{Bx}{\lVert Bx\rVert_2}$
   - if $1-\lvert x^Tx_{\text{old}}\rvert<\varepsilon$ then $c\leftarrow c+1$, else $c\leftarrow 0$
   - **break** if $c\ge k$
4. $v_1\leftarrow x$, $\ \sigma_1\leftarrow\lVert Av_1\rVert_2$
5. **return** $(\sigma_1,v_1)$

**Stopping rule explained**
- $1-\lvert x^Tx_{\text{old}}\rvert\approx\theta^2/2$ where $\theta$ is the angle moved in one step (since $\cos\theta\approx1-\theta^2/2$). Small value = direction stopped changing.
- Requiring $k$ **consecutive** small steps guards against one lucky small step in the middle of convergence.
- Absolute value because $x$ and $-x$ are the same direction.

### Convergence rate

> [!note] Rate
> Error shrinks by a factor $\sigma_2^2/\sigma_1^2$ per step (geometric convergence; a straight line on a log plot).
> - Big gap ($\sigma_2\ll\sigma_1$): fast.
> - Small gap ($\sigma_1\approx\sigma_2$): slow.

Numbers from the slides (two $50\times50$ matrices): ratio $0.5$ reaches machine precision in about 40 steps; ratio $0.9$ is still far away.

### Worked example

Use the same $A=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}$ as Sections 3 and 5. We *pretend we do not know* the answer ($\sigma_1=\sqrt3,\ v_1=\tfrac1{\sqrt2}(1,1)^T$) and find it with the power method. Section 5 gives the answer to check against.

**Setup.**

$$B=A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix},\qquad x_0=(1,0)^T\ \text{(a deliberately bad start, far from }v_1)$$

**Each step = 2 actions:** (a) multiply by $B$, (b) divide by the length. Dividing only keeps numbers small. It does not change the direction, so for the *direction* we can skip it and just track $B^tx_0$.

| $t$ | $B^tx_0$ (no normalising) | $x_t$ = divide by length | angle of $x_t$ | gap to $v_1$ (45°) |
|---|---|---|---|---|
| 0 | $(1,0)$ | $(1,\ 0)$ | 0° | 45° |
| 1 | $B(1,0)=(2,1)$ | $(0.894,\ 0.447)$ | 26.6° | 18.4° |
| 2 | $B(2,1)=(5,4)$ | $(0.781,\ 0.625)$ | 38.7° | 6.3° |
| 3 | $B(5,4)=(14,13)$ | $(0.733,\ 0.681)$ | 42.9° | 2.1° |
| 4 | $B(14,13)=(41,40)$ | $(0.716,\ 0.698)$ | 44.3° | 0.7° |
| $\infty$ | | $(0.707,\ 0.707)=\tfrac1{\sqrt2}(1,1)$ | 45° | 0° |

How to compute one row: $(a,b)\mapsto(2a+b,\ a+2b)$. Example: $(5,4)\mapsto(10+4,\ 5+8)=(14,13)$. Then divide by $\sqrt{14^2+13^2}=\sqrt{365}\approx19.1$.

**Observation 1: it converges to $v_1$.** $x_t\to\tfrac1{\sqrt2}(1,1)^T$, which is exactly the $v_1$ from Section 5.

**Observation 2: the gap shrinks by about $\tfrac13$ per step** ($18.4\to6.3\to2.1\to0.7$). This is $\sigma_2^2/\sigma_1^2=1/3$.

**Why (the one idea to remember).** Break $x_0$ into the two singular directions $v_1=\tfrac1{\sqrt2}(1,1)$ and $v_2=\tfrac1{\sqrt2}(1,-1)$:

$$x_0=\tfrac1{\sqrt2}v_1+\tfrac1{\sqrt2}v_2$$

$B$ multiplies the $v_1$ part by $\sigma_1^2=3$ and the $v_2$ part by $\sigma_2^2=1$ (these are the eigenvalues of $B$). So after $t$ steps

$$B^tx_0=\tfrac1{\sqrt2}\,3^t\,v_1+\tfrac1{\sqrt2}\,1^t\,v_2$$

The $v_2$ part is only $(1/3)^t$ as big as the $v_1$ part, so it vanishes. Check at $t=1$: $\tfrac1{\sqrt2}(3v_1+v_2)=\tfrac12\big[3(1,1)+(1,-1)\big]=(2,1)$ ✓. Also this gives the closed form $B^tx_0=\big(\tfrac{3^t+1}2,\ \tfrac{3^t-1}2\big)$, e.g. $t=4$: $(41,40)$ ✓.

**Getting the singular value.** Take $v_1\approx x_4$ and compute $\sigma_1=\lVert Av_1\rVert$:

$$Av_1=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}\tfrac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}=\tfrac1{\sqrt2}(1,1,2)^T,\qquad \sigma_1=\tfrac1{\sqrt2}\sqrt{1+1+4}=\sqrt3\approx1.732\ \checkmark$$

(Shortcut: $x^TBx\to\sigma_1^2$. With $x_4$: $2+2(0.716)(0.698)=2.9997\approx3$.)

**Stopping rule in action.** $x_3^Tx_4=0.733(0.716)+0.681(0.698)=0.9997$, so $1-\lvert x_3^Tx_4\rvert\approx3\times10^{-4}$. Direction has nearly stopped moving, so stop (with $\varepsilon=10^{-3}$ it would stop here, assuming $k$ consecutive such steps).

> [!tip] Exam recipe for a power-method question
> 1. Form $B=A^TA$.
> 2. Pick $x_0$ (not perpendicular to $v_1$). Repeat $x\leftarrow Bx$, divide by length.
> 3. Direction converges to $v_1$; gap shrinks by $\sigma_2^2/\sigma_1^2$ per step.
> 4. $\sigma_1=\lVert Av_1\rVert$ (or $\sqrt{x^TBx}$).
> 5. If asked "why slow/fast": ratio $\sigma_2/\sigma_1$ close to 1 means slow.
> 6. If $x_0\perp v_1$ exactly, it never finds $v_1$ (e.g. $x_0=(1,-1)$ gives $Bx_0=x_0$ forever). That is why we start random.

---

## 7. Why a Random Start Works

**Worry.** If the random start $x$ has almost no component along $v_1$ (i.e. $x^Tv_1\approx0$), the method takes very long. How likely is that in high $d$?

**Step 1: density of one coordinate.** For a random unit vector $x$, $x^Tv_1$ has the same distribution as one coordinate $s=x_1$ (by rotational symmetry). From Week 2, the cross-section at height $s$ has radius $\sqrt{1-s^2}$, so

$$f(s)\propto(1-s^2)^{(d-1)/2}=e^{\frac{d-1}{2}\ln(1-s^2)}\approx e^{-(d-1)s^2/2}$$

using $\ln(1-s^2)\approx-s^2$ (valid at the natural scale $s\sim1/\sqrt d$). Normalised:

$$f(s)\approx\sqrt{\frac{d-1}{2\pi}}\;e^{-(d-1)s^2/2}$$

This is a Gaussian with variance $\approx1/d$: a typical coordinate has size $\approx1/\sqrt d$.

**Step 2: probability of a bad start.** Area under $f$ on a small window $[-\delta,\delta]$, where $f$ is nearly flat:

$$\Pr\big[\lvert x^Tv_1\rvert\le\delta\big]=\int_{-\delta}^{\delta}f(s)\,ds\approx2\delta f(0)=2\delta\sqrt{\frac{d-1}{2\pi}}$$

Take $\delta=\dfrac{1}{20\sqrt d}$ (20 times smaller than typical), $d$ large:

$$\Pr\approx\frac{2}{20}\cdot\frac{1}{\sqrt{2\pi}}\approx0.04$$

> [!note] Result
> Only about a **4%** chance of a bad start, and this does **not** get worse as $d$ grows. Experiments confirm the failure rate stays flat at about 4% up to $d=1000$.

(Flatness check: the exponent at $s=\delta$ is $(d-1)\delta^2/2\approx1/800\approx0$, so $f(\delta)\approx f(0)$.)

---

## 8. Getting k Vectors: Deflation

**Sequential deflation:** find vectors one at a time; while finding $v_i$, keep removing the components along the vectors already found.

1. **Input:** $A$, rank $k$. $V\leftarrow[\,]$
2. **for** $i=1$ to $k$:
   - $x\leftarrow$ random unit vector
   - **repeat** until the stopping criterion:
     - $x\leftarrow x-\sum_{v\in V}(v^Tx)\,v$ (project out found vectors)
     - $x\leftarrow A^T(Ax)$; $\ x\leftarrow x/\lVert x\rVert_2$
   - $v_i\leftarrow x$, $\ \sigma_i\leftarrow\lVert Av_i\rVert_2$; append $v_i$ to $V$
3. **return** $(\sigma_1,v_1),\dots,(\sigma_k,v_k)$

Note: compute $A^T(Ax)$ as two matrix-vector products. Never form $A^TA$ explicitly.

### Tiny example (same $A$ as before)

$B=A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, and $v_1=\tfrac1{\sqrt2}(1,1)^T$ with $\sigma_1^2=3$ is already found. Now find $v_2$, starting from $x=(1,0)^T$.

- **Project out $v_1$:** $v_1^Tx=\tfrac1{\sqrt2}$, so $x-\tfrac1{\sqrt2}v_1=(1,0)-\tfrac12(1,1)=(0.5,\,-0.5)$.
- **Power step:** $B(0.5,-0.5)^T=(0.5,\,-0.5)^T$. It is unchanged, so it is stable.
- **Result:** $v_2=\tfrac1{\sqrt2}(1,-1)^T$ and $\sigma_2=\lVert Av_2\rVert=\lVert\tfrac1{\sqrt2}(1,-1,0)\rVert=1$ ✓ (matches Section 5).

In 2D only one direction is left after removing $v_1$. In higher dimensions the power method runs on what remains, and its speed depends on $\sigma_3/\sigma_2$ instead.

> [!warning] Caveat
> Errors in early vectors propagate into later ones. Orthogonality against $V$ degrades over many deflations.

### Cost

| Step | Cost |
|---|---|
| matvec $A^T(Ax)$ | $O(nd)$ |
| project out $i$ found vectors | $O(id)$ |
| **total**, $k$ vectors, $t$ iterations each | $O(ndkt)$ (for $k\le n$) |
| full SVD (Householder bidiagonalisation) | $O(nd\min(n,d))$ |

Deflation beats full SVD exactly when $k\ll\min(n,d)$.

---

## 9. Block Iteration, Lanczos, Randomized SVD

| Variant | Idea | Note |
|---|---|---|
| Block / orthogonal iteration | iterate $k$ vectors jointly, QR each step | fixes the error drift of deflation |
| Lanczos | Krylov subspace from the same matvecs | far fewer matvecs |
| Randomized SVD | random sketch + few power iterations + small SVD | today's default |

> [!tip]
> Power method is the *idea*; Lanczos is the *implementation* you would call in practice (ARPACK, `scipy.sparse.linalg.svds`).

### 9.1 Block / orthogonal iteration

1. **Input:** $A$, rank $k$, iterations $t$
2. $X\in\mathbb{R}^{d\times k}\leftarrow$ random; $X,\_\leftarrow\mathrm{QR}(X)$
3. **for** $j=1$ to $t$:
   - $X\leftarrow A^T(AX)$ (all $k$ columns take one power step together)
   - $X,R\leftarrow\mathrm{QR}(X)$ (re-orthonormalise the columns)
4. $v_i\leftarrow$ column $i$ of $X$; $\ \sigma_i\leftarrow\lVert Av_i\rVert_2$

Same power step, but on a $d\times k$ block. QR keeps all $k$ columns mutually orthogonal at **every** step, so one vector's error cannot leak into a later one.

**What QR does.** It returns orthonormal columns spanning the same space (like Gram–Schmidt): column 1 keeps its direction; each later column has its parts along the earlier columns removed, then is normalised.

**Example** ($B=A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $k=2$, start $X_0=I$, i.e. columns $(1,0)$ and $(0,1)$).

- **Iteration 1.** Power step: $BX_0=B=\begin{pmatrix}2&1\\1&2\end{pmatrix}$. QR:
  - col 1: $(2,1)/\sqrt5=(0.894,\,0.447)$
  - col 2: remove its part along col 1: $(1,2)-\big[(1,2)\cdot(0.894,0.447)\big](0.894,0.447)=(1,2)-1.789(0.894,0.447)=(-0.6,\,1.2)$, normalised: $(-0.447,\,0.894)$
- **Iteration 2.** Power step: $B(0.894,0.447)=(2.236,1.789)$ and $B(-0.447,0.894)=(0,1.342)$. QR:
  - col 1: $(0.781,\,0.625)$
  - col 2: $(0,1.342)-0.839(0.781,0.625)=(-0.655,\,0.818)$, normalised: $(-0.625,\,0.781)$
- **Limit.** col 1 $\to v_1=\tfrac1{\sqrt2}(1,1)$ and col 2 $\to v_2=\tfrac1{\sqrt2}(-1,1)$ (same line as $(1,-1)$). The columns stay perpendicular at every step.

Notice col 1 is exactly the plain power method sequence (angles 26.6°, 38.7°, ... as in Section 6). Col 2 is the "deflated" vector, but obtained with no separate projection loop.

### 9.2 Lanczos

1. **Input:** $A$, rank $k$, Krylov dimension $m\ge k$
2. $q_1\leftarrow$ random unit vector; $q_0\leftarrow0$; $\beta_0\leftarrow0$
3. **for** $j=1$ to $m$:
   - $w\leftarrow A^T(Aq_j)-\beta_{j-1}q_{j-1}$
   - $\alpha_j\leftarrow q_j^Tw$; $\ w\leftarrow w-\alpha_jq_j$; $\ \beta_j\leftarrow\lVert w\rVert_2$; $\ q_{j+1}\leftarrow w/\beta_j$
4. $T\leftarrow$ tridiagonal $m\times m$ matrix, diagonal $\alpha_{1:m}$, off-diagonal $\beta_{1:m-1}$
5. $(\theta_i,y_i)\leftarrow$ top-$k$ eigenpairs of $T$; $\ v_i\leftarrow[q_1\cdots q_m]\,y_i$, $\ \sigma_i=\sqrt{\theta_i}$

**Difference from the power method:** same matvec, but every intermediate vector $q_j$ is **kept** instead of discarded. They are turned into a small $m\times m$ eigenproblem, which is cheap to solve. So $k$ accurate vectors come from far fewer matvecs.

**Example** ($B=A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, $q_1=(1,0)^T$, $m=2$). Here $A^T(Aq)=Bq$.

- **$j=1$:** $w=Bq_1-0=(2,1)$. $\alpha_1=q_1^Tw=2$. $w\leftarrow w-2q_1=(0,1)$. $\beta_1=\lVert w\rVert=1$, so $q_2=(0,1)$.
- **$j=2$:** $w=Bq_2-\beta_1q_1=(1,2)-(1,0)=(0,2)$. $\alpha_2=q_2^Tw=2$.
- **Build $T$:** diagonal $(\alpha_1,\alpha_2)=(2,2)$, off-diagonal $\beta_1=1$, so $T=\begin{pmatrix}2&1\\1&2\end{pmatrix}$.
- **Eigenpairs of $T$:** $\theta_1=3,\ y_1=\tfrac1{\sqrt2}(1,1)$; $\theta_2=1,\ y_2=\tfrac1{\sqrt2}(1,-1)$. So $\sigma_1=\sqrt3,\ \sigma_2=1$ ✓.
- **Map back:** $v_1=[q_1\ q_2]\,y_1=\tfrac1{\sqrt2}(1,1)$ ✓.

It is exact after $m=2$ matvecs only because $m=d=2$ (the Krylov space fills the whole space). For large $d$, a small $m$ already gives good top eigenvalues.

**Intuition.** The power method keeps only the latest vector of $x,Bx,B^2x,\dots$. Lanczos keeps all of them. Their span is the **Krylov subspace**, and Lanczos finds the best approximation to the top eigenvectors *inside that subspace*.
- Step 1: build an orthonormal basis $q_1,\dots,q_m$ of the subspace (Gram–Schmidt on $q_1,Bq_1,\dots$). $\alpha_j$ = part of $Bq_j$ along $q_j$; $\beta_j$ = length of the new direction left over.
- Step 2: $T=Q^TBQ$ is $B$ written in this basis: tiny ($m\times m$) and tridiagonal, because $Bq_j$ only involves $q_{j-1},q_j,q_{j+1}$.
- Step 3: eigenpairs of $T$ are cheap to find. $\theta_i\approx\sigma_i^2$, and $v_i=Qy_i$ converts back to the full space.

**Example 2: approximate case ($m<d$).** $B=\mathrm{diag}(4,2,1)$, so the true answer is $\lambda_1=4,\ v_1=(1,0,0)$. Start $q_1=(1,1,1)/\sqrt3=(0.577,0.577,0.577)$, $m=2$.

- **$j=1$:** $Bq_1=(4,2,1)/\sqrt3$. $\alpha_1=q_1^TBq_1=(4+2+1)/3=2.333$. Remove the $q_1$ part: $w\propto(1.667,-0.333,-1.333)$. $\beta_1=\lVert w\rVert=1.247$, so $q_2=(0.772,-0.154,-0.617)$.
- **$j=2$:** $Bq_2=(3.086,-0.309,-0.617)$. Minus $\beta_1q_1$: $(2.366,-1.029,-1.337)$. $\alpha_2=q_2^T(\text{that})=2.811$.
- **Build $T$:** $\begin{pmatrix}2.333&1.247\\1.247&2.811\end{pmatrix}$, with eigenvalues $\theta_1=3.84,\ \theta_2=1.30$.
- **Compare:** true $\lambda_1=4$. Lanczos gives $3.84$ after 2 matvecs. The power method with 2 matvecs gives $x_1=(4,2,1)/\sqrt{21}$ and $x_1^TBx_1=73/21=3.48$. So Lanczos is closer.
- **Eigenvector:** $y_1=(0.637,0.771)$, so $v_1\approx0.637q_1+0.771q_2=(0.963,\,0.249,\,-0.108)$, already close to $(1,0,0)$. A third step ($m=d=3$) would make it exact.

> [!tip] Exam recap
> 1. Same matvec as the power method, but all the $q_j$ are kept.
> 2. Each $q_{j+1}$ only needs orthogonalising against the previous two.
> 3. They compress $B$ into a small tridiagonal $T$ ($\alpha$ on the diagonal, $\beta$ beside it).
> 4. Eigenpairs of $T$ give approximate $\sigma^2$ and $v=Qy$.
> 5. About $O(1/\sqrt{\text{gap}})$ matvecs vs $O(1/\text{gap})$ for the power method.
> 6. Weakness: rounding destroys orthogonality (ghost eigenvalues). Fix: selective reorthogonalisation.

> [!note] Kaniel–Paige convergence bound
> Lanczos needs roughly $O\!\left(1/\sqrt{\text{gap}}\right)$ matvecs, versus the power method's $O(1/\text{gap})$, where
> $$\text{gap}:=\min_{1\le i\le k}\frac{\sigma_i-\sigma_{i+1}}{\sigma_1}$$
> is the hardest-to-separate pair among the top $k$.

One weak pair slows everyone down. This is why $m$ is chosen noticeably larger than $k$.

**Practical fix: reorthogonalisation.**
- Floating-point rounding breaks the exact orthogonality of the $q_j$ after enough steps, producing "ghost" (duplicate) eigenvalues.
- **Selective reorthogonalisation:** monitor drift each step and re-project $w$ only against the few $q_i$ that have started losing orthogonality, not the whole history (that would defeat the purpose).


  $$\frac{\lVert A-A_2\rVert_F}{\lVert A\rVert_F}=\sqrt{\frac{\text{discarded energy}}{\text{total
  energy}}}=\sqrt{\frac{5}{130}}\approx0.196$$




### 9.3 Randomized SVD

1. **Input:** $A$, rank $k$, oversampling $p$, power iterations $q$
2. $\Omega\in\mathbb{R}^{d\times(k+p)}\leftarrow$ random Gaussian matrix
3. $Y\leftarrow A\Omega$
4. **for** $i=1$ to $q$: $\ Y\leftarrow A(A^TY)$ (sharpens the gap, same trick as the power method)
5. $Q,\_\leftarrow\mathrm{QR}(Y)$ ($Q\in\mathbb{R}^{n\times(k+p)}$ orthonormal, approximates the range of $A$)
6. $B\leftarrow Q^TA$ (small, $(k+p)\times d$)
7. $\hat U,\Sigma,V^T\leftarrow$ exact SVD of $B$ (cheap because $B$ is small)
8. $U\leftarrow Q\hat U$
9. **return** top-$k$ columns of $(U,\Sigma,V)$

Only $O(q)$ passes over $A$. The heavy step $Y=A\Omega$ is a matrix-matrix product, followed by an exact tiny SVD. Implemented in `sklearn.utils.extmath.randomized_svd`.

---

## 10. Comparing the Four Methods

| Method | Per-matvec cost | Total |
|---|---|---|
| Deflation | $O(nd)+O(id)$ projection | $O(ndkt)$ |
| Block iteration | $O(ndk)+O(dk^2)$ QR | $O(ndkt)+O(dk^2t)$ |
| Lanczos | $O(nd)+O(jd)$ reorthog. | $O(ndm)+O(dm^2)$ |
| Randomized SVD | $O(nd(k+p))$ | $O(ndkq)$, $q=O(1)$ passes |

Same asymptotic shape. The real difference is **how many matvecs** ($t,t,m,q$) are needed for a given accuracy.

| Method | What it really gives you |
|---|---|
| **Deflation** | Baseline. One vector at a time, errors in $v_1$ leak into $v_2,\dots$. Needs $t=O(1/\text{gap})$ iterations per vector. |
| **Block iteration** | Same iteration count as deflation, but QR every step stops error leakage. More reliable, not fundamentally fewer matvecs. |
| **Lanczos** | Genuinely fewer matvecs, $O(1/\sqrt{\text{gap}})$, by reusing every intermediate vector. Cost: must manage reorthogonalisation. |
| **Randomized SVD** | Trades iteration count for **pass** count: $O(1)$ passes over $A$. Ideal when $A$ is too big to revisit (streaming, distributed, on disk). |

> [!tip] Which to pick
> **Lanczos** when matvecs are cheap and plentiful. **Randomized SVD** when passes over the data are the scarce resource.

---

## 11. Low-Rank Approximation and Eckart–Young

Truncate the SVD at $k$ terms:

$$A_k=\sum_{i=1}^{k}\sigma_iu_iv_i^T$$

This is the projection of $A$ onto its top-$k$ subspace.

> [!note] Eckart–Young Theorem
> For any $k\le\mathrm{rank}(A)$, $A_k$ is the **best rank-$k$ approximation** of $A$ in both Frobenius and operator (spectral) norm:
> $$\min_{\mathrm{rank}(B)\le k}\lVert A-B\rVert_F=\lVert A-A_k\rVert_F=\sqrt{\sum_{i>k}\sigma_i^2}$$
> $$\lVert A-A_k\rVert_2=\sigma_{k+1}$$

**Meaning.** The error depends only on the **discarded** singular values. If the tail $\sigma_{k+1},\sigma_{k+2},\dots$ is small, a low rank captures the data almost perfectly.

Useful related facts:

$$\lVert A\rVert_F^2=\sum_i\sigma_i^2,\qquad\lVert A\rVert_2=\sigma_1,\qquad\text{relative error}=\frac{\lVert A-A_k\rVert_F}{\lVert A\rVert_F}=\sqrt{\frac{\sum_{i>k}\sigma_i^2}{\sum_i\sigma_i^2}}$$

**Image compression.** A rank-$k$ image of size $n\times d$ needs $k(n+d+1)$ numbers instead of $nd$. In the slides, rank 20 already looks like the original with far fewer stored numbers.

**Toy check.** For the $3\times2$ example, best rank-1 approximation is $A_1=\sigma_1u_1v_1^T$ with error $\lVert A-A_1\rVert_F=\sigma_2=1$.

**Why truncation is best (intuition).** Each layer contributes $\sigma_i^2$ of "energy", and the layers are orthogonal and independent. Removing a layer removes exactly its energy and no more, so the cheapest layers to remove are the smallest. Eckart–Young proves no cleverer rank-$k$ matrix beats this.

### Example 1: the $3\times2$ matrix

$A=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}$, $\sigma_1=\sqrt3,\ \sigma_2=1$. From Section 5 the two layers are

$$\sigma_1u_1v_1^T=\tfrac12\begin{pmatrix}1&1\\1&1\\2&2\end{pmatrix},\qquad \sigma_2u_2v_2^T=\tfrac12\begin{pmatrix}1&-1\\-1&1\\0&0\end{pmatrix}$$

- **Best rank-1:** $A_1=\tfrac12\begin{pmatrix}1&1\\1&1\\2&2\end{pmatrix}$ (every row is a multiple of $(1,1)$).
- **Error:** $A-A_1$ is exactly layer 2. Frobenius: $\sqrt{\tfrac14+\tfrac14+\tfrac14+\tfrac14}=1=\sigma_2$ ✓. Spectral: $\sigma_2=1$ ✓.
- **Relative error:** $\lVert A\rVert_F^2=1+0+0+1+1+1=4=\sigma_1^2+\sigma_2^2=3+1$ ✓, so $\dfrac{\lVert A-A_1\rVert_F}{\lVert A\rVert_F}=\sqrt{\tfrac14}=0.5$. Rank 1 keeps $3/4=75\%$ of the energy.

### Example 2: errors from the singular values alone

Say $\sigma=(10,5,2,1)$. Energy is $\sigma^2$: $100,\,25,\,4,\,1$. Total $\lVert A\rVert_F^2=130$.

$A-A_k$ is exactly the **discarded layers**, so:

| Keep | Frobenius error $\sqrt{\sum_{i>k}\sigma_i^2}$ | Spectral error $\sigma_{k+1}$ | Relative error |
|---|---|---|---|
| $k=1$ | $\sqrt{25+4+1}=\sqrt{30}\approx5.48$ | $\sigma_2=5$ | $\sqrt{30/130}\approx0.48$ |
| $k=2$ | $\sqrt{4+1}=\sqrt5\approx2.24$ | $\sigma_3=2$ | $\sqrt{5/130}\approx0.196$ |

For $k=2$, kept energy is $125/130\approx96\%$. No matrix needed, only the discarded $\sigma$'s. Frobenius error is a root of a *sum*; spectral error is a *single* value (the first one dropped).

### Example 3: image compression (storage count)

A grayscale image is an $n\times d$ matrix. Take $n=100,\ d=200$.

- **Original:** $nd=20{,}000$ numbers.
- **Rank $k$:** each layer $\sigma_iu_iv_i^T$ is stored as $u_i$ ($n=100$ numbers) + $v_i$ ($d=200$ numbers) + $\sigma_i$ (1 number) $=301$ numbers. For $k=10$: $10\times301=3{,}010$ numbers, about **15%** of the original.
- **Rebuild:** compute each $\sigma_iu_iv_i^T$ and add them.
- **Break-even:** $k(n+d+1)<nd\iff k<20000/301\approx66$. Beyond that you store more than the original.

It works on real images because their singular values drop fast: a few big layers hold the shape and lighting, the many small ones are fine detail or noise.

> [!tip] Exam recap
> 1. $A_k=\sum_{i\le k}\sigma_iu_iv_i^T$ is the best rank-$k$ approximation in both norms.
> 2. Frobenius error $=\sqrt{\sum_{i>k}\sigma_i^2}$; spectral error $=\sigma_{k+1}$.
> 3. Relative error $=\sqrt{\sum_{i>k}\sigma_i^2\big/\sum_i\sigma_i^2}$.
> 4. Storage is $k(n+d+1)$ vs $nd$.

---

## 12. PCA

> [!note] Definition
> **Principal Component Analysis = SVD applied to mean-centred data.**

**Centre:** subtract the column means $\bar a$ from every row:

$$\tilde A=A-\mathbf 1\bar a^T$$

Then

$$\frac1n\tilde A^T\tilde A=C\quad(\text{sample covariance matrix})$$

- Right singular vectors $v_i$ of $\tilde A$ = eigenvectors of $C$ = the **principal components**.
- $\sigma_i^2/n$ = **variance captured** along $v_i$.

So PCA finds the directions of **maximum variance**, which is exactly the best-fit subspace once we centre.

(Picture from the slides: for a correlated 2-D Gaussian cloud, $v_1$ points along the long axis, $v_2$ is the orthogonal leftover; standard deviation along $v_i$ is $\sigma_i/\sqrt n$.)

### SVD vs PCA: when to use what

| | Raw SVD (uncentred) | PCA (centred) |
|---|---|---|
| **Use when** | zero is meaningful (ratings, term-document counts, pixel intensities); sparsity must be preserved; want the best-fit subspace **through the origin** | want directions of **maximum variance**; features on comparable scales; feeding a Euclidean-distance method afterwards |
| **Implementation** | power method / Lanczos on matvecs $Ax$, $A^Tx$; sparse $A$ stays sparse | never densify; compute $\tilde Ax=Ax-\mathbf 1(\bar a^Tx)$ inside the matvec |
| **Stopping criterion** | cosine-angle stability of successive iterates | identical, on $\tilde A^T\tilde Ax$ |

> [!tip]
> Same algorithm, same stopping rule. The only choice is whether you centre before you multiply. Implicit centring costs only $O(d)$ extra per matvec, negligible next to $O(\mathrm{nnz}(A))$. Explicitly subtracting the mean would destroy sparsity.

### Worked example: PCA by hand

Four points in 2D: $a=(1,1),\ b=(2,3),\ c=(4,3),\ d=(5,5)$.

**1. Means:** $\bar x=12/4=3,\ \bar y=12/4=3$.

**2. Centre** (subtract $(3,3)$):

$$\tilde A=\begin{pmatrix}-2&-2\\-1&0\\1&0\\2&2\end{pmatrix}$$

**3. Compute $\tilde A^T\tilde A$:** $\sum x^2=4+1+1+4=10$, $\sum y^2=4+0+0+4=8$, $\sum xy=4+0+0+4=8$.

$$\tilde A^T\tilde A=\begin{pmatrix}10&8\\8&8\end{pmatrix},\qquad C=\tfrac14\tilde A^T\tilde A=\begin{pmatrix}2.5&2\\2&2\end{pmatrix}$$

**4. Eigenvalues of $\tilde A^T\tilde A$:** trace $=18$, determinant $=80-64=16$, so $\lambda=\dfrac{18\pm\sqrt{324-64}}{2}=\dfrac{18\pm16.12}{2}$, giving $\lambda_1=17.06,\ \lambda_2=0.94$. Hence $\sigma_1=4.13,\ \sigma_2=0.97$.

**5. Principal components:** for $\lambda_1$, $(10-17.06)x+8y=0\Rightarrow y=0.883x$. Normalised:
- $v_1=(0.750,\,0.662)$ (the long diagonal direction)
- $v_2=(-0.662,\,0.750)$ (perpendicular)

**6. Variance captured** ($\lambda/n$, $n=4$): along $v_1$: $17.06/4=4.27$; along $v_2$: $0.94/4=0.23$. Total $4.5=\mathrm{trace}(C)=2.5+2$ ✓. So $v_1$ explains $4.27/4.5\approx95\%$.

**7. Project the centred points onto $v_1$:**

| Centred point | Score on $v_1$ |
|---|---|
| $(-2,-2)$ | $-2.82$ |
| $(-1,0)$ | $-0.75$ |
| $(1,0)$ | $0.75$ |
| $(2,2)$ | $2.82$ |

Check: squares sum to $7.97+0.56+0.56+7.97=17.06=\sigma_1^2$ ✓. Each 2D point is now one number with little loss (dimensionality reduction).

**Without centring.** The raw SVD of $A$ gives $v_1\approx(0.715,\,0.699)$, which just points toward the mean $(3,3)$, and $\sigma_1^2\approx89$ mostly measures distance from the origin rather than spread.

**Implicit centring check.** For $x=(1,0)$: $Ax=(1,2,4,5)$, $\bar a^Tx=3$, so $\tilde Ax=Ax-\mathbf 1\cdot3=(-2,-1,1,2)$, exactly the first column of $\tilde A$ ✓.

> [!tip] Exam recap
> 1. PCA = SVD of mean-centred data; principal components are the $v_i$ of $\tilde A$.
> 2. Variance along $v_i$ is $\sigma_i^2/n$; fraction explained is $\sigma_i^2/\sum_j\sigma_j^2$.
> 3. Raw SVD when zero is meaningful or sparsity matters; PCA for max-variance directions.
> 4. For sparse data, centre implicitly inside the matvec; never form $\tilde A$.

---

## 13. Choosing k

### Scree plot / explained variance

$$\text{fraction of variance explained by top }k=\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}$$

**Worked example.** $\sigma_i^2=(50,30,12,5,3)$, total $=100$.
- $k=2$: $(50+30)/100=80\%$
- $k=3$: $(50+30+12)/100=92\%$

Practice: plot $\sigma_i^2$ (the scree plot) and keep components up to the "elbow". Simple, but the cutoff is eyeballed.

### Choosing k rigorously (aside)

- **Random matrix theory:** singular values of pure noise cluster in a predictable bulk (Marchenko–Pastur law). Signal singular values poke out above the bulk's edge.
- **Gavish–Donoho threshold:** for $A=L_k+\text{noise}$ with i.i.d. $N(0,\sigma^2)$ noise and square $n\times n$ $A$, keep the singular values with $\sigma_i>\tau$, where

$$\tau=\frac{4}{\sqrt3}\sqrt n\,\sigma\quad(\text{noise level }\sigma\text{ known}),\qquad\tau\approx2.858\,\sigma_{\text{med}}\quad(\sigma\text{ unknown},\ \sigma_{\text{med}}=\text{median singular value})$$

- This is a provably optimal cutoff (asymptotically minimises $\lVert\hat A_k-L_k\rVert_F$) for the same signal + noise model as in Section 1.
- Other options: cross-validated reconstruction error, or domain knowledge of the true number of factors.

---

## 14. Case Study: LoRA

*Low-Rank Adaptation of Large Language Models* (Hu et al., ICLR 2022).

### Setting

- A transformer holds many weight matrices (attention Q/K/V/O and MLP projections in every layer), each roughly $W_0\in\mathbb{R}^{d\times d}$ with $d$ in the thousands.
- **Full fine-tuning** updates every entry: $d^2$ trainable parameters per matrix.
- **Observation:** the update $\Delta W=W_{\text{new}}-W_0$ has very **low intrinsic rank**, even though $W_0$ itself is full rank.

### Where SVD fits

$W_0$ stays **frozen**. Only the update is constrained to be rank $r$:

$$W=W_0+\Delta W,\qquad\Delta W=BA,\qquad B\in\mathbb{R}^{d\times r},\ A\in\mathbb{R}^{r\times d},\ r\ll d$$

- By Eckart–Young, a rank-$r$ matrix is enough when the singular-value tail of $\Delta W$ is small. LoRA assumes this and it is confirmed empirically.
- Parameters: $d^2\to2dr$. Example: $d=4096$, $r=8$ gives $\dfrac{d^2}{2dr}=\dfrac{d}{2r}=256\approx250\times$ fewer.
- LoRA is applied to each matrix independently.

### Algorithm

1. **Input:** frozen $W_0$, rank $r$, scale $\alpha$, task data
2. $A\leftarrow$ small random; $B\leftarrow0$ (so $\Delta W=BA=0$ at the start)
3. **for** each training step:
   - forward: $y=W_0x+\dfrac{\alpha}{r}(BA)x$
   - compute loss; backpropagate only through $A,B$
   - gradient step on $A,B$; $W_0$ stays frozen
4. **Deploy:** $W\leftarrow W_0+\dfrac{\alpha}{r}BA$ (merge, so no runtime overhead)

Only $2dr$ parameters get gradients and optimiser state. It is plain SGD/Adam on two small matrices.

**Why $B=0$ initially:** the model starts exactly as the pretrained one. $A$ must be non-zero or the gradients for $B$ would be zero too.

### LoRA vs baselines

| Method | Params | Inference cost | Quality |
|---|---|---|---|
| Full fine-tuning | $d^2$ | none | baseline |
| Adapters | small | added layers | $\approx$ baseline |
| LoRA ($BA$) | $2dr$ | none (merge $BA$) | $\approx$ baseline |

LoRA's edge over adapters: $BA$ folds back into $W_0$ after training, so inference is as cheap as the original model.

### Live demo (from the slides)

- **Data:** `sklearn` digits, 1797 images, $8\times8$, 10 classes, 70/30 split.
- **Model:** MLP $64\to256\to256\to10$ (ReLU).
- **Task shift:** rotate every image by $90^\circ$. Base model: 97.0% upright, 10.0% rotated (chance).

| Method | Accuracy | Trainable params |
|---|---|---|
| Full fine-tune | 94.3% | 85,002 |
| LoRA ($r=4$) | 95.6% | 5,898 |
| Head only | 39.8% | 2,570 |

- LoRA matches full fine-tuning with about $14\times$ fewer trainable parameters.
- Head-only failing shows the hidden layers, not just the classifier, need to adapt.
- **Why rank 4 was enough:** take the SVD of the residual $\Delta W_2=W_2^{\text{new}}-W_2^{\text{old}}$ from full fine-tuning. Its singular values collapse within the first 10–15 indices; rank 12 out of 256 captures 90% of $\lVert\Delta W_2\rVert_F^2$.

### Where it breaks

- LoRA's premise is **empirical, not a theorem**. $\Delta W$ is low-rank when fine-tuning re-weights skills the model already has (instruction, style, task adaptation).
- Teaching genuinely **new facts** needs an update whose singular-value tail is not small, so LoRA lags full fine-tuning.
- With $r$ too small (e.g. $r=1$), quality drops, and Eckart–Young tells you exactly what was thrown away: $\sum_{i>r}\sigma_i^2$.

> [!warning] Lesson
> Check the spectrum of the update your task actually needs before assuming a small rank is enough.

---

## 15. Exam Cheat Sheet

| Item | Formula / fact |
|---|---|
| Best-fit line | $v_1=\arg\max_{\lVert v\rVert=1}\lVert Av\rVert_2$ |
| Why max projection | $\lVert a_i\rVert^2=\langle a_i,v\rangle^2+\text{dist}^2$, left side fixed |
| Singular value | $\sigma_i=\lVert Av_i\rVert_2=\sqrt{\lambda_i(A^TA)}$ |
| Greedy | greedy top-$k$ singular vectors = globally best $k$-subspace |
| SVD | $A=U\Sigma V^T=\sum_{i=1}^r\sigma_iu_iv_i^T$ |
| Left vectors | $u_i=Av_i/\sigma_i$ |
| Spectral link | $A^TA=V\Sigma^2V^T$, $\ AA^T=U\Sigma^2U^T$ |
| Power method | $x\leftarrow Bx/\lVert Bx\rVert$, $B=A^TA$ |
| Power rate | $(\sigma_2/\sigma_1)^2$ per step |
| Random start | $\Pr[\lvert x^Tv_1\rvert\le\tfrac{1}{20\sqrt d}]\approx0.04$, independent of $d$ |
| Coordinate density | $f(s)\approx\sqrt{\tfrac{d-1}{2\pi}}\,e^{-(d-1)s^2/2}$ |
| Deflation cost | $O(ndkt)$ vs full SVD $O(nd\min(n,d))$ |
| Lanczos vs power | $O(1/\sqrt{\text{gap}})$ vs $O(1/\text{gap})$ matvecs |
| Eckart–Young (F) | $\lVert A-A_k\rVert_F=\sqrt{\sum_{i>k}\sigma_i^2}$ |
| Eckart–Young (2) | $\lVert A-A_k\rVert_2=\sigma_{k+1}$ |
| PCA | SVD of $\tilde A=A-\mathbf 1\bar a^T$; $C=\tfrac1n\tilde A^T\tilde A$ |
| Variance along $v_i$ | $\sigma_i^2/n$ |
| Explained variance | $\sum_{i\le k}\sigma_i^2\big/\sum_i\sigma_i^2$ |
| LoRA | $W=W_0+\tfrac{\alpha}{r}BA$, params $d^2\to2dr$ |

**Common traps**
- Singular values are square roots of the eigenvalues of $A^TA$, not the eigenvalues themselves.
- Best-fit subspace passes through the origin. PCA = centre first.
- Power method speed depends on the **ratio** $\sigma_2/\sigma_1$, not on $\sigma_1$ alone.
- Frobenius error uses **all** discarded $\sigma_i$; spectral-norm error uses only $\sigma_{k+1}$.
- LoRA constrains the **update** $\Delta W$ to low rank, not $W_0$.
