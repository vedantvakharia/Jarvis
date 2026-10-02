# FDS Tutorial Solutions (Tut 1 – Tut 4)

> [!info] How to use this file
> - Every problem: **Question** → **Solution** (Step 1, Step 2, …) → **Answer**.
> - Methods are taken from your notes: **W1** = [[FDS-Week1-Foundations]], **W2** = [[FDS-Week2-HighDimensionalSpace-JL]], **L4** = [[FDS_Lecture4_Concentration_Inequalities]], **L5** = [[FDS_Lecture5_BestFit_Subspaces_SVD]], **L6** = [[FDS_Lecture6_SVD_Applications_KDE_Curse]].
> - ⚠ = this step uses a standard method that is **not in your notes**. I solved it from first principles and marked it, so you know it is not a slide method.
> - Simulation problems: no code. I give the method and what theory predicts.
> - Decimals were lost in the PDFs (e.g. "0001"). I restored them (0.001) from context.
> - Formula sheet first (Section 0), then Tut 1 → Tut 4.

## Contents
- [[#0. Formula sheet]]
- [[#TUT 1: High-Dimensional Geometry]]
- [[#TUT 2: Concentration Inequalities]]
- [[#TUT 3: Best-Fit Subspaces & SVD]]
- [[#TUT 4: Applications of SVD, Curse of Dimensionality]]

---

# 0. Formula sheet

## 0.1 Basics (W1)

$$\|x\|_2=\sqrt{\textstyle\sum x_i^2},\qquad \langle x,y\rangle=\|x\|\|y\|\cos\theta,\qquad \text{orthogonal}\iff\langle x,y\rangle=0$$

$$\|A\|_F=\sqrt{\textstyle\sum_{i,j}A_{ij}^2}=\sqrt{\textstyle\sum_i\sigma_i^2},\qquad \|A\|_2=\max_{\|x\|=1}\|Ax\|=\sigma_1$$

$$E[aX+bY]=aE[X]+bE[Y]\ (\text{always}),\qquad \mathrm{Var}(X)=E[X^2]-E[X]^2,\qquad \mathrm{Cov}(X,Y)=E[XY]-E[X]E[Y]$$

- Independent $\Rightarrow$ $E[XY]=E[X]E[Y]$ and $\mathrm{Var}(\sum X_i)=\sum\mathrm{Var}(X_i)$.
- Sample mean: $E[\bar X]=\mu$, $\ \mathrm{Var}(\bar X)=\sigma^2/n$.
- Uniform$[a,b]$: mean $\frac{a+b}2$, variance $\frac{(b-a)^2}{12}$. Uniform$[0,1]$: $E[x]=\frac12$, $E[x^2]=\frac13$, $\mathrm{Var}=\frac1{12}$.
- $1+x\le e^x$ for all $x$.
- Linear combination of independent Gaussians is Gaussian: $\sum a_iZ_i\sim N\big(\sum a_i\mu_i,\ \sum a_i^2\sigma_i^2\big)$.
- Spectral theorem: symmetric $A=\sum\lambda_iv_iv_i^T$.

## 0.2 High-dimensional geometry (W2)

$$V(r)=c_dr^d,\qquad \frac{V((1-\epsilon)r)}{V(r)}=(1-\epsilon)^d\le e^{-\epsilon d},\qquad V(1)=\frac{\pi^{d/2}}{\Gamma(\frac d2+1)}$$

- Shell width where volume transitions: $\epsilon=\Theta(1/d)$ (set $\epsilon=c/d\Rightarrow e^{-c}$).
- Thin slab: for $x$ uniform in $B^d$, at least $1-\frac2ce^{-c^2/2}$ of the volume has $|x_1|\le\frac{c}{\sqrt{d-1}}$. Density of one coordinate: $f(s)\approx\sqrt{\frac{d-1}{2\pi}}e^{-(d-1)s^2/2}$.
- Coordinate budget (unit vectors): $E[x_k^2]=\frac1d$, $\ \mathrm{Var}\langle x_i,x_j\rangle=\frac1d$.
- $n$ random points in $B^d$ (prob. $\ge1-O(1/n)$): $\|x_i\|\ge1-\frac{2\ln n}{d}$, $\ |\langle x_i,x_j\rangle|\le\sqrt{\frac{6\ln n}{d-1}}$.
- Spherical Gaussian $x\sim N(0,I_d)$: $E\|x\|^2=d$. **Annulus theorem:** $\Pr\big[\,|\|x\|-\sqrt d|\ge\beta\,\big]\le3e^{-\beta^2/8}$ for $\beta\le\sqrt d$.
- Two Gaussians: $x-x'=\sqrt2\,z$ ($z\sim N(0,I)$), $\|x-x'\|^2\approx2d$, $\|x-y\|^2\approx2d+\Delta^2$, separable if $\Delta=\Omega(d^{1/4})$.
- Random projection $f(v)=Av$, $A$ is $k\times d$ with i.i.d. $N(0,1)$ entries: $\|f(v)\|\approx\sqrt k\|v\|$ and
$$\Pr\big[\,|\|f(v)\|-\sqrt k\|v\||\ge\epsilon\sqrt k\|v\|\,\big]\le3e^{-ck\epsilon^2},\quad c=\tfrac18$$
- **JL:** $k\ge\frac{3\ln n}{c\epsilon^2}$ keeps all pairwise distances within $(1\pm\epsilon)\sqrt k$ with probability $\ge1-\frac3{2n}$. $\ f(x)=\frac1{\sqrt k}Rx$.

## 0.3 Concentration (L4)

$$\textbf{Markov } (X\ge0):\ \Pr[X\ge a]\le\frac{E[X]}a\qquad\textbf{Chebyshev:}\ \Pr[|X-\mu|\ge a]\le\frac{\sigma^2}{a^2}$$

$$\textbf{Weak law:}\ \Pr[|\bar X-\mu|\ge\epsilon]\le\frac{\sigma^2}{n\epsilon^2}$$

$$\textbf{Chernoff } (X=\textstyle\sum\text{ independent }\{0,1\},\ \mu=E[X],\ 0<\delta\le1):$$
$$\Pr[X\ge(1+\delta)\mu]\le e^{-\mu\delta^2/3},\qquad \Pr[X\le(1-\delta)\mu]\le e^{-\mu\delta^2/2},\qquad \Pr[|X-\mu|\ge\delta\mu]\le2e^{-\mu\delta^2/3}$$
$$\text{general: }\Pr[X\ge(1+\delta)\mu]\le\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^\mu$$

- Recipes: Chebyshev = Markov on $(X-\mu)^2$. Chernoff = Markov on $e^{tX}$, factorise (independence), use $1+y\le e^y$.
- Union bound: $\Pr[\cup A_i]\le\sum\Pr[A_i]$.
- Fitting a Gaussian: $\hat\mu=\frac1n\sum x^{(i)}$, $\hat\mu_j\sim N(\mu_j,\sigma^2/n)$, samples $n\ge\frac{d\sigma^2}{\epsilon^2\eta}$ (Chebyshev + union bound). $\hat\sigma^2=\frac1{nd}\sum\|x^{(i)}-\hat\mu\|^2$ (biased by $\frac{n-1}n$).
- ⚠ Gaussian tail via MGF ($E e^{\lambda Z}=e^{\lambda^2/2}$, Chernoff recipe with $\lambda=t$): $\Pr[|Z|\ge t]\le2e^{-t^2/2}$ for $Z\sim N(0,1)$.

## 0.4 SVD (L5)

$$A=U\Sigma V^T=\sum_{i=1}^r\sigma_iu_iv_i^T,\qquad u_i=\frac{Av_i}{\sigma_i},\qquad A^TA=\sum\sigma_i^2v_iv_i^T,\qquad AA^T=\sum\sigma_i^2u_iu_i^T$$

- Recipe for SVD by hand: (1) $A^TA$; (2) eigenvalues $\lambda_i$, unit eigenvectors $v_i$; (3) $\sigma_i=\sqrt{\lambda_i}$; (4) $u_i=Av_i/\sigma_i$.
- Best-fit line through origin: $v_1=\arg\max_{\|v\|=1}\|Av\|$. Pythagoras: $\|a_i\|^2=\langle a_i,v\rangle^2+\mathrm{dist}^2$. Minimise distance $\iff$ maximise $\|Av\|^2=v^TA^TAv=\sum\lambda_ic_i^2\le\lambda_1$.
- Greedy $v_1,\dots,v_k$ span the best-fit $k$-subspace. **Best-fit line NOT through origin: centre first** (passes through the centroid).
- Power method: $x\leftarrow\frac{Bx}{\|Bx\|}$, $B=A^TA$. $\ B^tx=\sum\sigma_i^{2t}\langle x,v_i\rangle v_i$. Error shrinks by $(\sigma_2/\sigma_1)^2$ per step; $\tan\angle(x_t,v_1)=\frac{(\sum_{i\ge2}c_i^2\sigma_i^{4t})^{1/2}}{|c_1|\sigma_1^{2t}}$. $\ \sigma_1=\|Av_1\|$.
- Stopping: $1-|x^Tx_{old}|\approx\theta^2/2<\varepsilon$ for $k$ consecutive steps. Random start: $\Pr[|x^Tv_1|\le\frac1{20\sqrt d}]\approx0.04$.
- Deflation: $A-\sigma_1u_1v_1^T=A(I-v_1v_1^T)$. Cost $O(ndkt)$.
- Block iteration: $X\leftarrow A^T(AX)$, $X=QR$. Lanczos: $T$ tridiagonal ($\alpha_j$ diagonal, $\beta_j$ off-diagonal), $\sigma_i\approx\sqrt{\theta_i}$, needs $O(1/\sqrt{\text{gap}})$, $\text{gap}=\min_{i\le k}\frac{\sigma_i-\sigma_{i+1}}{\sigma_1}$ (power method $O(1/\text{gap})$). Randomized SVD: $Y=A\Omega$, $q$ times $Y\leftarrow A(A^TY)$, $Y=QR$, $B=Q^TA$, SVD of $B$.
- **Eckart–Young:** $\|A-A_k\|_F=\sqrt{\sum_{i>k}\sigma_i^2}$, $\ \|A-A_k\|_2=\sigma_{k+1}$. $\ \|A\|_F^2=\sum\sigma_i^2$. Storage of $A_k$: $k(m+n+1)$.
- PCA: centre $\tilde A=A-\mathbf1\bar a^T$, $C=\frac1n\tilde A^T\tilde A$, variance along $v_i=\sigma_i^2/n$. Explained variance $=\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}$.
- Gavish–Donoho (as given in the problem): $\tau^\star\approx2.858\,\sigma\sqrt n$. (Notes' known-$\sigma$ form: $\frac4{\sqrt3}\sqrt n\sigma$.)
- LoRA: $W=W_0+\frac\alpha rBA$, params $d^2\to2dr$, $B=0$ at start, $A$ random. ⚠ Rank: $\mathrm{rank}(X+Y)\le\mathrm{rank}X+\mathrm{rank}Y$.

## 0.5 Applications of SVD & curse of dimensionality (L6)

- LSI: terms = rows, $q_k=U_k^Tq$, $d_j=U_k^TA_{\cdot j}$, score $\cos(q_k,d_j)$. $(U_k^Tx)^T(U_k^Ty)=(P_kx)^T(P_ky)$, $P_k=U_kU_k^T$. (Need $k\ge2$ for cosine.)
- Recommender: $\hat A_{ij}=\sum_{\ell\le k}\sigma_\ell u_{i\ell}v_{j\ell}$. Masked objective $\min\sum_{(i,j)\ obs}(A_{ij}-(UV^T)_{ij})^2$. ALS = ridge: $p_u=\arg\min\sum_{i\ rated}(A_{ui}-p\cdot q_i)^2+\lambda\|p\|^2$. Zero init stays at zero.
- KDE: $\hat p(x)=\frac1{nh^d}\sum K\big(\frac{x-x^{(i)}}h\big)$; $\text{bias}^2\propto h^4$, $\text{var}\propto\frac1{nh^d}$; $h^*\propto n^{-1/(d+4)}$; $\text{MSE}\propto n^{-4/(d+4)}$; $n\propto\varepsilon^{-(d+4)/4}$.
- Neighbourhood side: $e_d(r)=r^{1/d}$. Points per bump $n(h^*)^d\to1$.
- Distance concentration: $\frac{\text{dist}_{\max}-\text{dist}_{\min}}{\text{dist}_{\min}}\to0$.
- ⚠ First-order: $\sqrt X\approx\sqrt{EX}+\frac{X-EX}{2\sqrt{EX}}$. Maximum of $N$ Gaussians $\approx$ the stated median value (given in problem).
- UMAP: $\rho_i=d_1$; $\sum_{j}e^{-(d_j-\rho_i)/\sigma_i}=\log_2k$; $w_{j|i}=e^{-(d_j-\rho_i)/\sigma_i}$; fuzzy union $w_{ij}=a+b-ab$. Laplacian $L=D-W$, $y^TLy=\frac12\sum_{i,j}w_{ij}(y_i-y_j)^2$; $L\mathbf1=0$ (discard).
- RAG: $s_i=\langle z_q,z_i\rangle$, $w_i=\frac{e^{s_i/\tau}}{\sum e^{s_j/\tau}}$, $p=\sum w_ig_i$, $\varepsilon_k=\sum_{i\notin Z_k}w_i$, $0\le p-\hat p\le\varepsilon_k$. $\ r_i=\frac{w_ig_i}p$, $\ \frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}\tau$. RAG-Sequence $p=\sum_zp(z)\prod_tp(y_t\mid z)$; RAG-Token $p=\prod_t\sum_zp(z)p(y_t\mid z)$.

---

# TUT 1: High-Dimensional Geometry

## Section A: Volumes and concentration near the surface

### A1 (BHK 2.10)

> **Question.** How large must $\epsilon$ be for 99% of the volume of a 1000-dimensional unit-radius ball to lie in the shell of $\epsilon$-thickness at the surface?

**Solution.**
- **Step 1.** Volume inside radius $(1-\epsilon)$ is the fraction $(1-\epsilon)^d$ (W2 §2.1). We want the inner part $\le1\%$.
- **Step 2.** Solve $(1-\epsilon)^{1000}=0.01$:
$$1-\epsilon=0.01^{1/1000}=e^{-\ln100/1000}\ \Rightarrow\ \epsilon=1-e^{-0.004605}\approx0.0046$$
- **Step 3 (quick version using $(1-\epsilon)^d\le e^{-\epsilon d}$).** Set $e^{-\epsilon d}=0.01\Rightarrow\epsilon=\frac{\ln100}{d}=\frac{4.605}{1000}=0.0046$.

> [!success] Answer
> $\epsilon\approx0.0046$ (about $0.46\%$ of the radius). In general $\epsilon\approx\frac{\ln 100}{d}$.

### A2 (BHK 2.17)

> **Question.** How does the volume of a ball of radius two behave as the dimension increases? What if the radius is larger than two but a constant independent of $d$? What function of $d$ must the radius be for a ball of radius $r$ to have approximately constant volume as $d$ grows? Hint: Stirling, $n!\approx(n/e)^n$.

**Solution.**
- **Step 1. Write the volume.** $V(r)=r^d\,\dfrac{\pi^{d/2}}{\Gamma(\frac d2+1)}$ (W2 §2.2).
- **Step 2. Stirling.** $\Gamma(\frac d2+1)=(\frac d2)!\approx\left(\frac{d}{2e}\right)^{d/2}$. So
$$V(r)\approx r^d\left(\frac{2\pi e}{d}\right)^{d/2}=\left(\frac{2\pi e\,r^2}{d}\right)^{d/2}$$
- **Step 3. Look at the base** $\frac{2\pi e r^2}{d}$. It decreases as $d$ grows, and the exponent $d/2$ grows.
  - Radius 2: base $=\frac{8\pi e}{d}$. For $d<8\pi e\approx68$ the base is $>1$; for $d>68$ the base is $<1$. So the volume first grows (peak near $d\approx2\pi r^2\approx25$), then goes to $0$ faster than exponentially.
  - Constant radius $r>2$: same shape, the cut-off is $d\approx2\pi e r^2$. Still $\to0$.
- **Step 4. Constant volume.** Need base $\approx$ constant, i.e. $\frac{2\pi er^2}{d}=1$:
$$r=\sqrt{\frac{d}{2\pi e}}\ \ (\approx0.24\sqrt d)$$

> [!success] Answer
> Radius 2 or any fixed $r$: volume $\to0$ as $d\to\infty$ (after a short initial rise). Constant volume needs $r=\Theta(\sqrt d)$, precisely $r\approx\sqrt{d/(2\pi e)}$.

### A3 (BHK 2.9)

> **Question.** A random point $x$ on the surface of the unit sphere in $\mathbb R^d$. What is the variance of $x_1$? Argue without integrals.

**Solution.**
- **Step 1. Mean is 0.** By symmetry $x$ and $-x$ are equally likely, so $E[x_1]=0$.
- **Step 2. Budget.** $\sum_{k=1}^dx_k^2=1$ always. Take expectations: $\sum_kE[x_k^2]=1$.
- **Step 3. Symmetry.** All coordinates look the same, so $E[x_k^2]$ is equal for all $k$. Each gets $\frac1d$ (W2 "coordinate budget").
- **Step 4.** $\mathrm{Var}(x_1)=E[x_1^2]-E[x_1]^2=\frac1d$.

> [!success] Answer
> $\mathrm{Var}(x_1)=\dfrac1d$.

### A4 (BHK 2.23)

> **Question.** Calculate the ratio of area above the plane $x_1=\epsilon$ to the area of the upper hemisphere of a unit-radius ball in $d$ dimensions for $\epsilon=0.001,0.01,0.02,0.03,0.04,0.05$ and for $d=100$ and $d=1000$.

**Solution.**
- **Step 1. Turn the ratio into a probability.** Cap above $x_1=\epsilon$ divided by the upper half $=\dfrac{\Pr[x_1>\epsilon]}{1/2}=\Pr[\lvert x_1\rvert>\epsilon]$ (symmetry).
- **Step 2. Use the slab density** (W2 §2.5, L5 §7): $x_1\approx N\!\left(0,\frac1{d-1}\right)$. Let $c=\epsilon\sqrt{d-1}$. Then
$$\text{ratio}\approx\Pr[\lvert Z\rvert>c]=2\big(1-\Phi(c)\big),\qquad Z\sim N(0,1)$$
- **Step 3. Table** ($c=\epsilon\sqrt{d-1}$; values from the Gaussian formula; they agree with the exact incomplete-Beta values to about 3 decimals):

| $\epsilon$ | $d=100$ ($c$) | ratio | $d=1000$ ($c$) | ratio |
|---|---|---|---|---|
| 0.001 | 0.010 | 0.992 | 0.032 | 0.975 |
| 0.01 | 0.099 | 0.921 | 0.316 | 0.752 |
| 0.02 | 0.199 | 0.842 | 0.632 | 0.527 |
| 0.03 | 0.298 | 0.765 | 0.948 | 0.343 |
| 0.04 | 0.398 | 0.691 | 1.264 | 0.206 |
| 0.05 | 0.497 | 0.619 | 1.580 | 0.114 |

- **Step 4. Check with the slide bound** $\frac2ce^{-c^2/2}$ (valid only for $c\ge1$): $d=1000$, $\epsilon=0.04$: $0.711\ge0.206$ ✓; $\epsilon=0.05$: $0.363\ge0.114$ ✓. For $c<1$ the bound exceeds 1 and says nothing.

> [!success] Answer
> Ratios are in the table. At $d=100$ even $\epsilon=0.05$ leaves $62\%$ of the area above the plane; at $d=1000$, $\epsilon=0.05$ leaves only $11\%$. Concentration at the equator needs $\epsilon\gg\frac1{\sqrt{d}}$.

### A5 (BHK 2.24 & 2.25)

> **Question.** (a) Almost all the volume of a high-dimensional ball lies in a narrow slice at the equator, but the slice depends on which surface point is the North Pole. How can this be true for several different North Poles (different equators)?
> (b) How can the volume simultaneously be in a narrow equatorial slice and in a narrow annulus at the surface?

**Solution (a).**
- **Step 1.** "Almost all" means all but a tiny fraction $\delta\le\frac2ce^{-c^2/2}$. It does not mean all.
- **Step 2.** For each fixed pole $u$, the volume outside its slab $\lvert\langle x,u\rangle\rvert\le\frac c{\sqrt{d-1}}$ is at most $\delta$.
- **Step 3. Union bound.** For $m$ different poles, the volume outside **at least one** slab is at most $m\delta$. Since $\delta$ is exponentially small, even a huge number $m$ of poles still leaves almost all points inside all $m$ slabs at once.
- **Step 4. Intuition (near-orthogonality).** A random point is nearly orthogonal to every fixed direction (W2 §2.6), so it sits near the equator of every pole simultaneously.

**Solution (b).**
- **Step 1.** The two statements are about different things: the **slab** limits one coordinate ($\lvert x_1\rvert\lesssim\frac1{\sqrt d}$); the **annulus** limits the norm ($\|x\|\ge1-\frac cd$).
- **Step 2.** Each fails with tiny probability, so by the union bound both hold together for almost all points.
- **Step 3. Picture.** Almost all the volume is a thin skin near the surface. On that skin, a point has only $x_1^2\approx\frac1d$ of its squared length in the pole direction (coordinate budget), so it is near the equator. The equatorial belt of the surface is nearly the whole surface.

> [!success] Answer
> (a) "Almost all" tolerates a tiny exceptional set; by the union bound many different slabs can all hold at once. (b) Slab restricts one coordinate, annulus restricts the radius, and both fail with exponentially small probability, so both hold together.

## Section B: High-dimensional Gaussians and near-orthogonality

### B1 (BHK 2.8)

> **Question.** $G$ is a $d$-dimensional spherical Gaussian with variance $\frac12$ in each direction, centred at the origin. Derive the expected squared distance to the origin.

**Solution.**
- **Step 1.** Squared distance $\|G\|^2=\sum_{i=1}^dG_i^2$.
- **Step 2. Linearity.** $E\|G\|^2=\sum_iE[G_i^2]$.
- **Step 3.** Mean is 0, so $E[G_i^2]=\mathrm{Var}(G_i)=\frac12$.
- **Step 4.** Sum over $d$ coordinates.

> [!success] Answer
> $E\|G\|^2=\dfrac d2$. (For variance 1 it is $d$, W2 §3.1.)

### B2 (BHK 2.28)

> **Question.** $x,y$ are $d$-dimensional zero-mean, unit-variance Gaussian vectors. Prove they are almost orthogonal by considering their dot product.

**Solution.**
- **Step 1. Mean and variance of the dot product.** $\langle x,y\rangle=\sum_ix_iy_i$. $E[x_iy_i]=E[x_i]E[y_i]=0$ (independent). $\mathrm{Var}(x_iy_i)=E[x_i^2]E[y_i^2]=1$. Terms are independent, so $\mathrm{Var}\langle x,y\rangle=d$. Typical size $\sqrt d$.
- **Step 2. Lengths.** By the Annulus theorem, $\|x\|\approx\|y\|\approx\sqrt d$, so $\|x\|\|y\|\approx d$.
- **Step 3. Cosine.**
$$\cos\theta=\frac{\langle x,y\rangle}{\|x\|\|y\|}\approx\frac{\pm\sqrt d}{d}=\pm\frac1{\sqrt d}\to0$$
- **Step 4. Make it precise.** Condition on $y$: $\frac{\langle x,y\rangle}{\|y\|}\sim N(0,1)$ (linear combination of independent Gaussians, W2 §4.2). Call it $Z$. By Chebyshev, $\Pr[\lvert Z\rvert\ge t]\le\frac1{t^2}$. Then $\lvert\cos\theta\rvert=\frac{\lvert Z\rvert}{\|x\|}\le\frac t{\sqrt d-\beta}$ with probability $\ge1-\frac1{t^2}-3e^{-\beta^2/8}$.

> [!success] Answer
> $\cos\theta=O(1/\sqrt d)\to0$: the angle is $90^\circ\pm O(1/\sqrt d)$ radians.

### B3 (BHK 2.29)

> **Question.** Prove that with high probability the angle between two random vectors in a high-dimensional space is at least $45^\circ$. Hint: Gaussian Annulus Theorem.

**Solution.** Take $x,y\sim N(0,I_d)$ independent.
- **Step 1. Law of cosines.**
$$\cos\theta=\frac{\|x\|^2+\|y\|^2-\|x-y\|^2}{2\|x\|\|y\|}$$
- **Step 2. Three lengths from the Annulus theorem** (W2 §3.3; $x-y=\sqrt2z$ with $z\sim N(0,I)$, W2/L4 §10): with probability $\ge1-9e^{-\beta^2/8}$,
$$\|x\|,\|y\|\in[\sqrt d-\beta,\sqrt d+\beta],\qquad \|x-y\|\in\sqrt2\,[\sqrt d-\beta,\sqrt d+\beta]$$
- **Step 3. Bound the numerator.**
$$\|x\|^2+\|y\|^2-\|x-y\|^2\le2(\sqrt d+\beta)^2-2(\sqrt d-\beta)^2=8\beta\sqrt d$$
- **Step 4. Bound the denominator** from below: $2\|x\|\|y\|\ge2(\sqrt d-\beta)^2$.
- **Step 5.**
$$\cos\theta\le\frac{4\beta\sqrt d}{(\sqrt d-\beta)^2}\xrightarrow{d\to\infty}0$$
Example: $\beta=8$ (failure probability $9e^{-8}\approx0.003$), $d=10^4$ ($\sqrt d=100$):
$$\cos\theta\le\frac{4\cdot8\cdot100}{92^2}=0.378<\frac1{\sqrt2}=0.707\ \checkmark$$
- **Step 6.** $\cos\theta<\cos45^\circ$ means $\theta>45^\circ$.

> [!success] Answer
> For large $d$ (e.g. $d\ge10^4$ with $\beta=8$), $\cos\theta\le0.38<\cos45^\circ$ with probability $\ge0.99$. In fact $\theta\to90^\circ$.

## Section C: Random projection and the JL lemma

### C1 (BHK 2.30)

> **Question.** Project the volume of a $d$-dimensional ball of radius $\sqrt d$ onto a line through the centre. For large $d$, give an intuitive argument that the projected volume behaves like a Gaussian.

**Solution.**
- **Step 1. Cross-section.** Cut the ball at height $t$ along the line. The cross-section is a $(d-1)$-ball of radius $\sqrt{d-t^2}$. Its volume is proportional to $(d-t^2)^{(d-1)/2}$.
- **Step 2. Normalise.** Divide by the value at $t=0$:
$$\left(1-\frac{t^2}{d}\right)^{(d-1)/2}=e^{\frac{d-1}2\ln(1-t^2/d)}\approx e^{-\frac{(d-1)t^2}{2d}}\to e^{-t^2/2}$$
(using $\ln(1-u)\approx-u$, the same trick as W2 §2.5).
- **Step 3. Recognise.** The density $\propto e^{-t^2/2}$ is the standard Gaussian $N(0,1)$.
- **Step 4. Cross-check by intuition.** Almost all of the ball sits at radius $\approx\sqrt d$ (volume concentrates at the surface), and a spherical Gaussian also sits at radius $\sqrt d$ (Annulus theorem). The coordinate budget gives $E[x_1^2]=\frac{(\sqrt d)^2}d=1$: variance 1, as for $N(0,1)$.

> [!success] Answer
> Projected density $\propto\left(1-\frac{t^2}d\right)^{(d-1)/2}\to e^{-t^2/2}$, a standard Gaussian.

### C2 (BHK 2.37)

> **Question.** Generate 20 points uniformly at random on a 900-dimensional sphere of radius 30. Calculate the distance between each pair. Select a method of projection and project onto subspaces of dimension $k=100,50,10,5,4,3,2,1$ and calculate the difference between $\sqrt k$ times the original distances and the new pairwise distances. For each $k$, what is the maximum difference as a percent of $\sqrt k$?

**Solution (method + what theory predicts; no code).**
- **Step 1. Original distances.** For $x,y$ on a sphere of radius $R=30$, $d=900$: $\|x-y\|^2=2R^2-2\langle x,y\rangle=1800-2\langle x,y\rangle$. Near-orthogonality: $\langle x,y\rangle=R^2\cos\theta$ with $\cos\theta\approx\pm\frac1{\sqrt d}=\pm\frac1{30}$, so $\langle x,y\rangle\approx\pm30$. All 190 distances $\approx30\sqrt2\approx42.4$ (spread about $\pm0.7$).
- **Step 2. Projection method.** Random Gaussian matrix $A\in\mathbb R^{k\times900}$ with i.i.d. $N(0,1)$ entries; $f(v)=Av$ (W2 §4.3). Same $A$ for all points.
- **Step 3. Compare.** For each pair compute $\|f(x)-f(y)\|$ and $\sqrt k\,\|x-y\|$; their difference divided by $\sqrt k\|x-y\|$ is the relative error (this is the "percent of $\sqrt k$" when the distance is scaled to 1).
- **Step 4. Theory.** $\frac{\|f(v)\|}{\|v\|}$ is the length of a $k$-dimensional standard Gaussian, so it is $\sqrt k\,(1\pm\epsilon)$ with typical $\epsilon\approx\frac1{\sqrt{2k}}$ (JL: failure prob. $3e^{-k\epsilon^2/8}$). Over 190 pairs the maximum is about $2.8$ standard deviations.

| $k$ | typical error $\frac1{\sqrt{2k}}$ | predicted max over 190 pairs ($\approx2.8\times$) |
|---|---|---|
| 100 | 7% | about 20% |
| 50 | 10% | about 28% |
| 10 | 22% | about 60% |
| 5 | 32% | about 90% |
| 4, 3, 2 | 35%, 41%, 50% | $\approx100\%$ or more (distances badly distorted) |
| 1 | 71% | far above 100% |

> [!success] Answer
> Error shrinks like $1/\sqrt{k}$: roughly $20\%$ at $k=100$, growing to $\gtrsim100\%$ for $k\le4$. These are theory-based expectations, not simulated numbers.
> To get the actual simulated numbers you would follow Steps 1 to 3 on a computer.

### C3 (BHK 2.38)

> **Question.** In $d$ dimensions there are exactly $d$ pairwise-orthogonal unit vectors, but you can squeeze in more almost-orthogonal ones. To find 1000 almost-orthogonal vectors in 100 dimensions: (1) begin with 1000 orthonormal 1000-dimensional vectors and project them to a random 100-dimensional space; (2) generate 1000 random Gaussian 100-dimensional vectors. Implement both and compare.

**Solution (method + theory; no code).**
- **Step 1. Method (1).** Take $e_1,\dots,e_{1000}$. Project with a random $100\times1000$ Gaussian matrix $A$. The image of $e_i$ is the $i$-th **column** of $A$, which is a vector of 100 independent $N(0,1)$ entries.
- **Step 2. Method (2).** 1000 vectors of 100 independent $N(0,1)$ entries.
- **Step 3. Compare.** These are the same distribution. So with a Gaussian projection, (1) and (2) give statistically identical vectors. (With an exact orthogonal projection onto a random subspace the vectors are almost the same; only tiny differences in norms.)
- **Step 4. Quality (normalise to unit length).** Cosine between two such vectors $\approx N(0,\frac1{100})$: typical $\lvert\cos\theta\rvert\approx0.1$. Among $\binom{1000}2\approx5\times10^5$ pairs the worst is about $4.9\sigma\approx0.5$.
- **Step 5. Guarantee from W2 §2.6.** $\lvert\langle x_i,x_j\rangle\rvert\le\sqrt{\frac{6\ln n}{d-1}}=\sqrt{\frac{6\ln1000}{99}}=0.65$.

> [!success] Answer
> Neither is better: (1) and (2) produce the same kind of vectors (typical $\lvert\cos\rvert\approx0.1$, worst $\approx0.5$, below the $0.65$ guarantee). Method (2) is simpler and cheaper, so use (2).

---

# TUT 2: Concentration Inequalities

## Section A: Markov, Chebyshev, Chernoff

### A1 (BHK 12.7)

> **Question.** Let $A_1,\dots,A_n$ be events. Prove $\Pr(A_1\cup\dots\cup A_n)\le\sum_{i=1}^n\Pr(A_i)$.

**Solution (induction).**
- **Step 1. Two events.** $\Pr(A\cup B)=\Pr(A)+\Pr(B)-\Pr(A\cap B)\le\Pr(A)+\Pr(B)$, because $\Pr(A\cap B)\ge0$.
- **Step 2. Base case** $n=1$: $\Pr(A_1)\le\Pr(A_1)$ ✓.
- **Step 3. Induction step.** Assume it holds for $n-1$ events. Let $B=A_1\cup\dots\cup A_{n-1}$. Then
$$\Pr(B\cup A_n)\le\Pr(B)+\Pr(A_n)\le\sum_{i=1}^{n-1}\Pr(A_i)+\Pr(A_n)$$

> [!success] Answer
> $\Pr(\cup A_i)\le\sum\Pr(A_i)$ (the union bound).
> Alternative: $\mathbf 1_{\cup A_i}\le\sum\mathbf 1_{A_i}$ pointwise; take expectations.

### A2 (BHK 2.3)

> **Question.** Show that for any $a\ge1$ there are distributions for which Markov's inequality is tight. (1) For each $a=2,3,4$ give a distribution $p(x)$ of a non-negative $x$ with $\Pr(x\ge a)=\frac{E(x)}a$. (2) Do the same for arbitrary $a\ge1$.

**Solution.**
- **Step 1. Idea.** Markov is tight when $x$ only takes the values $0$ and $a$ (all mass at $0$ or exactly at the threshold). (L4 §3 shows the same trick with 5.)
- **Step 2. General $a\ge1$.** Take
$$x=\begin{cases}a&\text{w.p. }\frac1a\\0&\text{w.p. }1-\frac1a\end{cases}$$
This is a valid distribution because $a\ge1$ gives $\frac1a\le1$.
- **Step 3. Check.** $E(x)=a\cdot\frac1a=1$. $\Pr(x\ge a)=\frac1a=\frac{E(x)}a$ ✓.
- **Step 4. Specific values** (put $a=2,3,4$ into Step 2):

| $a$ | distribution | $E(x)$ | $\Pr(x\ge a)=E(x)/a$ |
|---|---|---|---|
| 2 | $x=2$ w.p. $\frac12$, $0$ w.p. $\frac12$ | 1 | $\frac12$ |
| 3 | $x=3$ w.p. $\frac13$, $0$ w.p. $\frac23$ | 1 | $\frac13$ |
| 4 | $x=4$ w.p. $\frac14$, $0$ w.p. $\frac34$ | 1 | $\frac14$ |

> [!success] Answer
> $x\in\{0,a\}$ with $\Pr(x=a)=\frac1a$ makes Markov an equality for every $a\ge1$.

### A3 (BHK 12.14)

> **Question.** Why can one not prove an analogous theorem $p(x\le a)\le\frac{E(x)}a$?

**Solution.**
- **Step 1. Why Markov works.** The proof uses $E[x]\ge a\Pr[x\ge a]$: throw away the part $x<a$ (it contributes $\ge0$) and the rest is $\ge a$ each.
- **Step 2. Why it fails for $\le$.** Small values of $x$ add almost nothing to $E[x]$, so $E[x]$ gives no lower bound in terms of $\Pr[x\le a]$. There is no step that gives $E[x]\ge(\text{something})\cdot\Pr[x\le a]$.
- **Step 3. Counterexample.** $x=1$ always. $E(x)=1$. Take $a=2$: $\Pr(x\le2)=1$ but $\frac{E(x)}a=\frac12$. So $1\le\frac12$ is false.
- **Step 4. Fix when $x$ is bounded above** by $M$: apply Markov to $M-x\ge0$: $\Pr[x\le a]=\Pr[M-x\ge M-a]\le\frac{M-E(x)}{M-a}$.

> [!success] Answer
> Markov bounds the mass **far above** the mean using $x\ge0$. Mass near $0$ costs nothing in the mean, so the same argument gives no bound on $\Pr[x\le a]$. Counterexample: $x\equiv1$, $a=2$.

### A4 (BHK 2.5)

> **Question.** $x$ has density $\frac14$ on $0\le x\le4$ (zero elsewhere). (1) Use Markov to bound $\Pr[x\ge3]$. (2) Use $\Pr(\lvert x\rvert\ge a)=\Pr(x^2\ge a^2)$ for a tighter bound. (3) What is the bound using $\Pr(\lvert x\rvert\ge a)=\Pr(x^r\ge a^r)$?

**Solution.**
- **Step 1. Moments.** $E[x^r]=\int_0^4x^r\cdot\frac14dx=\frac{4^r}{r+1}$. So $E[x]=2$, $E[x^2]=\frac{16}3$.
- **Step 2. (1) Markov.** $\Pr[x\ge3]\le\frac{E[x]}3=\frac23=0.667$.
- **Step 3. (2) Markov on $x^2$.** $\Pr[x^2\ge9]\le\frac{E[x^2]}9=\frac{16/3}{9}=\frac{16}{27}=0.593$.
- **Step 4. (3) General $r$.**
$$\Pr[x\ge3]\le\frac{E[x^r]}{3^r}=\frac{(4/3)^r}{r+1}$$

| $r$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| bound | 0.667 | 0.593 | 0.593 | 0.632 |

- **Step 5. Best $r$.** Minimise $r\ln\frac43-\ln(r+1)$: set derivative $=0$: $r+1=\frac1{\ln(4/3)}=3.48$, so $r\approx2.5$, bound $\approx0.587$.
- **Step 6. True value** $\Pr[x\ge3]=\frac14=0.25$.

> [!success] Answer
> (1) $\frac23$. (2) $\frac{16}{27}\approx0.593$. (3) $\frac{(4/3)^r}{r+1}$; best near $r\approx2.5$ giving $\approx0.587$. Higher $r$ eventually gets worse. All are far above the true $0.25$.

### A5 (BHK 2.6)

> **Question.** $p(x=0)=1-\frac1a$, $p(x=a)=\frac1a$. Plot $\Pr[x\ge a]$ as a function of $a$ for the bound from Markov and from Markov applied to $x^2$ and $x^4$.

**Solution.**
- **Step 1. Moments.** $x\in\{0,a\}$, so $E[x^r]=a^r\cdot\frac1a=a^{r-1}$. $E[x]=1$, $E[x^2]=a$, $E[x^4]=a^3$.
- **Step 2. Bounds** for $\Pr[x\ge a]$:
$$\text{Markov: }\frac{E[x]}a=\frac1a,\qquad x^2:\ \frac{E[x^2]}{a^2}=\frac a{a^2}=\frac1a,\qquad x^4:\ \frac{E[x^4]}{a^4}=\frac{a^3}{a^4}=\frac1a$$
- **Step 3. True value** $=\Pr[x=a]=\frac1a$.

> [!success] Answer
> All three bounds equal $\frac1a$, equal to the true probability. The three curves lie on top of each other (the hyperbola $1/a$ for $a\ge1$). Powers do not help here because $x\in\{0,a\}$ already makes Markov tight.

### A6 (BHK 2.4)

> **Question.** Show that for any $c\ge1$ there are distributions for which Chebyshev is tight: $\Pr(\lvert x-E(x)\rvert\ge c)=\frac{\mathrm{Var}(x)}{c^2}$.

**Solution.**
- **Step 1. Idea.** Chebyshev is Markov on $(x-\mu)^2$, so make $(x-\mu)^2\in\{0,c^2\}$.
- **Step 2. Distribution.**
$$x=\begin{cases}+c&\text{w.p. }\frac1{2c^2}\\-c&\text{w.p. }\frac1{2c^2}\\0&\text{w.p. }1-\frac1{c^2}\end{cases}$$
Valid because $c\ge1$.
- **Step 3. Check.** $E(x)=0$. $\mathrm{Var}(x)=E[x^2]=c^2\cdot\frac1{c^2}=1$. $\Pr(\lvert x\rvert\ge c)=\frac1{c^2}=\frac{\mathrm{Var}(x)}{c^2}$ ✓.

> [!success] Answer
> The three-point distribution $\{-c,0,+c\}$ above makes Chebyshev an equality.

### A7 (BHK 12.15)

> **Question.** Compare the Markov and Chebyshev bounds for: (1) $p(x)=1$ if $x=1$, and $0$ otherwise. (2) $p(x)=\frac12$ for $0\le x\le2$, and $0$ otherwise.

**Solution (1).** $x\equiv1$: $E=1$, $\mathrm{Var}=0$.
- **Step 1.** Markov: $\Pr[x\ge a]\le\frac1a$. For $a>1$ the true value is $0$, so Markov is loose (e.g. $a=2$: bound $0.5$ vs true $0$).
- **Step 2.** Chebyshev: $\Pr[\lvert x-1\rvert\ge a]\le\frac0{a^2}=0$ for every $a>0$. This equals the true value $0$.

**Solution (2).** $x\sim U[0,2]$: $E=1$, $\mathrm{Var}=\frac{4}{12}=\frac13$.
- **Step 1.** For $\Pr[x\ge a]$: Markov gives $\frac1a$. Chebyshev (apply to $\lvert x-1\rvert\ge a-1$, $a>1$) gives $\frac1{3(a-1)^2}$. True value is $\frac{2-a}2$ for $a\le2$, and $0$ for $a>2$.

| $a$ | Markov | Chebyshev | true |
|---|---|---|---|
| 1.5 | 0.667 | 1.333 (useless) | 0.25 |
| 1.9 | 0.526 | 0.412 | 0.05 |
| 2 | 0.5 | 0.333 | 0 |
| 3 | 0.333 | 0.083 | 0 |

- **Step 2. Crossover.** Chebyshev is better when $\frac1{3(a-1)^2}<\frac1a\iff3a^2-7a+3>0\iff a>\frac{7+\sqrt{13}}6\approx1.77$.

> [!success] Answer
> (1) Chebyshev is exact ($0$), Markov is loose. (2) Markov is better only close to the mean ($a<1.77$); Chebyshev wins further out because it also uses the variance. Both are loose compared with the truth.

### A8 (BHK 2.12)

> **Question.** Prove $1+x\le e^x$ for all real $x$. For what values of $x$ is $1+x\approx e^x$ within $0.01$?

**Solution.**
- **Step 1. Define** $f(x)=e^x-1-x$.
- **Step 2. Minimum.** $f'(x)=e^x-1=0\iff x=0$. $f''(x)=e^x>0$, so $x=0$ is the global minimum, with $f(0)=0$.
- **Step 3.** Hence $f(x)\ge0$, i.e. $1+x\le e^x$ for all $x$.
- **Step 4. Within $0.01$.** Solve $e^x-1-x=0.01$. Since $f(x)\approx\frac{x^2}2$ for small $x$, $x\approx\pm0.14$. Check: $f(0.138)\approx0.0100$, $f(-0.145)\approx0.0100$.

> [!success] Answer
> $1+x\le e^x$ always (convexity: $1+x$ is the tangent at $0$). $\ \lvert e^x-(1+x)\rvert\le0.01$ for $-0.145\lesssim x\lesssim0.138$, i.e. $\lvert x\rvert\lesssim0.14$.

### A9 (BHK 2.8)

> **Question.** $U$ is a set of integers; $X,Y\subseteq U$ with $\lvert X\triangle Y\rvert=\frac1{10}\lvert U\rvert$. Prove that the probability that none of $n$ elements selected at random (with replacement) from $U$ lies in $X\triangle Y$ is less than $e^{-0.1n}$.

**Solution.**
- **Step 1. One draw.** $\Pr[\text{element not in }X\triangle Y]=1-\frac1{10}=0.9$.
- **Step 2. $n$ independent draws** (with replacement): $\Pr[\text{none in }X\triangle Y]=0.9^n=(1-0.1)^n$.
- **Step 3. Use $1+x\le e^x$ with $x=-0.1$:** $0.9\le e^{-0.1}$ (strict since $x\ne0$).
- **Step 4.** Raise to the power $n$: $0.9^n<e^{-0.1n}$.

> [!success] Answer
> $\Pr[\text{none}]=0.9^n<e^{-0.1n}$.

### A10 (BHK 12.16)

> **Question.** $s=x_1+\dots+x_n$, independent, $x_i=1$ w.p. $p$, $0$ w.p. $1-p$. $m=E(s)$. (1) How large must $\delta$ be for $\Pr[s<(1-\delta)m]<\epsilon$? (2) For $\Pr[s>(1+\delta)m]<\epsilon$?

**Solution.**
- **Step 1. Chernoff applies** ($s$ is a sum of independent $\{0,1\}$ variables, $\mu=m=np$) (L4 §6).
- **Step 2. (1) Lower tail:** $\Pr[s\le(1-\delta)m]\le e^{-m\delta^2/2}$. Need $e^{-m\delta^2/2}<\epsilon$:
$$\frac{m\delta^2}2>\ln\frac1\epsilon\ \Rightarrow\ \delta>\sqrt{\frac{2\ln(1/\epsilon)}m}$$
- **Step 3. (2) Upper tail** (for $\delta\le1$): $\Pr[s\ge(1+\delta)m]\le e^{-m\delta^2/3}$. Need $<\epsilon$:
$$\delta>\sqrt{\frac{3\ln(1/\epsilon)}m}$$
- **Step 4. If this $\delta$ exceeds 1** use the general form $\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^m<\epsilon$.

> [!success] Answer
> (1) $\delta>\sqrt{2\ln(1/\epsilon)/m}$. (2) $\delta>\sqrt{3\ln(1/\epsilon)/m}$ (valid for $\delta\le1$). In both cases $\delta\sim\frac1{\sqrt m}$.

## Section B: Fitting a spherical Gaussian

### B1 (BHK 2.43)

> **Question.** $x_1,\dots,x_n$ independent samples with mean $\mu$, variance $\sigma^2$; $m_s=\frac1n\sum x_i$; $\sigma_s^2=\frac1n\sum(x_i-m_s)^2$. Prove $E(\sigma_s^2)=\frac{n-1}n\sigma^2$, so one should divide by $n-1$. Hint: first show $\mathrm{Var}(m_s)=\frac1n\mathrm{Var}(x)$; then replace $x_i-m_s$ by $(x_i-\mu)-(m_s-\mu)$.

**Solution.**
- **Step 1. Variance of the sample mean.** Independent, so $\mathrm{Var}(m_s)=\frac1{n^2}\sum\mathrm{Var}(x_i)=\frac{\sigma^2}n$. Also $E[m_s]=\mu$.
- **Step 2. Split.** $x_i-m_s=(x_i-\mu)-(m_s-\mu)$. Square and sum:
$$\sum(x_i-m_s)^2=\sum(x_i-\mu)^2-2(m_s-\mu)\sum(x_i-\mu)+n(m_s-\mu)^2$$
- **Step 3. Simplify.** $\sum(x_i-\mu)=n(m_s-\mu)$. So the middle term is $-2n(m_s-\mu)^2$ and
$$\sum(x_i-m_s)^2=\sum(x_i-\mu)^2-n(m_s-\mu)^2$$
- **Step 4. Expectation.** $E\sum(x_i-\mu)^2=n\sigma^2$. $E(m_s-\mu)^2=\mathrm{Var}(m_s)=\frac{\sigma^2}n$. So
$$E\sum(x_i-m_s)^2=n\sigma^2-n\cdot\frac{\sigma^2}n=(n-1)\sigma^2$$
- **Step 5.** Divide by $n$: $E(\sigma_s^2)=\frac{n-1}n\sigma^2$.

> [!success] Answer
> $E(\sigma_s^2)=\frac{n-1}n\sigma^2<\sigma^2$. Using $\frac1{n-1}$ instead of $\frac1n$ makes it unbiased. (Matches the "small detail" in L4 §9.)

### B2 (BHK 2.45)

> **Question.** Estimate the unknown centre $\mu$ of a Gaussian in $d$-space with variance one in each direction. Show $O(\frac{\log d}{\epsilon^2})$ samples suffice to get $m_s$ with $\|\mu-m_s\|_\infty\le\epsilon$ with probability $\ge99\%$. How many samples ensure $\|\mu-m_s\|_2\le\epsilon$ with probability $\ge99\%$?

**Solution (a): $\|\cdot\|_\infty$.**
- **Step 1. Each coordinate.** $m_{s,j}-\mu_j\sim N(0,\frac1n)$ (average of $n$ Gaussians, $\sigma^2=1$; L4 §9).
- **Step 2. ⚠ Gaussian tail.** For $Z\sim N(0,1)$, $\Pr[\lvert Z\rvert\ge t]\le2e^{-t^2/2}$ (Chernoff recipe: Markov on $e^{\lambda Z}$, $Ee^{\lambda Z}=e^{\lambda^2/2}$, $\lambda=t$). With $t=\epsilon\sqrt n$:
$$\Pr[\lvert m_{s,j}-\mu_j\rvert\ge\epsilon]\le2e^{-n\epsilon^2/2}$$
(Chebyshev alone would only give $\frac1{n\epsilon^2}$, and after the union bound $n=O(d/\epsilon^2)$, too many.)
- **Step 3. Union bound over $d$ coordinates:** $\Pr[\exists j]\le2d\,e^{-n\epsilon^2/2}$.
- **Step 4. Set $\le0.01$:**
$$2de^{-n\epsilon^2/2}\le0.01\iff n\ge\frac{2\ln(200d)}{\epsilon^2}=O\!\left(\frac{\log d}{\epsilon^2}\right)$$

**Solution (b): $\|\cdot\|_2$.**
- **Step 1.** $\sqrt n(m_s-\mu)\sim N(0,I_d)$ (each coordinate $N(0,1)$, independent).
- **Step 2. Annulus theorem.** With probability $\ge1-3e^{-\beta^2/8}$, $\ \|\sqrt n(m_s-\mu)\|\le\sqrt d+\beta$. Choose $\beta$ with $3e^{-\beta^2/8}=0.01$: $\beta=\sqrt{8\ln300}\approx6.8$ (needs $\beta\le\sqrt d$, i.e. $d\ge46$).
- **Step 3.** $\|m_s-\mu\|_2\le\frac{\sqrt d+6.8}{\sqrt n}\le\epsilon\iff n\ge\frac{(\sqrt d+6.8)^2}{\epsilon^2}$.
- **Step 4. Simpler version (any $d$):** $E\|m_s-\mu\|^2=\frac dn$; Markov: $\Pr[\|m_s-\mu\|^2\ge\epsilon^2]\le\frac d{n\epsilon^2}\le0.01$ gives $n\ge\frac{100d}{\epsilon^2}$.

> [!success] Answer
> $\|\cdot\|_\infty\le\epsilon$: $n\ge\frac{2\ln(200d)}{\epsilon^2}=O(\frac{\log d}{\epsilon^2})$. $\ \|\cdot\|_2\le\epsilon$: $n=O(\frac d{\epsilon^2})$ (about $\frac{(\sqrt d+6.8)^2}{\epsilon^2}$, or $\frac{100d}{\epsilon^2}$ by Markov). The $\ell_2$ error adds up over all $d$ coordinates, so it costs a factor $\approx d/\log d$ more samples.

### B3 (BHK 2.41)

> **Question.** An object moves at constant velocity along a straight line. You receive GPS coordinates corrupted by Gaussian noise every minute. How do you estimate the current position?

**Solution. ⚠ (Regression is not in your notes; it extends the sample-mean idea.)**
- **Step 1. Model.** At minute $t$ the true position is $p(t)=p_0+vt$ ($p_0$, $v$ unknown vectors). You observe $y_t=p_0+vt+\text{noise}_t$, noise i.i.d. Gaussian.
- **Step 2. Estimate.** For Gaussian noise, the maximum-likelihood estimate is least squares (L4 §9 uses the same idea for the mean): choose $(\hat p_0,\hat v)$ minimising $\sum_t\|y_t-p_0-vt\|^2$.
- **Step 3. Solve per coordinate** (each coordinate is a separate 1-D line fit). With $\bar t=\text{mean}(t)$, $\bar y=\text{mean}(y_t)$:
$$\hat v=\frac{\sum(t-\bar t)(y_t-\bar y)}{\sum(t-\bar t)^2},\qquad \hat p(T)=\bar y+\hat v\,(T-\bar t)$$
(same formulas as Tut 3 A1.)
- **Step 4. Current position.** Put $t=T$ (now) into the fitted line. Do NOT just use the latest reading (one noisy sample) or just the average (it lags behind the motion).

> [!success] Answer
> Fit a straight line (least squares) to the readings versus time, per coordinate, and read off the fitted position at the current time: $\hat p(T)=\bar y+\hat v(T-\bar t)$. If the object were stationary this reduces to the plain sample mean.

### B4 (BHK 2.46)

> **Question.** Use the density $\frac1{3\sqrt{2\pi}}e^{-\frac12\left(\frac{x-5}3\right)^2}$ to generate ten points. (a) Estimate $\mu$ from the ten points; how close to the true mean 5? (b) Using the true mean 5, estimate $\sigma^2=\frac1{10}\sum(x_i-5)^2$; how close to the true variance 9? (c) Using your estimate $m$ of the mean, $\sigma^2=\frac1{10}\sum(x_i-m)^2$; how close to 9? (d) Using $m$, $\sigma^2=\frac1{9}\sum(x_i-m)^2$; how close to 9?

**Solution (method + what theory predicts; no code).** The density is $N(5,9)$, so $\sigma=3$, $n=10$.
- **Step 1. Generate** 10 draws $x_i=5+3z_i$ with $z_i\sim N(0,1)$.
- **Step 2. (a)** $m=\frac1{10}\sum x_i\sim N\left(5,\frac9{10}\right)$. Typical error $\frac{3}{\sqrt{10}}=0.95$ (L4 §9, $\sigma/\sqrt n$).
- **Step 3. (b)** Known mean: $\frac1{10}\sum(x_i-5)^2$ has mean $9$, sd $\sqrt{\frac{2\sigma^4}{n}}=\sqrt{16.2}=4.0$.
- **Step 4. (c)** Using $m$ and dividing by 10: mean $\frac9{10}\cdot9=8.1$ (biased low by $0.9$; Tut 2 B1), sd $\approx3.8$.
- **Step 5. (d)** Using $m$ and dividing by 9: mean $9$ (unbiased), sd $\sqrt{\frac{2\cdot81}9}=4.2$.

| estimator | expected value | typical error (sd) |
|---|---|---|
| (a) $m$ | 5 | 0.95 |
| (b) true mean, $\div10$ | 9 | 4.0 |
| (c) $m$, $\div10$ | 8.1 | 3.8 |
| (d) $m$, $\div9$ | 9 | 4.2 |

> [!success] Answer
> Expect $m$ within about $\pm1$ of $5$. The variance estimates are only accurate to about $\pm4$ (about 45%) with 10 points, so single runs are noisy. On average (c) is about $0.9$ too small, and (b), (d) are unbiased. The sd of $\pm4$ is larger than the $0.9$ bias, so one run cannot show the bias.

## Section C: Separating two Gaussians

### C1 (BHK 2.21)

> **Question.** $A$ is a unit ball centred at the origin; $B$ is a unit ball with centre at distance $s$. A point $x$ is drawn from the mixture: w.p. $\frac12$ uniformly from $A$, w.p. $\frac12$ uniformly from $B$. Show that $s\gg\frac1{\sqrt{d-1}}$ suffices so that $\Pr(x\in A\cap B)=o(1)$: for any $\epsilon>0$ there is $c$ such that $s\ge\frac c{\sqrt{d-1}}$ gives $\Pr(x\in A\cap B)<\epsilon$.

**Solution.** Put $B$'s centre at $se_1$.
- **Step 1. The overlap is symmetric.** $A\cap B$ is symmetric about the plane $x_1=\frac s2$. So $\mathrm{vol}(A\cap B)=2\,\mathrm{vol}(A\cap B\cap\{x_1\ge\frac s2\})$.
- **Step 2. Inside $A$.** $A\cap B\cap\{x_1\ge\frac s2\}\subseteq\{x\in A:x_1\ge\frac s2\}$. So
$$\mathrm{vol}(A\cap B)\le2\,\mathrm{vol}\{x\in A:x_1\ge\tfrac s2\}$$
- **Step 3. Slab bound** (W2 §2.4). Let $c'=\frac s2\sqrt{d-1}$. The fraction of $A$ with $\lvert x_1\rvert\ge\frac{c'}{\sqrt{d-1}}$ is $\le\frac2{c'}e^{-c'^2/2}$. By symmetry the fraction with $x_1\ge\frac{c'}{\sqrt{d-1}}$ is at most half of that.
- **Step 4.** Hence $\Pr[x\in B\mid x\text{ drawn from }A]=\frac{\mathrm{vol}(A\cap B)}{\mathrm{vol}(A)}\le2\cdot\frac12\cdot\frac2{c'}e^{-c'^2/2}=\frac2{c'}e^{-c'^2/2}$. Same for $B$ by symmetry. So
$$\Pr(x\in A\cap B)\le\frac2{c'}e^{-c'^2/2}$$
- **Step 5.** If $s\ge\frac c{\sqrt{d-1}}$ then $c'\ge\frac c2$ and the bound is $\le\frac4ce^{-c^2/8}$, which is $<\epsilon$ for $c$ large enough (and $c'\ge1$).

> [!success] Answer
> $\Pr(x\in A\cap B)\le\frac4ce^{-c^2/8}\to0$. So centres only $\Theta(\frac1{\sqrt d})$ apart already make the two balls almost disjoint, because volume sits in a thin slab at the equator.

### C2 (BHK 12.40)

> **Question.** We stretch space to maximise the expected distance between random vectors $x,y$: multiply coordinate $i$ by $a_i$ with $\sum_{i=1}^da_i^2=d$. Given $x=(x_1,\dots,x_d)$, $y=(y_1,\dots,y_d)$, how should we select $a_i$ to maximise $E\left[\|x-y\|^2\right]$ (after stretching)? Assume $y_i=0$ w.p. $\frac12$, $1$ w.p. $\frac12$, and $x_i$ has an arbitrary distribution.

**Solution.**
- **Step 1. Write the objective.** After stretching, $\|x-y\|^2=\sum_ia_i^2(x_i-y_i)^2$. By linearity,
$$E\|x-y\|^2=\sum_ia_i^2D_i,\qquad D_i=E[(x_i-y_i)^2]$$
- **Step 2. Compute $D_i$.** $E[y_i]=E[y_i^2]=\frac12$. Assume $x_i,y_i$ independent. Then
$$D_i=E[x_i^2]-2E[x_i]\cdot\tfrac12+\tfrac12=E[x_i^2]-E[x_i]+\tfrac12$$
- **Step 3. Linear problem.** Let $b_i=a_i^2\ge0$ with $\sum b_i=d$. Maximise $\sum b_iD_i$. A linear function over this simplex is maximised at a corner: put all the weight on the coordinate with the largest $D_i$.
- **Step 4. Answer.** Let $i^*=\arg\max_iD_i$. Then $a_{i^*}=\sqrt d$ and $a_i=0$ for all other $i$. The maximum is $d\,D_{i^*}$. (If several $i$ tie, split $d$ among them arbitrarily.)

> [!success] Answer
> $a_i^2=d$ on the coordinate maximising $E[x_i^2]-E[x_i]+\frac12$, and $a_i=0$ elsewhere. The objective is linear in $a_i^2$, so the best choice puts all the weight on one coordinate, i.e. keep only the coordinate where $x$ and $y$ differ most.

---

# TUT 3: Best-Fit Subspaces & SVD

> [!info] Sections C1, D4, H2 are reformatted from the worked solutions printed in the PDF (same results, step format).

## Section A: Best-fit lines and subspaces

### A1 (BHK 3.1, adapted)

> **Question.** Points $(x_1,y_1),\dots,(x_n,y_n)\in\mathbb R^2$; $\bar x=\frac1n\sum x_i$, $\bar y=\frac1n\sum y_i$, $S_{xx}=\sum(x_i-\bar x)^2$, $S_{xy}=\sum(x_i-\bar x)(y_i-\bar y)$, $E(m,b)=\frac1n\sum(y_i-mx_i-b)^2$ (mean squared **vertical** error of $y=mx+b$).
> (a) Assume the $x_i$ are not all equal. Find the minimiser $(m^\star,b^\star)$ in terms of $\bar x,\bar y,S_{xx},S_{xy}$.
> (b) For $(0,1),(1,3),(2,2),(3,4)$ find $m^\star,b^\star$ and $E(m^\star,b^\star)$.
> (c) Now $x_i=c$ for all $i$, the $y_i$ not all equal. Find the set of all minimisers.

**Solution (a). ⚠ (least-squares regression is not in your notes; L5 §2 only contrasts it with perpendicular fits).**
- **Step 1. Optimise $b$.** $\frac{\partial E}{\partial b}=0\Rightarrow\sum(y_i-mx_i-b)=0\Rightarrow b=\bar y-m\bar x$.
- **Step 2. Substitute.** $y_i-mx_i-b=(y_i-\bar y)-m(x_i-\bar x)$, so
$$E=\frac1n\big(S_{yy}-2mS_{xy}+m^2S_{xx}\big)$$
- **Step 3. Optimise $m$.** $-2S_{xy}+2mS_{xx}=0\Rightarrow m=\frac{S_{xy}}{S_{xx}}$ (valid since $S_{xx}>0$).

> [!success] Answer (a)
> $m^\star=\dfrac{S_{xy}}{S_{xx}},\quad b^\star=\bar y-m^\star\bar x$. The line passes through $(\bar x,\bar y)$.

**Solution (b).**
- **Step 1. Means.** $\bar x=1.5$, $\bar y=2.5$.
- **Step 2. Centred values.** $x-\bar x=(-1.5,-0.5,0.5,1.5)$, $y-\bar y=(-1.5,0.5,-0.5,1.5)$.
- **Step 3.** $S_{xx}=2.25+0.25+0.25+2.25=5$. $\ S_{xy}=2.25-0.25-0.25+2.25=4$. $\ S_{yy}=5$.
- **Step 4.** $m^\star=\frac45=0.8$, $\ b^\star=2.5-0.8(1.5)=1.3$.
- **Step 5. Error.** $E=\frac1n\big(S_{yy}-\frac{S_{xy}^2}{S_{xx}}\big)=\frac14\left(5-\frac{16}5\right)=0.45$. (Check with residuals $-0.3,0.9,-0.9,0.3$: squares sum $1.8$, divided by $4$ gives $0.45$ ✓.)

> [!success] Answer (b)
> $m^\star=0.8$, $b^\star=1.3$, $E=0.45$.

**Solution (c).**
- **Step 1.** All $x_i=c$, so $mx_i+b=mc+b$ is the same for every point.
- **Step 2.** $E=\frac1n\sum(y_i-(mc+b))^2$ depends only on the number $mc+b$. It is smallest when $mc+b=\bar y$ (the mean minimises the sum of squares).

> [!success] Answer (c)
> All $(m,b)$ with $mc+b=\bar y$, i.e. $b=\bar y-mc$ for any $m\in\mathbb R$. These are all lines of finite slope through $(c,\bar y)$. The minimiser is not unique. The vertical line $x=c$ is not of the form $y=mx+b$.

### A2 (BHK 3.2, adapted)

> **Question.** $p_1,\dots,p_n\in\mathbb R^5$ hold height, weight, age, income, blood pressure; $\bar p=\frac1n\sum p_i$; $\tilde P$ has rows $p_i-\bar p$, singular values $\sigma_1\ge\dots\ge\sigma_5\ge0$, right singular vectors $v_1,\dots,v_5$. For $a\in\mathbb R^5$, $\|a\|=1$, and $a_6\in\mathbb R$, the hyperplane $H=\{x:a^Tx=a_6\}$ has $\mathrm{dist}(p,H)=\lvert a^Tp-a_6\rvert$.
> (a) Find the $(a,a_6)$ minimising $\sum_i\mathrm{dist}(p_i,H)^2$ and the minimum value, in terms of $\bar p$, $\sigma_j$, $v_j$.
> (b) In $\mathbb R^2$ take $(0,1),(1,3),(2,2),(3,4)$. Find the slope of the line minimising squared vertical errors ($y$ on $x$), squared horizontal errors ($x$ on $y$), and squared perpendicular distances.
> (c) Change units $x\mapsto x'=10x$, fit the vertical-error line and the perpendicular-distance line to $(x'_i,y_i)$, map each back to the $(x,y)$ plane. Find the two slopes.

**Solution (a).**
- **Step 1. Optimise $a_6$.** $\sum(a^Tp_i-a_6)^2$ is smallest when $a_6$ is the mean of the numbers $a^Tp_i$: $a_6=a^T\bar p$. So $H$ passes through the centroid.
- **Step 2. Centre.** Then $\sum_i(a^T(p_i-\bar p))^2=\|\tilde Pa\|^2=a^T\tilde P^T\tilde Pa=\sum_j\sigma_j^2(a\cdot v_j)^2$ (L5 §3: weighted average of the $\sigma_j^2$).
- **Step 3. Minimise.** A weighted average of the $\sigma_j^2$ is smallest when all weight is on the smallest one: $a=\pm v_5$. Minimum $=\sigma_5^2$.

> [!success] Answer (a)
> $a=v_5$ (singular vector of the **smallest** singular value), $a_6=v_5^T\bar p$, minimum $=\sigma_5^2$. (If $\sigma_5=\sigma_4$ it is not unique.) Contrast: the best-fit **line/subspace** uses the largest $\sigma$'s.

**Solution (b).**
- **Step 1. Data.** $S_{xx}=5$, $S_{xy}=4$, $S_{yy}=5$ (from A1(b)).
- **Step 2. Vertical errors ($y$ on $x$):** slope $=\frac{S_{xy}}{S_{xx}}=\frac45=0.8$.
- **Step 3. Horizontal errors ($x$ on $y$):** fit $x=m'y+b'$ with $m'=\frac{S_{xy}}{S_{yy}}=0.8$. As a line in the $(x,y)$ plane, $y=\frac{x-b'}{m'}$, so slope $=\frac1{m'}=\frac{S_{yy}}{S_{xy}}=1.25$.
- **Step 4. Perpendicular distance (PCA, L5 §12).** $\tilde P^T\tilde P=\begin{pmatrix}5&4\\4&5\end{pmatrix}$, eigenvalues $9,1$, top eigenvector $\frac1{\sqrt2}(1,1)$: slope $=1$.

> [!success] Answer (b)
> Slopes: vertical $0.8$, horizontal $1.25$, perpendicular $1$. The perpendicular line lies between the other two. All pass through the centroid $(1.5,2.5)$.

**Solution (c).**
- **Step 1. Vertical-error line.** $S_{x'y}=10S_{xy}=40$, $S_{x'x'}=100S_{xx}=500$. Slope in $(x',y)$ plane $=\frac{40}{500}=0.08$. Map back: $y=0.08x'=0.8x$. Slope **$0.8$ (unchanged)**.
- **Step 2. Perpendicular line.** $\tilde P'^T\tilde P'=\begin{pmatrix}500&40\\40&5\end{pmatrix}$. Top eigenvalue $\lambda_1=\frac{505+\sqrt{251425}}2=503.21$. Eigenvector $(40,\lambda_1-500)=(40,3.211)$. Slope in $(x',y)$ plane $=\frac{3.211}{40}=0.0803$.
- **Step 3. Map back** ($x'=10x$): slope in $(x,y)$ plane $=10\times0.0803=\frac{\sqrt{251425}-495}8\approx0.803$.

> [!success] Answer (c)
> Vertical-error slope stays $0.8$. Perpendicular slope changes from $1$ to $\approx0.803$. The perpendicular (PCA) line depends on the units of the axes, so standardise features before PCA when units differ.

### A3 (BHK 3.3, adapted)

> **Question.** For points $p_1,\dots,p_n\in\mathbb R^2$ a best-fit line $L=\{c+tv:t\in\mathbb R,\|v\|=1\}$ minimises $D(L)=\sum\mathrm{dist}(p_i,L)^2$ over all lines. For each set find the centroid, the set of all best-fit lines, the minimum $D$, and whether some best-fit line passes through the origin. (1) $(4,4),(6,2)$. (2) $(4,2),(4,4),(6,2),(6,4)$. (3) $(3,2.5),(3,5),(5,1),(5,3.5)$.

**Method (L5 §12).** The best-fit line passes through the centroid $\bar p$. Its direction is the top right singular vector of the centred matrix $\tilde P$ (eigenvector of $\tilde P^T\tilde P$ with the largest eigenvalue). $D_{\min}=\sigma_2^2$.

**(1) $(4,4),(6,2)$.**
- **Step 1.** Centroid $(5,3)$. Centred points $(-1,1),(1,-1)$.
- **Step 2.** $\tilde P^T\tilde P=\begin{pmatrix}2&-2\\-2&2\end{pmatrix}$: eigenvalues $4,0$; top eigenvector $\frac1{\sqrt2}(1,-1)$.
- **Step 3.** Line: through $(5,3)$ direction $(1,-1)$: $x+y=8$. $D_{\min}=\sigma_2^2=0$ (both points lie on it).

**(2) $(4,2),(4,4),(6,2),(6,4)$.**
- **Step 1.** Centroid $(5,3)$. Centred: $(-1,-1),(-1,1),(1,-1),(1,1)$.
- **Step 2.** $\tilde P^T\tilde P=4I$: $\sigma_1^2=\sigma_2^2=4$, a tie, so **every** direction is top.
- **Step 3.** All lines through $(5,3)$ are best-fit. $D_{\min}=\sigma_2^2=4$.

**(3) $(3,2.5),(3,5),(5,1),(5,3.5)$.**
- **Step 1.** Centroid $(4,3)$. Centred: $(-1,-0.5),(-1,2),(1,-2),(1,0.5)$.
- **Step 2.** $\sum x^2=4$, $\sum y^2=8.5$, $\sum xy=0.5-2-2+0.5=-3$. $\tilde P^T\tilde P=\begin{pmatrix}4&-3\\-3&8.5\end{pmatrix}$, trace $12.5$, det $25$: eigenvalues $10$ and $2.5$.
- **Step 3.** Top eigenvector for $10$: $(4-10)v_1-3v_2=0\Rightarrow v_2=-2v_1$: direction $\frac1{\sqrt5}(1,-2)$. Line through $(4,3)$: $2x+y=11$. $D_{\min}=2.5$.

> [!success] Answer
> | set | centroid | best-fit lines | $D_{\min}$ | through origin? |
> |---|---|---|---|---|
> | (1) | $(5,3)$ | unique: $x+y=8$ | 0 | no |
> | (2) | $(5,3)$ | **all** lines through $(5,3)$ | 4 | **yes** (the line through $(5,3)$ and $(0,0)$) |
> | (3) | $(4,3)$ | unique: $2x+y=11$ | 2.5 | no |

### A4 (BHK 3.4, adapted)

> **Question.** A best-fit line through the origin is $\mathrm{span}\{v\}$, $\|v\|=1$, minimising $\sum\mathrm{dist}(p_i,\mathrm{span}\{v\})^2$. Find all best-fit lines through the origin for: (1) $\{(0,1),(1,0)\}$. (2) $\{(0,1),(2,0)\}$. (3) $\{(0,1),(\alpha,0)\}$ for each $\alpha>0$.

**Method (L5 §2–3).** Do NOT centre. Minimising distance $=$ maximising $\|Av\|^2=v^TA^TAv$: take the top eigenvector(s) of $A^TA$.

- **Step 1. (1)** $A^TA=\begin{pmatrix}1&0\\0&1\end{pmatrix}=I$. All eigenvalues equal, so every direction ties.
- **Step 2. (2)** $A^TA=\begin{pmatrix}4&0\\0&1\end{pmatrix}$, eigenvalues $4>1$: unique top eigenvector $e_1=(1,0)$.
- **Step 3. (3)** $A^TA=\mathrm{diag}(\alpha^2,1)$. If $\alpha>1$: top is $e_1$. If $\alpha<1$: top is $e_2$. If $\alpha=1$: tie.

> [!success] Answer
> (1) **Every** line through the origin. (2) Only the $x$-axis $\mathrm{span}\{(1,0)\}$. (3) $\alpha>1$: the $x$-axis; $\alpha<1$: the $y$-axis; $\alpha=1$: every line. (Compare A3: through-origin and centred answers differ, e.g. (1) here is a tie but the centred set $(4,4),(6,2)$ is not.)

### A5 (BHK 3.25, adapted)

> **Question.** $\sigma_1^2\ge\dots\ge\sigma_r^2\ge0$, $f(c)=\sum_{i=1}^rc_i^2\sigma_i^2$ with $\sum c_i^2=1$. (a) Find the maximum of $f$. (b) Find the set of all maximisers for $(\sigma_1^2,\sigma_2^2,\sigma_3^2)=(9,4,1)$ and for $(9,9,1)$.

**Solution.**
- **Step 1. (a)** $c_i^2\ge0$ add to 1, so $f$ is a weighted average of the $\sigma_i^2$. It is at most the largest, $\sigma_1^2$ (L5 §3):
$$f(c)\le\sigma_1^2\sum c_i^2=\sigma_1^2$$
Equality when all weight is on indices with $\sigma_i^2=\sigma_1^2$.
- **Step 2. (b) $(9,4,1)$.** Only $\sigma_1^2$ is largest, so $c_2=c_3=0$, $c_1=\pm1$.
- **Step 3. $(9,9,1)$.** $\sigma_1^2=\sigma_2^2$, so any weights on $c_1,c_2$ work, $c_3=0$.

> [!success] Answer
> (a) $\max f=\sigma_1^2$. (b) $(9,4,1)$: $c=(\pm1,0,0)$ (two points). $(9,9,1)$: $\{(c_1,c_2,0):c_1^2+c_2^2=1\}$ (a whole circle), max value $9$.

## Section B: The SVD and its structure

### B1 (BHK 3.5, adapted)

> **Question.** For each matrix find $\sigma_1\ge\sigma_2$, unit right singular vectors $v_1,v_2$, left singular vectors $u_i=Mv_i/\sigma_i$, and the SVD $M=\sigma_1u_1v_1^T+\sigma_2u_2v_2^T$. (a) $M=\begin{pmatrix}1&1\\0&3\\3&0\end{pmatrix}$. (b) $M=\begin{pmatrix}0&2\\2&0\\1&3\\3&1\end{pmatrix}$.

**Solution (a)** (recipe L5 §5).
- **Step 1.** $M^TM=\begin{pmatrix}1+0+9&1+0+0\\1&1+9+0\end{pmatrix}=\begin{pmatrix}10&1\\1&10\end{pmatrix}$.
- **Step 2.** Eigenvalues $11$ (vector $\frac1{\sqrt2}(1,1)$) and $9$ (vector $\frac1{\sqrt2}(1,-1)$).
- **Step 3.** $\sigma_1=\sqrt{11}$, $\sigma_2=3$; $v_1=\frac1{\sqrt2}(1,1)$, $v_2=\frac1{\sqrt2}(1,-1)$.
- **Step 4.** $Mv_1=\frac1{\sqrt2}(2,3,3)$, so $u_1=\frac1{\sqrt{22}}(2,3,3)$. $\ Mv_2=\frac1{\sqrt2}(0,-3,3)$, so $u_2=\frac1{\sqrt2}(0,-1,1)$.
- **Step 5. Check.** $\sqrt{11}u_1v_1^T=\begin{pmatrix}1&1\\1.5&1.5\\1.5&1.5\end{pmatrix}$, $3u_2v_2^T=\begin{pmatrix}0&0\\-1.5&1.5\\1.5&-1.5\end{pmatrix}$. Sum $=M$ ✓.

> [!success] Answer (a)
> $\sigma=(\sqrt{11},3)$, $v_1=\frac1{\sqrt2}(1,1)$, $v_2=\frac1{\sqrt2}(1,-1)$, $u_1=\frac1{\sqrt{22}}(2,3,3)$, $u_2=\frac1{\sqrt2}(0,-1,1)$.

**Solution (b).**
- **Step 1.** Columns $(0,2,1,3)$ and $(2,0,3,1)$: $M^TM=\begin{pmatrix}14&6\\6&14\end{pmatrix}$.
- **Step 2.** Eigenvalues $20$ ($\frac1{\sqrt2}(1,1)$) and $8$ ($\frac1{\sqrt2}(1,-1)$).
- **Step 3.** $\sigma_1=\sqrt{20}=2\sqrt5$, $\sigma_2=\sqrt8=2\sqrt2$.
- **Step 4.** $Mv_1=\frac1{\sqrt2}(2,2,4,4)\Rightarrow u_1=\frac1{\sqrt{10}}(1,1,2,2)$. $\ Mv_2=\frac1{\sqrt2}(-2,2,-2,2)\Rightarrow u_2=\frac12(-1,1,-1,1)$.
- **Step 5. Check.** $\sigma_1u_1v_1^T=\begin{pmatrix}1&1\\1&1\\2&2\\2&2\end{pmatrix}$, $\sigma_2u_2v_2^T=\begin{pmatrix}-1&1\\1&-1\\-1&1\\1&-1\end{pmatrix}$. Sum $=M$ ✓.

> [!success] Answer (b)
> $\sigma=(2\sqrt5,2\sqrt2)$, $v_1=\frac1{\sqrt2}(1,1)$, $v_2=\frac1{\sqrt2}(1,-1)$, $u_1=\frac1{\sqrt{10}}(1,1,2,2)$, $u_2=\frac12(-1,1,-1,1)$.

### B2 (BHK 3.6, adapted)

> **Question.** $A\in\mathbb R^{m\times n}$, $m\le n$, has orthonormal rows ($AA^T=I_m$). (a) For $m=n$ find $A^TA$. (b) For $m<n$ find $\mathrm{tr}(A^TA)$ and the eigenvalues of $A^TA$ with multiplicities. (c) For $A=\frac1{\sqrt2}(1\ \ 1)$ find the norms of the two columns and their inner product.

**Solution.**
- **Step 1. (a)** Square with $AA^T=I$ means $A^T=A^{-1}$, so $A^TA=I_n$.
- **Step 2. (b) Trace.** $\mathrm{tr}(A^TA)=\mathrm{tr}(AA^T)=\mathrm{tr}(I_m)=m$.
- **Step 3. Eigenvalues.** $(A^TA)^2=A^T(AA^T)A=A^TA$ and $A^TA$ is symmetric, so every eigenvalue is $0$ or $1$ (an orthogonal projection). The trace $m$ counts the $1$'s.
- **Step 4. (c)** Columns are $\frac1{\sqrt2}$ and $\frac1{\sqrt2}$ (single numbers). Norms $\frac1{\sqrt2}$ each; inner product $\frac12$. So the columns are not orthonormal when $m<n$.

> [!success] Answer
> (a) $I_n$. (b) $\mathrm{tr}=m$; eigenvalue $1$ with multiplicity $m$ and $0$ with multiplicity $n-m$. (c) Column norms $\frac1{\sqrt2},\frac1{\sqrt2}$; inner product $\frac12$ (here $A^TA=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$, eigenvalues $1,0$).

### B3 (BHK 3.9, adapted)

> **Question.** $x_1,\dots,x_r\in\mathbb R^m$, $y_1,\dots,y_r\in\mathbb R^n$, $C\in\mathbb R^{r\times r}$; $X$ has columns $x_i$, $Y$ has columns $y_i$. (a) For any $C$, write $XCY^T$ as a combination of $x_iy_{i'}^T$. (b) For $C=\mathrm{diag}(c_1,\dots,c_r)$ find $XCY^T-\sum c_ix_iy_i^T$. (c) $x_1=(1,0,1)^T$, $x_2=(0,1,1)^T$, $y_1=(1,2)^T$, $y_2=(2,-1)^T$. Find $XCY^T$ for $C=\mathrm{diag}(3,-1)$ and for $C=\begin{pmatrix}0&1\\0&0\end{pmatrix}$.

**Solution.**
- **Step 1. (a)** Entry $(j,l)$ of $XCY^T$ is $\sum_{i,i'}x_{ji}C_{ii'}y_{li'}$, so
$$XCY^T=\sum_{i,i'}C_{ii'}\,x_iy_{i'}^T$$
- **Step 2. (b)** For diagonal $C$ only $i=i'$ terms survive: $XCY^T=\sum c_ix_iy_i^T$. The difference is the **zero matrix**.
- **Step 3. (c), $C=\mathrm{diag}(3,-1)$:** $XCY^T=3x_1y_1^T-x_2y_2^T$.
$$x_1y_1^T=\begin{pmatrix}1&2\\0&0\\1&2\end{pmatrix},\ x_2y_2^T=\begin{pmatrix}0&0\\2&-1\\2&-1\end{pmatrix}\ \Rightarrow\ XCY^T=\begin{pmatrix}3&6\\-2&1\\1&7\end{pmatrix}$$
- **Step 4. $C=\begin{pmatrix}0&1\\0&0\end{pmatrix}$:** only $C_{12}=1$: $XCY^T=x_1y_2^T=\begin{pmatrix}2&-1\\0&0\\2&-1\end{pmatrix}$.

> [!success] Answer
> (a) $\sum_{i,i'}C_{ii'}x_iy_{i'}^T$. (b) $0$. (c) $\begin{pmatrix}3&6\\-2&1\\1&7\end{pmatrix}$ and $\begin{pmatrix}2&-1\\0&0\\2&-1\end{pmatrix}$.

### B4 (BHK 3.10, adapted)

> **Question.** $A=\sum_{i=1}^r\sigma_iu_iv_i^T$ with orthonormal $u$'s and $v$'s, $\sigma_1\ge\dots\ge\sigma_r>0$. (a) Find $u_i^TA$, and $u^TA$ for a unit $u$ orthogonal to $u_1,\dots,u_r$. (b) Find $\max_{\|u\|=1}\|u^TA\|$ and all maximisers if $\sigma_1>\sigma_2$. (c) Find all maximisers if $\sigma_1=\sigma_2>\sigma_3$.

**Solution.**
- **Step 1. (a)** $u_i^TA=\sum_j\sigma_j(u_i^Tu_j)v_j^T=\sigma_iv_i^T$. For $u\perp$ all $u_j$: $u^TA=0$.
- **Step 2. (b)** Write $u=\sum c_iu_i+w$ ($w\perp$ all $u_i$). Then $u^TA=\sum c_i\sigma_iv_i^T$ and $\|u^TA\|^2=\sum c_i^2\sigma_i^2\le\sigma_1^2$ (weighted average, L5 §3). Equality needs all weight on $\sigma_1$.
- **Step 3.** If $\sigma_1>\sigma_2$: $c=(\pm1,0,\dots)$, $w=0$.
- **Step 4. (c)** $\sigma_1=\sigma_2$: weights may be split between $c_1,c_2$.

> [!success] Answer
> (a) $u_i^TA=\sigma_iv_i^T$; $u^TA=0$. (b) Max $=\sigma_1$, maximisers $u=\pm u_1$. (c) All $u=c_1u_1+c_2u_2$ with $c_1^2+c_2^2=1$ (a circle in $\mathrm{span}\{u_1,u_2\}$).

### B5 (BHK 3.11, adapted)

> **Question.** Same $A$. (a) Write $A^TA$ in terms of $v_iv_i^T$. (b) Find $A^TAv_j$ and $A^TAw$ for $w\perp v_1,\dots,v_r$. (c) If $\sigma_1>\sigma_2$, find all unit $v$ with $A^TAv=\sigma_1^2v$ and $u=Av/\sigma_1$. (d) Same if $\sigma_1=\sigma_2>\sigma_3$.

**Solution.**
- **Step 1. (a)** $A^TA=\sum_{j,k}\sigma_j\sigma_kv_j(u_j^Tu_k)v_k^T=\sum_j\sigma_j^2v_jv_j^T$ (L5 §4).
- **Step 2. (b)** $A^TAv_j=\sigma_j^2v_j$; $\ A^TAw=0$.
- **Step 3. (c)** Write $v=\sum c_iv_i+w$. $A^TAv=\sum\sigma_i^2c_iv_i$. Setting equal to $\sigma_1^2v$: for $i\ge2$, $(\sigma_i^2-\sigma_1^2)c_i=0\Rightarrow c_i=0$ (since $\sigma_i<\sigma_1$); and $\sigma_1^2w=0\Rightarrow w=0$. So $v=\pm v_1$, $u=\pm u_1$.
- **Step 4. (d)** $\sigma_1=\sigma_2$: $c_1,c_2$ free, others $0$: $v=c_1v_1+c_2v_2$, $c_1^2+c_2^2=1$; $u=Av/\sigma_1=c_1u_1+c_2u_2$.

> [!success] Answer
> (a) $\sum_i\sigma_i^2v_iv_i^T$. (b) $\sigma_j^2v_j$; $0$. (c) $\{\pm v_1\}$ with $u=\pm u_1$. (d) $v\in\{c_1v_1+c_2v_2:c_1^2+c_2^2=1\}$ with $u=c_1u_1+c_2u_2$.

### B6 (BHK 3.13, adapted)

> **Question.** $A$ is symmetric $n\times n$ with SVD $A=\sum\sigma_iu_iv_i^T$, distinct singular values $\sigma_1>\dots>\sigma_r>0$. (a) Find the possible $\lambda_i$ in $Av_i=\lambda_iv_i$ and $u_i$ in terms of $\lambda_i,\sigma_i,v_i$. (b) Find a diagonal $D$ with $A=VDV^T$, $V=[v_1\cdots v_r]$. (c) Find $(u_1,v_1),(u_2,v_2)$ (up to common sign) for $A=\mathrm{diag}(2,1)$ and $A=\mathrm{diag}(1,-2)$. (d) Find the set of symmetric $A$ (distinct singular values) with $u_i=v_i$ for all $i$, in terms of eigenvalues.

**Solution.**
- **Step 1. (a) $v_i$ is an eigenvector of $A$.** $A^TA=A^2$, and $A^2v_i=\sigma_i^2v_i$. $A$ commutes with $A^2$, so $A v_i$ is also an eigenvector of $A^2$ with the same eigenvalue $\sigma_i^2$. Singular values are distinct, so that eigenvalue is simple, so $Av_i=\lambda_iv_i$.
- **Step 2.** $A^2v_i=\lambda_i^2v_i=\sigma_i^2v_i$, so $\lambda_i=\pm\sigma_i$.
- **Step 3.** $u_i=\frac{Av_i}{\sigma_i}=\frac{\lambda_i}{\sigma_i}v_i=\pm v_i$ (sign of $\lambda_i$).
- **Step 4. (b)** $A=\sum\sigma_iu_iv_i^T=\sum\lambda_iv_iv_i^T=V\,\mathrm{diag}(\lambda_1,\dots,\lambda_r)V^T$.
- **Step 5. (c)** $A=\mathrm{diag}(2,1)$: $\sigma=(2,1)$, $\lambda=(2,1)$ both positive, so $(u_1,v_1)=(e_1,e_1)$, $(u_2,v_2)=(e_2,e_2)$.
  $A=\mathrm{diag}(1,-2)$: $\sigma=(2,1)$. Top is the $e_2$ direction with $\lambda=-2$: $v_1=e_2$, $u_1=Av_1/2=-e_2$ (or the common sign flip). Second: $v_2=e_1$, $\lambda=1$: $u_2=e_1$.
- **Step 6. (d)** $u_i=v_i\iff\lambda_i=+\sigma_i>0$ for all $i$: all nonzero eigenvalues positive.

> [!success] Answer
> (a) $\lambda_i=\pm\sigma_i$, $u_i=\mathrm{sign}(\lambda_i)v_i$. (b) $D=\mathrm{diag}(\lambda_1,\dots,\lambda_r)$. (c) $\mathrm{diag}(2,1)$: $(e_1,e_1),(e_2,e_2)$. $\mathrm{diag}(1,-2)$: $(u_1,v_1)=(-e_2,e_2)$, $(u_2,v_2)=(e_1,e_1)$. (d) Symmetric positive semidefinite $A$ (all nonzero eigenvalues $>0$, distinct).

## Section C: The power method

### C1 (BHK 3.14, adapted; PDF solution reformatted)

> **Question.** $A\in\mathbb R^{n\times d}$, $A=\sum_{i=1}^r\sigma_iu_iv_i^T$; extend $v_1,\dots,v_r$ to an orthonormal basis $v_1,\dots,v_d$ ($\sigma_i=0$ for $i>r$); $B=A^TA$. Power method: $x_0=\sum_{i=1}^dc_iv_i$ (unit), $x_{t+1}=\frac{Bx_t}{\|Bx_t\|}$.
> (a) Find $\tan\angle(x_t,v_1)$ in terms of $c_i,\sigma_i,t$ and $\lim x_t$, for $\sigma_1>\sigma_2$, $c_1\ne0$.
> (b) Find $\lim x_t$ for $\sigma_1=\sigma_2>\sigma_3$, $(c_1,c_2)\ne(0,0)$.
> (c) Find $\lim x_t$ for $\sigma_1>\sigma_2>\sigma_3$, $c_1=0$, $c_2\ne0$.
> (d) Find a matrix $P$ with $A-\sigma_1u_1v_1^T=AP$, and the top right singular vector of $A-\sigma_1u_1v_1^T$ when $\sigma_2>\sigma_3$.

**Solution.**
- **Step 1. $B$ acts on each $v_i$ by $\sigma_i^2$.** $B=A^TA=\sum_j\sigma_j^2v_jv_j^T$ (L5 §4), so $Bv_i=\sigma_i^2v_i$ for all $i=1..d$.
- **Step 2. Closed form of $x_t$.** Dividing by a length never changes direction, so all the divisions can be done at the end:
$$x_t=\frac{B^tx_0}{\|B^tx_0\|},\qquad B^tx_0=\sum_ic_i\sigma_i^{2t}v_i$$
- **Step 3. Split along $v_1$ and the rest.** $B^tx_0=\underbrace{c_1\sigma_1^{2t}v_1}_{\text{along }v_1}+\underbrace{\sum_{i\ge2}c_i\sigma_i^{2t}v_i}_{\perp v_1}$. The $v_i$ are orthonormal, so by Pythagoras
$$\tan\angle(x_t,v_1)=\frac{\|\perp\|}{\lvert\text{along}\rvert}=\frac{\left(\sum_{i\ge2}c_i^2\sigma_i^{4t}\right)^{1/2}}{\lvert c_1\rvert\sigma_1^{2t}}$$

**(a)**
- **Step 4. Bound.** For $i\ge2$, $\sigma_i\le\sigma_2$ and $\sum_{i\ge2}c_i^2=1-c_1^2$. So
$$\tan\angle(x_t,v_1)\le\left(\frac{\sigma_2}{\sigma_1}\right)^{2t}\frac{\sqrt{1-c_1^2}}{\lvert c_1\rvert}\xrightarrow{t\to\infty}0$$
- **Step 5. Limit.** $x_t\to\mathrm{sign}(c_1)\,v_1$.

> [!success] Answer (a)
> $\tan\angle(x_t,v_1)\le(\sigma_2/\sigma_1)^{2t}\sqrt{1-c_1^2}/\lvert c_1\rvert\to0$; $\ \lim x_t=\pm v_1$ (sign of $c_1$). Each step multiplies the tangent by at most $(\sigma_2/\sigma_1)^2$; slow if $\sigma_2\approx\sigma_1$.

**(b) $\sigma_1=\sigma_2>\sigma_3$.**
- **Step 1.** Divide by $\sigma_1^{2t}$: $\frac{B^tx_0}{\sigma_1^{2t}}=\underbrace{c_1v_1+c_2v_2}_{z}+\underbrace{\sum_{i\ge3}c_i(\sigma_i/\sigma_1)^{2t}v_i}_{w_t}$.
- **Step 2.** $\|w_t\|^2\le(\sigma_3/\sigma_1)^{4t}\to0$, and $z$ does not depend on $t$.
- **Step 3.** $x_t\to\frac z{\|z\|}$.

> [!success] Answer (b)
> $\lim x_t=\dfrac{c_1v_1+c_2v_2}{\sqrt{c_1^2+c_2^2}}$: a unit vector in $\mathrm{span}\{v_1,v_2\}$. It depends on the start, but it is still a correct top singular vector ($Bz=\sigma_1^2z$). Only the span is determined.

**(c) $c_1=0$, $c_2\ne0$.**
- **Step 1.** The $v_1$ term is zero at every step, so $B^tx_0=c_2\sigma_2^{2t}\left(v_2+\sum_{i\ge3}\frac{c_i}{c_2}(\sigma_i/\sigma_2)^{2t}v_i\right)$.
- **Step 2.** This is (a) with $v_2$ playing the role of $v_1$.

> [!success] Answer (c)
> $\lim x_t=\mathrm{sign}(c_2)\,v_2$. The method finds $v_2$ instead of $v_1$ (in a computer rounding errors add a tiny $v_1$ part which grows, so it eventually turns to $v_1$; a random start has $c_1\ne0$ with probability 1).

**(d) Deflation.**
- **Step 1.** $Av_1=\sum_j\sigma_ju_j(v_j^Tv_1)=\sigma_1u_1$.
- **Step 2.** So $\sigma_1u_1v_1^T=Av_1v_1^T$ and $A-\sigma_1u_1v_1^T=A-Av_1v_1^T=A(I-v_1v_1^T)$.
- **Step 3.** $A'=A-\sigma_1u_1v_1^T=\sum_{i\ge2}\sigma_iu_iv_i^T$, so $A'^TA'=\sum_{i\ge2}\sigma_i^2v_iv_i^T$. For unit $x$ with $a_i=v_i^Tx$: $\|A'x\|^2=\sum_{i\ge2}\sigma_i^2a_i^2\le\sigma_2^2$.
- **Step 4.** Equality only when $x=\pm v_2$ (since $\sigma_2>\sigma_3$).

> [!success] Answer (d)
> $P=I-v_1v_1^T$. Top right singular vector of $A-\sigma_1u_1v_1^T$ is $\pm v_2$ (with singular value $\sigma_2$). Repeating this gives $v_3,v_4,\dots$ one at a time (deflation, L5 §8).

### C2 (BHK 3.15, adapted)

> **Question.** $A=\begin{pmatrix}1&2\\3&4\end{pmatrix}$, $B=A^TA$, $x_0=\frac1{\sqrt2}(1,1)^T$, $x_{t+1}=\frac{Bx_t}{\|Bx_t\|}$. (a) Find $x_1,x_2,x_3$ to four decimals. (b) Find $\sigma_1,v_1,u_1$ and $\sigma_2,v_2,u_2$ with $\sigma_1,\sigma_2$ in closed form. (c) Find the factor by which $\tan\angle(x_t,v_1)$ shrinks per step and the smallest $t$ with $\tan\angle(x_t,v_1)\le10^{-4}$. (d) Repeat (c) for $A'=\mathrm{diag}(1,0.9)$ with the same $x_0$.

**Solution.**
- **Step 1.** $B=A^TA=\begin{pmatrix}10&14\\14&20\end{pmatrix}$ (columns of $A$: $(1,3)$ and $(2,4)$).

**(a)**
- **Step 2.** $Bx_0\propto(10+14,\ 14+20)=(24,34)$, length $\sqrt{1732}=41.617$: $x_1=(0.5767,\ 0.8170)$.
- **Step 3.** $Bx_1=(17.205,\ 24.414)$, length $29.867$: $x_2=(0.5761,\ 0.8174)$.
- **Step 4.** $Bx_2=(17.204,\ 24.413)$, length $29.866$: $x_3=(0.5760,\ 0.8174)$.

**(b)**
- **Step 5.** $B$: trace $30$, det $4$. Eigenvalues $15\pm\sqrt{221}=29.866,\ 0.1339$.
- **Step 6.** $\sigma_1=\sqrt{15+\sqrt{221}}=5.4650$, $\sigma_2=\sqrt{15-\sqrt{221}}=0.3660$ (check $\sigma_1\sigma_2=\lvert\det A\rvert=2$ ✓).
- **Step 7.** $v_1\propto(14,\ 5+\sqrt{221})$: $v_1=(0.5760,\ 0.8174)$; $v_2=(-0.8174,\ 0.5760)$.
- **Step 8.** $u_1=Av_1/\sigma_1=(0.4046,\ 0.9145)$; $u_2=Av_2/\sigma_2=(0.9145,\ -0.4046)$.

**(c)**
- **Step 9. Shrink factor.** $\left(\frac{\sigma_2}{\sigma_1}\right)^2=\frac{15-\sqrt{221}}{15+\sqrt{221}}=0.004484$ per step.
- **Step 10. Start.** $x_0$ is at $45^\circ$, $v_1$ at $54.83^\circ$: $\tan\angle(x_0,v_1)=0.1732$.
- **Step 11. Solve** $0.1732\times0.004484^t\le10^{-4}$: $t=1$: $7.8\times10^{-4}$ (too big); $t=2$: $3.5\times10^{-6}$ ✓.

**(d)**
- **Step 12.** $A'^TA'=\mathrm{diag}(1,0.81)$; $v_1=e_1$; factor $\left(\frac{\sigma_2}{\sigma_1}\right)^2=0.81$. $\tan\angle(x_0,e_1)=1$.
- **Step 13.** $0.81^t\le10^{-4}\Rightarrow t\ge\frac{\ln10^4}{\ln(1/0.81)}=43.7$.

> [!success] Answer
> (a) $x_1=(0.5767,0.8170)$, $x_2=(0.5761,0.8174)$, $x_3=(0.5760,0.8174)$. (b) $\sigma_1=\sqrt{15+\sqrt{221}}\approx5.465$, $v_1\approx(0.5760,0.8174)$, $u_1\approx(0.4046,0.9145)$; $\sigma_2=\sqrt{15-\sqrt{221}}\approx0.366$, $v_2\approx(-0.8174,0.5760)$, $u_2\approx(0.9145,-0.4046)$. (c) Factor $0.0045$ per step; $t=2$. (d) Factor $0.81$; $t=44$. (Small gap, slow convergence.)

### C3 (BHK 3.16, adapted)

> **Question.** $A=\begin{pmatrix}1&2\\-1&2\\1&-2\\-1&-2\end{pmatrix}$, $B=A^TA$, power method from $x_0=\frac1{\sqrt2}(1,1)^T$. (a) Find $x_3$ and the angle between $x_3$ and $v_1$. (b) Find $v_1,v_2,\sigma_1,\sigma_2,u_1,u_2$. (c) Row $i$ = person $i$, column $j$ = restaurant $j$, $a_{ij}$ = how much person $i$ likes restaurant $j$. For $k=1,2$ find the restaurant on which $v_k$ is supported and the partition of the persons by the signs of $u_k$. (d) Find $\tan\angle(x_t,v_1)$ as a function of $t$.

**Solution.**
- **Step 1.** Columns $(1,-1,1,-1)$ and $(2,2,-2,-2)$: dot product $2-2-2+2=0$. $B=\begin{pmatrix}4&0\\0&16\end{pmatrix}$.
- **Step 2. (b)** Eigenvalues $16,4$: $\sigma_1=4$, $v_1=(0,1)$; $\sigma_2=2$, $v_2=(1,0)$.
  $u_1=Av_1/4=\frac12(1,1,-1,-1)$; $u_2=Av_2/2=\frac12(1,-1,1,-1)$.
- **Step 3. (a)** $Bx\propto(4x_1,16x_2)$: from $(1,1)$: $(4,16)\propto(1,4)$; then $(1,16)$; then $(1,64)$. So $x_3=\frac{(1,64)}{\sqrt{4097}}=(0.0156,\ 0.9999)$.
- **Step 4. Angle.** $\tan\angle(x_3,v_1)=\frac1{64}$, angle $=0.0156\ \text{rad}=0.895^\circ$.
- **Step 5. (c)** $v_1=e_2$: supported on **restaurant 2**. $u_1=\frac12(+,+,-,-)$: persons $\{1,2\}$ vs $\{3,4\}$ (they like / dislike restaurant 2: $a_{\cdot2}=(2,2,-2,-2)$). $v_2=e_1$: **restaurant 1**; $u_2=\frac12(+,-,+,-)$: persons $\{1,3\}$ vs $\{2,4\}$ ($a_{\cdot1}=(1,-1,1,-1)$).
- **Step 6. (d)** $c_1=x_0\cdot v_1=\frac1{\sqrt2}$, $c_2=\frac1{\sqrt2}$: $\tan\angle(x_t,v_1)=\frac{c_2}{c_1}\left(\frac{\sigma_2}{\sigma_1}\right)^{2t}=\left(\frac24\right)^{2t}=4^{-t}$ (check $t=3$: $\frac1{64}$ ✓).

> [!success] Answer
> (a) $x_3=(0.0156,0.9999)$, angle $0.895^\circ$. (b) $v_1=(0,1)$, $v_2=(1,0)$, $\sigma_1=4$, $\sigma_2=2$, $u_1=\frac12(1,1,-1,-1)$, $u_2=\frac12(1,-1,1,-1)$. (c) $k=1$: restaurant 2, persons $\{1,2\}\mid\{3,4\}$. $k=2$: restaurant 1, persons $\{1,3\}\mid\{2,4\}$. (d) $\tan\angle=4^{-t}$.

## Section D: Eckart–Young, low-rank approximation & PCA

### D1 (BHK 3.12, adapted)

> **Question.** $A=\sum_{i=1}^r\sigma_iu_iv_i^T$ (rank $r$), $A_k=\sum_{i\le k}\sigma_iu_iv_i^T$, $k<r$. (a) Find $\|A_k\|_F^2$, $\|A_k\|_2^2$, $\|A-A_k\|_F^2$, $\|A-A_k\|_2^2$ in terms of $\sigma_i$. (b) For $(\sigma_1,\dots,\sigma_6)=(4,2,2,2,2,2)$ find the smallest $k$ with $\|A-A_k\|_2\le\frac12\|A\|_2$ and the smallest $k$ with $\|A-A_k\|_F\le\frac12\|A\|_F$.

**Solution.**
- **Step 1. (a)** $\|M\|_F^2=\sum$ (squared singular values); $\|M\|_2=$ largest singular value (W1 §3.6, L5 §11). $A_k$ has singular values $\sigma_1..\sigma_k$; $A-A_k=\sum_{i>k}\sigma_iu_iv_i^T$ has $\sigma_{k+1},\dots,\sigma_r$.
- **Step 2. (b) Spectral.** $\|A\|_2=4$, need $\sigma_{k+1}\le2$: $k=1$ works ($\sigma_2=2$).
- **Step 3. Frobenius.** $\|A\|_F^2=16+5\cdot4=36$, $\|A\|_F=6$. Need $\sum_{i>k}\sigma_i^2\le9$: tail $=4(6-k)$: $k=1$: 20; $k=2$: 16; $k=3$: 12; $k=4$: $8\le9$ ✓.

> [!success] Answer
> (a) $\|A_k\|_F^2=\sum_{i\le k}\sigma_i^2$, $\|A_k\|_2^2=\sigma_1^2$, $\|A-A_k\|_F^2=\sum_{i>k}\sigma_i^2$, $\|A-A_k\|_2^2=\sigma_{k+1}^2$. (b) Spectral: $k=1$. Frobenius: $k=4$.

### D2 (BHK 3.23, adapted)

> **Question.** $A\ne0$ with singular values $\sigma_1\ge\sigma_2\ge\dots$, $k\ge1$. Given Eckart–Young: for every $B$ of rank $\le k$, $\|A-B\|_2\ge\sigma_{k+1}$ and $\|A-B\|_F^2\ge\sum_{i>k}\sigma_i^2$ (equality at $A_k$). (a) Find $\max_{A\ne0}\sigma_k/\|A\|_F$ and a matrix attaining it. (b) Find $\max_{A\ne0}\min_{\mathrm{rank}B\le k}\|A-B\|_2/\|A\|_F$. (c) For $A=I_n$ ($n>k$) find $\min_{\mathrm{rank}B\le k}\|A-B\|_F^2$ and the pairs $(n,k)$ for which it is at most $\|A\|_F^2/k$.

**Solution.**
- **Step 1. (a)** $\|A\|_F^2=\sum\sigma_i^2\ge\sigma_1^2+\dots+\sigma_k^2\ge k\sigma_k^2$ (each $\sigma_i\ge\sigma_k$ for $i\le k$). So $\frac{\sigma_k}{\|A\|_F}\le\frac1{\sqrt k}$. Equality when $\sigma_1=\dots=\sigma_k$ and all others $0$.
- **Step 2. (b)** The inner min is $\sigma_{k+1}$ (E–Y). By the same argument with $k+1$: $\frac{\sigma_{k+1}}{\|A\|_F}\le\frac1{\sqrt{k+1}}$, equality when $\sigma_1=\dots=\sigma_{k+1}$, rest $0$.
- **Step 3. (c)** $I_n$ has $n$ singular values equal to $1$. E–Y: $\min\|A-B\|_F^2=\sum_{i>k}1=n-k$. $\|A\|_F^2=n$.
- **Step 4.** Need $n-k\le\frac nk\iff k(n-k)\le n\iff n(k-1)\le k^2$.
  - $k=1$: $0\le1$, true for every $n>1$.
  - $k=2$: $n\le4$, so $n=3,4$.
  - $k\ge3$: $n\le k+1+\frac1{k-1}$, so $n=k+1$ only.

> [!success] Answer
> (a) Max $=\frac1{\sqrt k}$, attained by $A=\sum_{i\le k}u_iv_i^T$ (all $k$ nonzero singular values equal, e.g. the identity on a $k$-dim space). (b) Max $=\frac1{\sqrt{k+1}}$ (all of $\sigma_1..\sigma_{k+1}$ equal). (c) $\min=n-k$; holds for: $k=1$ and any $n\ge2$; $k=2$ with $n\in\{3,4\}$; $k\ge3$ with $n=k+1$.

### D3 (BHK 3.28, adapted)

> **Question.** The lecture photo (`scipy.misc.face`, grayscale) downsampled by 3 in each direction: an $m\times n=256\times342$ matrix $A$ of non-negative pixel intensities, singular values $\sigma_1\ge\sigma_2\ge\dots$, mean pixel value $\bar a$, rank-$k$ truncation $A_k$.
> (a) Find the number of stored numbers for $A_k$, and $\frac{\|A_k\|_F}{\|A\|_F}$ and $\frac{\|A-A_k\|_F}{\|A\|_F}$ in terms of $\sigma_i$.
> (b) For $k=1,2,4,16$ find the storage ratio $\frac{mn}{k(m+n+1)}$, the fraction $\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}$, and the two ratios in (a).
> (c) Find a lower bound on $\sigma_1^2$ in terms of $m,n,\bar a$ by evaluating $\|Av\|^2$ at $v=\frac1{\sqrt n}\mathbf 1$, and evaluate $\frac{mn\bar a^2}{\|A\|_F^2}$ for this photo.
> (d) $J$ is the $m\times n$ all-ones matrix. Find $\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}$ for the centred photo $A-\bar aJ$, $k=1,2,4,16$.

**Solution.**
- **Step 1. (a) Storage.** $A_k=\sum_{i\le k}\sigma_iu_iv_i^T$ stores $k$ values of $\sigma_i$, $k$ vectors $u_i\in\mathbb R^m$, $k$ vectors $v_i\in\mathbb R^n$: $k(m+n+1)$ numbers (L5 §11).
- **Step 2. Ratios.**
$$\frac{\|A_k\|_F}{\|A\|_F}=\sqrt{\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}},\qquad\frac{\|A-A_k\|_F}{\|A\|_F}=\sqrt{\frac{\sum_{i>k}\sigma_i^2}{\sum_i\sigma_i^2}}$$
(they satisfy $r_1^2+r_2^2=1$.)
- **Step 3. (b) Storage ratio.** $mn=87552$, $m+n+1=599$: ratio $=\frac{146.2}k$.

| $k$ | 1 | 2 | 4 | 16 |
|---|---|---|---|---|
| $\frac{mn}{k(m+n+1)}$ | 146.2 | 73.1 | 36.5 | 9.14 |

- **Step 4.** The fractions $\frac{\sum_{i\le k}\sigma_i^2}{\sum\sigma_i^2}$ and the two ratios need the actual singular values of this image. They cannot be derived without the image (you must read them off the singular values printed in the lecture). Use Step 2 formulas: fraction $f_k$, then ratios $\sqrt{f_k}$ and $\sqrt{1-f_k}$.
- **Step 5. (c) Lower bound.** $v=\frac1{\sqrt n}\mathbf 1$ is a unit vector, so $\sigma_1^2=\max\|Av\|^2\ge\|Av\|^2$. $Av$ has entries $R_i/\sqrt n$ where $R_i$ is the sum of row $i$. So $\|Av\|^2=\frac1n\sum_iR_i^2$.
- **Step 6.** By Cauchy–Schwarz, $\sum_iR_i^2\ge\frac{(\sum_iR_i)^2}m=\frac{(mn\bar a)^2}m=mn^2\bar a^2$. Hence
$$\sigma_1^2\ge\frac1n\cdot mn^2\bar a^2=mn\bar a^2$$
- **Step 7. Evaluate.** $\|A\|_F^2=mn(\bar a^2+s^2)$ where $s^2$ is the variance of the pixel values. So
$$\frac{mn\bar a^2}{\|A\|_F^2}=\frac{\bar a^2}{\bar a^2+s^2}$$
This is the guaranteed share of $\|A\|_F^2$ held by $\sigma_1^2$. Its number needs the photo's $\bar a$ and $s$ (not given). It is close to $1$ when the pixel spread is small compared with the mean.
- **Step 8. (d) Centred photo.** $\|A-\bar aJ\|_F^2=\|A\|_F^2-mn\bar a^2$: centring removes exactly the mean direction (the big $\sigma_1$). So the top-$k$ fractions of the centred photo are smaller than those of the raw photo for the same $k$ (the dominant "all pixels are about $\bar a$" component is gone). Their numbers again need the singular values of $A-\bar aJ$.

> [!success] Answer
> (a) $k(m+n+1)$; $\sqrt{f_k}$ and $\sqrt{1-f_k}$ with $f_k=\frac{\sum_{i\le k}\sigma_i^2}{\sum\sigma_i^2}$. (b) Storage ratios $146.2,73.1,36.5,9.14$ for $k=1,2,4,16$. (c) $\sigma_1^2\ge mn\bar a^2$, and $\frac{mn\bar a^2}{\|A\|_F^2}=\frac{\bar a^2}{\bar a^2+s^2}$. (d) Centring removes the mean direction, so top-$k$ fractions drop. ⚠ The photo's actual fractions/ratios are not computable from the PDF (no singular values given).

### D4 (BHK 3.29, adapted; PDF solution reformatted)

> **Question.** $n=100$, $G\in\mathbb R^{n\times n}$ with i.i.d. Uniform$[0,1]$ entries, $J=\mathbf1\mathbf1^T$, $N=G-\frac12J$. (a) Find $E\|G\|_F^2$ and $\|\frac12J\|_F^2$. Find a unit vector $v$ with $E\|Gv\|^2\ge\frac34E\sum_i\sigma_i(G)^2$, if one exists. (b) Find $E[N^TN]$. For the orthogonal projector $P$ onto a fixed $k$-dimensional subspace, find $\frac{E\|NP\|_F^2}{E\|N\|_F^2}$.

**Solution.**
- **Step 0. One entry.** $X\sim U[0,1]$: $EX=\frac12$, $EX^2=\frac13$, $\mathrm{Var}X=\frac1{12}$.
- **Step 1. (a) Norms.** $\|M\|_F^2=\sum M_{ij}^2$ over $n^2$ entries: $E\|G\|_F^2=\frac{n^2}3$, $\ \|\frac12J\|_F^2=n^2\cdot\frac14=\frac{n^2}4=\frac34E\|G\|_F^2$. Also $E\sum\sigma_i(G)^2=E\|G\|_F^2$.
- **Step 2. Pick $v$.** $\frac12J$ has rank one with row space $\mathrm{span}\{\mathbf1\}$. Try $v=\frac1{\sqrt n}\mathbf1$. Entry $i$ of $G\mathbf1$ is the row sum $R_i=\sum_jG_{ij}$, so $\|Gv\|^2=\frac1n\sum_iR_i^2$.
- **Step 3.** $R_i$ is a sum of $n$ independent entries: $ER_i=\frac n2$, $\mathrm{Var}R_i=\frac n{12}$, $ER_i^2=\frac n{12}+\frac{n^2}4$.
- **Step 4.** Sum over $n$ rows: $E\|Gv\|^2=\frac1n\cdot n\left(\frac n{12}+\frac{n^2}4\right)=\frac{n^2}4+\frac n{12}$.
- **Step 5. Ratio.**
$$\frac{E\|Gv\|^2}{E\|G\|_F^2}=\frac34+\frac1{4n}=0.7525\ge\frac34\ (n=100)$$
- **Step 6. (b)** $N_{ij}=G_{ij}-\frac12$ are independent, mean $0$, variance $\frac1{12}$. Entry $(j,l)$ of $N^TN$ is $\sum_iN_{ij}N_{il}$: $E[N_{ij}N_{il}]=\frac1{12}$ if $j=l$, $0$ if $j\ne l$. So $E[N^TN]=\frac n{12}I$.
- **Step 7. Projection of one vector.** $P=\sum_jw_jw_j^T$ ($w_j$ orthonormal basis of the subspace). $\|Px\|^2=\sum_j(w_j^Tx)^2$.
- **Step 8. Projection of $N$.** With rows $n_i^T$ of $N$: $\|NP\|_F^2=\sum_i\|Pn_i\|^2=\sum_i\sum_j(n_i^Tw_j)^2=\sum_j\|Nw_j\|^2=\sum_jw_j^TN^TNw_j$.
- **Step 9.** Take expectations: $E\|NP\|_F^2=\sum_{j=1}^kw_j^T\left(\frac n{12}I\right)w_j=\frac{kn}{12}$. And $E\|N\|_F^2=\frac{n^2}{12}$.

> [!success] Answer
> (a) $E\|G\|_F^2=\frac{n^2}3=3333$, $\|\frac12J\|_F^2=\frac{n^2}4=2500$. $v=\frac1{\sqrt n}\mathbf1$ works: ratio $0.7525\ge\frac34$. ($G$ looks low-rank only because every entry is $\approx\frac12$; that shared offset is one direction.) (b) $E[N^TN]=\frac n{12}I$; $\ \frac{E\|NP\|_F^2}{E\|N\|_F^2}=\frac kn$ (after removing the mean, no direction is special).

## Section E: Beyond deflation (block iteration, Lanczos, randomized SVD)

### E1 (block iteration)

> **Question.** $A\in\mathbb R^{n\times d}$ with SVD $\sum\sigma_iu_iv_i^T$, $\sigma_1>\sigma_2>\sigma_3\ge\dots$, $B=A^TA$. Block iteration keeps $X\in\mathbb R^{d\times k}$ and repeats $X\leftarrow A^T(AX)$, $X\leftarrow Q$ where $X=QR$ (thin QR).
> (a) A block step costs $O(ndk)$ for $A^T(AX)$ and $O(dk^2)$ for the QR. Find the ratio QR/product and evaluate at $n=10^6$, $d=10^4$, $k=10$.
> (b) Suppose the first deflation returns $\hat v_1=\cos\theta\,v_1+\sin\theta\,v_2$, $0<\theta<\frac\pi2$; $P=I-\hat v_1\hat v_1^T$, $w=\sin\theta\,v_1-\cos\theta\,v_2$. Find $Pv_1$ in terms of $w$, and $\lambda$ with $PBPw=\lambda w$. Find the top eigenvector $\hat v_2$ of $PBP$ on $\mathrm{range}(P)$, the angle $\angle(\hat v_2,v_2)$, and whether $\mathrm{span}\{\hat v_1,\hat v_2\}=\mathrm{span}\{v_1,v_2\}$.
> (c) Find $X^TX$ after a block step. Given: the tangent of the angle between $\mathrm{range}(X)$ and $\mathrm{span}\{v_1..v_k\}$ shrinks by $(\sigma_{k+1}/\sigma_k)^2$ per step. Find the number of steps $t'$ taking it from $1$ to tol, and evaluate at $\sigma_{k+1}/\sigma_k=0.95$, tol $=10^{-6}$.
> (d) For $k=1$ find $Q,R$ in the thin QR of $y=A^T(Ax)$, $\|x\|=1$, and the update of $x$.

**Solution.**
- **Step 1. (a)** Ratio $=\frac{dk^2}{ndk}=\frac kn$. At $n=10^6$, $k=10$: $\frac{10}{10^6}=10^{-5}$. The QR is negligible.
- **Step 2. (b) $Pv_1$.** $\hat v_1\cdot v_1=\cos\theta$, so
$$Pv_1=v_1-\cos\theta(\cos\theta v_1+\sin\theta v_2)=\sin^2\theta\,v_1-\sin\theta\cos\theta\,v_2=\sin\theta\;w$$
- **Step 3. $w\perp\hat v_1$:** $\hat v_1\cdot w=\cos\theta\sin\theta-\sin\theta\cos\theta=0$, so $Pw=w$.
- **Step 4. $Bw$.** $Bw=\sin\theta\,\sigma_1^2v_1-\cos\theta\,\sigma_2^2v_2$. Then $\hat v_1\cdot Bw=\sin\theta\cos\theta(\sigma_1^2-\sigma_2^2)$. So $PBw=Bw-\hat v_1(\hat v_1\cdot Bw)$:
  - $v_1$ coefficient: $\sin\theta\,\sigma_1^2-\sin\theta\cos^2\theta(\sigma_1^2-\sigma_2^2)=\sin\theta(\sigma_1^2\sin^2\theta+\sigma_2^2\cos^2\theta)$.
  - $v_2$ coefficient: $-\cos\theta\,\sigma_2^2-\sin^2\theta\cos\theta(\sigma_1^2-\sigma_2^2)=-\cos\theta(\sigma_1^2\sin^2\theta+\sigma_2^2\cos^2\theta)$.
- **Step 5.** So $PBPw=\lambda w$ with $\lambda=\sigma_1^2\sin^2\theta+\sigma_2^2\cos^2\theta$.
- **Step 6. Top eigenvector.** $\lambda$ is a weighted average of $\sigma_1^2,\sigma_2^2$, so $\lambda\ge\sigma_2^2>\sigma_3^2$. All other eigenvalues of $PBP$ are $\le\sigma_3^2$. So $\hat v_2=\pm w$.
- **Step 7. Angle.** $\cos\angle(\hat v_2,v_2)=\lvert w\cdot v_2\rvert=\cos\theta$, so $\angle(\hat v_2,v_2)=\theta$.
- **Step 8. Span.** $\hat v_1,\hat v_2$ are a rotation of $v_1,v_2$ by $\theta$, so $\mathrm{span}\{\hat v_1,\hat v_2\}=\mathrm{span}\{v_1,v_2\}$ (equal).
- **Step 9. (c)** After the step $X=Q$ has orthonormal columns: $X^TX=Q^TQ=I_k$. Steps: need $\left(\frac{\sigma_{k+1}}{\sigma_k}\right)^{2t'}\le\text{tol}$:
$$t'=\frac{\ln(1/\text{tol})}{2\ln(\sigma_k/\sigma_{k+1})}=\frac{\ln10^6}{2\ln(1/0.95)}=\frac{13.816}{0.10259}=134.7\ \Rightarrow\ 135\text{ steps}$$
- **Step 10. (d)** $k=1$: $Q=\frac y{\|y\|}$ ($d\times1$), $R=\|y\|$ ($1\times1$). New $x=\frac{A^TAx}{\|A^TAx\|}$: exactly the power-method step.

> [!success] Answer
> (a) $k/n=10^{-5}$. (b) $Pv_1=\sin\theta\,w$; $\lambda=\sigma_1^2\sin^2\theta+\sigma_2^2\cos^2\theta$; $\hat v_2=\pm w$; $\angle(\hat v_2,v_2)=\theta$ (the error in $\hat v_1$ is inherited); the **span** is exactly $\mathrm{span}\{v_1,v_2\}$ even though individual vectors are off by $\theta$. (c) $X^TX=I_k$; $t'=\frac{\ln(1/\text{tol})}{2\ln(\sigma_k/\sigma_{k+1})}\approx135$. (d) $Q=y/\|y\|$, $R=\|y\|$, $x\leftarrow A^TAx/\|A^TAx\|$.

### E2 (Lanczos)

> **Question.** $B=A^TA$ symmetric $d\times d$. Lanczos starts from unit $q_1$ ($q_0=0,\beta_0=0$) and for $j=1..m$: $w=Bq_j-\beta_{j-1}q_{j-1}$, $\alpha_j=q_j^Tw$, $w\leftarrow w-\alpha_jq_j$, $\beta_j=\|w\|$, $q_{j+1}=w/\beta_j$. $T=Q_m^TBQ_m$; top-$k$ eigenpairs $(\theta_i,y_i)$ of $T$ give $\sigma_i\approx\sqrt{\theta_i}$, $v_i\approx Q_my_i$. $\mathcal K_m=\mathrm{span}\{q_1,Bq_1,\dots,B^{m-1}q_1\}$, $\mathrm{gap}_k=\min_{i\le k}\frac{\sigma_i-\sigma_{i+1}}{\sigma_1}$.
> (a) Assume every $\beta_j\ne0$ and $\mathrm{span}\{q_1..q_i\}=\mathcal K_i$. Find $h_{ij}=q_i^TBq_j$ for $i<j-1$, $i=j-1$, $i=j$.
> (b) $C$ is the cyclic shift on $\mathbb R^3$: $Ce_1=e_2$, $Ce_2=e_3$, $Ce_3=e_1$. Run Arnoldi (orthogonalise $Cq_j$ against all earlier $q_i$) from $q_1=e_1$: find $q_2,q_3$ and $q_1^TCq_3$.
> (c) $\rho_m=\frac{(B^{m-1}q_1)^TB(B^{m-1}q_1)}{\|B^{m-1}q_1\|^2}$ is the power method's Rayleigh quotient after $m-1$ steps. Order $\theta_1,\rho_m,\sigma_1^2$.
> (d) For relative gap $g$, given: power method amplifies the top direction by $(1+g)^{m-1}\approx e^{(m-1)g}$, Lanczos by $\frac12e^{2(m-1)\sqrt g}$. Find the $m$ each needs for amplification $e^L$; evaluate at $g=0.01$, $L=14$.
> (e) $(\sigma_1,\dots,\sigma_7)=(100,50,49,48,47,46.99,10)$: find $\mathrm{gap}_1..\mathrm{gap}_5$ and the ratio of Lanczos dimensions $m\propto1/\sqrt{\mathrm{gap}_k}$ at $k=5$ and $k=1$.
> (f) Rounding gives $T$ a duplicate ("ghost") eigenvalue $\theta_1'\approx\theta_1$. Find the returned list of $k$ singular values and the one missing. Full reorthogonalisation costs $O(dm^2)$ over $m$ steps; find the $m$ at which it equals the cost of the $m$ products with $B$ for dense $A$ ($O(ndm)$) and sparse $A$ ($O(\mathrm{nnz}(A)m)$) at $n=10^6$, $d=10^4$, $\mathrm{nnz}(A)=10^8$.

**Solution.**
- **Step 1. (a) $i<j-1$.** $Bq_i\in\mathcal K_{i+1}=\mathrm{span}\{q_1..q_{i+1}\}$ and $q_j\perp\mathcal K_{j-1}\supseteq\mathcal K_{i+1}$ (since $i+1\le j-1$). By symmetry of $B$: $h_{ij}=(Bq_i)^Tq_j=0$.
- **Step 2. $i=j-1$.** The recurrence at step $j-1$: $\beta_{j-1}q_j=Bq_{j-1}-\alpha_{j-1}q_{j-1}-\beta_{j-2}q_{j-2}$. Take the inner product with $q_j$: $\beta_{j-1}=q_j^TBq_{j-1}$. So $h_{j-1,j}=\beta_{j-1}$.
- **Step 3. $i=j$.** $\alpha_j=q_j^Tw=q_j^TBq_j-\beta_{j-1}q_j^Tq_{j-1}=q_j^TBq_j$. So $h_{jj}=\alpha_j$.
- **Step 4. (b)** $Cq_1=e_2$; $e_2\perp q_1$, so $q_2=e_2$. $Cq_2=e_3\perp q_1,q_2$, so $q_3=e_3$. $q_1^TCq_3=e_1^Te_1=1$. (Nonzero entry at $(1,3)$, so $C$'s Hessenberg matrix is not tridiagonal because $C$ is not symmetric.)
- **Step 5. (c)** $B^{m-1}q_1\in\mathcal K_m$, and $\theta_1$ is the maximum of the Rayleigh quotient over $\mathcal K_m$, so $\rho_m\le\theta_1$. Any Rayleigh quotient is at most the top eigenvalue $\sigma_1^2$, so $\theta_1\le\sigma_1^2$.
- **Step 6. (d) Power:** $e^{(m-1)g}=e^L\Rightarrow m=\frac Lg+1$. At $g=0.01$, $L=14$: $m=1401$.
- **Step 7. Lanczos:** $\frac12e^{2(m-1)\sqrt g}=e^L\Rightarrow m=\frac{L+\ln2}{2\sqrt g}+1$. At $g=0.01$: $\frac{14.693}{0.2}+1=74.5\Rightarrow m=75$.
- **Step 8. (e)** Differences $\sigma_i-\sigma_{i+1}$: $50,1,1,1,0.01$. Divide by $\sigma_1=100$: $\mathrm{gap}_1=0.5$; $\mathrm{gap}_2=\min(0.5,0.01)=0.01$; $\mathrm{gap}_3=0.01$; $\mathrm{gap}_4=0.01$; $\mathrm{gap}_5=\min(\dots,0.0001)=0.0001$.
- **Step 9.** Ratio $\frac{m_5}{m_1}=\sqrt{\frac{\mathrm{gap}_1}{\mathrm{gap}_5}}=\sqrt{5000}=70.7$.
- **Step 10. (f) Ghost.** The returned list has the true $\sigma_1$ twice (the ghost duplicates the first): $(\sigma_1,\sigma_1,\sigma_2,\dots,\sigma_{k-1})$, and $\sigma_k$ is missing.
- **Step 11. Break-even.** Dense: $dm^2=ndm\Rightarrow m=n=10^6$. Sparse: $dm^2=\mathrm{nnz}\,m\Rightarrow m=\frac{\mathrm{nnz}}d=\frac{10^8}{10^4}=10^4$.

> [!success] Answer
> (a) $h_{ij}=0$ for $i<j-1$; $h_{j-1,j}=\beta_{j-1}$; $h_{jj}=\alpha_j$ ($T$ is tridiagonal). (b) $q_2=e_2$, $q_3=e_3$, $q_1^TCq_3=1$. (c) $\rho_m\le\theta_1\le\sigma_1^2$. (d) Power $m=\frac Lg+1=1401$; Lanczos $m=\frac{L+\ln2}{2\sqrt g}+1\approx75$ (about 19 times fewer). (e) gaps $0.5,0.01,0.01,0.01,0.0001$; ratio $\approx70.7$. (f) List $(\sigma_1,\sigma_1,\sigma_2,\dots,\sigma_{k-1})$, missing $\sigma_k$. Reorthogonalisation catches up at $m=10^6$ (dense) and $m=10^4$ (sparse), so for sparse data it dominates quickly, which is why selective reorthogonalisation is used.

### E3 (randomized SVD)

> **Question.** $A\in\mathbb R^{n\times d}$, rank $k$, oversampling $p$, $q$ power iterations: draw $\Omega\in\mathbb R^{d\times(k+p)}$ i.i.d. $N(0,1)$; $Y\leftarrow A\Omega$; repeat $q$ times $Y\leftarrow A(A^TY)$; $Y=QR$ ($Q\in\mathbb R^{n\times(k+p)}$); $B\leftarrow Q^TA$; exact SVD $B=\hat U\Sigma V^T$; $U\leftarrow Q\hat U$; return top-$k$ columns. A *pass* is one product of $A$ or $A^T$ with a block of vectors.
> (a) Number of passes as a function of $q$; evaluate at $q=0,1,2$. Number of passes of $m$ Lanczos steps on $A^TA$ (one vector per step) at $m=43$.
> (b) Given ($p\ge2$, $q=0$): $E\|(I-QQ^T)A\|_F\le\left(1+\frac k{p-1}\right)^{1/2}\left(\sum_{j>k}\sigma_j^2\right)^{1/2}$. Find the factor for $k=10$, $p=2,5,10$ and how the number of passes depends on $p$.
> (c) Before truncation find $U^TU$ and $U\Sigma V^T$ in terms of $Q,A$. Using Eckart–Young, find a lower bound on $\|(I-QQ^T)A\|_2$.
> (d) Find the singular values of $(AA^T)^qA$ in terms of those of $A$, and the ratio $\sigma_{k+1}/\sigma_k$ of the sketched matrix when it is $0.9$ for $A$, at $q=0,1,2$.
> (e) $k=10$, $p=10$, $q=2$, Lanczos $m=43$; a product of $A$ or $A^T$ with one vector costs $2\,\mathrm{nnz}(A)$ flops. Find (i) the flops of each method for a sparse $10^6\times10^5$ matrix with $\mathrm{nnz}=10^8$; (ii) the bytes read from disk by each method for a dense $10^7\times10^4$ float64 matrix streamed once per pass.

**Solution.**
- **Step 1. (a) Count products with $A$ or $A^T$ on blocks.** $Y=A\Omega$: 1. Each power iteration $A(A^TY)$: 2. $B=Q^TA$ (i.e. $A^TQ$): 1. The QR and small SVD do not touch $A$. Total passes $=2q+2$.
  $q=0$: **2**; $q=1$: **4**; $q=2$: **6**.
- **Step 2. Lanczos.** Each step computes $A^T(Aq_j)$: 2 passes. $m=43$: $2m=$ **86** passes.
- **Step 3. (b) Factor** $\sqrt{1+\frac{10}{p-1}}$: $p=2$: $\sqrt{11}=3.32$; $p=5$: $\sqrt{3.5}=1.87$; $p=10$: $\sqrt{2.11}=1.45$. Passes with $q=0$ stay at **2** for every $p$: $p$ only makes the block wider (more flops per pass), not more passes.
- **Step 4. (c)** $\hat U$ has orthonormal columns ($(k+p)\times(k+p)$) and $Q$ has orthonormal columns:
$$U^TU=\hat U^TQ^TQ\hat U=\hat U^T\hat U=I,\qquad U\Sigma V^T=Q\hat U\Sigma V^T=QB=QQ^TA$$
- **Step 5.** $QQ^TA$ has rank $\le k+p$. E–Y: $\|A-QQ^TA\|_2\ge\sigma_{k+p+1}(A)$.
- **Step 6. (d)** $A=U\Sigma V^T\Rightarrow AA^T=U\Sigma^2U^T$, so $(AA^T)^qA=U\Sigma^{2q+1}V^T$. Singular values $\sigma_i^{2q+1}$. Ratio becomes $(\sigma_{k+1}/\sigma_k)^{2q+1}$: $q=0$: $0.9$; $q=1$: $0.9^3=0.729$; $q=2$: $0.9^5=0.590$.
- **Step 7. (e)(i) Flops.** Randomized: $6$ passes $\times\ (k+p)=20$ vectors $=120$ products. $120\times2\times10^8=2.4\times10^{10}$. Lanczos: $86$ products. $86\times2\times10^8=1.72\times10^{10}$.
- **Step 8. (ii) Bytes.** One pass over the dense matrix reads $10^7\cdot10^4\cdot8=8\times10^{11}$ B $=800$ GB. Randomized: $6\times800$ GB $=4.8$ TB. Lanczos: $86\times800$ GB $=68.8$ TB.

> [!success] Answer
> (a) $2q+2$ passes: $2,4,6$. Lanczos: $2m=86$. (b) Factors $3.32,1.87,1.45$; passes independent of $p$. (c) $U^TU=I$; $U\Sigma V^T=QQ^TA$; $\|(I-QQ^T)A\|_2\ge\sigma_{k+p+1}(A)$. (d) $\sigma_i^{2q+1}$; ratios $0.9,0.729,0.590$. (e) Flops: randomized $2.4\times10^{10}$, Lanczos $1.72\times10^{10}$. Bytes: randomized $4.8$ TB, Lanczos $68.8$ TB. Randomized SVD wins when **passes** are the scarce resource (data on disk): $6$ vs $86$ passes.

### E4 (comparing the four methods)

> **Question.** For $A\in\mathbb R^{n\times d}$ and $k$ singular vectors: deflation runs $t$ power iterations per vector (the $i$-th projecting out the $i$ found vectors); block iteration runs $t'$ steps on a $d\times k$ block; Lanczos runs $m$ steps (the $j$-th reorthogonalising against $j$ earlier vectors); randomized SVD uses oversampling $p$ and $q$ power iterations. Costs: deflation $O(ndkt)$; block $O(ndkt')+O(dk^2t')$; Lanczos $O(ndm)+O(dm^2)$; randomized $O(ndkq)$, $q=O(1)$ passes. An *application* is a product of $A$ or $A^T$ with one vector ($2nd$ flops); a *pass* is one product with a block.
> (a) Find the number of applications of each method in terms of $k,t,t',m,p,q$, and which of $t,t',m,q$ depend on the spectrum.
> (b) $n=10^6$, $d=10^4$, $k=10$, $\sigma_2/\sigma_1=0.95$ (gap $=0.05$), tol $=10^{-6}$, $p=10$, $q=2$, $t=t'=\left\lceil\frac{\ln(1/\text{tol})}{2\ln(\sigma_1/\sigma_2)}\right\rceil$, $m=\left\lceil\frac{\ln(2/\text{tol})}{2\sqrt{\text{gap}}}\right\rceil+k$. Find applications, flops and passes of each.
> (c) Find $t$, $m$ and the pass count of randomized SVD at $\sigma_2/\sigma_1=0.995$ (gap $0.005$) and each as a multiple of its value in (b).

**Solution.**
- **Step 1. (a) Applications.** Each $x\leftarrow A^T(Ax)$ is two applications.

| method | applications | depends on spectrum? |
|---|---|---|
| Deflation | $2kt$ | $t$: yes ($\propto1/\text{gap}$) |
| Block iteration | $2kt'$ | $t'$: yes ($\propto1/\text{gap}$) |
| Lanczos | $2m$ | $m$: yes ($\propto1/\sqrt{\text{gap}}$) |
| Randomized SVD | $(2q+2)(k+p)$ | $q$ and $p$ are chosen by you ($q=O(1)$); the spectrum affects the accuracy, not the count |

- **Step 2. (b) Numbers.** $t=t'=\left\lceil\frac{13.816}{2\times0.05129}\right\rceil=135$. $\ m=\left\lceil\frac{14.509}{2\times0.2236}\right\rceil+10=33+10=43$. One application $=2nd=2\times10^{10}$ flops.

| method | applications | flops | passes |
|---|---|---|---|
| Deflation | $2\cdot10\cdot135=2700$ | $5.4\times10^{13}$ | $2700$ (one vector per pass) |
| Block | $2700$ | $5.4\times10^{13}$ (+QR $\approx10^8$, negligible) | $2t'=270$ |
| Lanczos | $2\cdot43=86$ | $1.72\times10^{12}$ | $86$ |
| Randomized | $6\cdot20=120$ | $2.4\times10^{12}$ | $6$ |

- **Step 3. (c) Gap $0.005$.** $t=\left\lceil\frac{13.816}{2\times0.0050125}\right\rceil=1379$ ($\approx10.2\times$ the 135). $m=\left\lceil\frac{14.509}{2\times0.0707}\right\rceil+10=103+10=113$ ($\approx2.6\times$ the 43; the $\sqrt{\ }$ gives $\approx3.2\times$ on the main term). Randomized passes stay at $6$ ($1\times$), but its accuracy gets worse unless you raise $q$.

> [!success] Answer
> Deflation and block iteration both need $2kt$ applications (the block version needs far fewer passes: 270 vs 2700). Lanczos needs only $2m=86$ applications, randomized SVD $120$ applications in just $6$ passes. A $10\times$ smaller gap multiplies $t$ by $\approx10$ and $m$ by $\approx\sqrt{10}$, but leaves the randomized pass count unchanged.

## Section F: The random start and the stopping rule

### F1 (random start)

> **Question.** $B=A^TA=\sum\sigma_i^2v_iv_i^T$, $\sigma_1>\sigma_2$, power method from a random unit $x\in\mathbb R^d$.
> (a) Find the density $f(s)$ of the first coordinate $x_1$ (up to normalising constant) for $x$ uniform in the ball $B^d$ and for $x$ uniform on the sphere $S^{d-1}$. For each find $\lim_{d\to\infty}f(t/\sqrt d)/f(0)$.
> (b) Take $f(s)\approx\sqrt{\frac{d-1}{2\pi}}e^{-(d-1)s^2/2}$ for $s=x^Tv_1$ and $\varepsilon=\frac1{20\sqrt d}$. Find an upper bound on the exponent $(d-1)\varepsilon^2/2$ and $\lim_{d\to\infty}\Pr[\lvert x^Tv_1\rvert\le\varepsilon]$ using $\Pr\approx2\varepsilon f(0)$.
> (c) Find $\left(E[(x^Tv_1)^2]\right)^{1/2}$ for $x$ uniform on $S^{d-1}$, and its ratio to the $\varepsilon$ of (b).
> (d) For the fixed threshold $\varepsilon=0.01$ find the exponent $(d-1)\varepsilon^2/2$ and $\Pr[\lvert x^Tv_1\rvert\le0.01]$ at $d=100$ and $d=10^4$, and the limit as $d\to\infty$.
> (e) With $c_1=x^Tv_1$ and the bound $\tan\angle(B^tx,v_1)\le\lvert c_1\rvert^{-1}(\sigma_2/\sigma_1)^{2t}$, find the smallest $t$ guaranteeing $\tan\angle\le\delta$. Find the extra iterations caused by $\lvert c_1\rvert=\frac1{\sqrt d}$, and evaluate at $d=10^4$, $\sigma_2/\sigma_1=0.9$.

**Solution.**
- **Step 1. (a) Ball.** The cross-section of $B^d$ at height $s$ is a $(d-1)$-ball of radius $\sqrt{1-s^2}$, with volume $\propto(1-s^2)^{(d-1)/2}$ (W2 §2.5). So $f(s)\propto(1-s^2)^{(d-1)/2}$.
- **Step 2. Sphere.** ⚠ (The sphere version is not in your notes.) The cross-section is a $(d-2)$-sphere of radius $\sqrt{1-s^2}$, with area $\propto(1-s^2)^{(d-2)/2}$, and the surface tilts, which adds a factor $(1-s^2)^{-1/2}$. So $f(s)\propto(1-s^2)^{(d-3)/2}$.
- **Step 3. Limit.** $\frac{f(t/\sqrt d)}{f(0)}=\left(1-\frac{t^2}d\right)^{(d-1)/2\ \text{or}\ (d-3)/2}\to e^{-t^2/2}$ in both cases: a Gaussian with $s\sim\frac1{\sqrt d}$.
- **Step 4. (b) Exponent.** $\frac{(d-1)\varepsilon^2}2=\frac{d-1}{800d}<\frac1{800}$, so $e^{-\text{exponent}}\approx1$ (the density is flat on the window).
- **Step 5. Probability.**
$$\Pr\approx2\varepsilon f(0)=2\cdot\frac1{20\sqrt d}\sqrt{\frac{d-1}{2\pi}}\xrightarrow{d\to\infty}\frac1{10\sqrt{2\pi}}=0.0399\approx4\%$$
- **Step 6. (c)** $E[x_1^2]=\frac1d$ (coordinate budget), so $\left(E[(x^Tv_1)^2]\right)^{1/2}=\frac1{\sqrt d}$. Ratio to $\varepsilon$: $\frac{1/\sqrt d}{1/(20\sqrt d)}=20$.
- **Step 7. (d) Fixed $\varepsilon=0.01$.**
  - $d=100$: exponent $\frac{99\times10^{-4}}2=0.005$. $\Pr\approx2\varepsilon f(0)=0.02\sqrt{\frac{99}{2\pi}}=0.079$.
  - $d=10^4$: exponent $\approx0.5$ (not small, so the flat approximation overestimates: $2\varepsilon f(0)=0.80$). The Gaussian gives $\Pr=2\Phi(\varepsilon\sqrt{d-1})-1=2\Phi(1)-1=0.683$.
  - $d\to\infty$: $\varepsilon\sqrt{d-1}\to\infty$, so $\Pr\to1$.
- **Step 8. (e)** Need $\lvert c_1\rvert^{-1}(\sigma_2/\sigma_1)^{2t}\le\delta\iff t\ge\frac{\ln\frac1{\lvert c_1\rvert\delta}}{2\ln(\sigma_1/\sigma_2)}$.
- **Step 9. Extra iterations** (vs $\lvert c_1\rvert=1$): $\Delta t=\frac{\ln(1/\lvert c_1\rvert)}{2\ln(\sigma_1/\sigma_2)}$. With $\lvert c_1\rvert=\frac1{\sqrt d}$: $\Delta t=\frac{\ln d}{4\ln(\sigma_1/\sigma_2)}$. At $d=10^4$, ratio $0.9$: $\frac{9.21}{4\times0.10536}=21.9\approx22$.

> [!success] Answer
> (a) Ball $f\propto(1-s^2)^{(d-1)/2}$; sphere $f\propto(1-s^2)^{(d-3)/2}$; both $\to e^{-t^2/2}$. (b) Exponent $<\frac1{800}$; $\Pr\to\frac1{10\sqrt{2\pi}}\approx0.04$ (a 4% chance of a bad start, independent of $d$). (c) $\frac1{\sqrt d}$, ratio $20$. (d) $d=100$: exponent $0.005$, $\Pr\approx0.079$. $d=10^4$: exponent $\approx0.5$, $\Pr\approx0.68$. Limit $1$. A **fixed** threshold is not dimension-free, you must scale $\varepsilon\propto\frac1{\sqrt d}$. (e) $t\ge\frac{\ln(1/(\lvert c_1\rvert\delta))}{2\ln(\sigma_1/\sigma_2)}$; random start costs only $\frac{\ln d}{4\ln(\sigma_1/\sigma_2)}\approx22$ extra iterations at $d=10^4$.

### F2 (stopping rule)

> **Question.** The power method iterates $x\leftarrow\frac{Bx}{\|Bx\|}$ and stops when $1-\lvert x^Tx_{old}\rvert<\varepsilon$ for $k$ consecutive iterations (the patience).
> (a) $\theta$ is the angle between successive unit iterates. Find $1-\lvert x^Tx_{old}\rvert$ to leading order in $\theta$, and the angle tolerance for $\varepsilon=10^{-8}$.
> (b) For $B=A^TA$ find the sign of $x^Tx_{old}$. For $B=\mathrm{diag}(-4,1)$ find $\lim_{t\to\infty}(1-x_t^Tx_{t-1})$ (without the absolute value) from any start with $x_0^Te_1\ne0$.
> (c) $B=\mathrm{diag}(4,1)$, $x_0\propto(10^{-6},1)$, $\varepsilon=10^{-8}$. Find $1-\lvert x_t^Tx_{t-1}\rvert$ and $\angle(x_t,e_1)$ for $t=1,2,3,4$, and the smallest patience $k$ for which the test does not fire at any $t\le4$.
> (d) $\sigma_1=\sigma_2>\sigma_3$, $x_0=w_0+\sum_{i\ge3}c_iv_i$ with $0\ne w_0\in\mathrm{span}\{v_1,v_2\}$. Find $\lim x_t$, $\lim(1-\lvert x_t^Tx_{t-1}\rvert)$, $\lim\|Ax_t\|^2$.

**Solution.**
- **Step 1. (a)** $x^Tx_{old}=\cos\theta\approx1-\frac{\theta^2}2$, so $1-\lvert x^Tx_{old}\rvert\approx\frac{\theta^2}2$ (L5 §6). For $\varepsilon=10^{-8}$: $\theta=\sqrt{2\varepsilon}=1.41\times10^{-4}$ rad.
- **Step 2. (b) $B=A^TA$ is positive semidefinite.** $x^Tx_{old}=\frac{x_{old}^TBx_{old}}{\|Bx_{old}\|}\ge0$.
- **Step 3. $B=\mathrm{diag}(-4,1)$.** Dominant eigenvalue $-4$ (largest magnitude), so $x_t\approx(-1)^te_1$ (flips sign each step): $x_t^Tx_{t-1}\to-1$, so $1-x_t^Tx_{t-1}\to2$. The test without absolute value never fires, which is why the rule uses $\lvert x^Tx_{old}\rvert$.
- **Step 4. (c)** $x_t\propto(4^t\cdot10^{-6},\ 1)$. The angle from $e_2$ is $\psi_t=\arctan(4^t10^{-6})\approx4^t\times10^{-6}$: $\psi_0=10^{-6}$, $\psi_1=4\times10^{-6}$, $\psi_2=1.6\times10^{-5}$, $\psi_3=6.4\times10^{-5}$, $\psi_4=2.56\times10^{-4}$. Step angle $\theta_t=\psi_t-\psi_{t-1}$.

| $t$ | $\theta_t$ | $1-\lvert x_t^Tx_{t-1}\rvert\approx\theta_t^2/2$ | $<10^{-8}$? | $\angle(x_t,e_1)=90^\circ-\psi_t$ |
|---|---|---|---|---|
| 1 | $3\times10^{-6}$ | $4.5\times10^{-12}$ | yes | $89.9998^\circ$ |
| 2 | $1.2\times10^{-5}$ | $7.2\times10^{-11}$ | yes | $89.9991^\circ$ |
| 3 | $4.8\times10^{-5}$ | $1.15\times10^{-9}$ | yes | $89.9963^\circ$ |
| 4 | $1.92\times10^{-4}$ | $1.84\times10^{-8}$ | **no** | $89.9853^\circ$ |

- **Step 5. Patience.** Iterations $1,2,3$ are all below $\varepsilon$ (counter $=3$), then $t=4$ resets it. Patience $3$ would stop at $t=3$ (wrongly). Patience $4$ never fires for $t\le4$.
- **Step 6. (d)** $B^tx_0/\sigma_1^{2t}\to w_0$ (the $v_i$, $i\ge3$ parts vanish). So $x_t\to\frac{w_0}{\|w_0\|}$. The iterates stop moving: $1-\lvert x_t^Tx_{t-1}\rvert\to0$. $\|Ax_t\|^2=x_t^TBx_t\to\sigma_1^2$ ($=\sigma_2^2$).

> [!success] Answer
> (a) $\frac{\theta^2}2$; $\theta=\sqrt{2\varepsilon}\approx1.4\times10^{-4}$ rad. (b) Positive semidefinite $\Rightarrow x^Tx_{old}\ge0$. For $\mathrm{diag}(-4,1)$ the limit is $2$ (sign flips every step; so use $\lvert\cdot\rvert$). (c) Values in the table; smallest patience $k=4$. Warning: the iterates are still $\approx90^\circ$ away from $e_1$ when the test first fires, the rule measures step size, not distance to the limit. (d) $\lim x_t=\frac{w_0}{\|w_0\|}$ (start-dependent), $\lim(1-\lvert x_t^Tx_{t-1}\rvert)=0$, $\lim\|Ax_t\|^2=\sigma_1^2$.

## Section G: PCA in practice

### G1 (implicit centring)

> **Question.** $A\in\mathbb R^{n\times d}$ sparse with $\mathrm{nnz}(A)$ non-zeros, column means $\bar a$, $\tilde A=A-\mathbf1\bar a^T$.
> (a) $d_+=\#\{j:\bar a_j\ne0\}$; suppose $a_{ij}\ne\bar a_j$ for all $i,j$. Find $\mathrm{nnz}(\tilde A)$, and the density of $A$ and $\tilde A$ for non-negative $A$ with no empty column, $n=10^6$, $d=10^4$, $\mathrm{nnz}(A)=10^8$.
> (b) Find $\tilde Ax$ and $\tilde A^Ty$ in terms of $A,\bar a,\mathbf1$ and the cost of each.
> (c) CSR stores a sparse $n\times d$ matrix as non-zero values, column index of each, and $n+1$ row pointers. For the matrix in (a) find the storage of $A$ in CSR (float64 values, int32 indices and pointers) and of $\tilde A$ dense in float64.
> (d) Term–document matrix with rows $a_1=(1,1,0,0)$, $a_2=(0,0,1,1)$, $a_3=(1,0,1,0)$, $a_4=(0,1,0,1)$. Find $\cos(a_1,a_2)$ and $\cos(a_1,a_3)$, $\cos(u,v)=\frac{u^Tv}{\|u\|\|v\|}$, and the same for the rows of $\tilde A$.

**Solution.**
- **Step 1. (a)** Entry $\tilde a_{ij}=a_{ij}-\bar a_j$. In a column with $\bar a_j\ne0$, every entry $a_{ij}-\bar a_j$ is non-zero (by assumption), so the column becomes fully dense ($n$ entries). Columns with $\bar a_j=0$ are unchanged (for non-negative $A$ these are empty columns). So
$$\mathrm{nnz}(\tilde A)=n\,d_++(\text{non-zeros in columns with }\bar a_j=0)$$
- **Step 2. Numbers.** Non-negative $A$, no empty column $\Rightarrow\bar a_j>0$ for all $j$, so $d_+=d$ and $\mathrm{nnz}(\tilde A)=nd=10^{10}$. Density of $A$: $\frac{10^8}{10^{10}}=1\%$. Density of $\tilde A$: $100\%$.
- **Step 3. (b)**
$$\tilde Ax=Ax-\mathbf1(\bar a^Tx),\qquad\tilde A^Ty=A^Ty-\bar a(\mathbf1^Ty)$$
Cost of $\tilde Ax$: $Ax$ is $O(\mathrm{nnz}(A))$, $\bar a^Tx$ is $O(d)$, subtracting a scalar from $n$ entries is $O(n)$: total $O(\mathrm{nnz}(A)+n+d)$. Same for $\tilde A^Ty$. (L5 §12: never densify.) Dense $\tilde A$ would cost $O(nd)$.
- **Step 4. (c) CSR.** Values: $10^8\times8=8\times10^8$ B. Column indices: $10^8\times4=4\times10^8$ B. Row pointers: $(10^6+1)\times4\approx4\times10^6$ B. Total $\approx1.2\times10^9$ B $=1.2$ GB. Dense $\tilde A$: $10^{10}\times8=8\times10^{10}$ B $=80$ GB. Ratio $\approx66\times$.
- **Step 5. (d) Raw.** $\cos(a_1,a_2)=\frac0{\sqrt2\sqrt2}=0$. $\cos(a_1,a_3)=\frac1{\sqrt2\sqrt2}=\frac12$.
- **Step 6. Centre.** Column means $\bar a=(0.5,0.5,0.5,0.5)$. $\tilde a_1=(.5,.5,-.5,-.5)$, $\tilde a_2=-\tilde a_1$, $\tilde a_3=(.5,-.5,.5,-.5)$, $\tilde a_4=-\tilde a_3$, all of norm $1$.
- **Step 7.** $\cos(\tilde a_1,\tilde a_2)=-1$. $\cos(\tilde a_1,\tilde a_3)=.25-.25-.25+.25=0$.

> [!success] Answer
> (a) $\mathrm{nnz}(\tilde A)=nd_+$ (plus non-zeros in zero-mean columns); densities $1\%$ and $100\%$ ($10^{10}$ entries). (b) $\tilde Ax=Ax-\mathbf1(\bar a^Tx)$, $\tilde A^Ty=A^Ty-\bar a(\mathbf1^Ty)$, cost $O(\mathrm{nnz}(A)+n+d)$. (c) CSR $\approx1.2$ GB vs $80$ GB dense. (d) Raw: $0$ and $\frac12$. Centred: $-1$ and $0$. Centring changes the similarities completely.

### G2 (choosing $k$)

> **Question.** The fraction of variance explained by the top $k$ components is $\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}$.
> (a) For $(\sigma_i^2)=(50,30,12,5,3)$ find the fraction for $k=1..5$ and the smallest $k$ reaching 90%.
> (b) For $(\sigma_i^2)=(100,95,40,38,36,5,4,3,2,1)$ find the two indices $i$ with the largest ratios $\frac{\sigma_i^2}{\sigma_{i+1}^2}$, and the fraction explained at $k$ equal to each.
> (c) $A=L+E$, $n\times n$, $E$ i.i.d. $N(0,\sigma^2)$. Given: Gavish–Donoho threshold $\tau^\star\approx2.858\sigma\sqrt n$ and the singular values of $E$ lie below $\approx2\sigma\sqrt n$. For $n=1000$, $\sigma=0.1$ and $L$ with singular values $(200,150,100,60,30)$, find $\tau^\star$, $2\sigma\sqrt n$, and the number of singular values of $A$ above $\tau^\star$.
> (d) For the same $A$, with $\|E\|_F^2\approx n^2\sigma^2$, find the signal energy, noise energy, the fraction of total energy in the five signal components. Find the energy the 90% rule must take from noise directions, and a lower bound on the number of noise directions it keeps, using $\sigma_i(E)^2\le(2\sigma\sqrt n)^2$.
> (e) $A_{ij}\sim\mathrm{Poisson}(\mu_{ij})$ independently. Find $\mathrm{Var}(A_{ij}-\mu_{ij})$ and the ratio of the largest to smallest noise variance when $\mu_{ij}\in[0.1,10]$.

**Solution.**
- **Step 1. (a)** Total $=100$. Cumulative: $k=1$: $50\%$; $k=2$: $80\%$; $k=3$: $92\%$; $k=4$: $97\%$; $k=5$: $100\%$. Smallest $k$ for $90\%$: **3**.
- **Step 2. (b) Ratios:** $\frac{100}{95}=1.05$; $\frac{95}{40}=2.38$; $\frac{40}{38}=1.05$; $\frac{38}{36}=1.06$; $\frac{36}{5}=7.2$; $\frac54=1.25$; $\frac43=1.33$; $\frac32=1.5$; $\frac21=2$. Largest: $i=5$ (7.2) and $i=2$ (2.38).
- **Step 3. Fractions.** Total $=324$. $k=5$: $\frac{309}{324}=95.4\%$. $k=2$: $\frac{195}{324}=60.2\%$. The elbow is at $k=5$.
- **Step 4. (c)** $\sigma\sqrt n=0.1\times31.62=3.162$. $\tau^\star=2.858\times3.162=9.04$. $2\sigma\sqrt n=6.32$. Signal singular values $200,150,100,60,30$ are all $>9.04$ (noise adds only $\lesssim6.3$): **5** above $\tau^\star$. (The notes' known-$\sigma$ form $\frac4{\sqrt3}\sqrt n\sigma=7.30$ gives the same count.)
- **Step 5. (d)** Signal energy $=200^2+150^2+100^2+60^2+30^2=40000+22500+10000+3600+900=77000$. Noise energy $\approx n^2\sigma^2=10^6\times0.01=10^4$. Total $\approx87000$. Signal fraction $=\frac{77000}{87000}=88.5\%$.
- **Step 6. 90% rule.** Needs $0.9\times87000=78300$ energy. Signal gives $77000$, so it must take $\ge1300$ from noise.
- **Step 7.** Each noise direction has energy $\le(2\sigma\sqrt n)^2=40$. So it keeps at least $\frac{1300}{40}=32.5\Rightarrow\ge33$ noise directions.
- **Step 8. (e)** Poisson variance equals the mean: $\mathrm{Var}(A_{ij}-\mu_{ij})=\mu_{ij}$. Ratio $\frac{10}{0.1}=100$.

> [!success] Answer
> (a) $50,80,92,97,100\%$; $k=3$. (b) Largest ratios at $i=5$ ($7.2$, fraction $95.4\%$) and $i=2$ ($2.38$, fraction $60.2\%$). (c) $\tau^\star=9.04$, $2\sigma\sqrt n=6.32$, $5$ values above. (d) Signal $77000$, noise $10^4$, fraction $88.5\%$; the 90% rule takes $\ge1300$ from noise, so keeps $\ge33$ noise directions. (e) $\mu_{ij}$; ratio $100$. Noise variance is not constant, so the i.i.d.-noise assumption fails.

### G3 (PCA vs classification)

> **Question.** Two equally likely classes in $\mathbb R^2$. Given the class, $x_1$ and $x_2$ are independent; $x_1$ has the same distribution in both classes, variance $s_1^2$; $x_2$ has variance $s_2^2$ about the class mean, which is $+\Delta/2$ in class 1 and $-\Delta/2$ in class 2.
> (a) Find the covariance matrix of $x$ and the condition on $s_1,s_2,\Delta$ under which the first principal component is $v_1=e_1$.
> (b) Find the accuracy of any classifier that sees only $e_1^Tx$.
> (c) $x_1\sim\mathrm{Unif}[-2,2]$ in both classes, $x_2\sim\mathrm{Unif}[0.2,1.4]$ in class 1 and $\mathrm{Unif}[-1.4,-0.2]$ in class 2. Find $s_1^2,s_2^2,\Delta,\mathrm{Var}(x_1),\mathrm{Var}(x_2)$ and the accuracy of the rule "class 1 iff $x_2>0$".
> (d) Find Fisher's LDA direction $w\propto\Sigma_w^{-1}(\mu_1-\mu_2)$, $\Sigma_w$ the within-class covariance, $\mu_c$ the class means.

**Solution.**
- **Step 1. (a)** $\mathrm{Var}(x_1)=s_1^2$. $\mathrm{Var}(x_2)=$ within $+$ between $=s_2^2+\left(\frac\Delta2\right)^2$ (class means $\pm\frac\Delta2$). $\mathrm{Cov}(x_1,x_2)=E[x_1x_2]-E[x_1]E[x_2]$: given the class they are independent, and $E[x_2]=0$ overall, so $E[x_1x_2]=E[x_1]\cdot E[x_2]=0$: covariance $0$.
$$\Sigma=\begin{pmatrix}s_1^2&0\\0&s_2^2+\Delta^2/4\end{pmatrix}$$
$v_1=e_1$ iff $s_1^2>s_2^2+\frac{\Delta^2}4$.
- **Step 2. (b)** $x_1$ has the same distribution in both classes, so it carries no information about the class: accuracy $=\frac12$ (chance).
- **Step 3. (c)** $\mathrm{Unif}[a,b]$ has variance $\frac{(b-a)^2}{12}$. $s_1^2=\frac{4^2}{12}=\frac43$. $x_2$ in class 1 has width $1.2$: $s_2^2=\frac{1.44}{12}=0.12$. Class means $\pm0.8$, so $\Delta=1.6$. $\mathrm{Var}(x_1)=\frac43=1.333$. $\mathrm{Var}(x_2)=0.12+\frac{1.6^2}4=0.12+0.64=0.76$.
- **Step 4. Rule.** Class 1 has $x_2\in[0.2,1.4]>0$; class 2 has $x_2\in[-1.4,-0.2]<0$. Accuracy $=100\%$.
- **Step 5. (d)** $\Sigma_w=\mathrm{diag}(s_1^2,s_2^2)$. $\mu_1-\mu_2=(0,\Delta)$ ($x_1$ means are equal). $w\propto\mathrm{diag}\left(\frac1{s_1^2},\frac1{s_2^2}\right)(0,\Delta)=\left(0,\frac\Delta{s_2^2}\right)\propto e_2$.

> [!success] Answer
> (a) $\Sigma=\mathrm{diag}(s_1^2,\ s_2^2+\Delta^2/4)$; $v_1=e_1$ iff $s_1^2>s_2^2+\Delta^2/4$. (b) $50\%$. (c) $s_1^2=\frac43$, $s_2^2=0.12$, $\Delta=1.6$, $\mathrm{Var}(x_1)=1.333$, $\mathrm{Var}(x_2)=0.76$; the rule is $100\%$ accurate. (d) $w\propto e_2$. Lesson: PCA picks the direction of **largest variance** ($e_1$ here, useless for classifying) while LDA picks the **class-separating** direction ($e_2$). PCA does not know the labels.

## Section H: Case study, LoRA

### H1 (parameter counts)

> **Question.** $W_0\in\mathbb R^{d\times d}$; full fine-tuning updates $d^2$ entries; LoRA freezes $W_0$ and trains $B\in\mathbb R^{d\times r}$, $A\in\mathbb R^{r\times d}$, computing $W_0x+\frac\alpha rBAx$. A transformer has $L$ layers; each layer's attention has four matrices $W_Q,W_K,W_V,W_O\in\mathbb R^{d\times d}$, LoRA on each (one $(B,A)$ pair per matrix); count only these matrices.
> (a) Trainable parameters $2dr$ and $d^2$ for $d=4096$, $r=8$, and their ratio. (b) The largest $r$ for which LoRA trains fewer parameters than full fine-tuning, in terms of $d$. (c) $L=32$, $d=4096$: total trainable attention parameters under full fine-tuning and under LoRA with $r=8$. (d) float32 weights and gradients and two float32 Adam moments per trainable parameter: find the memory for parameters, gradients and Adam moments in both settings of (c), and the saving from each.

**Solution.**
- **Step 1. (a)** LoRA: $2dr=2\times4096\times8=65536$. Full: $d^2=16\,777\,216$. Ratio $\frac{d^2}{2dr}=\frac d{2r}=256$.
- **Step 2. (b)** $2dr<d^2\iff r<\frac d2$. Largest integer $r=\frac d2-1=2047$ for $d=4096$ ($r=\frac d2$ gives equal).
- **Step 3. (c)** Number of matrices $=4L=128$. Full: $128\times d^2=2\,147\,483\,648\approx2.15\times10^9$. LoRA: $128\times65536=8\,388\,608\approx8.39\times10^6$.
- **Step 4. (d) Bytes per trainable parameter:** weight $4$ + gradient $4$ + two Adam moments $8$ $=16$ B.
  - Full: $2.147\times10^9\times16=34.4$ GB (weights $8.59$, gradients $8.59$, Adam $17.2$ GB).
  - LoRA (trainable only): $8.39\times10^6\times16=134$ MB (adapter weights $33.6$ MB, gradients $33.6$ MB, Adam $67.1$ MB).
- **Step 5. Frozen weights.** LoRA still has to store the frozen $W_0$ for the forward pass: $2.147\times10^9\times4=8.59$ GB. So the LoRA total $=8.59+0.134=8.72$ GB.
- **Step 6. Savings.** Gradients and Adam moments: $256\times$ smaller (they exist only for the adapters). Weights: no saving (the frozen $W_0$ is still stored, plus $0.4\%$ for the adapters). Overall: $\frac{34.4}{8.72}\approx3.9\times$ (about $25.6$ GB saved).

> [!success] Answer
> (a) $65536$ vs $16\,777\,216$, ratio $256$. (b) $r<\frac d2$ (largest integer $2047$). (c) Full $2.15\times10^9$ ($2^{31}$), LoRA $8.39\times10^6$ ($2^{23}$). (d) Full: $34.4$ GB. LoRA: $134$ MB for trainable state ($256\times$ less) $+8.59$ GB frozen weights $=8.72$ GB, about $3.9\times$ smaller overall. The saving comes from the gradients and optimiser state.

### H2 (Eckart–Young view of LoRA; PDF solution reformatted)

> **Question.** LoRA freezes $W_0\in\mathbb R^{d\times d}$ and trains $B\in\mathbb R^{d\times r}$, $A\in\mathbb R^{r\times d}$, $r\ll d$; adapted weight $W_0+\frac\alpha rBA$. Given: the best rank-$r$ approximation $(W_0)_r$ in Frobenius norm is the truncated SVD.
> (a) Find $\frac{\|W_0-(W_0)_r\|_F^2}{\|W_0\|_F^2}$ in terms of singular values, and evaluate for a flat spectrum $\sigma_i(W_0)=\sigma$ at $r=8$, $d=4096$. For $W_0=I_d$ and $\Delta W=e_1e_1^T$ find $\mathrm{rank}(\Delta W)$ and $\mathrm{rank}(W_0+\Delta W)$.
> (b) Given $\mathrm{rank}(X+Y)\le\mathrm{rank}X+\mathrm{rank}Y$, for $W_0$ of rank $\rho$ find lower and upper bounds on $\mathrm{rank}(W_0+BA)$ in terms of $\rho$ and $r$.
> (c) Training minimises a scalar loss $L(W)$ by gradient steps on $A,B$ only. $G_{il}=\frac{\partial L}{\partial W_{il}}$ at $W=W_0+\frac\alpha rBA$; $\frac{\partial L}{\partial A_{kj}}=\sum_{i,l}G_{il}\frac{\partial W_{il}}{\partial A_{kj}}$, likewise for $B$. Find $\frac{\partial L}{\partial A}$ and $\frac{\partial L}{\partial B}$ in terms of $G,A,B$. Each of $A,B$ is initialised to $0$ or at random. Find the initialisations for which $\Delta W=\frac\alpha rBA=0$ at step 0 while $\frac{\partial L}{\partial A}$ or $\frac{\partial L}{\partial B}$ is non-zero. For each such $(A_0,B_0)$ find $A_1,B_1$ after one gradient step with learning rate $\eta$, and $\Delta W_1$.
> (d) For $M\in\mathbb R^{d\times d}$ of rank $s\le r$ with SVD $U_s\Sigma_sV_s^T$ find $B,A$ with $BA=M$, and the largest rank of $BA$ over all $B,A$.

**Solution.**
- **Step 1. (a) Truncation error.** $W_0-(W_0)_r=\sum_{i>r}\sigma_iu_iv_i^T$. For a sum over an index set $I$: $\left\|\sum_{i\in I}\sigma_iu_iv_i^T\right\|_F^2=\sum_{i\in I}\sigma_i^2$. So
$$\frac{\|W_0-(W_0)_r\|_F^2}{\|W_0\|_F^2}=\frac{\sum_{i>r}\sigma_i^2}{\sum_i\sigma_i^2}$$
- **Step 2. Flat spectrum.** $\frac{(d-r)\sigma^2}{d\sigma^2}=1-\frac rd=1-\frac8{4096}=99.8\%$.
- **Step 3. Rank of a sum.** $e_1e_1^T$ has one non-zero entry, rank $1$. $I_d+e_1e_1^T=\mathrm{diag}(2,1,\dots,1)$ is invertible, rank $d$.
- **Step 4. (b) $\mathrm{rank}(BA)\le r$:** every column of $BA$ is $B\times(\text{a column of }A)$, so lies in the column space of $B$, which has $\le r$ columns.
- **Step 5. Upper bound.** $\mathrm{rank}(W_0+BA)\le\rho+r$.
- **Step 6. Lower bound.** $W_0=(W_0+BA)+(-BA)$, so $\rho\le\mathrm{rank}(W_0+BA)+r$, i.e. $\mathrm{rank}(W_0+BA)\ge\rho-r$.
- **Step 7. (c) Gradients.** Let $c=\frac\alpha r$. $W_{il}=(W_0)_{il}+c\sum_mB_{im}A_{ml}$, so $\frac{\partial W_{il}}{\partial A_{kj}}=cB_{ik}\delta_{lj}$ and
$$\frac{\partial L}{\partial A_{kj}}=\sum_{i,l}G_{il}\,cB_{ik}\delta_{lj}=c\sum_iB_{ik}G_{ij}=c(B^TG)_{kj}$$
Similarly $\frac{\partial W_{il}}{\partial B_{kj}}=c\delta_{ik}A_{jl}$, so $\frac{\partial L}{\partial B_{kj}}=c\sum_lG_{kl}A_{jl}=c(GA^T)_{kj}$.
$$\frac{\partial L}{\partial A}=\frac\alpha rB^TG,\qquad\frac{\partial L}{\partial B}=\frac\alpha rGA^T$$
- **Step 8. Initialisations.** $\Delta W=0$ needs $A=0$ or $B=0$. With $G\ne0$:

| init | $\Delta W$ | $\partial L/\partial A$ | $\partial L/\partial B$ |
|---|---|---|---|
| $A=B=0$ | 0 | 0 | 0 |
| $B=0$, $A$ random | 0 | 0 | $\frac\alpha rGA^T\ne0$ |
| $A=0$, $B$ random | 0 | $\frac\alpha rB^TG\ne0$ | 0 |

So training can move $\Delta W$ iff **exactly one** of $A,B$ is zero and the other random. $A=B=0$ is stuck forever (L6: zero init stays at zero).
- **Step 9. One step** ($A_1=A_0-\eta\frac{\partial L}{\partial A}$, $B_1=B_0-\eta\frac{\partial L}{\partial B}$):
  - $B_0=0$, $A_0$ random: $A_1=A_0$, $B_1=-\eta cGA_0^T$, $\Delta W_1=cB_1A_1=-\eta c^2GA_0^TA_0$.
  - $A_0=0$, $B_0$ random: $B_1=B_0$, $A_1=-\eta cB_0^TG$, $\Delta W_1=cB_1A_1=-\eta c^2B_0B_0^TG$.
- **Step 10. (d) Construction.** $U_s,V_s\in\mathbb R^{d\times s}$, $\Sigma_s\in\mathbb R^{s\times s}$. Pad with zeros:
$$B=\big[\,U_s\Sigma_s\ \big|\ 0_{d\times(r-s)}\big],\qquad A=\begin{bmatrix}V_s^T\\0_{(r-s)\times d}\end{bmatrix},\qquad BA=U_s\Sigma_sV_s^T=M$$
- **Step 11. Largest rank.** By (b), $\mathrm{rank}(BA)\le r$, and $s=r$ attains it.

> [!success] Answer
> (a) $\frac{\sum_{i>r}\sigma_i^2}{\sum\sigma_i^2}$; $99.8\%$ for the flat spectrum; $\mathrm{rank}(\Delta W)=1$, $\mathrm{rank}(W_0+\Delta W)=d$. (A low-rank approximation of $W_0$ loses almost everything, but a low-rank **update** keeps $W_0$ full rank: LoRA makes the *change* low-rank, not the weight.) (b) $\rho-r\le\mathrm{rank}(W_0+BA)\le\rho+r$. (c) $\frac{\partial L}{\partial A}=\frac\alpha rB^TG$, $\frac{\partial L}{\partial B}=\frac\alpha rGA^T$; exactly one of $A,B$ is zero; $\Delta W_1=-\eta(\frac\alpha r)^2GA_0^TA_0$ (if $B_0=0$) or $-\eta(\frac\alpha r)^2B_0B_0^TG$ (if $A_0=0$). (d) $B=[U_s\Sigma_s\mid0]$, $A=[V_s^T;0]$; largest rank is $r$ (so LoRA's only constraint on $\Delta W$ is rank $\le r$).

### H3 (MLP rotated digits)

> **Question.** An MLP $64\to256\to256\to10$ (ReLU) is trained on $8\times8$ upright digits, then adapted to the same digits rotated by $90^\circ$. $W_2\in\mathbb R^{256\times256}$ is the hidden-to-hidden weight. Full fine-tuning changes it from $W_2^{old}$ to $W_2^{new}$, residual $\Delta W_2=W_2^{new}-W_2^{old}$. Test accuracies on rotated digits: base model $10.0\%$, head-only $39.8\%$, LoRA $r=4$ $95.6\%$, full fine-tuning $94.3\%$.
> (a) The hidden activations $h$ feeding $W_2$ all lie in the column space of $H\in\mathbb R^{256\times s}$ (orthonormal columns). Find $\Delta W_2h$ in terms of $\Delta W_2HH^T$, and the part of $\|\Delta W_2\|_F^2$ that changes no output.
> (b) Find $\|\Delta W_2-(\Delta W_2)_r\|_F$ in terms of $\sigma_i$ of $\Delta W_2$. If the top singular values are $(3.0,2.2,1.6,1.1,0.8,0.6)$ with a negligible tail, find the energy kept and the fraction of $\|\Delta W_2\|_F$ discarded at $r=4$.
> (c) Given Weyl: $\lvert\sigma_i(W+\Delta)-\sigma_i(W)\rvert\le\|\Delta\|_2$. With the spectrum of (b), find the largest possible change of any singular value from $W_2^{old}$ to $W_2^{new}$.
> (d) Find the fraction of the base-to-full-fine-tuning accuracy gain recovered by head-only training and by LoRA.

**Solution.**
- **Step 1. (a)** $h\in\mathrm{col}(H)\Rightarrow h=HH^Th$ ($HH^T$ projects onto $\mathrm{col}(H)$). So $\Delta W_2h=\Delta W_2HH^Th$: only $\Delta W_2HH^T$ matters.
- **Step 2.** Split $\Delta W_2=\Delta W_2HH^T+\Delta W_2(I-HH^T)$. The two pieces have orthogonal row spaces, so
$$\|\Delta W_2\|_F^2=\|\Delta W_2HH^T\|_F^2+\|\Delta W_2(I-HH^T)\|_F^2$$
The second part acts only on directions the activations never use: it changes no output.
- **Step 3. (b)** $\|\Delta W_2-(\Delta W_2)_r\|_F=\sqrt{\sum_{i>r}\sigma_i^2}$ (Eckart–Young). Squares: $9,\ 4.84,\ 2.56,\ 1.21,\ 0.64,\ 0.36$; total $18.61$.
- **Step 4. $r=4$.** Kept $=9+4.84+2.56+1.21=17.61$, i.e. $\frac{17.61}{18.61}=94.6\%$ of the energy. Discarded energy $=1.00$: fraction of the norm $\sqrt{\frac{1.00}{18.61}}=0.232=23.2\%$.
- **Step 5. (c)** $\lvert\sigma_i(W^{new})-\sigma_i(W^{old})\rvert\le\|\Delta W_2\|_2=\sigma_1(\Delta W_2)=3.0$.
- **Step 6. (d)** Full gain $=94.3-10.0=84.3$ points. Head-only: $\frac{39.8-10}{84.3}=\frac{29.8}{84.3}=35.4\%$. LoRA: $\frac{95.6-10}{84.3}=\frac{85.6}{84.3}=101.5\%$.

> [!success] Answer
> (a) $\Delta W_2h=\Delta W_2HH^Th$; the wasted part is $\|\Delta W_2(I-HH^T)\|_F^2$. (b) $\sqrt{\sum_{i>r}\sigma_i^2}$; at $r=4$ the energy kept is $94.6\%$, the norm discarded is $23.2\%$ (energy discarded $5.4\%$). (c) At most $3.0$. (d) Head-only recovers $35\%$; LoRA recovers $101.5\%$ (slightly better than full fine-tuning).

### H4 (adapters, merging, serving)

> **Question.** LoRA freezes $W_0\in\mathbb R^{d\times d}$, trains $B\in\mathbb R^{d\times r}$, $A\in\mathbb R^{r\times d}$, layer $y=W_0x+\frac\alpha rBAx$. For a required update $\Delta W$ with singular values $\sigma_1\ge\sigma_2\ge\dots$, let $\rho(r)=\frac{\sum_{i\le r}\sigma_i^2}{\sum_i\sigma_i^2}$, the largest fraction of $\|\Delta W\|_F^2$ a rank-$r$ update can match.
> (a) For $d=256$ find $\rho(8)$ and the smallest $r$ with $\rho(r)\ge0.95$ for (i) a decaying profile $\sigma_i=2^{-i}$ and (ii) a flat profile $\sigma_i=1$, $i=1..256$.
> (b) Find the single matrix $W$ with $W_0x+\frac\alpha rBAx=Wx$ for all $x$ and the cost of forming it (the merged weight). An adapter instead inserts a nonlinear layer $h\mapsto h+f(h)$. For the scalar adapter $h\mapsto h+\max(h,0)$, does some $w\in\mathbb R$ satisfy $h+\max(h,0)=wh$ for all $h$?
> (c) You serve 100 task-specific adapters from one base model. At $d=4096$, $r=8$, per matrix, find the float32 memory of (i) 100 merged copies of $W_0+\frac\alpha rBA$ and (ii) one copy of $W_0$ plus 100 unmerged $(A,B)$ pairs, and the extra multiply-adds per input of an unmerged forward pass $W_0x+\frac\alpha rB(Ax)$ as a fraction of $d^2$.

**Solution.**
- **Step 1. (a)(i) Decaying.** $\sigma_i^2=4^{-i}$. $\sum_{i\le r}4^{-i}=\frac13(1-4^{-r})$, total $\approx\frac13$. So $\rho(r)\approx1-4^{-r}$. $\rho(8)=1-4^{-8}=0.99998$. Need $4^{-r}\le0.05$: $r\ge\frac{\ln20}{\ln4}=2.16\Rightarrow r=3$ ($\rho(3)=0.984$, $\rho(2)=0.9375$).
- **Step 2. (ii) Flat.** $\rho(r)=\frac r{256}$. $\rho(8)=\frac8{256}=0.031$. Need $\frac r{256}\ge0.95\Rightarrow r\ge243.2\Rightarrow r=244$.
- **Step 3. (b) Merge.** $W=W_0+\frac\alpha rBA$. Forming it costs one $d\times r$ by $r\times d$ matrix product, $d^2r$ multiply-adds, plus $d^2$ additions, once. Afterwards inference costs the same as $W_0$.
- **Step 4. Nonlinear adapter.** $h>0$: $h+h=2h\Rightarrow w=2$. $h<0$: $h+0=h\Rightarrow w=1$. Contradiction: **no** such $w$. A nonlinear adapter cannot be folded into the weights, so it adds inference cost.
- **Step 5. (c)(i)** $100\times d^2\times4$ B $=100\times16\,777\,216\times4=6.71\times10^9$ B $=6.71$ GB.
- **Step 6. (ii)** $W_0$: $67.1$ MB. $100$ adapters: $100\times2dr\times4=100\times65536\times4=26.2$ MB. Total $93.3$ MB. About $72\times$ less than (i).
- **Step 7. Extra compute.** $Ax$: $rd$ multiplies; $B(Ax)$: $dr$. Total $2dr=65536$. Fraction of $d^2$: $\frac{2dr}{d^2}=\frac{2r}d=\frac{16}{4096}=0.39\%$.

> [!success] Answer
> (a) (i) $\rho(8)\approx0.99998$, $r=3$. (ii) $\rho(8)=0.031$, $r=244$. (b) $W=W_0+\frac\alpha rBA$, cost $d^2r$ once. No $w$ exists for the ReLU adapter, so nonlinear adapters cannot be merged. (c) (i) $6.71$ GB. (ii) $93.3$ MB ($72\times$ less). Extra compute $\frac{2r}d=0.39\%$ of $d^2$.

---

# TUT 4: Applications of SVD, Curse of Dimensionality

> [!info] A1, E4 are reformatted from the worked solutions printed in the PDF (same results, step format).

## Section A: Latent structure (LSI and low-rank models)

### A1 (BHK 3.8, adapted; PDF solution reformatted)

> **Question.** $A\in\mathbb R^{n\times d}$, $A_{ij}\ge0$ is the count of term $i$ in document $j$ (terms are rows); singular values $\sigma_1>\sigma_2\ge\dots$, top triple $(\sigma_1,u_1,v_1)$: $Av_1=\sigma_1u_1$, $A^Tu_1=\sigma_1v_1$. $A_{i\cdot}$ is row $i$, $A_{\cdot j}$ is column $j$.
> (a)(i) Can $v_1$ have entries of both signs? Possible sign patterns of $(u_1,v_1)$? (ii) Allow $\sigma_1=\sigma_2$: can some top pair be chosen with all entries non-negative? Does every top right singular vector have entries of one sign? (iii) For $B=\begin{pmatrix}1&-2\\-2&1\end{pmatrix}$ find all top singular pairs $(u_1,v_1)$ and the signs of their entries.
> (b) Find $u_{1,i}$ in terms of $A_{i\cdot},v_1,\sigma_1$ and $v_{1,j}$ in terms of $A_{\cdot j},u_1,\sigma_1$. Find the maximum of $\sum_j(u^TA_{\cdot j})^2$ over unit $u$, and all maximisers.
> (c) Rows *the, car, automobile*, three documents: $A=\begin{pmatrix}10&10&10\\1&0&0\\0&1&0\end{pmatrix}$. Find $\|A\|_F^2$, a lower bound on $\sigma_1^2$ from the test vector $u=e_1$, a lower bound on $\lvert u_{1,1}\rvert$, the term $u_1$ is essentially aligned with, and a lower bound on $\sigma_1^2/\|A\|_F^2$.
> (d) Reweight by tf–idf: $A'_{ij}=A_{ij}\ln(3/\mathrm{df}_i)$, $\mathrm{df}_i$ = number of documents containing term $i$. Find $A'$, its singular values and the set of top left singular vectors; the terms on which they are non-zero; whether a single top concept direction is determined.

**Solution (a)(i).**
- **Step 1. Flipping signs never lowers $\|Av\|$.** For unit $v$ let $\lvert v\rvert$ be the entrywise absolute value (also a unit vector). Since $A_{ij}\ge0$: $\lvert(Av)_i\rvert=\left\lvert\sum_jA_{ij}v_j\right\rvert\le\sum_jA_{ij}\lvert v_j\rvert=(A\lvert v\rvert)_i$. Square and sum over $i$:
$$\|Av\|\le\|A\lvert v\rvert\|\le\max_{\|x\|=1}\|Ax\|=\sigma_1\qquad(*)$$
- **Step 2. Contradiction.** Suppose $v_1$ has both signs, and let $w=\lvert v_1\rvert\ne\pm v_1$. By $(*)$ with $v=v_1$: $\sigma_1=\|Av_1\|\le\|Aw\|\le\sigma_1$, so $w$ is also a top right singular vector. But $\sigma_1>\sigma_2$ makes the top right singular vector unique up to sign, so $w=\pm v_1$: contradiction.
- **Step 3.** So $v_1\ge0$ or $v_1\le0$ (zeros allowed), and $u_1=Av_1/\sigma_1$ has the same sign.

> [!success] Answer (a)(i)
> $v_1$ cannot have mixed signs; $(u_1,v_1)\ge0$ or $(u_1,v_1)\le0$.

**(a)(ii).**
- **Step 1.** Let $v_1$ be any top right singular vector, $w=\lvert v_1\rvert$. By $(*)$, $\|Aw\|=\sigma_1$, so $w$ is also a top right singular vector. Choose it: $v_1=w\ge0$ and $u_{1,i}=\frac1{\sigma_1}\sum_jA_{ij}w_j\ge0$.
- **Step 2. Not every top vector.** $A=I_2$ (non-negative, $\sigma_1=\sigma_2=1$): every unit vector is a top right singular vector, including $\frac1{\sqrt2}(1,-1)$.

> [!success] Answer (a)(ii)
> Yes, some top pair can be chosen non-negative. No, not every top right singular vector is one-signed.

**(a)(iii).**
- **Step 1.** $B^TB=B^2=\begin{pmatrix}5&-4\\-4&5\end{pmatrix}$ with eigenpairs $9,\ \frac1{\sqrt2}(1,-1)$ and $1,\ \frac1{\sqrt2}(1,1)$.
- **Step 2.** $\sigma_1=3$ is simple: $v_1=\pm\frac1{\sqrt2}(1,-1)$. $u_1=\frac{Bv_1}3=v_1$.

> [!success] Answer (a)(iii)
> $(u_1,v_1)=\pm\left(\frac1{\sqrt2}(1,-1),\frac1{\sqrt2}(1,-1)\right)$. Both vectors have one positive and one negative entry (the non-negativity of $A$ was needed in (i); $B$ has negative entries).

**(b).**
- **Step 1.** From $Av_1=\sigma_1u_1$ and $A^Tu_1=\sigma_1v_1$:
$$u_{1,i}=\frac{A_{i\cdot}v_1}{\sigma_1},\qquad v_{1,j}=\frac{u_1^TA_{\cdot j}}{\sigma_1}$$
- **Step 2.** $\sum_j(u^TA_{\cdot j})^2=\|A^Tu\|^2=\sum_l\sigma_l^2(u_l^Tu)^2\le\sigma_1^2\sum_l(u_l^Tu)^2\le\sigma_1^2$. Equality iff $u=\pm u_1$ (since $\sigma_1>\sigma_2$).

> [!success] Answer (b)
> Formulas above. Maximum $\sigma_1^2$, maximisers $u=\pm u_1$.

**(c).**
- **Step 1.** $\|A\|_F^2=300+1+1=302$.
- **Step 2. Lower bound on $\sigma_1^2$.** $\sigma_1^2=\max\|A^Tu\|^2\ge\|A^Te_1\|^2=\|(10,10,10)\|^2=300$.
- **Step 3. Bound $\lvert u_{1,1}\rvert$.** Write $u_1=ce_1+w$, $w\perp e_1$, $\|w\|^2=1-c^2$. $A^Tw=(w_2,w_3,0)$ so $\|A^Tw\|=\|w\|$. Then
$$\sqrt{300}\le\|A^Tu_1\|\le\lvert c\rvert\sqrt{300}+\sqrt{1-c^2}\ \Rightarrow\ \sqrt{300}(1-\lvert c\rvert)\le\sqrt{(1-\lvert c\rvert)(1+\lvert c\rvert)}$$
Square and divide by $(1-\lvert c\rvert)$: $300(1-\lvert c\rvert)\le1+\lvert c\rvert\le2$, so $\lvert c\rvert\ge1-\frac2{300}=0.9933$.
- **Step 4.** $\frac{\sigma_1^2}{\|A\|_F^2}\ge\frac{300}{302}=0.993$.

> [!success] Answer (c)
> $\|A\|_F^2=302$; $\sigma_1^2\ge300$; $\lvert u_{1,1}\rvert\ge0.9933$; $u_1\approx\pm e_1$ (the stopword *the*); $\frac{\sigma_1^2}{\|A\|_F^2}\ge0.993$.

**(d).**
- **Step 1.** $\mathrm{df}=(3,1,1)$, weights $\ln\frac3{\mathrm{df}}=(0,\ln3,\ln3)=(0,1.099,1.099)$.
$$A'=\ln3\begin{pmatrix}0&0&0\\1&0&0\\0&1&0\end{pmatrix},\qquad A'A'^T=(\ln3)^2\mathrm{diag}(0,1,1)$$
- **Step 2.** Singular values $(\ln3,\ln3,0)=(1.099,1.099,0)$. Top left singular vectors: all unit vectors in $\mathrm{span}\{e_2,e_3\}$.

> [!success] Answer (d)
> tf–idf removes *the* (weight $\ln1=0$). The top vectors are non-zero only on *car* and *automobile*. The tie $\sigma_1=\sigma_2$ means no single concept direction is determined (any mix of car/automobile).

### A2 (BHK 3.7, adapted)

> **Question.** $A$ is $n\times n$ block diagonal with $k$ blocks of size $m=n/k$, every entry of block $i$ equal to $a_i>0$. $e_i\in\mathbb R^n$ is $m^{-1/2}$ on the coordinates of block $i$ and $0$ elsewhere.
> (a) For $a_1>a_2>\dots>a_k$ find the number of non-zero singular values, their values, and the singular vectors. (b) For $a_1=\dots=a_k=a$ find the set of all top singular vectors. For $k=2$ is $\frac{e_1+e_2}{\sqrt2}$ a top singular vector, and on how many blocks is it non-zero? (c) In case (b), $V_k\in\mathbb R^{n\times k}$ has any orthonormal basis of top singular vectors as columns. For coordinates $j,l$ find $\langle(V_k)_{j\cdot},(V_k)_{l\cdot}\rangle$ in terms of the blocks containing $j,l$. How many distinct rows does $V_k$ have?

**Solution.**
- **Step 1. (a)** Block $i$ is $a_i\mathbf1\mathbf1^T$ ($m\times m$), and $\mathbf1\mathbf1^T=m\,e_ie_i^T$ on that block. So $A=\sum_{i=1}^k m a_i\,e_ie_i^T$, with orthonormal $e_i$ (disjoint supports). That is already an SVD.
- **Step 2.** $\sigma_i=ma_i$ ($k$ non-zero values, rank $k$), $u_i=v_i=e_i$.
- **Step 3. (b)** All $\sigma_i=ma$ equal. Top right singular vectors $=$ all unit vectors in $\mathrm{span}\{e_1,\dots,e_k\}$ ($\sigma_1=\dots=\sigma_k$ tie, as in Tut 3 B5(d)).
- **Step 4. $k=2$:** $\frac{e_1+e_2}{\sqrt2}$ is in the span, so it **is** a top singular vector, non-zero on **both** blocks.
- **Step 5. (c)** $V_k=EQ$ where $E=[e_1\cdots e_k]$ and $Q$ is a $k\times k$ orthogonal matrix. Row $j$ of $E$ is $m^{-1/2}$ times the unit vector of block $b(j)$, so row $j$ of $V_k$ is $m^{-1/2}q_{b(j)}$, where $q_b$ is row $b$ of $Q$.
- **Step 6.** $\langle(V_k)_{j\cdot},(V_k)_{l\cdot}\rangle=\frac1mq_{b(j)}\cdot q_{b(l)}$. The rows of an orthogonal $Q$ are orthonormal: so it is $\frac1m$ if $j,l$ in the same block, $0$ if different blocks.
- **Step 7.** Rows in the same block are identical; rows of different blocks are orthogonal, hence different: exactly $k$ distinct rows.

> [!success] Answer
> (a) $k$ non-zero singular values $\sigma_i=ma_i$, with $u_i=v_i=e_i$. (b) All unit vectors in $\mathrm{span}\{e_1..e_k\}$. For $k=2$, $\frac{e_1+e_2}{\sqrt2}$ is a top vector, non-zero on both blocks. (c) $\langle\cdot,\cdot\rangle=\frac1m$ (same block) or $0$ (different blocks); exactly $k$ distinct rows. So even with an arbitrary rotation $Q$, grouping equal rows recovers the clusters.

### A3 (BHK 3.26, adapted)

> **Question.** $A\in\mathbb R^{m\times n}$ is a document–term matrix whose rows $a_1,\dots,a_m$ (documents) have unit length, SVD $A=\sum\sigma_lu_lv_l^T$, $\sigma_1>\sigma_2>\dots$. Similarity of two documents is their dot product. A right singular vector with singular value $\sigma$ is an eigenvector of $A^TA$ with eigenvalue $\sigma^2$.
> (1) Find the unit $x$ maximising $\sum_j(a_j\cdot x)^2$ and the maximum. (2) $m_1$ documents equal $e_1$ and $m_2<m_1$ equal $e_2$: find the maximiser of (1) and the unit vector maximising $\sum_ja_j\cdot x$ (the centroid direction). (3) Find the maximum of $\sum_{i=1}^k\sum_{j=1}^m(a_j\cdot x_i)^2$ over orthonormal $x_1..x_k$ and a maximiser. (4) After permuting rows and columns $A=\mathrm{diag}(A_1,\dots,A_k)$ (block $A_i$: documents of cluster $i$ as rows, terms of cluster $i$ as columns); $v=(v^{(1)},\dots,v^{(k)})$ in the same blocks. Find the set of right singular vectors of $A$ with singular value $\sigma$ in terms of those of $A_1..A_k$. (5) In (4) let every entry of every block be positive, and the top singular values of the $k$ blocks distinct and larger than every other singular value of every block. Find the supports of $v_1..v_k$ and $Av_1..Av_k$. Then let two blocks share the same top singular value: is every top-$k$ right singular vector non-zero on only one block? (Perron–Frobenius: a symmetric matrix with all entries positive has a simple top eigenvalue with an all-positive eigenvector.)

**Solution.**
- **Step 1. (1)** $\sum_j(a_j\cdot x)^2=\|Ax\|^2$ (L5 §2). Maximum over unit $x$: $x=v_1$, value $\sigma_1^2$.
- **Step 2. (2)** $A^TA=m_1e_1e_1^T+m_2e_2e_2^T=\mathrm{diag}(m_1,m_2)$. Top eigenvector $e_1$ (since $m_1>m_2$): maximiser $x=e_1$, value $m_1$. Centroid direction: maximise $\left(\sum_ja_j\right)\cdot x=(m_1e_1+m_2e_2)\cdot x$: $x=\frac{m_1e_1+m_2e_2}{\sqrt{m_1^2+m_2^2}}$.
- **Step 3. (3)** Greedy $=$ optimal (L5 §3): max $=\sigma_1^2+\dots+\sigma_k^2$, attained at $x_i=v_i$.
- **Step 4. (4)** $A^TA=\mathrm{diag}(A_1^TA_1,\dots,A_k^TA_k)$. $A^TAv=\sigma^2v$ means block by block $A_i^TA_iv^{(i)}=\sigma^2v^{(i)}$. So each $v^{(i)}$ is either $0$ or a right singular vector of $A_i$ with singular value $\sigma$.
- **Step 5.** (5) Each $A_i^TA_i$ is symmetric with all positive entries, so by Perron–Frobenius its top eigenvector is positive and simple. The top singular values of the blocks are distinct and beat all other singular values, so the top-$k$ singular vectors of $A$ are exactly the blocks' top vectors, one per block: $v_j$ is non-zero (positive) exactly on the terms of one cluster and zero elsewhere. $Av_j=\left(0,\dots,A_jv_j,\dots,0\right)$ is non-zero (positive) exactly on the documents of that cluster.
- **Step 6. Tie.** If two blocks have the same top singular value, any unit vector in the span of their two top vectors is a top singular vector, e.g. $\frac{v^{(1)}+v^{(2)}}{\sqrt2}$, which is non-zero on **two** blocks. So not every top-$k$ vector is supported on one block (the span still identifies the clusters).

> [!success] Answer
> (1) $x=v_1$, value $\sigma_1^2$. (2) Maximiser $e_1$ (value $m_1$); centroid direction $\frac{m_1e_1+m_2e_2}{\sqrt{m_1^2+m_2^2}}$, which mixes both clusters. (3) $\sigma_1^2+\dots+\sigma_k^2$ at $x_i=v_i$. (4) $\{v:\ \text{each }v^{(i)}=0\text{ or a right singular vector of }A_i\text{ with value }\sigma\}$. (5) $v_j$ is supported on cluster $j$'s terms only, $Av_j$ on cluster $j$'s documents only. With a tie between two blocks, mixtures non-zero on both blocks are also top vectors, so single-block support is no longer guaranteed.

### A4 (BHK 3.24, adapted)

> **Question.** $A\in\mathbb R^{n\times d}$, SVD $\sum\sigma_iu_iv_i^T$, rank-$k$ truncation $A_k=U_k\Sigma_kV_k^T$, $\|A-A_k\|_2=\sigma_{k+1}$. After preprocessing $A$, each query $x\in\mathbb R^d$ must be answered with $y$ satisfying $\|y-Ax\|\le\varepsilon\|A\|_F\|x\|$. (a) Find an upper bound on $\sigma_{k+1}$ in terms of $\|A\|_F$ and $k$. (b) Take $y=A_kx$; find the smallest $k$ (function of $\varepsilon$) for which the bound in (a) guarantees the requirement for every $x$. (c) Find the cost per query of $y=U_k(\Sigma_k(V_k^Tx))$ in terms of $n,d,k$, and with $k$ from (b) in terms of $n,d,\varepsilon$. Find the cost of computing $Ax$ directly.

**Solution.**
- **Step 1. (a)** $\sigma_1\ge\dots\ge\sigma_{k+1}$, so $(k+1)\sigma_{k+1}^2\le\sum_{i\le k+1}\sigma_i^2\le\|A\|_F^2$. Hence $\sigma_{k+1}\le\frac{\|A\|_F}{\sqrt{k+1}}$.
- **Step 2. (b)** $\|A_kx-Ax\|\le\|A-A_k\|_2\|x\|=\sigma_{k+1}\|x\|\le\frac{\|A\|_F\|x\|}{\sqrt{k+1}}$. This is $\le\varepsilon\|A\|_F\|x\|$ when $\frac1{\sqrt{k+1}}\le\varepsilon\iff k+1\ge\frac1{\varepsilon^2}$.
- **Step 3. (c)** Cost: $V_k^Tx$: $kd$; scale by $\Sigma_k$: $k$; multiply by $U_k$: $nk$. Total $O(k(n+d))$. With $k=\lceil\varepsilon^{-2}\rceil-1$: $O\!\left(\frac{n+d}{\varepsilon^2}\right)$. Direct $Ax$: $O(nd)$.

> [!success] Answer
> (a) $\sigma_{k+1}\le\frac{\|A\|_F}{\sqrt{k+1}}$. (b) $k=\lceil1/\varepsilon^2\rceil-1$. (c) $O(k(n+d))=O\!\left(\frac{n+d}{\varepsilon^2}\right)$ vs $O(nd)$ directly: a big saving when $\frac1{\varepsilon^2}\ll\min(n,d)$ (the SVD is done once, as preprocessing).

## Section B: From graphs and distances to coordinates

### B1 (BHK 3.19, adapted)

> **Question.** $M$ is positive semidefinite if $x^TMx\ge0$ for all $x$. (1) For a real matrix $A$ find $x^TAA^Tx$ in terms of $A^Tx$, and the set of $x$ for which it is $0$. (2) A graph on vertices $1..n$ has adjacency matrix $W$, degree matrix $D$, Laplacian $L=D-W$. $B$ has a row per edge $e$ and a column per vertex $i$: $b_{ei}=-1$ if $i$ is the endpoint of $e$ with lesser index, $+1$ if the endpoint with greater index, $0$ otherwise. Find $(B^TB)_{ii}$, $(B^TB)_{ij}$ ($i\ne j$) and $x^TLx$ as a sum over edges. Find the null space of $L$ for the path $1-2-3$ and for the graph on $\{1,2,3,4\}$ with edges $\{1,2\},\{3,4\}$.

**Solution.**
- **Step 1. (1)** $x^TAA^Tx=(A^Tx)^T(A^Tx)=\|A^Tx\|^2\ge0$ (so $AA^T$ is PSD). It is $0$ iff $A^Tx=0$: $x\in\mathrm{null}(A^T)$ (orthogonal to the column space of $A$).
- **Step 2. (2) Diagonal.** $(B^TB)_{ii}=\sum_eb_{ei}^2=$ number of edges at $i=D_{ii}$.
- **Step 3. Off-diagonal.** $(B^TB)_{ij}=\sum_eb_{ei}b_{ej}$; only the edge $\{i,j\}$ (if present) contributes, with $b_{ei}b_{ej}=(-1)(+1)=-1$. So $(B^TB)_{ij}=-W_{ij}$. Hence $B^TB=D-W=L$.
- **Step 4. Edge sum.** $x^TLx=\|Bx\|^2=\sum_{e=\{i,j\}}(x_i-x_j)^2$ (matches L6 §11: $\frac12\sum_{i,j}w_{ij}(y_i-y_j)^2$).
- **Step 5. Null space.** $Lx=0\iff x^TLx=0\iff x_i=x_j$ on every edge $\iff x$ is constant on each connected component.
- **Step 6.** Path $1-2-3$ (connected): $\mathrm{null}(L)=\mathrm{span}\{(1,1,1)\}$. Two edges $\{1,2\},\{3,4\}$ (2 components): $\mathrm{null}(L)=\mathrm{span}\{(1,1,0,0),(0,0,1,1)\}$.

> [!success] Answer
> (1) $\|A^Tx\|^2$; zero iff $A^Tx=0$. (2) $(B^TB)_{ii}=\deg(i)$, $(B^TB)_{ij}=-W_{ij}$, so $B^TB=L$ and $x^TLx=\sum_{\{i,j\}\in E}(x_i-x_j)^2$. Null space: dimension $=$ number of connected components. Path: $\mathrm{span}\{\mathbf1\}$. Two disjoint edges: $\mathrm{span}\{(1,1,0,0),(0,0,1,1)\}$.

### B2 (BHK 3.31, adapted; classical MDS)

> **Question.** $x_1..x_n\in\mathbb R^d$ (row vectors) with centroid $0$, $\sum x_i=0$; $X\in\mathbb R^{n\times d}$ has rows $x_i$; $d_{ij}=\|x_i-x_j\|$. Only the $d_{ij}$ are known.
> (1) Find $x_ix_j^T$ in terms of the squared distances $d_{kl}^2$. (Expand $d_{ij}^2=\|x_i\|^2+\|x_j\|^2-2x_ix_j^T$ and average over $i$, over $j$, and over both.)
> (2) $G=XX^T=Q\Lambda Q^T$ with eigenvalues in decreasing order. Find an $n\times d$ matrix $X'$ with $X'X'^T=G$ in terms of $Q,\Lambda$, and the set of all such $X'$.
> (3) Four points have $D^{(2)}=\begin{pmatrix}0&4&5&1\\4&0&1&5\\5&1&0&4\\1&5&4&0\end{pmatrix}$, $d=2$. Find $G$, its eigenvalues and an $X'$.

**Solution. ⚠ (MDS is not in your notes; the steps follow the hint.)**
- **Step 1. (1) Averaging.** Since $\sum_kx_k=0$ the cross term vanishes when averaged:
  - over $i$: $\frac1n\sum_id_{ij}^2=\frac1n\sum_k\|x_k\|^2+\|x_j\|^2$.
  - over $j$: $\frac1n\sum_jd_{ij}^2=\|x_i\|^2+\frac1n\sum_k\|x_k\|^2$.
  - over both: $\frac1{n^2}\sum_{k,l}d_{kl}^2=\frac2n\sum_k\|x_k\|^2$.
- **Step 2.** Solve: $\|x_j\|^2=r_j-\frac t2$, $\|x_i\|^2=c_i-\frac t2$, where $r_j$ is the average over $i$, $c_i$ the average over $j$, $t$ the average over both. Then $x_ix_j^T=\frac12\left(\|x_i\|^2+\|x_j\|^2-d_{ij}^2\right)$:
$$x_ix_j^T=-\frac12\left(d_{ij}^2-\frac1n\sum_kd_{kj}^2-\frac1n\sum_ld_{il}^2+\frac1{n^2}\sum_{k,l}d_{kl}^2\right)$$
- **Step 3. (2)** $G$ is symmetric PSD of rank $\le d$. Take $X'=Q_d\Lambda_d^{1/2}$ (first $d$ columns of $Q$, top $d$ eigenvalues). Then $X'X'^T=Q\Lambda Q^T=G$.
- **Step 4. All solutions:** $X'R$ for any $d\times d$ orthogonal $R$ (rotation/reflection): coordinates are determined only up to rotation and reflection.
- **Step 5. (3)** All row sums of $D^{(2)}$ equal $10$, so each row mean $=2.5$ and the overall mean $=2.5$. Then $G_{ij}=-\frac12(d_{ij}^2-2.5-2.5+2.5)=1.25-\frac{d_{ij}^2}2$:
$$G=\begin{pmatrix}1.25&-0.75&-1.25&0.75\\-0.75&1.25&0.75&-1.25\\-1.25&0.75&1.25&-0.75\\0.75&-1.25&-0.75&1.25\end{pmatrix}$$
- **Step 6. Eigenvalues.** Eigenvectors $\frac12(-1,1,1,-1)$ with eigenvalue $4$, and $\frac12(-1,-1,1,1)$ with eigenvalue $1$; the other two eigenvalues are $0$ (rank $2$).
- **Step 7. $X'=Q_2\Lambda_2^{1/2}$:** columns $2\cdot\frac12(-1,1,1,-1)=(-1,1,1,-1)$ and $1\cdot\frac12(-1,-1,1,1)=(-0.5,-0.5,0.5,0.5)$:
$$X'=\begin{pmatrix}-1&-0.5\\1&-0.5\\1&0.5\\-1&0.5\end{pmatrix}$$
- **Step 8. Check.** $\|x_1-x_2\|^2=4$ ✓, $\|x_1-x_3\|^2=4+1=5$ ✓, $\|x_1-x_4\|^2=1$ ✓. The points are the corners of a $2\times1$ rectangle.

> [!success] Answer
> (1) $x_ix_j^T=-\frac12\big(d_{ij}^2-\overline{d^2}_{\cdot j}-\overline{d^2}_{i\cdot}+\overline{d^2}_{\cdot\cdot}\big)$ (the "double-centring" formula). (2) $X'=Q_d\Lambda_d^{1/2}$; all solutions $X'R$ with $R$ orthogonal. (3) $G$ as above, eigenvalues $4,1,0,0$, $X'$ the rectangle above.

### B3 (BHK 2.39, adapted)

> **Question.** $W\subset\mathbb R^N$ is a fixed $p$-dimensional subspace, $S$ its unit sphere. $P$ is the orthogonal projection onto a uniformly random $k$-dimensional subspace, $M=\sqrt{N/k}\,P$. For fixed unit $x$, $\|Px\|^2\sim\mathrm{Beta}\left(\frac k2,\frac{N-k}2\right)$; $\mathrm{Beta}(\alpha,\beta)$ has mean $\frac\alpha{\alpha+\beta}$ and variance $\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}$. To first order $\sqrt X\approx\sqrt{EX}+\frac{X-EX}{2\sqrt{EX}}$. For large dimensions, with $a=k/N$, $b=p/N$, the squared singular values of $P$ restricted to $W$ fill $[\lambda_-,\lambda_+]$, $\lambda_\pm=\left(\sqrt{a(1-b)}\pm\sqrt{b(1-a)}\right)^2$.
> (a) $M|_W=\sum_{j=1}^ps_ja_jb_j^T$ with $b_j$ an orthonormal basis of $W$. Find the set $M(S)$. (b) Find $EP$ and $E\|Mx\|^2$ for fixed $x\in S$. At $N=1000$, $k=500$ find the standard deviation of $\|Mx\|^2$ and, to first order, of $\|Mx\|$. (c) At $N=1000$, $k=500$ find the smallest and largest semi-axes of $M(S)$ for $p=100$ and $p=10$. (d) Find the limits of the smallest and largest semi-axes as $N\to\infty$ with $k,p$ fixed. Which of $N,k,p$ do they depend on?

**Solution. ⚠ (Random-matrix interval; the problem supplies the formulas.)**
- **Step 1. (a)** Points of $S$: $x=\sum_jt_jb_j$ with $\sum t_j^2=1$. $Mx=\sum_js_jt_ja_j$. So $M(S)=\left\{\sum_js_jt_ja_j:\sum t_j^2=1\right\}$: the surface of an **ellipsoid** inside the $p$-dimensional space $\mathrm{span}\{a_j\}$, with semi-axes $s_j$ along $a_j$.
- **Step 2. (b)** $EP=\frac kNI$ (by symmetry; trace $k$). $E\|Mx\|^2=\frac Nk\cdot E\|Px\|^2=\frac Nk\cdot\frac kN=1$.
- **Step 3. SD of $\|Px\|^2$.** Beta$(250,250)$: variance $=\frac{250\cdot250}{500^2\cdot501}=\frac1{4\cdot501}=4.99\times10^{-4}$ (general: $\frac{2k(N-k)}{N^2(N+2)}$). SD $=0.02234$.
- **Step 4. SD of $\|Mx\|^2$.** $\|Mx\|^2=\frac Nk\|Px\|^2=2\|Px\|^2$: SD $=0.0447$.
- **Step 5. First order.** With $X=\|Mx\|^2$, $EX=1$: $\mathrm{SD}(\|Mx\|)\approx\frac{\mathrm{SD}(X)}{2\sqrt{EX}}=0.0224$.
- **Step 6. (c)** $a=0.5$. Squared singular values of $M|_W$ are $\frac Nk\lambda_\pm=2\lambda_\pm$; semi-axes $=\sqrt{2\lambda_\pm}$.
  - $p=100$ ($b=0.1$): $\sqrt{a(1-b)}=0.6708$, $\sqrt{b(1-a)}=0.2236$. $\lambda_+=(0.8944)^2=0.8$, $\lambda_-=(0.4472)^2=0.2$. Semi-axes $\sqrt{0.4}=0.632$ and $\sqrt{1.6}=1.265$.
  - $p=10$ ($b=0.01$): $\sqrt{0.495}=0.7036$, $\sqrt{0.005}=0.0707$. $\lambda_+=0.5995$, $\lambda_-=0.4005$. Semi-axes $\sqrt{2\cdot0.4005}=0.895$ and $\sqrt{2\cdot0.5995}=1.095$.
- **Step 7. (d)** $N\to\infty$: $a,b\to0$, $\lambda_\pm\approx(\sqrt a\pm\sqrt b)^2=\frac{(\sqrt k\pm\sqrt p)^2}N$. Squared semi-axes $\frac Nk\lambda_\pm=\left(1\pm\sqrt{\frac pk}\right)^2$. So semi-axes $\to1\pm\sqrt{p/k}$.

> [!success] Answer
> (a) An ellipsoid with semi-axes $s_j$ in the directions $a_j$ ($p$-dimensional). (b) $EP=\frac kNI$; $E\|Mx\|^2=1$; SD$(\|Mx\|^2)=0.045$; SD$(\|Mx\|)\approx0.022$. (c) $p=100$: $[0.63,1.26]$; $p=10$: $[0.90,1.10]$. (d) $1\pm\sqrt{p/k}$: they depend only on the ratio $p/k$, not on $N$. When $k\gg p$ the semi-axes $\to1$: the projection is nearly an isometry on $W$ (the JL idea, with distortion $\approx\sqrt{p/k}$).

## Section C: Distances in high dimensions (the curse)

### C1 (BHK 2.1)

> **Question.** (1) $x,y$ independent uniform on $[0,1]$: find $E(x),E(x^2),E(x-y),E(xy),E(x-y)^2$. (2) The same for uniform on $[-\frac12,\frac12]$. (3) What is the expected squared distance between two points generated at random inside a unit $d$-dimensional cube?

**Solution.**
- **Step 1. (1)** $E(x)=\frac12$. $E(x^2)=\int_0^1x^2dx=\frac13$. $E(x-y)=0$. $E(xy)=E(x)E(y)=\frac14$ (independent). $E(x-y)^2=E(x^2)-2E(x)E(y)+E(y^2)=\frac13-\frac12+\frac13=\frac16$.
- **Step 2. (2)** $E(x)=0$. $E(x^2)=\int_{-1/2}^{1/2}x^2dx=\frac1{12}$. $E(x-y)=0$. $E(xy)=0$. $E(x-y)^2=\frac1{12}+\frac1{12}=\frac16$.
- **Step 3. (3)** Coordinates are independent: $E\|x-y\|^2=\sum_{i=1}^dE(x_i-y_i)^2=\frac d6$.

> [!success] Answer
> (1) $\frac12,\frac13,0,\frac14,\frac16$. (2) $0,\frac1{12},0,0,\frac16$. (3) $\frac d6$ (the shift does not change distances).

### C2 (BHK 2.2, adapted)

> **Question.** $x,y$ independent and uniform in $[-\frac12,\frac12]^d$. (a) Find $E\|x\|^2$, $E\|x-y\|^2$, $E[x\cdot y]$, $\mathrm{Var}(x\cdot y)$. (b) Using $\|x\|^2\approx\|y\|^2\approx\frac d{12}$, find the mean and standard deviation of $\cos\angle(x,y)$ to leading order. At $d=100$ find the typical $\|x\|$, $\|x-y\|$ and angle. (c) Take 30 such points at $d=100$ (435 pairs); treat the 435 cosines as independent normals; the median of the largest of 435 independent $\lvert N(0,1)\rvert$ values is $3.16$. Find the predicted most extreme angle (simulation: $72^\circ$). (d) Now $x,y$ independent and uniform in $[0,1]^d$. Find $\lim_{d\to\infty}\cos\angle(x,y)$ (in probability) and the limiting angle.

**Solution.**
- **Step 1. (a)** $E\|x\|^2=d\cdot\frac1{12}=\frac d{12}$. $E\|x-y\|^2=\frac d6$. $E[x\cdot y]=\sum E[x_i]E[y_i]=0$. Each term $x_iy_i$ has mean $0$ and variance $E[x_i^2]E[y_i^2]=\frac1{144}$, independent over $i$: $\mathrm{Var}(x\cdot y)=\frac d{144}$.
- **Step 2. (b)** $\cos\angle=\frac{x\cdot y}{\|x\|\|y\|}\approx\frac{x\cdot y}{d/12}$. Mean $0$; SD $=\frac{\sqrt d/12}{d/12}=\frac1{\sqrt d}$.
- **Step 3. At $d=100$:** $\|x\|\approx\sqrt{100/12}=2.89$; $\|x-y\|\approx\sqrt{100/6}=4.08$; $\cos$ has SD $0.1$, so the angle is $90^\circ\pm\arcsin(0.1)=90^\circ\pm5.7^\circ$.
- **Step 4. (c)** Most extreme $\lvert\cos\rvert\approx3.16\times0.1=0.316$. Angle $=\arccos(0.316)=71.6^\circ\approx72^\circ$ ✓ (matches the simulation).
- **Step 5. (d)** Law of large numbers: $\frac1dx\cdot y\to E[x_i]E[y_i]=\frac14$; $\frac1d\|x\|^2\to E[x_i^2]=\frac13$. So $\cos\angle\to\frac{1/4}{1/3}=\frac34$. Angle $=\arccos0.75=41.4^\circ$.

> [!success] Answer
> (a) $\frac d{12}$, $\frac d6$, $0$, $\frac d{144}$. (b) Mean $0$, SD $\frac1{\sqrt d}$; at $d=100$: $\|x\|\approx2.89$, $\|x-y\|\approx4.08$, angle $90^\circ\pm5.7^\circ$. (c) $\approx72^\circ$. (d) $\cos\to\frac34$, angle $\to41.4^\circ$ (non-centred data does not become orthogonal; it keeps a fixed angle).

### C3 (BHK 2.34, adapted)

> **Question.** $x,y$ independent and uniform on the unit sphere in $\mathbb R^d$, $t=x\cdot y$, $r=\|x-y\|$. (a) Find $r^2$ in terms of $t$, and $Et$, $Et^2$. (b) At $d=3$, $t$ is uniform on $[-1,1]$: find the density of $r$. (c) At $d=100$ take $t\approx N(0,\frac1d)$. Find the mean and standard deviation of $r$ to first order using $\sqrt X\approx\sqrt{EX}+\frac{X-EX}{2\sqrt{EX}}$. For 100 points (4950 pairs), treating the $t$'s as independent, the median of the largest of 4950 independent $\lvert N(0,1)\rvert$ values is $3.63$: find the predicted smallest and largest distance (simulation: $1.14$ and $1.65$). (d) Find the standard deviation of $r$ exactly at $d=3$ and compare with (c).

**Solution.**
- **Step 1. (a)** $r^2=\|x\|^2+\|y\|^2-2x\cdot y=2-2t$. $Et=0$ (symmetry $y\to-y$). $Et^2=\frac1d$ (coordinate budget, W2 §2.4).
- **Step 2. (b)** $t=1-\frac{r^2}2$, so $\left\lvert\frac{dt}{dr}\right\rvert=r$. Density of $r$: $f_r(r)=f_t\cdot r=\frac12\cdot r=\frac r2$ for $r\in[0,2]$ (check: $\int_0^2\frac r2dr=1$).
- **Step 3. (c)** $X=r^2=2-2t$, $EX=2$, $X-EX=-2t$. First order: $r\approx\sqrt2+\frac{-2t}{2\sqrt2}=\sqrt2-\frac t{\sqrt2}$. Mean $\sqrt2=1.414$. SD $=\frac{\mathrm{SD}(t)}{\sqrt2}=\frac{0.1}{1.414}=0.0707$.
- **Step 4. Extremes.** Largest $\lvert t\rvert\approx3.63\times0.1=0.363$. Smallest $r\approx1.414-3.63\times0.0707=1.158$; largest $r\approx1.414+0.257=1.671$. (Using the exact square root, $\sqrt{2-2(0.363)}=1.13$ and $\sqrt{2+0.726}=1.65$, even closer to the simulation $1.14$ and $1.65$.)
- **Step 5. (d)** $d=3$: $E[r]=\int_0^2r\cdot\frac r2dr=\frac43$, $E[r^2]=\int_0^2r^2\cdot\frac r2dr=2$. $\mathrm{Var}=2-\frac{16}9=\frac29$, SD $=0.471$.

> [!success] Answer
> (a) $r^2=2-2t$, $Et=0$, $Et^2=\frac1d$. (b) $f_r(r)=\frac r2$ on $[0,2]$. (c) Mean $\sqrt2\approx1.41$, SD $\approx0.071$; predicted smallest $\approx1.16$ (exact sqrt: $1.13$), largest $\approx1.67$ ($1.65$). (d) SD $=\sqrt{2/9}=0.47$ at $d=3$ vs $0.07$ at $d=100$ (approx. $\frac1{\sqrt{2d}}$): distances concentrate as $d$ grows.

## Section D: Latent factors on toy matrices

### D1 (LSI toy matrices)

> **Question.** Terms are rows, documents are columns of $A$. $U_k$ holds the top $k$ left singular vectors; a document or query $x$ is encoded as $U_k^Tx$; $A_k$ is the rank-$k$ truncation.
> (a) Rows *car, automobile*; columns $D_1,D_2,D_3$: $A=\begin{pmatrix}2&0&1\\0&2&1\end{pmatrix}$. Find $A_1$ and its entries at the two zero entries of $A$. Now delete $D_3$, so $A=2I_2$: find the set of all best rank-1 approximations of $A$ and the set of values their (car, $D_2$) entry takes.
> (b) Find the set of values of $\cos(U_1^Tq,U_1^TD_j)$ over all $q,D_j$ with non-zero codes.
> (c) Rows *river, bank, loan*; $D_1$ = "river bank", $D_2$ = "bank loan": $A=\begin{pmatrix}1&0\\1&1\\0&1\end{pmatrix}$, query $q=e_1$ ("river"). Find the concept-space inner products $(U_k^Tq)^T(U_k^TD_j)$ for $j=1,2$ at $k=1$ and $k=2$, and the raw inner products $q^TD_j$.
> (d) Double every count in $D_1$ of (a): $A'=\begin{pmatrix}4&0&1\\0&2&1\end{pmatrix}$. Find $u_1$ and the concept-space inner products at $k=1$ of $q=e_2$ ("automobile") with $D_1,D_2,D_3$. Then normalise each column of $A'$ to unit length and find $u_1$ and the three inner products again.

**Solution.**
- **Step 1. (a)** $AA^T=\begin{pmatrix}5&1\\1&5\end{pmatrix}$: eigenvalues $6$ ($u_1=\frac1{\sqrt2}(1,1)$) and $4$ ($u_2=\frac1{\sqrt2}(1,-1)$) (L6 §3).
- **Step 2.** $A_1=u_1(u_1^TA)$. $u_1^TA=\frac1{\sqrt2}(2,2,2)$. So $A_1=\frac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}\cdot\sqrt2(1,1,1)=\begin{pmatrix}1&1&1\\1&1&1\end{pmatrix}$.
- **Step 3.** At the two zero entries of $A$ (car, $D_2$) and (automobile, $D_1$): both are $1$. This is the inferred synonymy (L6 §3).
- **Step 4. Delete $D_3$:** $A=2I_2$, $\sigma_1=\sigma_2=2$ (tie). Any unit $u=(\cos\varphi,\sin\varphi)$ gives a best rank-1 approximation $2uu^T$. The set is $\{2uu^T:\|u\|=1\}$.
- **Step 5.** The (car, $D_2$) entry is $2\cos\varphi\sin\varphi=\sin2\varphi\in[-1,1]$: every value in $[-1,1]$.
- **Step 6. (b)** At $k=1$ the codes are scalars, so $\cos=\pm1$ (sign of the product): the set is $\{-1,+1\}$ (L6 caveat: cosine needs $k\ge2$).
- **Step 7. (c)** $AA^T=\begin{pmatrix}1&1&0\\1&2&1\\0&1&1\end{pmatrix}$ with eigenvalues $3,1,0$ and eigenvectors $\frac1{\sqrt6}(1,2,1)$, $\frac1{\sqrt2}(1,0,-1)$, $\frac1{\sqrt3}(1,-1,1)$.
- **Step 8. $k=1$:** $U_1^Tq=\frac1{\sqrt6}$; $U_1^TD_1=\frac3{\sqrt6}$; $U_1^TD_2=\frac3{\sqrt6}$. Inner products: $\frac1{\sqrt6}\cdot\frac3{\sqrt6}=\mathbf{0.5}$ for **both** $D_1$ and $D_2$.
- **Step 9. $k=2$:** add the second coordinate: $U_2^Tq=(\frac1{\sqrt6},\frac1{\sqrt2})$; $U_2^TD_1=(\frac3{\sqrt6},\frac1{\sqrt2})$; $U_2^TD_2=(\frac3{\sqrt6},-\frac1{\sqrt2})$. Inner products: $D_1$: $0.5+0.5=\mathbf1$; $D_2$: $0.5-0.5=\mathbf0$.
- **Step 10. Raw:** $q^TD_1=1$, $q^TD_2=0$.
- **Step 11. (d)** $A'A'^T=\begin{pmatrix}17&1\\1&5\end{pmatrix}$: eigenvalues $11\pm\sqrt{37}=17.08,\ 4.92$. $u_1\propto(1,\sqrt{37}-6)=(1,0.083)$: $u_1=(0.9966,\ 0.0825)$ (pulled towards *car* because $D_1$ is long).
- **Step 12.** $q=e_2$: $u_1^Tq=0.0825$. $u_1^TD_1=3.986$, $u_1^TD_2=0.165$, $u_1^TD_3=1.079$. Inner products: $D_1$: $\mathbf{0.329}$, $D_2$: $\mathbf{0.014}$, $D_3$: $\mathbf{0.089}$. So the *automobile* query prefers $D_1$ (which only says *car*, but is long) over $D_2$ (which says *automobile*): length bias.
- **Step 13. Normalise columns:** $A''=\begin{pmatrix}1&0&0.7071\\0&1&0.7071\end{pmatrix}$, $A''A''^T=\begin{pmatrix}1.5&0.5\\0.5&1.5\end{pmatrix}$, $u_1=\frac1{\sqrt2}(1,1)$. $u_1^Tq=0.7071$; $u_1^TD_1=0.7071$, $u_1^TD_2=0.7071$, $u_1^TD_3=1$. Inner products: $\mathbf{0.5},\ \mathbf{0.5},\ \mathbf{0.707}$.

> [!success] Answer
> (a) $A_1=\begin{pmatrix}1&1&1\\1&1&1\end{pmatrix}$, both zero entries become $1$. For $A=2I_2$: all $2uu^T$ ($u$ any unit vector); (car, $D_2$) entry takes every value in $[-1,1]$ (the answer is not unique when $\sigma_1=\sigma_2$). (b) $\{-1,+1\}$. (c) $k=1$: $(0.5,0.5)$; $k=2$: $(1,0)$; raw: $(1,0)$. At $k=1$ the synonym link makes $D_2$ score as high as $D_1$; at $k=2$ (full rank) the concept space reproduces the raw match. (d) Unnormalised: $u_1=(0.997,0.083)$, scores $(0.329,0.014,0.089)$. Normalised: $u_1=\frac1{\sqrt2}(1,1)$, scores $(0.5,0.5,0.707)$. Always normalise document lengths first.

### D2 (masked completion)

> **Question.** A rank-1 model $\hat A_{ij}=a_ib_j$ is fitted to the observed entries $\mathcal K$ of a user–item matrix by minimising $\sum_{(u,i)\in\mathcal K}(A_{ui}-\hat A_{ui})^2$. The observation graph is bipartite (users, items; an edge per observed rating).
> (a) $A=\begin{pmatrix}5&4&3\\10&8&6\\15&12&\cdot\end{pmatrix}$ ($\cdot$ is the one unobserved entry). Find the set of predictions $\hat A_{u_3m_3}$ over all zero-loss rank-1 models.
> (b) Only five entries are observed: $A_{u_1m_1}=5$, $A_{u_1m_2}=4$, $A_{u_2m_1}=10$, $A_{u_2m_2}=8$, $A_{u_3m_3}=6$. Find the connected components of the observation graph and the set of predictions $\hat A_{u_1m_3}$ over all zero-loss rank-1 models with positive factors. Then add the observation $A_{u_3m_1}=15$ and find the set again.
> (c) Fix item factors $q=(1,0.8,0.6)$. One ALS user step at $k=1$ minimises $\sum_{i\ rated}(A_{ui}-pq_i)^2+\lambda p^2$ over $p$. User $u_3$ rated $m_1,m_2$ as $15,12$. Find $p_{u_3}$ and the prediction $p_{u_3}q_3$ for $\lambda=0,1,5$. A second user rated 20 items, each with $q_i=1$ and rating $15$: find $p$ at $\lambda=0$ and $\lambda=5$, and the ratio $\frac{p(\lambda=5)}{p(\lambda=0)}$ for both users.
> (d) Let every item factor be $q_i=0\in\mathbb R^k$. Find the ALS user update $p_u$, the following item update $q_i$, and the masked loss after any number of iterations.

**Solution.**
- **Step 1. (a)** Zero loss on the 8 observed entries: $a_1b_1=5$, $a_1b_2=4$, $a_1b_3=3$, $a_2b_1=10$, $a_2b_2=8$, $a_2b_3=6$, $a_3b_1=15$, $a_3b_2=12$. From the first row, $b\propto(5,4,3)/a_1$. $a_2b_1=10\Rightarrow a_2=2a_1$. $a_3b_1=15\Rightarrow a_3=3a_1$. Then $\hat A_{u_3m_3}=a_3b_3=3a_1\cdot\frac3{a_1}=9$.
- **Step 2. (b) Components.** Edges: $u_1m_1,u_1m_2,u_2m_1,u_2m_2$ (one component $\{u_1,u_2,m_1,m_2\}$) and $u_3m_3$ (a second component $\{u_3,m_3\}$). **Two** components.
- **Step 3. Prediction.** $\hat A_{u_1m_3}=a_1b_3$. In component 1: $a_1b_1=5$ fixes only the product, so $a_1=s>0$ is free (then $b_1=\frac5s$). In component 2: $a_3b_3=6$, so $b_3=\frac6{a_3}$ with $a_3>0$ free. So $a_1b_3=\frac{6s}{a_3}$ is **any positive number**: set $=(0,\infty)$. The two components are not tied together, so the scale is not identified.
- **Step 4. Add $A_{u_3m_1}=15$.** Now $u_3$ joins component 1 (one connected component). $a_3b_1=15$, $a_1b_1=5\Rightarrow a_3=3a_1$. $a_3b_3=6\Rightarrow b_3=\frac6{3a_1}=\frac2{a_1}$. $\hat A_{u_1m_3}=a_1\cdot\frac2{a_1}=2$: the set is $\{2\}$.
- **Step 5. (c) Ridge solution** $p=\frac{\sum A_{ui}q_i}{\sum q_i^2+\lambda}$. $u_3$: $\sum Aq=15+12(0.8)=24.6$, $\sum q^2=1+0.64=1.64$.

| $\lambda$ | $p_{u_3}$ | prediction $p_{u_3}q_3$ ($q_3=0.6$) |
|---|---|---|
| 0 | $\frac{24.6}{1.64}=15.0$ | 9.0 |
| 1 | $\frac{24.6}{2.64}=9.32$ | 5.59 |
| 5 | $\frac{24.6}{6.64}=3.70$ | 2.22 |

- **Step 6. Second user.** $p=\frac{20\cdot15}{20+\lambda}$: $\lambda=0$: $15$; $\lambda=5$: $\frac{300}{25}=12$.
- **Step 7. Ratios.** $u_3$: $\frac{1.64}{6.64}=0.247$. Second user: $\frac{20}{25}=0.80$. Ridge shrinks users with **few** ratings much more than users with many ratings.
- **Step 8. (d)** $q_i=0$: user step minimises $\sum(A_{ui}-0)^2+\lambda\|p\|^2$, a constant plus $\lambda\|p\|^2$, so $p_u=0$ (for $\lambda>0$; if $\lambda=0$ any $p$ works). Item step with all $p_u=0$ gives $q_i=0$. Masked loss $=\sum_{\mathcal K}A_{ui}^2$ at every iteration (never improves).

> [!success] Answer
> (a) $\{9\}$. (b) Two components $\{u_1,u_2,m_1,m_2\}$ and $\{u_3,m_3\}$; predictions for $\hat A_{u_1m_3}$: every positive real $(0,\infty)$. After adding $A_{u_3m_1}=15$ the graph is connected and the prediction is $\{2\}$. (c) $p_{u_3}=15,\ 9.32,\ 3.70$ and predictions $9,\ 5.59,\ 2.22$ for $\lambda=0,1,5$. Second user: $p=15$ and $12$. Ratios $0.247$ and $0.80$. (d) $p_u=0$, $q_i=0$, loss stays $\sum A_{ui}^2$: zero init is stuck (use random init, L6 §4). Takeaway: low-rank completion needs the observation graph to be connected.

## Section E: The curse of dimensionality in numbers

### E1 (KDE at the mode)

> **Question.** $X_1,\dots,X_n\sim N(0,I_d)$, $\hat p(0)=\frac1n\sum_i\varphi_h(X_i)$, $\varphi_h(x)=(2\pi h^2)^{-d/2}e^{-\|x\|^2/2h^2}$; $p(0)=(2\pi)^{-d/2}$. The density of $Z_1+Z_2$, $Z_1\sim N(0,s_1^2I)$, $Z_2\sim N(0,s_2^2I)$ independent, is $\varphi_{\sqrt{s_1^2+s_2^2}}$.
> (a) Find $E\hat p(0)$, the relative bias $\frac{E\hat p(0)}{p(0)}-1$, and its leading order for small $h$. (b) Find $E[\varphi_h(X)^2]$ for $X\sim N(0,I_d)$. (c) Find the relative MSE $\varepsilon(h,n)=\frac{\mathrm{MSE}(\hat p(0))}{p(0)^2}$ and evaluate at $d=1$, $n=4$, $h=0.78$. (d) The smallest $n$ with $\min_h\varepsilon(h,n)\le0.1$ is $4,19,223,2788,43684,841566$ for $d=1,2,4,6,8,10$. Find the ratios $\frac{n(d+2)}{n(d)}$. For fixed $h>0$ find $\lim_{d\to\infty}$ of the squared relative bias, and the set of $h$ for which $\big(h^2(2+h^2)\big)^{-d/2}\to\infty$.

**Solution.**
- **Step 1. (a)** $E\hat p(0)=E\varphi_h(X)=\int\varphi_h(x)p(x)dx$. Since $\varphi_h$ is symmetric, this is the density of $Z_1+Z_2$ at $0$ with $Z_1\sim N(0,h^2I)$, $Z_2\sim N(0,I)$: $\varphi_{\sqrt{1+h^2}}(0)=\left(2\pi(1+h^2)\right)^{-d/2}$.
- **Step 2. Relative bias:**
$$\frac{E\hat p(0)}{p(0)}-1=(1+h^2)^{-d/2}-1\approx-\frac{dh^2}2\ \ (h\text{ small})$$
- **Step 3. (b)** $\varphi_h(x)^2=(2\pi h^2)^{-d}e^{-\|x\|^2/h^2}=(4\pi h^2)^{-d/2}\varphi_{h/\sqrt2}(x)$. So $E[\varphi_h(X)^2]=(4\pi h^2)^{-d/2}\,E\varphi_{h/\sqrt2}(X)=(4\pi h^2)^{-d/2}\left(2\pi(1+\tfrac{h^2}2)\right)^{-d/2}$:
$$E[\varphi_h(X)^2]=(2\pi)^{-d}\big(h^2(2+h^2)\big)^{-d/2}$$
- **Step 4. (c)** $\mathrm{MSE}=\mathrm{Var}+\mathrm{bias}^2$, $\mathrm{Var}(\hat p(0))=\frac1n\left(E\varphi_h^2-(E\varphi_h)^2\right)$. Divide by $p(0)^2=(2\pi)^{-d}$:
$$\varepsilon(h,n)=\frac1n\Big[\big(h^2(2+h^2)\big)^{-d/2}-(1+h^2)^{-d}\Big]+\Big[(1+h^2)^{-d/2}-1\Big]^2$$
- **Step 5. Evaluate** $d=1$, $n=4$, $h=0.78$ ($h^2=0.6084$): $h^2(2+h^2)=1.587$, so $1.587^{-1/2}=0.7938$; $(1.6084)^{-1}=0.6217$. Variance part: $\frac{0.7938-0.6217}4=0.0430$. Bias: $(1.6084)^{-1/2}-1=-0.2115$, squared $0.0447$. $\varepsilon=0.0430+0.0447=0.0877\le0.1$ ✓.
- **Step 6. (d) Ratios:** $\frac{223}{19}=11.7$ ($d=2\to4$); $\frac{2788}{223}=12.5$ ($4\to6$); $\frac{43684}{2788}=15.7$ ($6\to8$); $\frac{841566}{43684}=19.3$ ($8\to10$). Each 2 extra dimensions multiplies $n$ by 12 to 19, and the factor keeps growing.
- **Step 7. Squared bias limit.** For fixed $h>0$, $(1+h^2)^{-d/2}\to0$, so the squared relative bias $\to(0-1)^2=1$: $\hat p(0)/p(0)\to0$ (the estimate collapses; it is $100\%$ wrong).
- **Step 8. Blow-up of the variance factor.** $\big(h^2(2+h^2)\big)^{-d/2}\to\infty$ iff $h^2(2+h^2)<1\iff h^4+2h^2-1<0\iff h^2<\sqrt2-1$.

> [!success] Answer
> (a) $E\hat p(0)=(2\pi(1+h^2))^{-d/2}$; relative bias $(1+h^2)^{-d/2}-1\approx-\frac{dh^2}2$. (b) $E\varphi_h^2=(2\pi)^{-d}\big(h^2(2+h^2)\big)^{-d/2}$. (c) $\varepsilon=\frac1n\big[(h^2(2+h^2))^{-d/2}-(1+h^2)^{-d}\big]+\big[(1+h^2)^{-d/2}-1\big]^2$; at $d=1,n=4,h=0.78$: $0.088$. (d) Ratios $11.7,12.5,15.7,19.3$. Squared bias $\to1$. Variance factor $\to\infty$ iff $h<\sqrt{\sqrt2-1}\approx0.644$. So for any fixed $h$: either the bias kills you ($h$ large) or the variance blows up ($h$ small): no fixed bandwidth works as $d\to\infty$.

### E2 (how big is a neighbourhood)

> **Question.** (a) $n=10^6$ points uniform in $[0,1]^d$. A 10-NN query sees an expected fraction $r=10^{-5}$ of the data. Find the side length $e_d(r)$ of a cube holding that fraction at $d=10$ and $d=2$. (b) Find the fraction of $[0,1]^d$ within distance $0.1$ (in each coordinate) of the boundary at $d=2,10,100$. (c) Now the $10^6$ points lie on the diagonal $x=t(1,\dots,1)\in[0,1]^{10}$, $t\sim U[0,1]$. Find $\|x-x'\|$ in terms of $t,t'$ and the expected fraction of the segment's length spanned by a 10-NN neighbourhood. (d) Add independent $N(0,s^2I_{10})$ noise to each point of (c). For two independent points find $E\|x-x'\|^2$ as a function of $s$, and the $s$ at which the noise contributes half of it.

**Solution.**
- **Step 1. (a)** A cube of side $e$ has volume $e^d$, so $e_d(r)=r^{1/d}$ (L6 §8). $d=10$: $(10^{-5})^{0.1}=10^{-0.5}=0.316$. $d=2$: $10^{-2.5}=0.00316$.
- **Step 2. (b)** The inner cube (distance $>0.1$ from every face) has side $0.8$ and volume $0.8^d$. So the boundary fraction is $1-0.8^d$: $d=2$: $0.36$; $d=10$: $0.893$; $d=100$: $1-2\times10^{-10}\approx1$.
- **Step 3. (c)** $x-x'=(t-t')(1,\dots,1)$, so $\|x-x'\|=\sqrt{10}\,\lvert t-t'\rvert$. The 10 nearest points among $10^6$ are a fraction $10^{-5}$ of the data, and $t$ is uniform, so they span a fraction $\approx10^{-5}$ of the segment's length (tiny, since the intrinsic dimension is $1$).
- **Step 4. (d)** $x=t\mathbf1+\epsilon$: $E\|x-x'\|^2=10E(t-t')^2+E\|\epsilon-\epsilon'\|^2=\frac{10}6+20s^2$ (using $E(t-t')^2=\frac16$ and $\epsilon-\epsilon'\sim N(0,2s^2I_{10})$).
- **Step 5. Half from noise:** noise part $=$ signal part, so $20s^2=\frac{10}6=1.667\Rightarrow s^2=\frac1{12}\Rightarrow s=0.289$.

> [!success] Answer
> (a) $0.316$ (at $d=10$) and $0.00316$ (at $d=2$): in 10-D a "local" neighbourhood needs $32\%$ of each axis. (b) $0.36,\ 0.89,\ \approx1$. (c) $\|x-x'\|=\sqrt{10}\lvert t-t'\rvert$; fraction $\approx10^{-5}$ of the segment (neighbourhoods are tiny because the data is really 1-dimensional). (d) $E\|x-x'\|^2=\frac{10}6+20s^2$; noise is half at $s=\frac1{\sqrt{12}}\approx0.289$. Intrinsic dimension, not ambient dimension, decides how big a neighbourhood must be.

### E3 (distances concentrate)

> **Question.** $x,y$ independent uniform in $[0,1]^d$. (a) Using $E(x_i-y_i)^2=\frac16$ and $E(x_i-y_i)^4=\frac1{15}$ find the relative standard deviation $\frac{\mathrm{sd}\|x-y\|^2}{E\|x-y\|^2}$ and to first order that of $\|x-y\|$. (b) For 200 data points and one query, the largest and smallest of 200 roughly Gaussian distances sit about $2.75$ standard deviations above and below the mean. Find the predicted relative gap $\frac{\text{dist}_{\max}-\text{dist}_{\min}}{\text{dist}_{\min}}$ at $d=2,100,3000$. (c) At $d=2$ place the query at the centre of the square. Find the median $r_{1/2}$ of the nearest-neighbour distance among 200 points, and the relative gap when $\text{dist}_{\min}=r_{1/2}$ and $\text{dist}_{\max}=\frac{\sqrt2}2$. (d) Find $\lim_{d\to\infty}$ of the relative gap in each case: (i) points uniform on a fixed unit square embedded in $\mathbb R^d$ by an isometry $T$; (ii) two clusters $N(\mu_1,I_d)$, $N(\mu_2,I_d)$ with $\|\mu_1-\mu_2\|=\Delta$: find $E\|x-y\|^2$ for $x,y$ in different clusters divided by that for the same cluster, for $\Delta$ fixed and for $\Delta=c\sqrt d$.

**Solution.**
- **Step 1. (a)** $D=\|x-y\|^2=\sum_i(x_i-y_i)^2$, a sum of $d$ i.i.d. terms. $E D=\frac d6$. $\mathrm{Var}D=d\left(\frac1{15}-\frac1{36}\right)=d\cdot\frac7{180}$. Relative sd of $D$:
$$\frac{\sqrt{7d/180}}{d/6}=\frac{6\sqrt{7/180}}{\sqrt d}=\frac{1.183}{\sqrt d}$$
- **Step 2. First order for $\|x-y\|=\sqrt D$:** relative sd $\approx\frac12\cdot\frac{1.183}{\sqrt d}=\frac{0.592}{\sqrt d}$.
- **Step 3. (b)** Let $\rho=\frac{0.592}{\sqrt d}$ (relative sd of a distance). $\text{dist}_{\max}\approx\mu(1+2.75\rho)$, $\text{dist}_{\min}\approx\mu(1-2.75\rho)$:
$$\text{gap}=\frac{5.5\rho}{1-2.75\rho}$$
  - $d=100$: $\rho=0.0592$: gap $=\frac{0.3254}{0.8373}=0.39$.
  - $d=3000$: $\rho=0.0108$: gap $=\frac{0.0594}{0.9703}=0.061$ (about $6\%$, matches L6 §9).
  - $d=2$: $\rho=0.418$, so $1-2.75\rho<0$: the Gaussian approximation breaks down (distances are far from Gaussian in 2-D); use (c).
- **Step 4. (c)** Probability that all 200 points are farther than $r$: $(1-\pi r^2)^{200}$ (disc area $\pi r^2$ inside the square for $r\le0.5$). Median: $(1-\pi r^2)^{200}=\frac12\Rightarrow\pi r^2=1-2^{-1/200}=0.00346$, $r_{1/2}=0.0332$.
- **Step 5. Gap:** $\frac{0.7071-0.0332}{0.0332}\approx20$.
- **Step 6. (d)(i)** An isometry keeps all distances unchanged, so the relative gap is the same as in 2-D for every $d$: it does **not** go to $0$ (stays $\approx20$ at $n=200$). Intrinsic dimension matters, not the ambient one.
- **Step 7. (ii)** Same cluster: $E\|x-y\|^2=2d$. Different clusters: $2d+\Delta^2$. Ratio $=1+\frac{\Delta^2}{2d}$. $\Delta$ fixed: $\to1$ (clusters indistinguishable by distance). $\Delta=c\sqrt d$: $\to1+\frac{c^2}2$ (a constant $>1$, separation survives).

> [!success] Answer
> (a) Relative sd of $\|x-y\|^2$ is $\frac{1.183}{\sqrt d}$, of $\|x-y\|$ it is $\frac{0.592}{\sqrt d}$. (b) $d=100$: $0.39$; $d=3000$: $0.061$; $d=2$: formula invalid (use (c)). (c) $r_{1/2}\approx0.033$, gap $\approx20$. (d) (i) Gap does **not** tend to $0$ (stays $\approx20$). (ii) $1+\frac{\Delta^2}{2d}$: $\to1$ for fixed $\Delta$; $\to1+\frac{c^2}2$ for $\Delta=c\sqrt d$.

### E4 (PCA: where it gives out; PDF solution reformatted)

> **Question.** $n=1000$ training points with $2+m$ coordinates. The first two are signal: each has variance 1, and their $2\times2$ covariance matrix has eigenvalues $1.42$ and $0.58$ (the *stronger* and *weaker* signal directions). The other $m$ are junk: independent $N(0,\sigma^2)$, $\sigma^2=0.16$, independent of the signal. Let $\gamma=m/n$. Facts: (i) if every coordinate is independent $N(0,\sigma^2)$, the largest sample-covariance eigenvalue is about $\sigma^2(1+\sqrt\gamma)^2$ (the *noise edge*); (ii) a signal direction of variance $\lambda$ is *found* by PCA iff $\lambda>\sigma^2(1+\sqrt\gamma)$, and then its sample eigenvalue is about $\lambda+\frac{\gamma\sigma^2\lambda}{\lambda-\sigma^2}$.
> (a) For points $x,y,y'$ find the sd of the junk part of $\|x-y\|^2-\|x-y'\|^2$ and evaluate at $m=100,1000$. Find the expected signal part of $\|x-y\|^2$ and the smallest $m$ at which the junk sd exceeds it. (b) Find the noise edge at $m=100,500,1000$ and the $m$ at which the edge equals $0.58$. (c) For the weaker direction find the predicted sample eigenvalue at $m=1000$ and the largest $m$ at which PCA still finds it. At the $m$ where the noise edge equals $0.58$ find the predicted sample eigenvalue and whether the direction is lost. (d) The analyst z-scores every coordinate (centre, divide by sd) before PCA, on all $2+m$ coordinates. Find the new $\sigma^2$ and, for each signal direction, the largest $m$ at which PCA still finds it. Find the same for the stronger direction without z-scoring, and whether z-scoring helps. Now let the junk have $\sigma^2=4$ (signal unchanged): without and with z-scoring find the largest $m$ at which PCA finds the stronger direction, and whether z-scoring helps.

**Solution.**
- **Step 1. (a) One junk coordinate.** With $a,b,c\sim N(0,\sigma^2)$ the noise of $x,y,y'$: $(a-b)^2-(a-c)^2=(b^2-c^2)-2a(b-c)$. $\mathrm{Var}(b^2-c^2)=4\sigma^4$, $\mathrm{Var}(2a(b-c))=8\sigma^4$, uncorrelated: variance $12\sigma^4$. Over $m$ coordinates: $\mathrm{sd}=\sigma^2\sqrt{12m}$. $m=100$: $0.16\times34.6=5.5$. $m=1000$: $0.16\times109.5=17.5$.
- **Step 2. Signal part.** Each of the 2 signal coordinates has $E(x_i-y_i)^2=2\mathrm{Var}(x_i)=2$: total $4$. Junk sd $>4$: $0.16\sqrt{12m}>4\iff\sqrt{12m}>25\iff m>52.1$: **$m=53$**.
- **Step 3. (b) Edge** $=0.16(1+\sqrt{m/1000})^2$: $m=100$: $0.277$; $m=500$: $0.466$; $m=1000$: $0.640$. Edge $=0.58$: $(1+\sqrt\gamma)^2=\frac{0.58}{0.16}=3.625\Rightarrow\sqrt\gamma=0.904\Rightarrow\gamma=0.817$, **$m=817$**.
- **Step 4. (c)** $\lambda=0.58$, $\sigma^2=0.16$, $\lambda-\sigma^2=0.42$. $m=1000$ ($\gamma=1$): $0.58+\frac{0.16\times0.58}{0.42}=0.58+0.22=\mathbf{0.80}$.
- **Step 5. Largest $m$ found:** $0.58>0.16(1+\sqrt\gamma)\iff\sqrt\gamma<2.625\iff\gamma<6.89$, so $m<6890.6$: **$m=6890$**.
- **Step 6. At $m=817$** ($\gamma=0.817$): $0.58+\frac{0.817\times0.16\times0.58}{0.42}=0.58+0.18=\mathbf{0.76}>0.58$: the sample eigenvalue sits above the noise edge. **Not lost**; it is lost only past $m=6890$.
- **Step 7. (d) Z-scoring.** Every coordinate now has variance $1$: junk $\sigma^2=1$; signal variances stay $1.42,0.58$.
  - Weaker: $0.58<1\le1(1+\sqrt\gamma)$, found for **no** $m$.
  - Stronger: $1.42>1+\sqrt\gamma\iff\sqrt\gamma<0.42\iff\gamma<0.1764$: $m<176.4$, **$m=176$**.
- **Step 8. Without z-scoring (stronger):** $1.42>0.16(1+\sqrt\gamma)\iff\sqrt\gamma<7.875\iff\gamma<62.02$: $m<62\,015$, **$m=62015$**.
- **Step 9. $\sigma^2=4$.** Without z-scoring: $1.42<4\le4(1+\sqrt\gamma)$: found for **no** $m$. With z-scoring: junk variance becomes $1$, same as above: found up to $m=176$.

> [!success] Answer
> (a) sd $5.5$ and $17.5$; signal part $4$; $m=53$. (b) $0.277,0.466,0.640$; edge $=0.58$ at $m=817$. (c) Sample eigenvalue $0.80$ at $m=1000$; found up to $m=6890$; at $m=817$ it is $0.76>0.58$, not lost. (d) Z-scoring ($\sigma^2=1$): weaker never found, stronger up to $m=176$. Without z-scoring the stronger direction is found up to $m=62015$, so here z-scoring **hurts** (it lifts junk variance from $0.16$ to $1$). With junk $\sigma^2=4$: without z-scoring never found; with z-scoring up to $m=176$: z-scoring **helps**. Rule: z-scoring sets junk variance to $1$ whatever it was, so it helps if the raw junk variance is above the signal's, and hurts if it is below.

## Section F: Case study, UMAP

### F1 (per-point bandwidth)

> **Question.** Point $i$ has neighbour distances $d_1\le\dots\le d_k$, $\rho_i=d_1$. Its bandwidth solves $S(\sigma):=\sum_{j=1}^ke^{-(d_j-\rho_i)/\sigma}=\log_2k$ and its edge weights are $w_{j|i}=e^{-(d_j-\rho_i)/\sigma_i}$. Take $k=4$.
> (a) Distances $(1.0,1.1,1.2,1.5)$: find the range of $S(\sigma)$ over $\sigma\in(0,\infty)$, $\sigma_i$ and the four weights. (b) Distances $(5,5.5,6,7.5)$: find $\sigma_i$ and the weights. (c) Distances $(D,D+0.1,D+0.2,D+0.5)$: find $\sigma_i$, the weights and the nearest-neighbour weight as a function of $D$. (d) For general $k$ find the range of $S(\sigma)$ and the set of solutions $\sigma>0$ for $k=2$ and $k=1$. (e) The fuzzy union is $w_{ij}=w_{i|j}+w_{j|i}-w_{i|j}w_{j|i}$. Evaluate it and the average $\frac12(w_{i|j}+w_{j|i})$ at $(1,0.1)$ and $(0.5,0.5)$. If $w_{i|j},w_{j|i}$ are the probabilities of two independent directed edges, find the probability that at least one exists.

**Solution.**
- **Step 1. (a) Range.** The nearest neighbour always gives $e^0=1$. As $\sigma\to0$ the other terms $\to0$, so $S\to1$. As $\sigma\to\infty$ all terms $\to1$, so $S\to4$. $S$ increases with $\sigma$: range $(1,4)$. Target $\log_24=2$ is inside, so there is a unique $\sigma$.
- **Step 2. Solve.** Offsets $(0,0.1,0.2,0.5)$: $1+e^{-0.1/\sigma}+e^{-0.2/\sigma}+e^{-0.5/\sigma}=2$ (bisection). $\sigma=0.19$: sum $=2.012$; $\sigma=0.18$: $1.965$; so $\sigma_i\approx0.1874$.
- **Step 3. Weights:** $(1,\ e^{-0.534},\ e^{-1.067},\ e^{-2.668})=(1,\ 0.587,\ 0.344,\ 0.069)$ (sum $=2$ ✓).
- **Step 4. (b)** Offsets $(0,0.5,1,2.5)=5\times$ the offsets in (a). Only $\frac{\text{offset}}\sigma$ matters, so $\sigma_i=5\times0.1874=0.937$ and the **same weights** $(1,0.587,0.344,0.069)$.
- **Step 5. (c)** Offsets are $(0,0.1,0.2,0.5)$ for every $D$ (only differences from $\rho_i=D$ matter): $\sigma_i=0.1874$, weights $(1,0.587,0.344,0.069)$, nearest-neighbour weight $=1$ for every $D$.
- **Step 6. (d)** Range $(1,k)$ (open). $S$ is increasing, so for each target $1<\log_2k<k$ ($k\ge3$) the solution is unique. For $k=2$: target $\log_22=1$, but $S>1$ for every $\sigma>0$ (the second term is positive): **no solution** ($\sigma\to0$ only in the limit; as in L6 §11). For $k=1$: $S\equiv1$ and the target is $\log_21=0$: **no solution**. Both sets are empty.
- **Step 7. (e)** $(1,0.1)$: $w=1+0.1-0.1=1.0$; average $0.55$. $(0.5,0.5)$: $w=0.5+0.5-0.25=0.75$; average $0.5$. For independent directed edges, $\Pr[\text{at least one}]=1-(1-a)(1-b)=a+b-ab$: the same expression: $1.0$ and $0.75$.

> [!success] Answer
> (a) Range $(1,4)$; $\sigma_i\approx0.187$; weights $(1,0.587,0.344,0.069)$. (b) $\sigma_i\approx0.937$, same weights. (c) $\sigma_i\approx0.187$, same weights, nearest-neighbour weight $1$ for all $D$ (scale- and shift-invariant). (d) Range $(1,k)$; no solution for $k=2$ and none for $k=1$. (e) Fuzzy union $1.0$ and $0.75$; averages $0.55$ and $0.5$; probability of at least one edge $=a+b-ab$ (same). The union keeps a strong edge from either side; the average dilutes it.

### F2 (spectral initialisation)

> **Question.** For a graph with Laplacian $L=D-W$, the 1-D spectral embedding places vertex $i$ at $y_i$, where $y$ is a unit eigenvector of $L$.
> (a) For the path $1-2-3-4$ find $L$ and $y^TLy$ as a sum over edges. Its eigenvalues are $0,\ 2-\sqrt2,\ 2,\ 2+\sqrt2$, with eigenvector $(0.653,0.271,-0.271,-0.653)$ for $2-\sqrt2$. Find the order of the four vertices along the line under this embedding. (b) Find the eigenvector for eigenvalue $0$, its value of $y^TLy$, and the number of distinct positions in the embedding it gives. (c) For two disjoint edges $\{1,2\}$ and $\{3,4\}$ find the spectrum of $L$ and each eigenspace. Find the unit vectors in the eigenvalue-$0$ eigenspace orthogonal to $\mathbf1$, and the set of values of $\frac{\lvert y_1-y_2\rvert}{\lvert y_3-y_4\rvert}$ over unit $y$ in the eigenvalue-$2$ eigenspace.

**Solution.**
- **Step 1. (a)** $D=\mathrm{diag}(1,2,2,1)$:
$$L=\begin{pmatrix}1&-1&0&0\\-1&2&-1&0\\0&-1&2&-1\\0&0&-1&1\end{pmatrix},\qquad y^TLy=(y_1-y_2)^2+(y_2-y_3)^2+(y_3-y_4)^2$$
- **Step 2. Order.** $y=(0.653,0.271,-0.271,-0.653)$ is decreasing: vertices lie in the order $1,2,3,4$ (preserves the path order).
- **Step 3. (b)** Eigenvalue $0$: $y=\frac12(1,1,1,1)$ (unit). $y^TLy=0$. All four vertices land at the **same** position (1 distinct position): useless, so discard it (L6 §11).
- **Step 4. (c)** $L=\mathrm{blockdiag}\left(\begin{pmatrix}1&-1\\-1&1\end{pmatrix},\begin{pmatrix}1&-1\\-1&1\end{pmatrix}\right)$; each block has eigenvalues $0$ (vector $(1,1)$) and $2$ (vector $(1,-1)$). Spectrum: $0$ (multiplicity 2) and $2$ (multiplicity 2).
- **Step 5. Eigenspaces:** $\lambda=0$: $\mathrm{span}\{(1,1,0,0),(0,0,1,1)\}$. $\lambda=2$: $\mathrm{span}\{(1,-1,0,0),(0,0,1,-1)\}$.
- **Step 6. Orthogonal to $\mathbf1$.** $y=a(1,1,0,0)+b(0,0,1,1)$ with $\mathbf1^Ty=2a+2b=0\Rightarrow b=-a$; unit: $y=\pm\frac12(1,1,-1,-1)$ (two vectors). It puts $\{1,2\}$ at $+\frac12$ and $\{3,4\}$ at $-\frac12$: separates the two components.
- **Step 7. Ratio in the $\lambda=2$ space.** $y=a(1,-1,0,0)+b(0,0,1,-1)$ with $2a^2+2b^2=1$. $\lvert y_1-y_2\rvert=2\lvert a\rvert$, $\lvert y_3-y_4\rvert=2\lvert b\rvert$. Ratio $=\frac{\lvert a\rvert}{\lvert b\rvert}$ can be any value in $[0,\infty)$.

> [!success] Answer
> (a) $L$ as above; order $1,2,3,4$. (b) $y=\frac12\mathbf1$, $y^TLy=0$, one distinct position: useless. (c) Spectrum $\{0,0,2,2\}$; $\lambda=0$ unit vectors orthogonal to $\mathbf1$: $\pm\frac12(1,1,-1,-1)$; ratio takes every value in $[0,\infty)$ (the $\lambda=2$ eigenspace has no preferred split between the two edges).

## Section G: Case study, RAG

> [!info] Data for G1: $N=4$, $z_1=(0.8,0.6)$, $z_2=(0.6,0.8)$, $z_3=(0,1)$, $z_4=(-0.6,0.8)$, $z_q=(0.7,0.7)$. Scores $s_i=\langle z_q,z_i\rangle=(0.98,\ 0.98,\ 0.70,\ 0.14)$.

### G1 (truncation bound)

> **Question.** Corpus of $N$ passages with embeddings $z_i$, query $z_q$, scores $s_i=\langle z_q,z_i\rangle$, $w_i=\frac{e^{s_i/\tau}}{\sum_{j=1}^Ne^{s_j/\tau}}$, $g_i=p_\theta(y\mid q,c_i)$, $p=\sum_{i=1}^Nw_ig_i$, $\hat p=\sum_{i\in Z_k}w_ig_i$, $\varepsilon_k=\sum_{i\notin Z_k}w_i$; $Z_k$ is the set of $k$ highest-scoring passages, so $\lvert p-\hat p\rvert\le\varepsilon_k$.
> (a) Find the scores, weights and $\varepsilon_1,\varepsilon_2$ at $\tau=0.05$. (b) $g_1=0.9$, $g_2=0.1$, $g_3,g_4\in[0,1]$ unknown: find the largest possible top-1 error $\lvert p-\hat p\rvert$ and compare it with $\varepsilon_1$; find the condition on the $g_i$ under which $\lvert p-\hat p\rvert=\varepsilon_k$. (c) Find the weights and $\varepsilon_2$ at $\tau=1$. (d) Keep $c_1,c_2$ and replace $c_3,c_4$ by $N-2$ off-topic passages each scoring $0.14$. At $\tau=0.05$ find $\varepsilon_2$ for $N=10^3,10^6,10^9$, and the smallest score gap $\Delta$ between $0.98$ and the off-topic score for which $\varepsilon_2\le0.01$ at $N=10^6$. Then find $\varepsilon_2$ at $N=10^6$ when the off-topic score is $0.5$. (e) Every score in (a) is lowered by $0.8$. Find the weights and the set of shifts $c$ for which $s_i\mapsto s_i-c$ leaves them unchanged. (f) The correct answer $y^*$ has $g_1=g_2=0.05$ (both top passages are out of date) and $g_3=g_4=0.9$. At $\tau=0.05$ find $p,\hat p$ for $k=2$ and $\varepsilon_2$.

**Solution.**
- **Step 1. (a) Scores** $(0.98,0.98,0.70,0.14)$. Divide by $\tau=0.05$: $(19.6,19.6,14,2.8)$. Relative to $e^{19.6}$: $(1,\ 1,\ e^{-5.6}=0.00370,\ e^{-16.8}=5.1\times10^{-8})$. Sum $=2.00370$.
- **Step 2. Weights:** $w=(0.49908,\ 0.49908,\ 0.001846,\ 2.5\times10^{-8})$.
- **Step 3.** $\varepsilon_1=1-w_1=0.5009$. $\varepsilon_2=w_3+w_4=0.001846$ (≈ $0.002$, L6 §13).
- **Step 4. (b) Top-1 error.** $p-\hat p=w_2g_2+w_3g_3+w_4g_4$. Largest when $g_3=g_4=1$: $0.49908(0.1)+0.001846+0.000000025=0.0518$. Compare $\varepsilon_1=0.5009$: the actual worst case is 10 times smaller, because $g_2=0.1$ is small (the bound assumed $g_2=1$).
- **Step 5. Equality condition.** $p-\hat p=\sum_{i\notin Z_k}w_ig_i=\sum_{i\notin Z_k}w_i=\varepsilon_k$ iff $g_i=1$ for every left-out passage $i\notin Z_k$ (with $w_i>0$). The $g_i$ inside $Z_k$ do not matter.
- **Step 6. (c) $\tau=1$:** $e^{s}=(2.6645,2.6645,2.0138,1.1503)$, sum $8.4931$. $w=(0.3137,\ 0.3137,\ 0.2371,\ 0.1354)$. $\varepsilon_2=0.2371+0.1354=0.3725$. (A large temperature spreads the weights, so truncation hurts.)
- **Step 7. (d)** With $N-2$ off-topic passages at score $0.14$: let $u=(N-2)e^{-16.8}=(N-2)\times5.06\times10^{-8}$. Then $\varepsilon_2=\frac u{2+u}$.
  - $N=10^3$: $u=5.05\times10^{-5}$, $\varepsilon_2=2.5\times10^{-5}$.
  - $N=10^6$: $u=0.0506$, $\varepsilon_2=\frac{0.0506}{2.0506}=0.0247$.
  - $N=10^9$: $u=50.6$, $\varepsilon_2=\frac{50.6}{52.6}=0.962$.
- **Step 8. Gap for $\varepsilon_2\le0.01$ at $N=10^6$.** Off-topic score $=0.98-\Delta$: $u=(N-2)e^{-\Delta/\tau}$. Need $\frac u{2+u}\le0.01\iff u\le\frac{0.02}{0.99}=0.0202$. So $e^{-\Delta/0.05}\le\frac{0.0202}{999998}=2.02\times10^{-8}$, $\frac\Delta{0.05}\ge17.72$, **$\Delta\ge0.886$** (off-topic score $\le0.094$).
- **Step 9. Off-topic score $0.5$:** $\Delta=0.48$, $e^{-9.6}=6.77\times10^{-5}$, $u=67.7$, $\varepsilon_2=\frac{67.7}{69.7}=0.971$.
- **Step 10. (e)** Softmax is shift-invariant: $\frac{e^{(s_i-c)/\tau}}{\sum e^{(s_j-c)/\tau}}=\frac{e^{s_i/\tau}}{\sum e^{s_j/\tau}}$. Weights unchanged: same as (a). Every shift $c\in\mathbb R$ leaves them unchanged.
- **Step 11. (f)** $p=0.49908(0.05)+0.49908(0.05)+0.001846(0.9)+2.5\times10^{-8}(0.9)=0.04991+0.00166=\mathbf{0.0516}$. $\hat p=0.04991$. $\varepsilon_2=0.001846$. $p-\hat p=0.00166\le\varepsilon_2$ ✓.

> [!success] Answer
> (a) Scores $(0.98,0.98,0.70,0.14)$; $w=(0.4991,0.4991,0.0018,2.5\times10^{-8})$; $\varepsilon_1=0.501$, $\varepsilon_2=0.0018$. (b) Largest error $0.052$ vs $\varepsilon_1=0.501$; equality iff $g_i=1$ for all $i\notin Z_k$. (c) $w=(0.314,0.314,0.237,0.135)$, $\varepsilon_2=0.373$. (d) $\varepsilon_2=2.5\times10^{-5},\ 0.025,\ 0.96$ for $N=10^3,10^6,10^9$; need $\Delta\ge0.886$ for $\varepsilon_2\le0.01$ at $N=10^6$; with off-topic score $0.5$, $\varepsilon_2=0.97$. Truncation fails when many mediocre passages outweigh the few good ones: distance concentration (a small score gap) makes this worse. (e) Weights unchanged; every shift $c$ works. (f) $p=0.0516$, $\hat p=0.0499$, $\varepsilon_2=0.0018$: truncation loses almost nothing, but the answer probability is low because both retrieved passages are outdated.

### G2 (where the learning signal goes)

> **Question.** A training pair $(q,y)$ retrieves $Z_k$. For $i\in Z_k$: $s_i=\langle z_q,z_i\rangle$, $w_i=\frac{e^{s_i/\tau}}{\sum_{j\in Z_k}e^{s_j/\tau}}$, $g_i=p_\theta(y\mid q,c_i)$. The loss is $-\log p$ with $p=\sum_{i\in Z_k}w_ig_i$, $r_i:=\frac{w_ig_i}p$.
> (a) Find $\frac{\partial\log p}{\partial s_i}$ in terms of $r_i,w_i,\tau$, and find $\sum_{i\in Z_k}\frac{\partial\log p}{\partial s_i}$. (b) Find $\nabla_\theta\log p$ in terms of the $r_i$ and $\nabla_\theta\log g_i$. With $Z_2$ and $r=(0.9,0.1)$ find the weight on $\nabla_\theta\log g_2$. (c) Assume every $w_i>0$. Find the set of $(g_i)_{i\in Z_k}$ for which every $\frac{\partial\log p}{\partial s_i}$ is $0$. (d) $z_1=(0.8,0.6)$, $z_2=(0.6,0.8)$, $z_3=(0,1)$, $z_q=(0.7,0.7)$, $\tau=0.1$, $Z_3=\{c_1,c_2,c_3\}$, $g=(0.9,0.1,0.1)$. Find $w,p,r,\frac{\partial\log p}{\partial s_i},\nabla_{z_q}\log p$, and the change $\Delta s_j$ of each score after the step $z_q\leftarrow z_q+\alpha\nabla_{z_q}\log p$ (to first order in $\alpha$). Which score falls most? If instead $z_2=z_1$, find $s_1-s_2$ after any update of $z_q$.

**Solution.**
- **Step 1. (a)** (L6 §13 lemma.) $\log p=\log\sum_je^{s_j/\tau}g_j-\log\sum_je^{s_j/\tau}$. Differentiate:
$$\frac{\partial\log p}{\partial s_i}=\frac1\tau\left(\frac{e^{s_i/\tau}g_i}{\sum_je^{s_j/\tau}g_j}-\frac{e^{s_i/\tau}}{\sum_je^{s_j/\tau}}\right)=\frac{r_i-w_i}\tau$$
- **Step 2.** Sum: $\sum_i\frac{r_i-w_i}\tau=\frac{1-1}\tau=0$ (since $\sum r_i=\sum w_i=1$). Shifting all scores equally changes nothing.
- **Step 3. (b)** $w_i$ does not depend on $\theta$, so $\nabla_\theta p=\sum w_ig_i\nabla_\theta\log g_i$ and
$$\nabla_\theta\log p=\sum_{i\in Z_k}r_i\nabla_\theta\log g_i$$
With $r=(0.9,0.1)$: weight $0.1$ on $\nabla_\theta\log g_2$ (the passage that explains $y$ poorly barely trains the generator).
- **Step 4. (c)** All derivatives are $0\iff r_i=w_i$ for all $i\iff\frac{w_ig_i}p=w_i\iff g_i=p$ for all $i$ (as $w_i>0$). So all $g_i$ are equal.
- **Step 5. (d) Scores** $s=(0.98,0.98,0.70)$, $s/\tau=(9.8,9.8,7)$: $e^{9.8}=18034$, $e^7=1096.6$. $w=(0.48525,\ 0.48525,\ 0.02951)$.
- **Step 6.** $p=0.48525(0.9)+0.48525(0.1)+0.02951(0.1)=0.43673+0.04853+0.00295=0.4882$.
- **Step 7.** $r=\frac{w_ig_i}p=(0.8946,\ 0.0994,\ 0.0060)$.
- **Step 8.** $\frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}{0.1}=(4.093,\ -3.859,\ -0.235)$ (sum $\approx0$ ✓).
- **Step 9. Gradient on $z_q$** ($\frac{\partial s_i}{\partial z_q}=z_i$): $\nabla_{z_q}\log p=\sum_i\frac{\partial\log p}{\partial s_i}z_i=4.093(0.8,0.6)-3.859(0.6,0.8)-0.235(0,1)=(0.959,\ -0.866)$.
- **Step 10. Score changes.** $\Delta s_j=\langle\Delta z_q,z_j\rangle=\alpha\langle\nabla,z_j\rangle$:
  - $j=1$: $\alpha(0.959\cdot0.8-0.866\cdot0.6)=+0.248\alpha$.
  - $j=2$: $\alpha(0.959\cdot0.6-0.866\cdot0.8)=-0.117\alpha$.
  - $j=3$: $\alpha(0-0.866)=-0.866\alpha$.
- **Step 11. If $z_2=z_1$:** $s_1-s_2=\langle z_q,z_1-z_2\rangle=0$ for any $z_q$, forever. The retriever cannot separate duplicates, even though $g_1\ne g_2$.

> [!success] Answer
> (a) $\frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}\tau$ (posterior minus prior); the sum is $0$. (b) $\nabla_\theta\log p=\sum r_i\nabla_\theta\log g_i$; weight on $\nabla_\theta\log g_2$ is $0.1$. (c) $\{g_1=g_2=\dots=g_k\}$ (all passages explain $y$ equally). (d) $w=(0.485,0.485,0.030)$, $p=0.488$, $r=(0.895,0.099,0.006)$, derivatives $(4.09,-3.86,-0.23)$, $\nabla_{z_q}\log p=(0.959,-0.866)$; $\Delta s=\alpha(+0.248,-0.117,-0.866)$: $s_1$ rises, $s_3$ falls most. If $z_2=z_1$: $s_1-s_2=0$ always.

### G3 (RAG-Sequence vs RAG-Token)

> **Question.** Retrieve $Z_k$ with weights $w_i=\frac{e^{s_i/\tau}}{\sum_je^{s_j/\tau}}$. For a two-token answer $y=(y_1,y_2)$: $a_i=p_\theta(y_1\mid q,c_i)$, $b_i=p_\theta(y_2\mid q,c_i,y_1)$, $p_{seq}=\sum_{i\in Z_k}w_ia_ib_i$, $p_{tok}=\left(\sum w_ia_i\right)\left(\sum w_ib_i\right)$.
> (a) Find $p_{seq}-p_{tok}$ in terms of $\mathrm{Cov}_w(a,b)$ (covariance of $a_i$ and $b_i$ when $i$ is drawn with probability $w_i$). Find the condition under which $p_{seq}>p_{tok}$ and two conditions under which they are equal. (b) $Z_2=\{c_1,c_2\}$, $w=(0.5,0.5)$: find both probabilities for $a=b=(0.9,0.1)$ and for $a=(0.9,0.1)$, $b=(0.1,0.9)$. (c) Query "In which year and month was the prime minister born?" Passage $c_1$ says 1956, March; passage $c_2$ (a different person) says 1961, June. Each passage gives probability $0.9$ to its own year (month) and $0.1$ to the other's, whatever the first token was; $w=(0.5,0.5)$. Find $p_{seq}$ and $p_{tok}$ for all four answers and the answers ranked highest by each. (d) Find $\frac{\partial\log p_{tok}}{\partial s_i}$ and $\frac{\partial\log p_{seq}}{\partial s_i}$ in terms of $w_i,\tau$ and the posteriors $r_{i,1}=\frac{w_ia_i}{\sum_jw_ja_j}$, $r_{i,2}=\frac{w_ib_i}{\sum_jw_jb_j}$, $r_i^{seq}=\frac{w_ia_ib_i}{p_{seq}}$. Evaluate the posteriors and both derivatives for the second table in (b).

**Solution.**
- **Step 1. (a)** $p_{seq}=E_w[ab]$ and $p_{tok}=E_w[a]E_w[b]$, so $p_{seq}-p_{tok}=E_w[ab]-E_w[a]E_w[b]=\mathrm{Cov}_w(a,b)$.
- **Step 2.** $p_{seq}>p_{tok}\iff\mathrm{Cov}_w(a,b)>0$: the passages that give a high first-token probability also give a high second-token probability. Equal iff the covariance is $0$, e.g.: (i) $a_i$ (or $b_i$) is the same for all passages in $Z_k$ (a constant has zero covariance), or (ii) $k=1$ (one passage: both equal $a_1b_1$).
- **Step 3. (b) First table** $a=b=(0.9,0.1)$: $p_{seq}=0.5(0.81)+0.5(0.01)=0.41$. $p_{tok}=(0.5)(0.5)=0.25$. Difference $0.16=\mathrm{Cov}$ ✓.
- **Step 4. Second table** $a=(0.9,0.1)$, $b=(0.1,0.9)$: $p_{seq}=0.5(0.09)+0.5(0.09)=0.09$. $p_{tok}=0.25$. Difference $-0.16=\mathrm{Cov}$ ✓.
- **Step 5. (c)** Year $1956$: $a=(0.9,0.1)$; $1961$: $a=(0.1,0.9)$. March: $b=(0.9,0.1)$; June: $b=(0.1,0.9)$. $E_w[a]=E_w[b]=0.5$ always, so $p_{tok}=0.25$ for **all four** answers.

| answer | $p_{seq}$ | $p_{tok}$ |
|---|---|---|
| 1956, March | $0.5(0.81)+0.5(0.01)=0.41$ | 0.25 |
| 1961, June | $0.5(0.01)+0.5(0.81)=0.41$ | 0.25 |
| 1956, June | $0.5(0.09)+0.5(0.09)=0.09$ | 0.25 |
| 1961, March | $0.09$ | 0.25 |

- **Step 6. (d)** For $p_{tok}$: $\log p_{tok}=\log\sum w_ja_j+\log\sum w_jb_j$ and each term uses the G2 lemma (with $g=a$, then $g=b$). For $p_{seq}$: G2 lemma with $g_i=a_ib_i$:
$$\frac{\partial\log p_{tok}}{\partial s_i}=\frac{r_{i,1}+r_{i,2}-2w_i}\tau,\qquad\frac{\partial\log p_{seq}}{\partial s_i}=\frac{r_i^{seq}-w_i}\tau$$
- **Step 7. Second table** $a=(0.9,0.1)$, $b=(0.1,0.9)$, $w=(0.5,0.5)$: $\sum w a=0.5$, so $r_{\cdot,1}=(0.9,0.1)$. $\sum wb=0.5$, so $r_{\cdot,2}=(0.1,0.9)$. $w_ia_ib_i=(0.045,0.045)$, $p_{seq}=0.09$, $r^{seq}=(0.5,0.5)$.
- **Step 8. Derivatives.** Token: $\frac{(0.9+0.1-1,\ 0.1+0.9-1)}\tau=(0,0)$. Sequence: $\frac{(0.5-0.5,\ 0.5-0.5)}\tau=(0,0)$.

> [!success] Answer
> (a) $p_{seq}-p_{tok}=\mathrm{Cov}_w(a,b)$; $p_{seq}>p_{tok}$ iff the covariance is positive; equal if $a$ (or $b$) is constant over $Z_k$, or $k=1$. (b) First table: $0.41$ vs $0.25$. Second table: $0.09$ vs $0.25$. (c) $p_{tok}=0.25$ for all four answers (cannot tell consistent from mixed answers); $p_{seq}=0.41$ for (1956, March) and (1961, June), $0.09$ for the mixed ones. RAG-Sequence correctly prefers answers whose year and month come from the **same** passage. (d) $\frac{\partial\log p_{tok}}{\partial s_i}=\frac{r_{i,1}+r_{i,2}-2w_i}\tau$, $\frac{\partial\log p_{seq}}{\partial s_i}=\frac{r_i^{seq}-w_i}\tau$; for the second table both are $(0,0)$: posterior $=$ prior, so there is no retrieval signal (each passage explains one token exactly as well as the other).

---

# Index of ⚠ items (not in your notes)

| Problem | What I used | Why |
|---|---|---|
| Tut 2 B2 | Gaussian tail $2e^{-t^2/2}$ (Chernoff recipe on the Gaussian MGF) | Needed for the $O(\log d/\epsilon^2)$ result |
| Tut 2 B3 | Least-squares line fit with extrapolation | Regression is not covered; extends the sample-mean idea |
| Tut 3 A1 | Least-squares regression formulas | Same |
| Tut 3 D3 | Photo's singular values | Not given in the PDF; only formulas and storage ratios are computable |
| Tut 3 F1(a) | Sphere density $(1-s^2)^{(d-3)/2}$ | Slide derives the ball case only |
| Tut 4 B2 | Classical MDS (double centring) | Not in the notes; steps follow the problem's hint |
| Tut 4 B3 | Random-projection interval $[\lambda_-,\lambda_+]$ | The problem supplies the formulas |
| Tut 1 A2 | Stirling approximation | Given as the problem's hint |
