# PART A: High-dimensional geometry, concentration, JL

## Problem A1: Rejection sampling a uniform point in the ball ★★★

*(Combines his ASM rejection-sampling question with Week 2's volume facts.)*
To sample $x$ uniformly from the unit ball $B^d$: draw $x$ uniform in the cube $[-1,1]^d$ and accept if $\|x\|\le1$.

### Q1. Find the acceptance probability $p_d$. Evaluate it for $d=2,3,10$ and give the expected number of proposals per accepted sample.

**Solution.** The proposal is uniform on the cube, so $p_d=\dfrac{\text{vol}(B^d)}{\text{vol}([-1,1]^d)}=\dfrac{V_d(1)}{2^d}$, $V_d(1)=\dfrac{\pi^{d/2}}{\Gamma(d/2+1)}$.

| $d$ | $V_d(1)$ | $p_d$ | expected proposals $1/p_d$ (geometric mean) |
|---|---|---|---|
| 2 | $\pi=3.14$ | $\pi/4=0.785$ | 1.27 |
| 3 | $4\pi/3=4.19$ | $\pi/6=0.524$ | 1.91 |
| 10 | $\pi^5/120=2.55$ | $0.00249$ | about 402 |

(For $d=20$ it is about $4\times10^7$.)

### Q2. How does $1/p_d$ grow with $d$? Justify.

**Solution.** Stirling gives $V_d(1)\approx\left(\frac{2\pi e}{d}\right)^{d/2}\frac1{\sqrt{\pi d}}$, so
$$p_d\approx\left(\frac{\pi e}{2d}\right)^{d/2}\frac1{\sqrt{\pi d}}\to0$$
faster than any exponential: the base $\frac{\pi e}{2d}$ itself goes to $0$. The expected number of proposals $1/p_d$ grows faster than exponentially. The reason is that the ball's volume goes to $0$ while the cube's volume $2^d$ grows, so almost all of the cube lies in its corners.

### Q3. Give an $O(d)$-per-sample alternative and justify that it is exactly uniform on $B^d$.

**Solution.**
1. Draw $z\sim N(0,I_d)$ and set $\theta=z/\|z\|$. The density of $z$ depends only on $\|z\|$ (it is rotation-invariant), so $\theta$ is uniform on the sphere.
2. Radius: for uniform $x\in B^d$, $\Pr[\|x\|\le r]=\frac{V(r)}{V(1)}=r^d$ (volume scales as $r^d$). Inverse transform: $R=U^{1/d}$, $U\sim\text{Unif}(0,1)$.
3. Return $x=R\,\theta$ ($R$ independent of $\theta$). Cost: $d$ Gaussians plus one norm, $O(d)$, and no rejection.

### Q4. For uniform $x\in B^d$ find $E\|x\|$, the median of $\|x\|$, and the fraction of volume inside radius $0.9$ at $d=100$.

**Solution.** Density of $R$: $\frac{d}{dr}r^d=dr^{d-1}$.
- $E[R]=\int_0^1 r\cdot dr^{d-1}dr=\frac d{d+1}$.
- Median: $r^d=\frac12\Rightarrow r=2^{-1/d}\approx1-\frac{\ln2}d$ ($d=100$: $0.9931$).
- $\Pr[R\le0.9]=0.9^{100}=2.7\times10^{-5}$.

Almost all the volume is in a shell of width $O(1/d)$.

---

## Problem A2: Is it about balls? Surface and slab concentration for the cube ★★★

*(Same Week 2 results, different shape: which proof steps survive?)* Let $x$ be uniform in the cube $K=[-1,1]^d$.

### Q5. What fraction of the cube's volume lies within distance $\epsilon$ of its boundary (distance measured as $1-\max_i|x_i|$)? Evaluate it for $\epsilon=0.01$ at $d=10$ and $d=100$. Which step of the ball proof did you reuse?

**Solution.** The points farther than $\epsilon$ from the boundary form the shrunken cube $(1-\epsilon)K$. Scaling by $t$ multiplies $d$-dimensional volume by $t^d$ (the Jacobian argument from the ball proof; it never used roundness). So the boundary fraction is $1-(1-\epsilon)^d$: $d=10$: $9.6\%$; $d=100$: $63\%$. **Surface concentration holds for any shape scaled about an interior point** (any convex body containing the origin), not only balls.

### Q6. Does the thin-slab ("equator") phenomenon hold for the cube? Compare the projection onto $e_1$ with the projection onto the diagonal $u=\frac1{\sqrt d}(1,\dots,1)$, both in absolute terms and relative to $\|x\|$.

**Solution.**
- $x_1$ is uniform on $[-1,1]$ for **every** $d$: its density is flat, so there is no concentration of $x_1$ near $0$.
- $\langle x,u\rangle=\frac1{\sqrt d}\sum_ix_i$: mean 0, variance $\frac1d\cdot d\cdot\frac13=\frac13$, approximately $N(0,\frac13)$ (CLT). That is $O(1)$, again not shrinking.
- But $\|x\|^2=\sum x_i^2\approx\frac d3$, so $\|x\|\approx\sqrt{d/3}$ (it concentrates; it is a sum of $d$ i.i.d. terms). **Relative** to the length, $\frac{|\langle x,u\rangle|}{\|x\|}=O(\sqrt{3/d})\to0$ in every fixed direction.
- **Conclusion:** the ball's absolute statement "$|x_1|=O(1/\sqrt d)$" used that the ball has radius 1. The cube's radius grows like $\sqrt d$, so only the scale-free version (a point is nearly orthogonal to any fixed direction) survives. The ball proof (cross-sections are $(d-1)$-balls of radius $\sqrt{1-t^2}$) does not apply to the cube; the cube needs the independent-coordinates (CLT/concentration) argument instead.

---

## Problem A3: Near-orthogonality of random sign vectors ★★★

*(Applies Chernoff, stated for 0/1 variables, to a new object.)*
$u,v$ are independent and uniform on $\{\pm\frac1{\sqrt d}\}^d$ (random unit sign vectors).

### Q7. Find $E\langle u,v\rangle$ and $\mathrm{Var}\langle u,v\rangle$.

**Solution.** $\langle u,v\rangle=\frac1d\sum_i s_i$ with $s_i=\pm1$ i.i.d. fair. Mean $0$, variance $\frac1{d^2}\cdot d=\frac1d$. Typical size is $\frac1{\sqrt d}$.

### Q8. Bound $\Pr[|\langle u,v\rangle|\ge t]$ with Chebyshev and with Chernoff (you may only use the 0/1 Chernoff bound).

**Solution.**
- **Chebyshev:** $\le\frac{1/d}{t^2}=\frac1{dt^2}$.
- **Chernoff:** let $X$ be the number of coordinates where the signs agree, so $X\sim\text{Bin}(d,\frac12)$ (a sum of independent 0/1 variables) with $\mu=\frac d2$, and $\langle u,v\rangle=\frac{X-(d-X)}d=\frac{2X-d}d$. Then
$$|\langle u,v\rangle|\ge t\iff\left|X-\tfrac d2\right|\ge\tfrac{td}2=t\mu$$
so $\delta=t$ and $\Pr\le2e^{-\mu\delta^2/3}=2e^{-dt^2/6}$ (for $t\le1$).

### Q9. Evaluate both at $d=10^4$, $t=0.1$.

**Solution.** Chebyshev: $\frac1{10^4\cdot0.01}=0.01$. Chernoff: $2e^{-16.67}\approx1.2\times10^{-7}$.

### Q10. How many independent random sign vectors can you draw in $d=10^4$ so that, with probability $\ge\frac12$, **every** pair has $|\cos|\le0.1$? Compare the two bounds. What is the lesson?

**Solution.** There are fewer than $\frac{n^2}2$ pairs; union bound: need $\frac{n^2}2\cdot q\le\frac12$, i.e. $n\le1/\sqrt q$.
- Chebyshev ($q=0.01$): $n\le10$.
- Chernoff ($q=2e^{-16.67}$): $n\le\sqrt{e^{16.67}/2}\approx2900$.

**Lesson:** the union bound over many pairs needs failure probabilities that are *exponentially* small. Only independence, through Chernoff, gives that. This is exactly why JL and the "$n$ points are nearly orthogonal" theorem use Chernoff-type tails, not Chebyshev. (Far more than $d$ vectors can be pairwise *almost* orthogonal, even though only $d$ can be *exactly* orthogonal.)

---

## Problem A4: Gaussian annulus in changed settings ★★★

### Q11. $x\sim N(0,\sigma^2I_d)$. Where is the annulus, and how wide is it? At what radius does the density of $\|x\|$ peak?

**Solution.** $x=\sigma z$ with $z\sim N(0,I_d)$, so $\|x\|=\sigma\|z\|\in[\sigma(\sqrt d-\beta),\sigma(\sqrt d+\beta)]$ with probability $\ge1-3e^{-\beta^2/8}$: radius $\sigma\sqrt d$, width $O(\sigma)$ (it does not grow with $d$).
Mass at radius $r$ is $\propto r^{d-1}e^{-r^2/2\sigma^2}$ (shell surface times density). Setting the log-derivative to zero, $\frac{d-1}r-\frac r{\sigma^2}=0$, gives $r^*=\sigma\sqrt{d-1}$.

### Q12. Using only Chebyshev, show the annulus has width $O(1)$ for $N(0,I_d)$. Why do we still need the Chernoff proof?

**Solution.** $\|z\|^2=\sum z_i^2$ with independent $z_i^2\sim\chi^2_1$ (mean 1, variance 2), so $E\|z\|^2=d$ and $\mathrm{Var}\|z\|^2=2d$. Since $\big|\|z\|^2-d\big|=\big|\|z\|-\sqrt d\big|(\|z\|+\sqrt d)\ge\big|\|z\|-\sqrt d\big|\sqrt d$:
$$\Pr\big[|\|z\|-\sqrt d|\ge\beta\big]\le\Pr\big[|\|z\|^2-d|\ge\beta\sqrt d\big]\le\frac{2d}{\beta^2d}=\frac2{\beta^2}$$
So width $O(1)$ already holds, but the tail is only **polynomial**. For $n$ points at once (union bound), Chebyshev needs $\beta\sim\sqrt n$, while Chernoff's $3e^{-\beta^2/8}$ needs only $\beta\sim\sqrt{8\ln(3n)}$. JL needs the second.

### Q13. Break point: let $x_1\sim N(0,d)$ and $x_2,\dots,x_d\sim N(0,1)$, all independent. Does $\|x\|$ still concentrate? State the general condition.

**Solution.** $\|x\|^2=d\,z_1^2+\sum_{i\ge2}z_i^2$. Mean $2d-1$, variance $2d^2+2(d-1)$, so the relative sd is $\frac{\sqrt{2d^2+2d}}{2d-1}\to\frac1{\sqrt2}$. **It does not concentrate.** For example, $\Pr[z_1^2\le0.1]\approx0.25$, so with probability about $\frac14$ the value of $\|x\|^2$ is below $1.1d$, far from its mean $2d$.
General: for independent $x_i\sim N(0,\sigma_i^2)$, the relative sd of $\|x\|^2$ is $\frac{\sqrt{2\sum\sigma_i^4}}{\sum\sigma_i^2}$. It tends to $0$ only if no single direction dominates the variance. The annulus needs **many comparable independent contributions** (spherical, or close to it).

---

## Problem A5: Separating two Gaussians, changed assumptions ★★★

### Q14. Both clusters are $N(\mu_i,\sigma^2I_d)$ (variance $\sigma^2$, not 1), $\|\mu_1-\mu_2\|=\Delta$. What separation suffices?

**Solution.** Scale everything by $\sigma$: same cluster $\|x-x'\|^2=2\sigma^2\|z\|^2=2d\sigma^2\pm O(\sigma^2\sqrt d)$; different clusters $2d\sigma^2+\Delta^2\pm O(\sigma^2\sqrt d)$ (the cross term $2\sqrt2\sigma\,\delta\cdot z$ is $O(\sigma\Delta)$, smaller). Need $\Delta^2\gg\sigma^2\sqrt d$, i.e. $\Delta=\Omega(\sigma d^{1/4})$.

### Q15. Now $\mu_1=\mu_2$ ($\Delta=0$) but the variances differ: $N(\mu,\sigma_1^2I)$ and $N(\mu,\sigma_2^2I)$. Can pairwise distances still separate the clusters? Take $d=10^4$, $\sigma_1=1$, $\sigma_2=1.1$.

**Solution.** Expected squared distances: within cluster 1, $2d\sigma_1^2=20000$; within cluster 2, $2d\sigma_2^2=24200$; across, $d(\sigma_1^2+\sigma_2^2)=22100$. Fluctuations are $O(\sigma^2\sqrt d)$: the sd of $2\sigma^2\|z\|^2$ is $2\sigma^2\sqrt{2d}\approx283$. The gaps of about $2100$ are roughly $7$ sd, so **yes**. In general $|\sigma_1^2-\sigma_2^2|\,d\gg\sigma^2\sqrt d$ suffices, i.e. $|\sigma_1^2-\sigma_2^2|\gg\sigma^2/\sqrt d$. The two clouds sit on annuli of radii $100$ vs $110$ with width $O(1)$. In high dimension, even equal means are separable.

### Q16. If the direction $w=(\mu_1-\mu_2)/\Delta$ is known (unit variances), what $\Delta$ suffices? Compare with $d^{1/4}$ at $d=10^4$.

**Solution.** Project: $w^Tx$ is 1-D $N(w^T\mu_i,1)$, with centres $\Delta$ apart. Classify by the midpoint: error $=\Phi(-\Delta/2)$. $\Delta=4$: $2.3\%$; $\Delta=10$: $3\times10^{-7}$. A **constant** $\Delta$ suffices, independent of $d$. The $d^{1/4}=10$ threshold is the price of not knowing the direction (using only distances).

---

## Problem A6: Concentration ladder on power-method restarts ★★

A random start of the power method is "bad" (i.e. $|x^Tv_1|\le\frac1{20\sqrt d}$) with probability about $0.04$. We run $100$ independent restarts. Let $X$ be the number of bad ones.

### Q17. Bound $\Pr[X\ge10]$ with Markov, Chebyshev and Chernoff.

**Solution.** $X\sim\text{Bin}(100,0.04)$: $\mu=4$, $\sigma^2=3.84$.
- Markov: $\frac4{10}=0.4$.
- Chebyshev: $\Pr[X-4\ge6]\le\frac{3.84}{36}=0.107$.
- Chernoff: $10=(1+\delta)4\Rightarrow\delta=1.5>1$, so use the general form: $\left(\frac{e^{1.5}}{2.5^{2.5}}\right)^4=(0.4535)^4=0.042$.
- (Exact: $0.0068$.) Each extra assumption (mean, then variance, then independence) tightens the bound.

### Q18. A bug makes all 100 restarts use the same random seed. What changes?

**Solution.** Now $X\in\{0,100\}$: $\Pr[\text{all bad}]=0.04$ instead of $0.04^{100}$. $\mathrm{Var}(\bar X)=\sigma^2$ instead of $\sigma^2/n$: perfect correlation removes all concentration. Markov and Chebyshev on $X$ still hold (they need no independence); Chernoff's factorisation $E[e^{tX}]=\prod E[e^{tX_i}]$ fails.

---

## Problem A7: Estimating the variance, where high dimension *helps* ★★★

*(Lecture 4 fits the mean; here the target changes to $\sigma^2$.)* $x^{(1)},\dots,x^{(n)}\sim N(\mu,\sigma^2I_d)$.

### Q19. Suppose $\mu$ is known. Use $\hat\sigma^2=\frac1{nd}\sum_i\|x^{(i)}-\mu\|^2$. Find $E\hat\sigma^2$, $\mathrm{Var}\,\hat\sigma^2$, and (by Chebyshev) the $n$ that guarantees relative error $\le5\%$ with probability $\ge95\%$, at $d=1$, $d=100$, $d=10^4$.

**Solution.** $\|x^{(i)}-\mu\|^2=\sigma^2\chi^2_d$ (mean $d\sigma^2$, variance $2d\sigma^4$), independent over $i$. So $E\hat\sigma^2=\sigma^2$ (unbiased) and $\mathrm{Var}\,\hat\sigma^2=\frac{n\cdot2d\sigma^4}{n^2d^2}=\frac{2\sigma^4}{nd}$.
Chebyshev: $\Pr\left[\left|\frac{\hat\sigma^2}{\sigma^2}-1\right|\ge\epsilon\right]\le\frac2{nd\epsilon^2}\le\eta\iff n\ge\frac2{d\epsilon^2\eta}=\frac{16000}d$.

| $d$ | 1 | 100 | $10^4$ |
|---|---|---|---|
| $n$ | 16,000 | 160 | 2 |

**The opposite of the mean:** estimating the mean coordinate-wise needs $n$ to **grow** with $d$; estimating the one shared $\sigma^2$ needs $n$ to **shrink** with $d$, because each sample gives $d$ independent squared deviations. This is the annulus theorem in disguise: one sample's $\|x-\mu\|$ is already $\sigma\sqrt d\pm O(\sigma)$.

### Q20. Now $\mu$ is unknown and you have only $n=2$ samples. Give an unbiased estimator of $\sigma^2$ and its relative standard deviation at $d=10^4$. What assumption, if broken, ruins it?

**Solution.** $x^{(1)}-x^{(2)}\sim N(0,2\sigma^2I_d)$ (the mean cancels), so $\|x^{(1)}-x^{(2)}\|^2=2\sigma^2\chi^2_d$ and $\tilde\sigma^2=\frac{\|x^{(1)}-x^{(2)}\|^2}{2d}$ is unbiased, with variance $\frac{4\sigma^4\cdot2d}{4d^2}=\frac{2\sigma^4}d$. Relative sd $\sqrt{2/d}=1.4\%$ at $d=10^4$: two points suffice.
**Breaks** if the covariance is not spherical (e.g. one coordinate with variance $d\sigma^2$: then a single $\chi^2_1$ term dominates and nothing concentrates, as in Q13), or if the coordinates are strongly correlated (then there are effectively far fewer than $d$ independent terms).

---

## Problem A8: JL, numbers and break points ★★★

Use the lecture's constants: $k\ge\frac{3\ln n}{c\epsilon^2}$, $c=\frac18$, failure probability $\le\frac3{2n}$.

### Q21. A colleague wants JL with $\epsilon=0.1$ for $n=10^6$ embeddings in $d=4096$. Evaluate. What about $\epsilon=0.2$ and $\epsilon=0.3$?

**Solution.** $k\ge\frac{24\ln n}{\epsilon^2}$, $\ln10^6=13.8$:

| $\epsilon$ | $k$ | vs $d=4096$ |
|---|---|---|
| 0.1 | 33,157 | larger than $d$: useless, keep the identity map |
| 0.2 | 8,290 | still larger than $d$ |
| 0.3 | 3,684 | barely smaller: almost no saving |

JL pays off only when $d\gg\epsilon^{-2}\log n$. (The slides' "$k\approx690$" for $n=1000,\epsilon=0.1$ drops the constant. In the exam, use whatever constant the question gives.)

### Q22. After building the projection for $n$ database points, $Q$ queries arrive later. Only query-to-database distances matter. What $k$ guarantees all of them with failure probability $\le\delta$?

**Solution.** Each query–point pair fails with probability $\le3e^{-ck\epsilon^2}$ (random projection theorem applied to $v=q-x_i$, using linearity). There are $Qn$ pairs; union bound: $3Qne^{-ck\epsilon^2}\le\delta\iff k\ge\frac{\ln(3Qn/\delta)}{c\epsilon^2}$. It grows only like $\log Q$. (The queries must be chosen independently of the random matrix; the guarantee is for fixed points, not adversarial ones.)

### Q23. Does JL preserve inner products? Give the error for unit vectors $x,y$. Then explain why cosine ranking of nearly orthogonal embeddings can still break.

**Solution.** Polarisation: $\langle x,y\rangle=\frac14\left(\|x+y\|^2-\|x-y\|^2\right)$. JL (applied to the points $x,-y,y$; $f$ is linear) keeps each squared norm within a factor $(1\pm\epsilon)^2$, i.e. an error of at most $(2\epsilon+\epsilon^2)\times$ the true value. So
$$\left|\tfrac1k\langle f(x),f(y)\rangle-\langle x,y\rangle\right|\le\frac{(2\epsilon+\epsilon^2)\left(\|x+y\|^2+\|x-y\|^2\right)}4=2\epsilon+\epsilon^2\quad(\|x\|=\|y\|=1)$$
This is an **additive** $O(\epsilon)$ error, not a relative one. **Break:** random high-dimensional embeddings have $|\cos|\approx\frac1{\sqrt d}$ (e.g. $0.01$ at $d=10^4$). With $\epsilon=0.1$ the error can reach about $0.21\gg0.01$, so the ranking among nearly orthogonal items can be destroyed.

### Q24. Sign matrix ($k=1$, $f(x)=\sum_ir_ix_i$, $r_i=\pm1$ fair, independent). Show $E[f(x)^2]=\|x\|^2$ and compute $\mathrm{Var}(f(x)^2)$. Compare with a Gaussian projection.

**Solution.** $f(x)^2=\sum_ix_i^2+2\sum_{i<j}r_ir_jx_ix_j$. $E[r_ir_j]=0$ for $i\ne j$, so $E f^2=\|x\|^2$. The products $r_ir_j$ (over distinct pairs) are pairwise uncorrelated with mean 0 and variance 1:
$$\mathrm{Var}(f^2)=4\sum_{i<j}x_i^2x_j^2=2\Big(\|x\|^4-\sum_ix_i^4\Big)$$
Gaussian: $f\sim N(0,\|x\|^2)$, so $\mathrm{Var}(f^2)=2\|x\|^4$. The sign matrix is never worse (for $k$ rows, divide by $k$).

> [!warning] Nuance vs the slide
> The slide says spiky $v=(1,0,\dots,0)$ breaks sign projections because $r_i\cdot v=\pm v_1$ is "one coin flip": each coordinate is not Gaussian, and the CLT argument fails. In an exam, give that reason (no rotation invariance; quality depends on $\|v\|_\infty/\|v\|_2$). Note, though, that for a **dense** $\pm1$ matrix $\|f(v)\|^2=kv_1^2$ exactly. The real failure is for **sparse** projections ($\{+\sqrt s,0,-\sqrt s\}$ entries): a one-hot $v$ meets only zeros with probability $(1-\frac1s)^k$. That is why Fast-JL spreads the mass (sign flips + Hadamard) before a sparse projection.

---

# PART B: SVD, power method, Eckart–Young, PCA, LoRA

## Problem B1: An SVD with a dial, and where the power method breaks ★★★

$A_c=\begin{pmatrix}2c&2c\\1&-1\\1&-1\end{pmatrix}$ for a parameter $c>0$ (row 1 = a user who likes both items equally, scaled by $c$; rows 2–3 = users who like item 1 and dislike item 2).

### Q25. Find the full SVD for $c=1$, then the singular values as functions of $c$.

**Solution.** The columns of $A_c$ are $(2c,1,1)$ and $(2c,-1,-1)$, so $A_c^TA_c=\begin{pmatrix}4c^2+2&4c^2-2\\4c^2-2&4c^2+2\end{pmatrix}$. This has the form $\begin{pmatrix}a&b\\b&a\end{pmatrix}$: eigenvalues $a+b=8c^2$ (eigenvector $\frac1{\sqrt2}(1,1)$) and $a-b=4$ (eigenvector $\frac1{\sqrt2}(1,-1)$).
At $c=1$: $\sigma_1=2\sqrt2$, $v_1=\frac1{\sqrt2}(1,1)$, $u_1=\frac{A v_1}{\sigma_1}=\frac{(4,0,0)/\sqrt2}{2\sqrt2}=(1,0,0)$; $\sigma_2=2$, $v_2=\frac1{\sqrt2}(1,-1)$, $u_2=\frac{(0,2,2)/\sqrt2}{2}=\frac1{\sqrt2}(0,1,1)$. Check: $\sigma_1^2+\sigma_2^2=12=\|A\|_F^2$ ✓.
In general the singular values are $2\sqrt2\,c$ (along $(1,1)$) and $2$ (along $(1,-1)$).

### Q26. For which $c$ is the top right singular vector $\frac1{\sqrt2}(1,1)$, and for which $c$ is it $\frac1{\sqrt2}(1,-1)$? What happens at the switch, and what does each $u_1$ say about the users?

**Solution.** $8c^2>4\iff c>\frac1{\sqrt2}$: $v_1=(1,1)/\sqrt2$ ("overall liking") and $u_1=e_1$ (only user 1 loads on it). For $c<\frac1{\sqrt2}$: $v_1=(1,-1)/\sqrt2$ ("item 1 over item 2") and $u_1=\frac1{\sqrt2}(0,1,1)$ (users 2, 3). At $c=\frac1{\sqrt2}$: $\sigma_1=\sigma_2=2$, a **tie**. Every unit vector is a top right singular vector, so the "dominant pattern" is not defined, and an arbitrarily small change in the data flips which pattern is called the most important.

### Q27. Power method on $B=A_c^TA_c$ from $x_0=(1,0)$: give $\tan\angle(x_t,v_1)$ and the iterations needed for $\tan\angle\le10^{-6}$ at $c=1,\ 0.8,\ 0.75,\ 0.72$. What happens as $c\downarrow\frac1{\sqrt2}$?

**Solution.** $x_0=\frac1{\sqrt2}(v_1+v_2)$, so $c_1=c_2$ and $\tan\angle(x_t,v_1)=\rho^t$ with $\rho=\left(\frac{\sigma_2}{\sigma_1}\right)^2=\frac4{8c^2}=\frac1{2c^2}$. Need $t\ge\frac{\ln10^6}{\ln(1/\rho)}$:

| $c$ | 1 | 0.8 | 0.75 | 0.72 |
|---|---|---|---|---|
| $\rho$ | 0.5 | 0.78 | 0.89 | 0.96 |
| $t$ | 20 | 56 | 118 | 383 |

As $c\to\frac1{\sqrt2}$, $\rho\to1$ and $t\to\infty$ (cost $\propto\frac1{\text{gap}}$). Exactly at the tie, $x_t=x_0$ for all $t$: the method "converges" instantly to whatever it started with. That is still a valid top singular vector, but it is not unique.

### Q28. At $c=1$, after finding $v_1$, deflate: compute $A-\sigma_1u_1v_1^T$. What do you notice, and why is this the same as $A(I-v_1v_1^T)$?

**Solution.** $\sigma_1u_1v_1^T=2\sqrt2\cdot e_1\cdot\frac1{\sqrt2}(1,1)=\begin{pmatrix}2&2\\0&0\\0&0\end{pmatrix}$, so $A-\sigma_1u_1v_1^T=\begin{pmatrix}0&0\\1&-1\\1&-1\end{pmatrix}$: user 1's row is removed completely and the rest is the rank-1 matrix $\sigma_2u_2v_2^T$. In general $Av_1=\sigma_1u_1$, so $\sigma_1u_1v_1^T=Av_1v_1^T$ and $A-\sigma_1u_1v_1^T=A(I-v_1v_1^T)$: deflation just projects every row off $v_1$. The next power method run therefore finds $v_2$ with rate $(\sigma_3/\sigma_2)^2$ (here $\sigma_3=0$, so one step).

---

## Problem B2: "A student claims…" (find the flaw) ★★★

### Q29. A student runs the power method on $A=\begin{pmatrix}1&3\\0&2\end{pmatrix}$ itself (not on $A^TA$), gets the Rayleigh quotient $2$, and reports $\sigma_1=2$. Correct?

**Solution.** **Incorrect.** The power method on $A$ converges to the dominant *eigen*vector $(3,1)/\sqrt{10}$ with eigenvalue $2$. For a non-symmetric matrix, eigenvalues are not singular values. $A^TA=\begin{pmatrix}1&3\\3&13\end{pmatrix}$ (trace 14, det 4) has $\lambda_1=7+\sqrt{45}=13.71$, so $\sigma_1=3.70$. Check: $\sigma_1\ge\|Ae_2\|=\|(3,2)\|=3.6>2$ already. ($\sigma_1$ is the maximum stretch; an eigenvector is only an invariant direction. A non-symmetric $A$ can even have complex eigenvalues, a rotation, and then the power method on $A$ never settles.)

### Q30. A student claims $\sigma_1(AB)=\sigma_1(A)\,\sigma_1(B)$ for all compatible $A,B$. Correct? What is true, and when is it an equality?

**Solution.** **Incorrect.** Counterexample: $A=\begin{pmatrix}1&0\\0&0\end{pmatrix}$, $B=\begin{pmatrix}0&0\\0&1\end{pmatrix}$: $\sigma_1(A)=\sigma_1(B)=1$ but $AB=0$.
True: $\sigma_1(AB)\le\sigma_1(A)\sigma_1(B)$, because $\|ABx\|\le\sigma_1(A)\|Bx\|\le\sigma_1(A)\sigma_1(B)\|x\|$ ($\sigma_1$ is the maximum stretch). Equality holds when $B$'s top output direction $u_1(B)$ is $A$'s top input direction $v_1(A)$: then $x=v_1(B)$ is stretched by $\sigma_1(B)$ and lands exactly where $A$ stretches most. In the counterexample, $B$ outputs along $e_2$, which $A$ kills.

### Q31. Why does the course iterate with $B=A^TA$ rather than $A$? Illustrate with $A=\mathrm{diag}(3,-3)$.

**Solution.** On $A$: $A^tx_0=(3^tc_1,(-3)^tc_2)\propto(c_1,(-1)^tc_2)$. It **oscillates** between two directions and never converges; $|x_t^Tx_{t-1}|=\frac{|c_1^2-c_2^2|}{c_1^2+c_2^2}<1$, so the stopping rule never fires. On $B=A^TA=9I$: every unit vector is a top singular vector, so $x_0$ itself is a correct answer.
Reasons for $B$: it is **symmetric PSD** (real eigenvalues $\sigma_i^2\ge0$, so no sign flips and no complex rotation), it works for **rectangular** $A$, and its top eigenvector *is* the best-fit direction ($\|Av\|^2=v^TBv$).

---

## Problem B3: Complexity (power method vs full SVD) ★★★

*(His Fenwick-vs-Alias style.)* $A\in\mathbb R^{n\times d}$ is sparse with $\mathrm{nnz}(A)$ non-zeros, $n=10^6$, $d=10^5$, $\mathrm{nnz}=10^8$, $\sigma_2/\sigma_1=0.9$.

### Q32. Cost per power-method iteration, and why you should not form $A^TA$.

**Solution.** Compute $A^T(Ax)$ as two sparse matvecs: $O(\mathrm{nnz})=2\times10^8$ flops. Forming $A^TA$ creates a $d\times d=10^{10}$-entry matrix (80 GB in float64), usually **dense** even when $A$ is sparse, and costs far more than a few matvecs.

### Q33. How many iterations are needed for $\tan\angle(x_t,v_1)\le\delta=10^{-6}$ from a typical random start ($|c_1|\approx1/\sqrt d$)? Total cost vs a full SVD?

**Solution.** $\tan\angle\le\frac1{|c_1|}\left(\frac{\sigma_2}{\sigma_1}\right)^{2t}\le\delta\iff t\ge\frac{\ln\frac1{|c_1|\delta}}{2\ln(\sigma_1/\sigma_2)}=\frac{13.8+5.76}{2(0.1054)}\approx93$.
Total $\approx93\times2\times10^8\approx2\times10^{10}$ flops. Full SVD: $O(nd\min(n,d))=10^6\cdot10^5\cdot10^5=10^{16}$. About $5\times10^5$ times cheaper. (For $k$ vectors by deflation: $O(\mathrm{nnz}\cdot k\cdot t)$; it wins when $k\ll\min(n,d)$.)

### Q34. The data changes slightly every day ($A\to A'$). How should you recompute $v_1$, and when does that fail?

**Solution.** **Warm start** from yesterday's $v_1$: if the gap is healthy, the new $v_1'$ is close to it, so $\tan\theta_0$ is small and $t\approx\frac{\ln(\tan\theta_0/\delta)}{2\ln(\sigma_1/\sigma_2)}$. E.g. $\tan\theta_0=10^{-3}$: $\frac{\ln1000}{0.21}\approx33$ iterations instead of 93. **Fails** when $\sigma_1\approx\sigma_2$: a tiny change can rotate the top direction a lot (in the tie case it is not even unique). It also fails if the warm start happens to be nearly orthogonal to the new $v_1$. Fix: add a small random perturbation, or use block iteration on the top few vectors.

---

## Problem B4: Eckart–Young with numbers ★★★

$A$ is $500\times800$ with singular values $(12,6,4,3,2,1)$ (rank 6).

### Q35. Without computing any new SVD, find the best rank-2 Frobenius error of (i) $A$, (ii) $A^T$, (iii) $3A$, (iv) $[A\ \ A]$ (the columns duplicated, $500\times1600$), (v) $A$ with 100 rows of zeros appended. For (iv), does the smallest $k$ with relative Frobenius error $\le25\%$ change?

**Solution.** By Eckart–Young the error is $\sqrt{\sum_{i>2}\sigma_i^2}$, so we only need each matrix's singular values.
- (i) $\sqrt{16+9+4+1}=\sqrt{30}=5.48$.
- (ii) $A^T=V\Sigma U^T$ has the same singular values: $5.48$.
- (iii) $3A$ has singular values $3\sigma_i$: $3\sqrt{30}=16.4$.
- (iv) $[A\ A][A\ A]^T=2AA^T$, so the singular values are $\sqrt2\sigma_i$: $\sqrt{60}=7.75$. The best approximation is $[A_2\ A_2]$.
- (v) Zero rows add nothing to $A^TA$: same singular values, $5.48$.
- Relative error $\sqrt{\sum_{i>k}\sigma_i^2/\sum\sigma_i^2}$ is unchanged by scaling every $\sigma_i$ by $\sqrt2$, so the answer is the same as for $A$: need $\sum_{i>k}\sigma_i^2\le0.0625\times210=13.1$, which gives $k=4$ (tail 5; $k=3$ leaves 14).

### Q36. Storage of $A_4$ vs $A$, and the break-even rank.

**Solution.** $k(m+n+1)=4\times1301=5204$ numbers vs $400{,}000$ (1.3%). Break-even $k<\frac{400000}{1301}\approx307$.

### Q37. A student says: "To compress $A$ to $k$ numbers' worth of information, keep its $k$ largest entries and zero the rest; that is as good as a rank-$k$ SVD." Test this on the $n\times n$ all-ones matrix $J$ and on $I_n$.

**Solution.** **Incorrect in general: low-rank is not the same as sparse.**
- $J=\mathbf1\mathbf1^T$ has rank 1, $\sigma_1=n$. The rank-1 SVD reproduces it exactly (error 0) using $2n+1$ numbers. Keeping $k=2n+1$ entries leaves $n^2-(2n+1)$ ones, so the Frobenius error is $\sqrt{n^2-2n-1}\approx n$, about 100% relative error.
- $I_n$: keeping its $n$ non-zero entries is exact, while any rank-$k$ approximation has Frobenius error $\sqrt{n-k}$ (all singular values are 1).
- So each method wins on a different structure. Eckart–Young says the truncated SVD is optimal **among rank-$k$ matrices**, not among all compressions.

---

## Problem B5: PCA vs uncentred SVD ★★★

Points $(1,2),(3,4),(5,6),(7,8)$.

### Q38. Do PCA: centroid, first principal component, variance explained, best-fit line.

**Solution.** Centroid $(4,5)$. Centred rows: $(-3,-3),(-1,-1),(1,1),(3,3)$. $\tilde A^T\tilde A=\begin{pmatrix}20&20\\20&20\end{pmatrix}$, eigenvalues $40,0$. $v_1=\frac1{\sqrt2}(1,1)$ explains $100\%$. Best-fit line: through $(4,5)$ with slope 1, i.e. $y=x+1$, residual $0$. All points lie on it.

### Q39. A student skips centring and takes the top right singular vector of the raw $A$. What do they get? What is the residual?

**Solution.** $A^TA=\begin{pmatrix}84&100\\100&120\end{pmatrix}$, trace 204, det 80: $\lambda_{1,2}=102\pm\sqrt{10324}$, i.e. $203.61$ and $0.39$. $v_1$: $(84-203.61)a+100b=0\Rightarrow$ slope $1.196$, not 1. Residual $=\lambda_2=0.39\ne0$, even though the points are exactly collinear. The best line **through the origin** cannot contain them ($y=x+1$ misses the origin), and its direction is pulled toward the mean $(4,5)$ (slope 1.25). PCA = SVD **after** centring.

---

## Problem B6: LoRA ★★

### Q40. A rectangular weight $W_0\in\mathbb R^{4096\times11008}$ (MLP layer) gets LoRA rank $r=16$. Count the trainable parameters, the ratio to full fine-tuning, and the largest useful $r$.

**Solution.** $B\in\mathbb R^{4096\times r}$, $A\in\mathbb R^{r\times11008}$: $r(m+n)=16\times15104=241{,}664$ vs $mn=45{,}088{,}768$. Ratio $\approx187\times$. Fewer than full iff $r(m+n)<mn\iff r<\frac{mn}{m+n}=2985$.

### Q41. Two rank-1 LoRA adapters were trained for two tasks on the same $W_0$: $\Delta W_1=3e_1e_1^T$ and $\Delta W_2=2e_2e_2^T$. A student wants to serve both tasks at once with **one** rank-1 adapter equal to the best approximation of $\Delta W_1+\Delta W_2$. Find that adapter and its errors. What rank is needed for zero error? What if the two updates were $3e_1e_1^T$ and $2e_1e_1^T$?

**Solution.** $\Delta W_1+\Delta W_2=\mathrm{diag}(3,2,0,\dots)$ has rank 2 with singular values $3,2$. Best rank-1 (Eckart–Young) $=3e_1e_1^T$, i.e. task 2's adapter is **dropped entirely**: spectral error $\sigma_2=2$, Frobenius error $2$, energy kept $\frac9{13}=69\%$. Zero error needs rank 2 (in general $\mathrm{rank}(\Delta W_1+\Delta W_2)\le r_1+r_2$). If both updates point along $e_1$, the sum $5e_1e_1^T$ has rank 1: one rank-1 adapter is exact. **Lesson:** adapters for different tasks merge cheaply only when their singular directions overlap; orthogonal updates add their ranks.

---

# PART C: Applications, the curse of dimensionality, case studies

## Problem C1: LSI ★★★

Terms (rows) *car, auto, banana*; documents $D_1$ = "car auto", $D_2$ = "car", $D_3$ = "banana banana":
$$A=\begin{pmatrix}1&1&0\\1&0&0\\0&0&2\end{pmatrix}$$

### Q42. Find the singular values and left singular vectors. A student uses $k=1$ "to keep only the strongest concept" and queries "car". What happens?

**Solution.** $AA^T=\begin{pmatrix}2&1&0\\1&1&0\\0&0&4\end{pmatrix}$ is block-diagonal. The banana block gives $\sigma^2=4$ with $u=e_3$. The car/auto block $\begin{pmatrix}2&1\\1&1\end{pmatrix}$ has trace 3, det 1: $\sigma^2=\frac{3\pm\sqrt5}2=2.618,\ 0.382$, top eigenvector $(2-2.618)a+b=0\Rightarrow u\propto(1,0.618)$, i.e. $u=(0.851,0.526,0)$.
So $u_1=e_3$ (**banana**). With $k=1$ the query "car" has code $u_1^Te_1=0$, and every document about cars also gets code 0: **all car documents score 0**. The top concept is chosen by **energy** (raw counts: "banana banana" has the biggest mass), not by relevance to the query. Too small a $k$ throws away the topic you need.

### Q43. Now use $k=2$ and the query "auto" ($q=e_2$). Compute the concept-space scores (inner products of codes) and compare with raw matching.

**Solution.** $U_2=[e_3,\ (0.851,0.526,0)]$. Query code $U_2^Tq=(0,0.526)$. Document codes: $D_1=(1,1,0)\to(0,1.377)$, $D_2=(1,0,0)\to(0,0.851)$, $D_3=(0,0,2)\to(2,0)$. Scores: $D_1$ $0.724$, $D_2$ $0.447$, $D_3$ $0$. Raw scores: $1,0,0$. $D_2$ (which only says "car") is now retrieved for "auto", because *car* and *auto* co-occur in $D_1$; *banana* stays at 0. (At $k=3=\mathrm{rank}$, $U$ is orthogonal and the raw scores come back exactly: the benefit comes **only from truncation**.)

### Q44. Give one thing LSI cannot handle well, and the cost of adding a new document without recomputing the SVD.

**Solution.** **Polysemy:** each term has one row, hence one vector, so "bank" (river vs money) becomes a blend of both meanings. Synonymy is the case LSI handles well. Folding in a new document: code $U_k^Td$, costing $O(nk)$ (or $O(\mathrm{nnz}(d)\,k)$). The concept directions $U_k$ are not updated, so they drift as new vocabulary arrives.

---

## Problem C2: Low-rank recommender ★★★

### Q45. $A=\begin{pmatrix}1&2\\2&?\end{pmatrix}$. Find the zero-loss prediction for "?" under a rank-1 model and under a rank-2 model. Then answer the same for $\begin{pmatrix}1&2\\-2&?\end{pmatrix}$. What does this say about where the "inference" comes from?

**Solution.** Rank 1: $\hat A=ab^T$ with $a_1b_1=1$, $a_1b_2=2$, $a_2b_1=2$, so $?=a_2b_2=\frac{(a_1b_2)(a_2b_1)}{a_1b_1}=\frac{2\cdot2}1=4$, uniquely (equivalently $\det=0$: $1\cdot?-4=0$). With $-2$: $?=\frac{2\cdot(-2)}1=-4$.
Rank 2: any $2\times2$ matrix has rank $\le2$, so **every** value of "?" gives zero loss; there is no prediction at all.
**Lesson:** the observed entries alone determine nothing; the prediction comes entirely from the **assumed rank**. Choosing $k$ too large (more parameters $k(m+n-k)$ than observations) makes the model fit anything and predict nothing; choosing it too small forces a wrong structure.

### Q46. Why not just fill the "?" with 0 and take a plain rank-1 SVD?

**Solution.** Plain SVD treats the filled zeros as real ratings, which pulls predictions toward 0 (the answer depends on the fill value). Use the **masked** objective $\min\sum_{(i,j)\text{ obs}}(A_{ij}-(UV^T)_{ij})^2$ (ALS or gradient descent).

### Q47. Cold start. In ALS ($k=1$, ridge $\lambda>0$), a new user has rated **nothing**. What is their factor $p$ and what do they get predicted? What happens with $\lambda=0$? Then a new **item** joins with no ratings. Suggest a fix that stays inside the low-rank framework.

**Solution.** The user step minimises $\sum_{i\text{ rated}}(A_{ui}-pq_i)^2+\lambda p^2=\lambda p^2$ (empty sum), so $p=0$ and every prediction is $p\cdot q_i=0$: the lowest possible rating, which is meaningless. With $\lambda=0$ the objective is identically 0, so **every** $p$ is a minimiser (not identifiable). A new item has the same problem by symmetry. The masked objective only "sees" observed entries, so an unobserved row or column carries no information.
Fix: model ratings as global mean + user bias + item bias + $p_u\cdot q_i$ (so a cold user is predicted the item's average), or require a few seed ratings. (Recall from Q48 that every row/column needs at least $k$ observations.)

### Q48. How many numbers does a rank-$k$ model of a $1000\times500$ matrix have at $k=10$? What does that imply about the observations needed?

**Solution.** $k(m+n-k)=10\times1490=14{,}900$ (3% of the 500,000 entries). You need at least that many observed entries, spread so that every row and column has $\ge k$ of them and the graph is connected. The ambient $d$ never enters.

---

## Problem C3: KDE rates under changed assumptions ★★★

### Q49. Suppose $\text{bias}^2\propto h^{2s}$ (smoothness $s$; the lecture has $s=2$) and $\text{var}\propto\frac1{nh^d}$. Find $h^*$ and the MSE rate. Apply it to a histogram ($s=1$) and compare with KDE at $d=1$.

**Solution.** $\mathrm{MSE}(h)\propto h^{2s}+\frac1{nh^d}$. Setting the derivative to 0: $2sh^{2s-1}=\frac d{nh^{d+1}}\Rightarrow h^{2s+d}\propto\frac1n$:
$$h^*\propto n^{-1/(2s+d)},\qquad\mathrm{MSE}^*\propto(h^*)^{2s}=n^{-2s/(2s+d)}$$
Histogram: $n^{-2/(d+2)}$; KDE: $n^{-4/(d+4)}$. At $d=1$: $n^{-2/3}$ vs $n^{-4/5}$. Both tend to $n^0$ as $d\to\infty$. The $h^d$ in the variance (the volume of a radius-$h$ ball) is the source of the curse.

### Q50. Data in $\mathbb R^{10}$ actually lies on a smooth 2-D surface. Compare the samples needed for relative error $\varepsilon=0.01$ (use $n\propto\varepsilon^{-(d+4)/4}$, constants ignored).

**Solution.** The rate is governed by the **intrinsic** dimension. Ambient $d=10$: $n\propto0.01^{-3.5}=10^7$. Intrinsic $m=2$: $n\propto0.01^{-1.5}=10^3$. This is why reducing dimension first (PCA, UMAP) helps.

### Q51. Expected number of points under one optimal bump at $n=10^6$, $d=20$? What does it show?

**Solution.** $n(h^*)^d\propto n^{4/(d+4)}=10^{6\cdot4/24}=10$. Even with a million points, each bump averages about 10 points, and the count tends to 1 as $d$ grows. The estimator is never told $p$ is Gaussian: this is the cost of assuming **no** form (a parametric fit costs only $O(d)$).

---

## Problem C4: Neighbourhoods and distance concentration ★★

### Q52. Points are uniform in $[0,1]^d$, and a query sits at the centre. How many points $n$ are needed so that, with probability $\ge\frac12$, at least one point lies within sup-norm distance $0.1$ of the query (a box of side $0.2$)? Evaluate at $d=2,10,20$.

**Solution.** One point lands in the box with probability $0.2^d$. $\Pr[\text{none of }n]=(1-0.2^d)^n\approx e^{-n0.2^d}=\frac12\Rightarrow n=\frac{\ln2}{0.2^d}$.

| $d$ | 2 | 10 | 20 |
|---|---|---|---|
| $n$ | 17 | $6.8\times10^6$ | $6.6\times10^{13}$ |

The sample size grows like $5^d$ for a **fixed** notion of "nearby": exponential in $d$. This is the k-NN version of the KDE cost $n\propto\varepsilon^{-1}c^d$. Either accept huge neighbourhoods ($e_d(r)=r^{1/d}\to1$) or reduce dimension first.

### Q53. A student says: "Distances concentrate in high $d$, so first apply JL; then nearest neighbours will be meaningful again." Correct? What does work, and when does it fail?

**Solution.** **Incorrect.** JL *preserves* all pairwise distances up to $1\pm\epsilon$, so the relative gap $\frac{\text{dist}_{\max}-\text{dist}_{\min}}{\text{dist}_{\min}}$ stays (nearly) the same. JL buys **speed, not meaning**. What helps is *dropping* the directions that carry only noise: PCA keeps the high-variance (signal) directions. That works only while the signal outweighs the junk; with enough noise coordinates (e.g. $m=1000$ in the lecture's experiment) PCA's top directions are noise too.

---

## Problem C5: UMAP ★★

### Q54. Calibration $S(\sigma)=\sum_{j=1}^ke^{-(d_j-\rho_i)/\sigma}=\log_2k$ with $k=4$. (a) All four neighbours are at exactly the same distance. (b) The two nearest are tied and the other two are farther ($d=(1,1,1.2,1.5)$). Can $\sigma_i$ be found in each case?

**Solution.**
- (a) All offsets are 0, so $S(\sigma)\equiv4$ for every $\sigma$. The target is $\log_24=2<4$: **no solution**.
- (b) Offsets $(0,0,0.2,0.5)$. $S(\sigma)=2+e^{-0.2/\sigma}+e^{-0.5/\sigma}$ is increasing and ranges over $(2,4)$: as $\sigma\to0$ it tends to 2, but never reaches it. Target 2: **no solution**, only the limit $\sigma\to0$, which gives weights $(1,1,0,0)$.
- General rule: if $m$ neighbours tie at the nearest distance, $S$ ranges over $(m,k)$, so a solution exists iff $m<\log_2k$. Calibration needs a spread in neighbour distances. Distance concentration in high $d$ makes the offsets tiny but not tied; since only offset$/\sigma$ matters, $\sigma_i$ just shrinks with them (which is also why scaling all distances leaves the weights unchanged).

### Q55. Star graph: centre vertex 1 joined to leaves 2, 3, 4 (unit weights). Find the spectrum of $L=D-W$ and the eigenspaces. What does a 1-D spectral embedding do with the centre, and is it unique?

**Solution.** $L=\begin{pmatrix}3&-1&-1&-1\\-1&1&0&0\\-1&0&1&0\\-1&0&0&1\end{pmatrix}$.
- $\lambda=0$: $\mathbf1$ (connected graph, one zero eigenvalue).
- $\lambda=1$: vectors with $y_1=0$ and $y_2+y_3+y_4=0$ (check: centre row $-\sum\text{leaves}=0$; leaf row $y_{\text{leaf}}-0=1\cdot y_{\text{leaf}}$). This eigenspace is **2-dimensional**.
- $\lambda=4$: $(3,-1,-1,-1)$ (centre row $9+3=12$, leaf row $-3-1=-4$ ✓).

The embedding uses the smallest non-zero eigenvalue, $\lambda=1$: the centre sits at 0 and the leaves spread around it with zero sum. **Not unique**: any vector in the 2-D eigenspace works (e.g. $(0,1,-1,0)$ or $(0,1,1,-2)$), because the star's leaves are symmetric. Ties in the spectrum mean the embedding is determined only up to rotation within the eigenspace (the same issue as a tied $\sigma_1=\sigma_2$).

---

## Problem C6: RAG ★★

Two retrieved passages $Z_2=\{c_1,c_2\}$ with scores $s=(0.9,0.8)$, $w_i=\frac{e^{s_i/\tau}}{\sum_je^{s_j/\tau}}$, generator likelihoods $g=(0.2,0.8)$ for the true answer $y$ (the lower-scored passage is the useful one). Recall $\frac{\partial\log p}{\partial s_i}=\frac{r_i-w_i}\tau$ with $r_i=\frac{w_ig_i}p$.

### Q56. All embeddings are rescaled by a factor 2 (so every score doubles). What is this equivalent to? Does the top-$k$ truncation error bound $\varepsilon_k=\sum_{i\notin Z_k}w_i$ get better or worse?

**Solution.** $w_i\propto e^{2s_i/\tau}=e^{s_i/(\tau/2)}$: doubling the scores is the same as **halving the temperature**. Score *gaps* double, so the weights become sharper and $\varepsilon_k$ shrinks (truncation becomes safer). Contrast: **adding** a constant to every score changes nothing (shift invariance). So the softmax is blind to the level of the scores but very sensitive to their scale. That makes "relevance" depend on the arbitrary norm of the embeddings unless $\tau$ is tuned with it.

### Q57. Compute the retriever's gradient $\partial\log p/\partial s_2$ at $\tau=0.01,\ 0.1,\ 1,\ 10$. Which temperature trains the retriever fastest, and why do both extremes fail?

**Solution.**

| $\tau$ | $w$ | $p$ | $r$ | $\partial\log p/\partial s_2=\frac{r_2-w_2}\tau$ |
|---|---|---|---|---|
| 0.01 | $(0.99995,\ 0.00005)$ | 0.200 | $(0.9998,\ 0.0002)$ | 0.014 |
| 0.1 | $(0.731,\ 0.269)$ | 0.361 | $(0.405,\ 0.595)$ | **3.26** |
| 1 | $(0.525,\ 0.475)$ | 0.485 | $(0.216,\ 0.784)$ | 0.31 |
| 10 | $(0.502,\ 0.498)$ | 0.499 | $(0.202,\ 0.798)$ | 0.030 |

- $\tau\to0$: the softmax saturates. $w_2\approx0$ so $r_2\approx0$ too (the posterior is the prior times $g$), and the useful passage gets almost no signal.
- $\tau\to\infty$: $r-w$ stays bounded but is divided by a large $\tau$, and the scores barely affect $w$ anyway.
- An intermediate $\tau$ (here around $0.1$) gives the strongest learning signal. Small $\tau$ is good for truncation (Q56) but bad for learning: a real trade-off.

### Q58. A $T$-token answer alternates between two facts: odd tokens are supported by $c_1$ (probability $0.9$ from $c_1$, $0.1$ from $c_2$), even tokens by $c_2$ ($0.9$ vs $0.1$); $w=(\frac12,\frac12)$, $T$ even. Compute $p_{\text{seq}}$ and $p_{\text{tok}}$ as functions of $T$ and their ratio for $T=2,4,10$.

**Solution.** RAG-Sequence uses one passage for the whole answer: each passage gives $0.9^{T/2}0.1^{T/2}=0.09^{T/2}=0.3^T$, so $p_{\text{seq}}=\frac12(0.3^T+0.3^T)=0.3^T$. RAG-Token mixes per token: every token gets $\frac12(0.9)+\frac12(0.1)=0.5$, so $p_{\text{tok}}=0.5^T$. Ratio $\left(\frac{0.5}{0.3}\right)^T$: $T=2$: $2.8$; $T=4$: $7.7$; $T=10$: $165$. **The gap grows exponentially with answer length** when facts come from different passages. (Reverse case: if a passage-consistent answer is needed, e.g. year and month of the same person, Sequence wins.)

---

## Problem C7: FAISS complexity ★★★

$\ell$ database vectors in $\mathbb R^d$; IVF with $|C_1|$ centroids, probing $\tau$ lists.

### Q59. Per-query cost of IVF as a function of $|C_1|$. Choose $|C_1|$ optimally. Numbers for $\ell=10^9$. What assumption is hidden?

**Solution.** Find the nearest centroids: $O(|C_1|d)$. Scan $\tau$ lists of size about $\ell/|C_1|$: $O(\tau\ell d/|C_1|)$. AM–GM: $|C_1|+\frac{\tau\ell}{|C_1|}\ge2\sqrt{\tau\ell}$, with equality at $|C_1|=\sqrt{\tau\ell}$ (the slides treat $\tau$ as a constant: $|C_1|\approx\sqrt\ell\approx3\times10^4$). Candidates scored $\approx\tau\sqrt\ell=8\times3.2\times10^4\approx2.5\times10^5$ vs $10^9$ for naive search. **Hidden assumption:** balanced lists. k-means minimises distortion, not list-size variance, so balance is empirical, not guaranteed. IVF can also miss the true neighbour (recall $<1$).

### Q60. PQ with $d=96$ (float32), $b=12$ sub-vectors, 256 centroids each. Find the bytes per vector, the compression ratio, the number of distinct reconstructions, and the per-candidate scoring cost with ADC tables.

**Solution.** Raw: $96\times4=384$ B. Code: $12$ ids $\times\log_2256=8$ bits $=12$ B, a $32\times$ compression. Reconstruction points: $|C_1|\times256^{12}$, so collisions are rare. Codebooks: $256\times d$ floats in total (global, stored once). ADC: build $b$ tables of 256 entries per probed list, $O(256d)$, then score each candidate with $b=12$ lookups, $O(b)$ instead of $O(d)$. FAISS does **not** use JL: it reduces dimension with learned maps (PCA/OPQ), with no guarantee. JL would give a guarantee but no learning.

---

# PART D: True/False with a one-line justification ★★★

### Q61. The best-fit 2-D subspace always contains a best-fit line.
**True.** Greedy is optimal: $\mathrm{span}(v_1,v_2)$ is a best 2-D subspace and contains $v_1$.

### Q62. Adding a data row to $A$ can never decrease $\sigma_1$.
**True.** $\|A'v\|^2=\|Av\|^2+(a\cdot v)^2\ge\|Av\|^2$ for every $v$; take the max.

### Q63. For any square matrix, the singular values are the absolute values of the eigenvalues.
**False.** $\begin{pmatrix}0&1\\0&0\end{pmatrix}$: eigenvalues $0,0$, but $\sigma_1=1$. (True for symmetric matrices.)

### Q64. $\|A\|_2\le\|A\|_F\le\sqrt{\mathrm{rank}(A)}\,\|A\|_2$.
**True.** $\sigma_1^2\le\sum_{i\le r}\sigma_i^2\le r\sigma_1^2$.

### Q65. The Chebyshev proof of the weak law needs the $X_i$ to be fully independent.
**False.** $\mathrm{Var}(\bar X)=\sigma^2/n$ needs only pairwise uncorrelated $X_i$. Chernoff is what needs full independence.

### Q66. For a sum of independent coin flips, the Chernoff bound is always tighter than the Chebyshev bound.
**False.** $n=300$ fair flips, $\Pr[X\ge180]$: Chebyshev gives $\frac{75}{900}=0.083$, one-sided Chernoff gives $e^{-150(0.04)/3}=e^{-2}=0.135$. Chernoff wins only once $\mu\delta^2$ is large: it decays like $e^{-cn}$ while Chebyshev decays like $1/n$.

### Q67. The JL target dimension grows with the ambient dimension $d$.
**False.** $k=O(\epsilon^{-2}\log n)$; $d$ never appears. (Use $\min(d,k)$.)

### Q68. Centring the data can change the rank of the data matrix.
**True.** $(1,2),(3,4),(5,6),(7,8)$: the raw matrix has rank 2 (the rows are not multiples of each other), but after centring every row is a multiple of $(1,1)$: rank 1. Centring removes the mean direction (it can lower the rank by at most 1).

### Q69. Multiplying every entry of $A$ by 10 makes the power method converge 10 times faster.
**False.** The rate is $(\sigma_2/\sigma_1)^2$ per step, and scaling multiplies both by 10, so the ratio is unchanged. The normalisation $x\leftarrow Bx/\|Bx\|$ also removes any scale. Only the **gap ratio** matters.

### Q70. A sample from $N(0,I_d)$ is most likely to be found near the origin, since that is where the density is highest.
**False.** The density is highest at 0, but the volume near 0 is tiny. The mass at radius $r$ is $\propto r^{d-1}e^{-r^2/2}$, which peaks at $\sqrt{d-1}$. $\Pr[\|x\|\le\sqrt d-\beta]\le3e^{-\beta^2/8}$; e.g. at $d=10^4$, essentially no sample lies within radius 50 of the origin.

### Q71. Lanczos needs fewer matrix–vector products than the power method for the same accuracy.
**True.** $O(1/\sqrt{\text{gap}})$ vs $O(1/\text{gap})$, because it keeps the whole Krylov subspace instead of the last vector.

### Q72. The rank-$k$ matrix that minimises the Frobenius error is also the one that minimises the spectral error.
**True.** Eckart–Young: the truncated SVD $A_k$ is optimal in both norms simultaneously ($\sqrt{\sum_{i>k}\sigma_i^2}$ and $\sigma_{k+1}$). (Caveat: for the spectral norm the minimiser need not be unique even when the singular values are distinct; for Frobenius it is unique when $\sigma_k>\sigma_{k+1}$.)

---

# Last-minute checklist

- Write a one-line reason under every answer; a bare answer can lose marks.
- For "new setting" questions: (1) name the result you are reusing, (2) say what changed, (3) redo only the step that changes.
- Common traps: the volume shell is $\Theta(1/d)$ wide but the Gaussian annulus is $O(1)$ wide; $\sigma_i=\sqrt{\lambda_i(A^TA)}$; Frobenius error uses all discarded $\sigma$'s, spectral error only $\sigma_{k+1}$; centre before PCA; JL keeps distances (speed, not meaning); the power-method rate is $(\sigma_2/\sigma_1)^2$ per step; Chernoff needs independence.
