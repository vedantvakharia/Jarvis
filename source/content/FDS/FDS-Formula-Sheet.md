## 1. Linear Algebra

### 1.1 Norms and inner products

| Item | Formula |
|---|---|
| 2-norm | $\|x\|_2 = \sqrt{\sum_i x_i^2}$ |
| Inner product | $\langle x,y\rangle = x^Ty = \sum_i x_i y_i = \|x\|_2\|y\|_2\cos\theta$ |
| Orthogonal vectors | $\langle x,y\rangle = 0$ |
| Cauchy-Schwarz | $\|\langle x,y\rangle\| \le \|x\|_2\|y\|_2$ |

> [!example] Example
> $x=(3,4)$, $y=(4,3)$: $\|x\|=\|y\|=5$, $\langle x,y\rangle=24$, $\cos\theta = 24/25 = 0.96$, $\theta \approx 16.3^\circ$.

**Cauchy-Schwarz proof idea:** $\|x - ty\|^2 \ge 0$ for all $t$. Pick $t = \langle x,y\rangle/\|y\|^2$ (minimizer of the quadratic in $t$).

### 1.2 Matrices as linear maps

$A \in \mathbb{R}^{m\times n}$ is a linear map $x \mapsto Ax$ from $\mathbb{R}^n$ to $\mathbb{R}^m$.

- **Rank** = dim(column space) = dim(row space).
- **Symmetric:** $A = A^T$ (square only).
- **Orthogonal:** $A^TA = I$. Then $\|Ax\|_2 = \|x\|_2$ for all $x$ (pure rotation/reflection, preserves lengths and angles).

### 1.3 Eigenvalues and eigenvectors

$$Av = \lambda v \quad (v \ne 0), \qquad \det(A - \lambda I) = 0$$

- Eigenvector: $A$ only rescales it by $\lambda$ (direction kept, or flipped if $\lambda<0$).

### 1.4 Spectral Theorem

If $A\in\mathbb{R}^{n\times n}$ is **symmetric**: $n$ real eigenvalues, orthonormal eigenvector basis, and

$$A = \sum_{i=1}^n \lambda_i v_i v_i^T$$

(weighted sum of mutually orthogonal rank-one pieces).

### 1.5 Matrix norms

$$\|A\|_F = \sqrt{\sum_{i,j}A_{ij}^2}, \qquad \|A\|_2 = \max_{x\ne0}\frac{\|Ax\|_2}{\|x\|_2}$$

- Symmetric $A$: $\|A\|_2 = \max_i |\lambda_i|$.
- General (non-square) $A$: uses **singular values** (SVD, Week 4).
- Always $\|A\|_2 \le \|A\|_F$.
- Example above: $\|A\|_F = \sqrt{10} \approx 3.16$, $\|A\|_2 = 3$.

---

## 2. Probability

### 2.1 Expectation, variance, covariance

$$E[X] = \sum_x x\,P(X=x) \ \text{ or } \ \int x f(x)\,dx$$

$$\text{Var}(X) = E[(X-E[X])^2] = E[X^2] - (E[X])^2$$

$$\text{Cov}(X,Y) = E[XY] - E[X]E[Y]$$

> [!important] Linearity of expectation
> $E[aX + bY] = aE[X] + bE[Y]$ for **any** $X,Y$. No independence needed.

### 2.2 Independence

$P(X=x,Y=y) = P(X=x)P(Y=y)$ for all $x,y$.

If independent:
- $E[XY] = E[X]E[Y]$, so $\text{Cov}(X,Y)=0$.
- $\text{Var}(\sum X_i) = \sum \text{Var}(X_i)$ (variances add **only** with independence).

> [!warning] Trap: uncorrelated does NOT imply independent
> $X$ uniform on $\{-1,0,1\}$, $Y = X^2$. Then $E[X]=0$, $E[XY]=E[X^3]=0$, so $\text{Cov}=0$, yet $Y$ is a function of $X$.
> Check: $P(X=1,Y=0)=0 \ne \frac13\cdot\frac13$.
> Covariance only detects **linear** relationships.

### 2.3 Averages

For i.i.d. $X_i$ with mean $\mu$, $\bar X = \frac1n\sum X_i$:

$$E[\bar X] = \mu, \qquad \text{Var}(\bar X) = \frac{\text{Var}(X_1)}{n} \to 0$$

---

## 3. Volume in High Dimensions

### 3.1 Scaling

$$V(r) = c_d\, r^d, \qquad c_d = V(1) = \frac{\pi^{d/2}}{\Gamma(d/2+1)}$$

(The exact $c_d$ is not needed: it cancels in ratios.)

> [!important] Key ratio
> $$\frac{V((1-\epsilon)r)}{V(r)} = (1-\epsilon)^d \le e^{-\epsilon d}$$
> using $1-\epsilon \le e^{-\epsilon}$.

### 3.2 Volume sits near the surface

- Fixed $\epsilon$: inner ball fraction $\to 0$ as $d \to\infty$.
- Crossover scale: $\epsilon = c/d$ gives $(1-\epsilon)^d \le e^{-c}$ (a constant).
- **Almost all volume lies in a shell of width $\Theta(1/d)$ just inside the surface.**

### 3.3 Thin slab (first coordinate is small)

For $x$ uniform in $B^d$ and any $c>0$, at least

$$1 - \frac{2}{c}e^{-c^2/2}$$

of the volume has $|x_1| \le \dfrac{c}{\sqrt{d-1}}$.

- Holds for $\langle x,u\rangle$ with any **fixed** unit vector $u$ (rotational invariance). It is a per-direction statement, not "all coordinates at once".
- Cross-section at height $t$ is a $(d-1)$-ball of radius $\sqrt{1-t^2}$, volume $\propto (1-t^2)^{(d-1)/2} \approx e^{-t^2(d-1)/2}$ (using $\ln(1-t^2)\approx -t^2$).
- Slab half-width: $t^* = \Theta(1/\sqrt{d-1})$.
- Theoretical bound is valid but conservative (sits above the exact numerics).

### 3.4 Coordinate budget intuition

- $\|x\|^2 = \sum_k x_k^2 \approx 1$, so by symmetry $E[x_k^2] = 1/d$, typical $|x_k| \approx 1/\sqrt d$.
- Two independent points: $\text{Var}(\langle x_i,x_j\rangle) = \sum_k \frac1d\cdot\frac1d = \frac1d$, so $\langle x_i,x_j\rangle \sim O(1/\sqrt d)$.

### 3.5 $n$ random points are nearly orthogonal (BHK Ch. 2)

$x_1,\dots,x_n$ i.i.d. uniform in $B^d$. With probability $\ge 1 - O(1/n)$:

$$\|x_i\|_2 \ge 1 - \frac{2\ln n}{d} \ \ \forall i, \qquad |\langle x_i,x_j\rangle| \le \sqrt{\frac{6\ln n}{d-1}} \ \ \forall i\ne j$$

**Proof ideas:**
- Norm: apply surface concentration with $\epsilon = \frac{2\ln n}{d}$, so $\Pr[\|x_i\| < 1-\epsilon] \le e^{-\epsilon d} = n^{-2}$. Union bound over $n$ points: $\le n\cdot n^{-2} = 1/n$.
- Inner product: thin slab with $c=\sqrt{6\ln n}$ gives $\frac2c e^{-c^2/2} = O(n^{-3})$ per pair. Union bound over $\binom n2 < n^2$ pairs: $O(1/n)$.

**n vs d tension:**
- Fix $d$, grow $n$: norm floor drops only like $\Theta(\log n)$, dot-product bound grows like $\Theta(\sqrt{\log n})$.
- Fix $n$, grow $d$: norm gap is $O(1/d)$, dot product bound is $O(1/\sqrt d)$.
- Near-orthogonality survives provided $d \gg \log n$.

**Toy check (random sign vectors):** $u,v \in \{\pm1/\sqrt d\}^d$: $E\langle u,v\rangle = 0$, $\text{Var} = 1/d$. For $d=10^4$, typical $|\langle u,v\rangle| \approx 0.01$ (within about $0.6^\circ$ of $90^\circ$).

---

## 4. Gaussian Annulus Theorem

### 4.1 Setup

Spherical Gaussian $x\sim N(0,I_d)$, each $x_i\sim N(0,1)$ independent.

$$E[\|x\|_2^2] = \sum_i E[x_i^2] = d \quad\Rightarrow\quad \|x\|_2 \approx \sqrt d$$

### 4.2 Why a shell, not the origin

Mass at radius $r$ is proportional to

$$\underbrace{e^{-r^2/2}}_{\text{density shrinks}}\cdot\underbrace{r^{d-1}}_{\text{shell volume explodes}}$$

Peak at $r \approx \sqrt{d-1}$. The mean $\vec 0$ is one of the least likely places to find a sample.

### 4.3 Theorem

> [!important] Gaussian Annulus Theorem
> For $\beta \le \sqrt d$, all but at most $3e^{-c\beta^2}$ of the mass satisfies
> $$\sqrt d - \beta \le \|x\|_2 \le \sqrt d + \beta$$
> with a constant $c>0$ independent of $d$. Proven here with $c = \tfrac18$.

The shell **width is $O(1)$**, not growing with $d$ (radius is $\sqrt d$).
Example: $d=10^4$, radius $\approx 100 \pm O(1)$.

$$\Pr\Big[Z \ge t\Big] \le e^{-t^2/(8d)}, \qquad \Pr\Big[Z\le -t\Big] \le e^{-t^2/(8d)}, \qquad \Pr\Big[|Z|\ge t\Big] \le 2e^{-t^2/(8d)}\qquad 0\le t\le d$$

   $$
   \Pr\big[\big|\|x\|_2 - \sqrt d\big| \ge \beta\big] \le 3e^{-\beta^2 /8}
   $$


7. **Convert $t \to \beta$** using $(\sqrt d \pm\beta)^2 - d = \pm 2\beta\sqrt d + \beta^2$:

| Tail | Threshold $t$ | Condition | Bound |
|---|---|---|---|
| Upper: $\|x\|\ge\sqrt d+\beta$ | $2\beta\sqrt d+\beta^2$, relax to $2\beta\sqrt d$ | $\beta\le\sqrt d/2$ | $e^{-\beta^2/2}$ |
| Lower: $\|x\|\le\sqrt d-\beta$ | $2\beta\sqrt d - \beta^2$ | all $\beta\in(0,\sqrt d]$ ($0<t\le d$ holds) | $e^{-(2\beta\sqrt d-\beta^2)^2/(8d)}$ |

8. **Constant:** lower-tail exponent over $\beta^2$ is $\dfrac{(2-\beta/\sqrt d)^2}{8}$, decreasing from $\tfrac12$ (as $\beta\to0$) to $\tfrac18$ (at $\beta=\sqrt d$, worst case). So $c = \tfrac18$ and by union bound over both tails:
   $$\Pr[\text{outside annulus}] \le 2e^{-\beta^2/8} \le 3e^{-\beta^2/8}$$
9. Tightness: true worst-case rate (Cramer-type) is about $0.81$ vs proven $\tfrac18$, so the bound is valid but conservative (about 6-7x).

### 4.5 Aside: Transformer attention scaling

$q,k\in\mathbb{R}^{d_k}$ with i.i.d. $O(1)$ entries: $q\cdot k$ has mean $0$, variance $d_k$, so $|q\cdot k| = \Theta(\sqrt{d_k})$. Large scores saturate softmax (vanishing gradients). Fix:

$$\text{Attention}(Q,K,V) = \text{softmax}\!\Big(\frac{QK^T}{\sqrt{d_k}}\Big)V$$

---

## 5. Random Projection and Johnson-Lindenstrauss

### 5.1 Gaussian linear combinations

If $Z_i\sim N(\mu_i,\sigma_i^2)$ are independent:

$$\sum_i a_iZ_i \sim N\Big(\sum a_i\mu_i,\ \sum a_i^2\sigma_i^2\Big)$$

Proof: MGF of sum of independents = product of MGFs, which is again a Gaussian MGF:
$E[e^{t\sum a_iZ_i}] = \prod_i e^{ta_i\mu_i + \frac12t^2a_i^2\sigma_i^2}$. MGF determines the distribution.

### 5.2 The map

Draw $u_1,\dots,u_k \sim N(0,I_d)$ i.i.d. Define

$$f(v) = (u_1\cdot v,\dots,u_k\cdot v) = Av,\quad A\in\mathbb{R}^{k\times d}\ \text{(rows } u_i^T)$$

For fixed $v$: each $u_i\cdot v \sim N(0,\|v\|_2^2)$ (mean $0$, variance $\sum_j v_j^2$), independent across $i$. So $f(v)/\|v\|_2 \sim N(0,I_k)$ and

$$\|f(v)\|_2 \approx \sqrt k\,\|v\|_2$$

**Linearity:** $f(x)-f(y) = f(x-y)$, so preserving all pairwise distances is the same as preserving the length of one vector $v=x-y$.

### 5.3 Random Projection Theorem (BHK Thm 2.10)

> [!important]
> For fixed $v\in\mathbb{R}^d$, $\epsilon\in(0,1)$, $c=\tfrac18$:
> $$\Pr\Big[\big|\,\|f(v)\| - \sqrt k\,\|v\|\,\big| \ge \epsilon\sqrt k\,\|v\|\Big] \le 3e^{-ck\epsilon^2}$$

- Equivalent: $(1-\epsilon)\sqrt k\|v\| \le \|f(v)\| \le (1+\epsilon)\sqrt k\|v\|$.
- **Does not depend on ambient $d$.**
- Proof: WLOG $\|v\|=1$ (linearity), so $f(v)\sim N(0,I_k)$ exactly. Apply the Annulus Theorem in dimension $k$ with $\beta = \epsilon\sqrt k \le \sqrt k$.
- Do **not** orthogonalize the $u_i$ (it would break independence and exact Gaussianity). Independent random directions are already nearly orthogonal in high $d$.

### 5.4 JL Lemma (BHK Thm 2.11)

Union bound over $\binom n2 < n^2/2$ pairs. Need $3e^{-ck\epsilon^2} \le \dfrac{3}{n^3}$:

$$k \ge \frac{3\ln n}{c\,\epsilon^2}$$

Total failure probability $< \dfrac{n^2}{2}\cdot\dfrac{3}{n^3} = \dfrac{3}{2n}$.

> [!important] JL Lemma
> For $\epsilon\in(0,1)$, $n$ points in $\mathbb{R}^d$, $k \ge \dfrac{3}{c\epsilon^2}\ln n$: with probability $\ge 1-\dfrac{3}{2n}$, for **all** pairs
> $$(1-\epsilon)\sqrt k\,\|v_i-v_j\| \le \|f(v_i)-f(v_j)\| \le (1+\epsilon)\sqrt k\,\|v_i-v_j\|$$
> $k$ depends only on $\log n$ and $\epsilon$, **not** on $d$.

Existence argument (small failure probability implies some projection has zero failures) is the **probabilistic method**.

### 5.5 Algorithm

1. Set $k = O(\epsilon^{-2}\log n)$.
2. $R\in\mathbb{R}^{k\times d}$ with i.i.d. $N(0,1)$ entries.
3. $f(x) = \dfrac{1}{\sqrt k}Rx$ (the $1/\sqrt k$ gives the plain $(1\pm\epsilon)$ guarantee).
4. Run distance-based tasks (nearest neighbors, clustering) on $f(x)$.

### 5.6 When does JL help?

| Regime | $k$ vs $d$ | Outcome |
|---|---|---|
| $d \gg \epsilon^{-2}\log n$ | $k\ll d$ | Big savings (sweet spot) |
| $d\approx\epsilon^{-2}\log n$ | $k\approx d$ | Marginal |
| $d\ll\epsilon^{-2}\log n$ | $k>d$ | Nothing to reduce (use identity) |

- $k = \min(d,\ O(\epsilon^{-2}\log n))$ always suffices.
- $n$ enters only via $\log n$. Halving $\epsilon$ quadruples $k$ ($k\propto 1/\epsilon^2$).
- **Numbers:** $n=1000$, $\epsilon=0.1$: $k\approx \ln(1000)/0.01 \approx 690$. MNIST ($d=784$) gets almost nothing. $\epsilon=0.01$ pushes $k$ into the tens of thousands.
- Hidden constant in $O(\cdot)$ depends on the concentration bound, so this shows scaling, not a production formula.

### 5.7 Achlioptas sign matrix

Use $r_{ij}=\pm1$ (fair coin) instead of Gaussians. Needs only $E[r_{ij}]=0$, $\text{Var}(r_{ij})=1$.

- Cheaper: zero multiplications (only signed additions). Sparse $\{+1,0,-1\}$ variant helps further for sparse inputs.
- Toy unbiasedness ($d=2,k=1$): $f(x)^2 = x_1^2+x_2^2+2r_1r_2x_1x_2$ and $E[r_1r_2]=0$, so $E[f(x)^2]=\|x\|^2$.
- Example: $x=(3,-1,2,4)$, $r=(+,-,+,+)$ gives $r\cdot x = 10$.

> [!warning] Spiky vectors
> Sign matrices are **not** rotation invariant. For $v=(1,0,\dots,0)$, $r_i\cdot v=\pm v_1$ is a single coin flip and never concentrates, however large $k$ is. Quality depends on $\|v\|_\infty/\|v\|_2$.
> Fixes: sparser $\{+\sqrt s,0,-\sqrt s\}$ variant, or Hadamard preconditioner (Fast-JL), at the cost of some speedup.
> Gaussian projections are rotation invariant (depend only on $\|v\|_2$).

### 5.8 Limits of JL

- Never promises fewer than $O(\epsilon^{-2}\log n)$ dimensions.
- Covers only pairwise distances among the $n$ projected points. Nothing about cluster shapes, class margins, or later points (adding points means redoing the union bound with larger $n$).

---

## 6. Proof Recipes (reused constantly)

> [!tip] Recipe A: concentration for many objects
> 1. Prove a strong concentration bound for **one** random object.
> 2. **Union bound** to cover all $n$ (or $\binom n2$) objects at once, accepting a weaker constant.

> [!tip] Recipe B: power to exponential
> $(1-\epsilon)^d \le e^{-\epsilon d}$ and $(1-t^2)^{(d-1)/2}\approx e^{-t^2(d-1)/2}$.

> [!tip] Recipe C: Chernoff
> Exponentiate (monotone) -> Markov -> independence turns sum into product of MGFs -> bound each log-MGF by a quadratic -> optimize the free parameter $\lambda$ (check its validity range).

> [!tip] Recipe D: coordinate budget
> Fixed total squared length shared by $d$ coordinates: each is $\approx 1/\sqrt d$; dot products of independent points are $\approx 1/\sqrt d$.

---

## 7. Quick Reference Table

| Quantity | Value / Scale |
|---|---|
| $V(r)$ | $c_d r^d$ |
| Inner-ball volume fraction | $(1-\epsilon)^d \le e^{-\epsilon d}$ |
| Surface shell width | $\Theta(1/d)$ |
| Slab half-width (first coordinate) | $\Theta(1/\sqrt{d-1})$ |
| Typical coordinate (unit ball) | $\approx 1/\sqrt d$ |
| Dot product of 2 random points | $\approx 1/\sqrt d$ (variance $1/d$) |
| $n$-point inner product bound | $\sqrt{6\ln n/(d-1)}$ |
| $n$-point norm floor | $1 - 2\ln n/d$ |
| Gaussian norm | $\sqrt d \pm O(1)$ |
| Annulus failure prob. | $3e^{-\beta^2/8}$ |
| $\chi_1^2$ MGF | $(1-2\lambda)^{-1/2}$, $\lambda<\frac12$ |
| Log-MGF bound | $\le 2\lambda^2$, $\lambda\in[0,\frac14]$ |
| Chernoff optimum | $\lambda^*=t/(4d)$, bound $e^{-t^2/(8d)}$, need $t\le d$ |
| Projection failure prob. | $3e^{-k\epsilon^2/8}$ |
| JL dimension | $k\ge \dfrac{3\ln n}{c\epsilon^2}$, $c=\frac18$ (so $k \ge 24\ln n/\epsilon^2$) |
| JL success prob. | $\ge 1-\dfrac{3}{2n}$ |
