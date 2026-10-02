## Contents
1. [[#1. Recap of Week 2]]
2. [[#2. The Question]]
3. [[#3. Markov's Inequality]]
4. [[#4. Chebyshev's Inequality]]
5. [[#5. Weak Law of Large Numbers]]
6. [[#6. Chernoff Bound]]
7. [[#7. Comparing the Three Bounds]]
8. [[#8. When Independence Fails]]
9. [[#9. Fitting a Spherical Gaussian]]
10. [[#10. Separating Two Gaussians]]
11. [[#11. Where Each Result Breaks]]
12. [[#12. Quick Practice with Solutions]]
13. [[#13. Exam Cheat Sheet]]

---

> [!warning] Do not mix up the two shells
> Volume shell of the ball has width $\Theta(1/d)$. Gaussian annulus has width $O(1)$ around radius $\sqrt{d}$.



## 2. The Question

Let $X_1,\dots,X_n$ be i.i.d. with mean $\mu$ and let

$$\bar X = \frac1n \sum_{i=1}^n X_i$$

We know $\mathrm{Var}(\bar X)=\mathrm{Var}(X_1)/n \to 0$, so the average settles down.

**Goal:** bound $\Pr[\lvert \bar X-\mu\rvert \ge a]$ using only what we know about the distribution.

Three tools. Each assumes more and gives more:

| Tool | You must know |
|---|---|
| Markov | $X\ge 0$ and its mean |
| Chebyshev | mean and variance |
| Chernoff | $X$ is a sum of independent variables |

---

## 3. Markov's Inequality

> [!note] Theorem
> If $X \ge 0$ with finite mean, then for any $a>0$
> $$\Pr[X\ge a]\le \frac{E[X]}{a}$$

### Proof
Since $X\ge 0$, throwing away the part where $X<a$ can only lower the mean, and on the part where $X \ge a$ we have $X \ge a$:

$$E[X]\;\ge\; E\big[X\cdot \mathbf 1_{\{X\ge a\}}\big]\;\ge\; a\,E\big[\mathbf 1_{\{X\ge a\}}\big]\;=\;a\Pr[X\ge a]$$

Divide by $a$. Done.

### Intuition
If the average is 3.5, at most a fraction $3.5/a$ of the mass can sit at or above $a$. Otherwise the average would be larger.

### Example: one fair die roll
$X\in\{1,\dots,6\}$, $X\ge0$, $E[X]=3.5$.

**Threshold 5:**
$$\Pr[X\ge5]\le \frac{3.5}{5}=0.7 \qquad \text{(true value } \tfrac{2}{6}\approx 0.33)$$

**Threshold 6:**
$$\Pr[X\ge6]\le \frac{3.5}{6}\approx0.58 \qquad \text{(true value } \tfrac16\approx 0.17)$$

Correct but loose.

### Why it is loose, and why it cannot be fixed
Markov only knows the mean, so it must also cover nasty distributions with the same mean. Take

$$X=\begin{cases}5 & \text{w.p. } 0.7\\ 0 & \text{w.p. } 0.3\end{cases}$$

Then $E[X]=5(0.7)=3.5$ and $\Pr[X\ge5]=0.7$ exactly. Markov is **tight** here, so with only the mean known it cannot do better.

> [!tip] Key trick
> Every later bound is Markov applied to a cleverly chosen non-negative function of $X$.

---

## 4. Chebyshev's Inequality

> [!note] Theorem
> If $X$ has mean $\mu$ and finite variance $\sigma^2$, then for any $a>0$
> $$\Pr\big[\lvert X-\mu\rvert\ge a\big]\le\frac{\sigma^2}{a^2}$$

### Proof
Apply Markov to the non-negative variable $(X-\mu)^2$ with threshold $a^2$:

$$\Pr[\lvert X-\mu\rvert\ge a]=\Pr[(X-\mu)^2\ge a^2]\le\frac{E[(X-\mu)^2]}{a^2}=\frac{\sigma^2}{a^2}$$

### Example: same die
$\mu=3.5$, $\sigma^2=\frac{35}{12}\approx 2.92$.

Bound $\Pr[\lvert X-3.5\rvert\ge 2.5]$:

$$\Pr[\lvert X-3.5\rvert\ge2.5]\le\frac{2.92}{2.5^2}=\frac{2.92}{6.25}\approx0.47$$

**True value:** $\lvert X-3.5\rvert\ge2.5$ only for $X\in\{1,6\}$, so the probability is $\frac26=\frac13\approx0.33$.

Compare with Markov's $0.7$ at a comparable threshold: variance is extra information and it buys a tighter bound. It is still not exact, because it must cover every distribution with this mean and variance.

> [!info] Independence not needed
> Chebyshev is a one-variable bound. It needs only mean and variance, no independence.

---

## 5. Weak Law of Large Numbers

Let $X_i$ be i.i.d. with variance $\sigma^2$. Then $\mathrm{Var}(\bar X)=\sigma^2/n$. Apply Chebyshev to $\bar X$:

$$\Pr\big[\lvert\bar X-\mu\rvert\ge\epsilon\big]\le\frac{\mathrm{Var}(\bar X)}{\epsilon^2}=\frac{\sigma^2}{n\epsilon^2}\;\xrightarrow{n\to\infty}\;0$$

So $\bar X\to\mu$ in probability. That is the weak law, proved in two lines.

> [!warning] Slow decay
> The bound shrinks only like $1/n$ (polynomially). For independent sums we can get exponential decay (Chernoff).

> [!info] Fine print
> $\mathrm{Var}(\bar X)=\sigma^2/n$ needs only that the $X_i$ are pairwise uncorrelated. Chernoff needs full independence.

---

## 6. Chernoff Bound

> [!note] Theorem
> Let $X=\sum_{i=1}^n X_i$ where the $X_i$ are independent $\{0,1\}$ variables and $\mu=E[X]$. For any $\delta>0$,
> $$\Pr[X\ge(1+\delta)\mu]\le\left(\frac{e^{\delta}}{(1+\delta)^{1+\delta}}\right)^{\mu}$$

### Proof (step by step)

**Step 1. Markov on an exponential.** For $t>0$, the event $X\ge(1+\delta)\mu$ equals the event $e^{tX}\ge e^{t(1+\delta)\mu}$. So

$$\Pr[X\ge(1+\delta)\mu]\le e^{-t(1+\delta)\mu}\,E[e^{tX}]$$

**Step 2. Independence factorises the expectation.**

$$E[e^{tX}]=\prod_{i}E[e^{tX_i}]$$

**Step 3. Bound each factor.** If $\Pr[X_i=1]=p_i$:

$$E[e^{tX_i}]=1+p_i(e^t-1)\le e^{p_i(e^t-1)}\quad(\text{since }1+y\le e^y)$$

Multiply over $i$, using $\sum p_i=\mu$:

$$E[e^{tX}]\le e^{\mu(e^t-1)}$$

**Step 4. Choose the best $t$.** Putting it together,

$$\Pr[X\ge(1+\delta)\mu]\le \exp\big(\mu(e^t-1)-t(1+\delta)\mu\big)$$

Pick $t=\ln(1+\delta)$, so $e^t=1+\delta$:

$$=\exp\big(\mu\delta-\mu(1+\delta)\ln(1+\delta)\big)=\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^{\mu}$$

### The usable form (the one to quote in exams)

For $0<\delta\le1$:

$$\boxed{\Pr\big[\lvert X-\mu\rvert\ge\delta\mu\big]\le 2e^{-\mu\delta^2/3}}$$

Lower tail alone: $\Pr[X\le(1-\delta)\mu]\le e^{-\mu\delta^2/2}$.

Upper tail alone (for $0<\delta\le1$): $\Pr[X\ge(1+\delta)\mu]\le e^{-\mu\delta^2/3}$. The factor 2 appears only when you count both tails.

Decay is exponential in $\mu$ (so in $n$), far stronger than Chebyshev's $1/n$.

> [!info] Where it is used
> Gaussian Annulus and Johnson-Lindenstrauss (Week 2) and the sample-complexity arguments below.
> Those involve sums of squared Gaussians (chi-squared), not $\{0,1\}$ variables. "Chernoff" there names the technique: Markov on $e^{tX}$, then factorise by independence. It works with the same exponential shape but different constants.

### Example: 100 coin flips, three bounds

$X\sim\mathrm{Bin}(100,\tfrac12)$, so $\mu=50$, $\sigma^2=100\cdot\tfrac12\cdot\tfrac12=25$.
Bound $\Pr[X\ge75]$. Since $75=(1+\delta)\cdot 50$, we get $\delta=0.5$.

**Markov:**
$$\frac{50}{75}\approx0.67$$

**Chebyshev:** $75$ is $25$ above the mean, so $a=25$:
$$\frac{25}{25^2}=\frac{25}{625}=0.04$$

**Chernoff (upper tail):**
$$e^{-50\cdot 0.25/3}=e^{-4.17}\approx0.016$$

**Exact:** about $3\times10^{-7}$.

| Tool | Bound |
|---|---|
| Markov | 0.67 |
| Chebyshev | 0.04 |
| Chernoff | 0.016 |
| Exact | $\approx 3\times10^{-7}$ |

Each extra assumption (mean, then variance, then independence) gains orders of magnitude. Even Chernoff is loose in absolute terms. What it gets right is the exponential scaling in $n$, which is what our proofs need.

---

## 7. Comparing the Three Bounds

| Tool | Assumes | Tail decay in $a$ |
|---|---|---|
| Markov | $X\ge0$, mean | $1/a$ |
| Chebyshev | mean and variance | $1/a^2$ |
| Chernoff | independent sum | $e^{-\Theta(a^2)}$ |

**Rule of thumb:** use the weakest tool that needs only what you actually know. Independence is the expensive assumption, and it buys exponential decay.

### The decay rates as $n$ grows
Take $X\sim\mathrm{Bin}(n,\tfrac12)$ and bound $\Pr[X\ge0.6n]$. Here $\mu=n/2$, $\sigma^2=n/4$, deviation $a=0.1n$, $\delta=0.2$.

**Chebyshev:**
$$\frac{n/4}{(0.1n)^2}=\frac{25}{n}$$

**Chernoff:**
$$e^{-(n/2)(0.2)^2/3}=e^{-n/150}$$

So Chebyshev falls like $1/n$ (barely bends on a log plot), Chernoff falls like a straight line on a log plot (exponential), and the exact tail is steeper still.

---

## 8. When Independence Fails

Chernoff's step "$E[e^{tX}]$ factorises" needs independence. Remove it and you fall back to Chebyshev-type bounds.

**Extreme case:** $X_i=X_1$ for all $i$ (perfectly correlated). Then $\bar X=X_1$ and

$$\mathrm{Var}(\bar X)=\sigma^2\quad(\text{not }\sigma^2/n)$$

No concentration at all, however large $n$ is.

Markov and Chebyshev stay valid under any dependence. They make no independence assumption, which is also why they are loose.

Weak dependence can still be enough (martingale or bounded-difference methods), but that is out of scope.

---

## 9. Fitting a Spherical Gaussian

### Setup
We see $n$ i.i.d. samples $x^{(1)},\dots,x^{(n)}\sim N(\mu,\sigma^2 I)$ in $\mathbb R^d$. The mean $\mu$ is unknown. We want to estimate it.

"Spherical" means every coordinate has the same variance $\sigma^2$ and coordinates are uncorrelated.

### The estimator
The maximum-likelihood estimate is the sample mean:

$$\hat\mu=\frac1n\sum_{i=1}^n x^{(i)},\qquad \hat\mu_j=\frac1n\sum_{i=1}^n x^{(i)}_j$$

### How many samples do we need?

**Step 1.** Coordinate $j$ of each sample is $N(\mu_j,\sigma^2)$. Averaging $n$ of them:

$$\hat\mu_j\sim N\!\left(\mu_j,\frac{\sigma^2}{n}\right),\qquad \mathrm{Var}(\hat\mu_j)=\frac{\sigma^2}{n}$$

**Step 2. Chebyshev on one coordinate:**

$$\Pr\big[\lvert\hat\mu_j-\mu_j\rvert\ge\epsilon\big]\le\frac{\sigma^2}{n\epsilon^2}$$

**Step 3. Union bound over all $d$ coordinates** (probability that at least one is bad is at most the sum of the individual probabilities):

$$\Pr\big[\exists j:\lvert\hat\mu_j-\mu_j\rvert\ge\epsilon\big]\le\frac{d\sigma^2}{n\epsilon^2}$$

**Step 4. Make this at most $\eta$:**

$$\boxed{n\ \ge\ \frac{d\sigma^2}{\epsilon^2\eta}}$$

The sample size is **linear in $d$**: high dimension costs us, but only mildly.

### Worked numbers
Take $d=100$, $\sigma=1$, accuracy $\epsilon=0.1$ in every coordinate, failure probability $\eta=0.05$:

$$n\ge\frac{100\cdot1}{(0.1)^2\cdot0.05}=\frac{100}{0.0005}=200{,}000$$

This is a guarantee, not the minimum. Chebyshev is loose, and Gaussian tails would need far fewer samples. The point is the scaling: $n\propto d$.

### Fitting algorithm
1. Compute $\hat\mu=\frac1n\sum_i x^{(i)}$.
2. Estimate the shared variance:
$$\hat\sigma^2=\frac1{nd}\sum_{i=1}^n\lVert x^{(i)}-\hat\mu\rVert_2^2$$
3. Report $N(\hat\mu,\hat\sigma^2 I)$.

Why divide by $nd$: there are $n$ points with $d$ squared deviations each, and each coordinate deviation has variance about $\sigma^2$. So the average squared coordinate deviation estimates $\sigma^2$.

(Small detail: because $\hat\mu$ is itself fitted, this slightly underestimates $\sigma^2$ by a factor $\frac{n-1}{n}$. Negligible for large $n$.)

The spherical assumption is what lets one scalar $\hat\sigma^2$ suffice. A full covariance matrix needs $O(d^2)$ parameters.

### Convergence picture
For $N(0,I)$ with $d=100$, the worst-coordinate error $\max_j\lvert\hat\mu_j-\mu_j\rvert$ shrinks like $1/\sqrt n$ on a log-log plot. This matches $\mathrm{Var}(\hat\mu_j)=\sigma^2/n$, i.e. standard deviation $\sigma/\sqrt n$.

---

## 10. Separating Two Gaussians

### Setup
Two spherical unit-variance Gaussians in $\mathbb R^d$ with means $\mu_1,\mu_2$ and

$$\lVert\mu_1-\mu_2\rVert_2=\Delta$$

Given a point, decide which Gaussian produced it. How big must $\Delta$ be?

### Starting facts
A sample lies at distance about $\sqrt d$ from its own mean (Gaussian Annulus). So:

- Two samples from the **same** Gaussian: distance about $\sqrt{2d}$.
- Two samples from **different** Gaussians: distance about $\sqrt{2d+\Delta^2}$.

We need these two distances to be reliably distinguishable.

> [!note] Theorem (Separation threshold)
> Intra-cluster and inter-cluster pairwise distances are distinguishable with high probability once
> $$\Delta=\Omega\big(d^{1/4}\big)$$

Striking: this is far smaller than the cloud radius $\sqrt d$. The means can be much closer than the radius, yet the clusters are separable.

### Proof (reduce to the Gaussian Annulus)

Let $x,x'$ be from Gaussian 1 and $y$ from Gaussian 2. Let $z\sim N(0,I_d)$ be a standard Gaussian vector.

**Same Gaussian.** Each coordinate of $x-x'$ is a difference of two independent $N(0,1)$, so it is $N(0,2)$. Hence $x-x'=\sqrt2\,z$.

Annulus theorem: $\lVert z\rVert=\sqrt d\pm O(1)$, so $\lVert z\rVert^2=d\pm O(\sqrt d)$. Therefore

$$\lVert x-x'\rVert^2=2\lVert z\rVert^2=2d\pm O(\sqrt d)$$

**Different Gaussians.** $x-y=(\mu_1-\mu_2)+\sqrt2\,z$, a fixed shift $\delta=\mu_1-\mu_2$ of norm $\Delta$. Expand the square:

$$\lVert x-y\rVert^2=\underbrace{\Delta^2}_{\text{shift}}+\underbrace{2\sqrt2\,\delta\cdot z}_{\text{cross term}}+\underbrace{2\lVert z\rVert^2}_{2d\pm O(\sqrt d)}$$

The cross term: $\delta\cdot z\sim N(0,\Delta^2)$, so it has standard deviation $\Theta(\Delta)$. A Chernoff-type tail bound keeps it $O(\Delta)$ with high probability. This is smaller than $O(\sqrt d)$ once $\Delta\ll\sqrt d$, which holds at the threshold. So

$$\lVert x-y\rVert^2=2d+\Delta^2\pm O(\sqrt d)$$

**Compare the two:**

| Pair | Squared distance |
|---|---|
| same Gaussian | $2d\pm O(\sqrt d)$ |
| different Gaussians | $2d+\Delta^2\pm O(\sqrt d)$ |

The gap $\Delta^2$ beats the noise $O(\sqrt d)$ when

$$\Delta^2\gg\sqrt d\iff\Delta\gg d^{1/4}$$

The same Annulus theorem, applied twice, is the whole proof.

### Worked example: $d=10{,}000$
- Cloud radius: $\sqrt d=100$.
- Threshold: $d^{1/4}=10$, so $\Delta\sim10$ suffices.
- Coordinate by coordinate the clouds overlap heavily (a gap of 10 per direction against spread of order 100 in total), yet pairwise distances reveal the cluster. The signal $\Delta^2$ is a collective property of all $d$ coordinates.

### Numeric check of the picture ($d=10{,}000$, $\Delta=40$)
- Same-cluster distance: $\sqrt{2d}=\sqrt{20000}\approx141.4$.
- Different-cluster distance: $\sqrt{2d+\Delta^2}=\sqrt{21600}\approx147.0$.
- Spread of one distance: $\lVert x-x'\rVert^2=2\lVert z\rVert^2$ has standard deviation about $2\sqrt{2d}\approx283$. Dividing by $2\cdot141.4$ to convert squared distance to distance gives spread about $1$.

So the centres are about $5.6$ apart with spread about $1$: two clean, separated histograms. Here $\Delta=4d^{1/4}$. The theorem says $\Omega(d^{1/4})$ and the constant matters for a crisp picture.

### Empirical check of the $d^{1/4}$ scaling
$\Delta_c(d)$ is the smallest gap giving 95% accuracy (found by binary search over $d=50$ to $50{,}000$). The log-log slope is $0.228$ over the full range and $0.242$ for $d\ge5000$, approaching the theoretical $1/4$.

> [!tip] Hyperplane remark
> If you already knew the direction $\mu_1-\mu_2$, projecting onto it gives two 1-D unit-variance Gaussians whose centres are $\Delta$ apart, so a hyperplane orthogonal to $\mu_1-\mu_2$ through the midpoint separates them. The $d^{1/4}$ threshold is what you get from pairwise distances alone, without knowing that direction. This is the basis for clustering mixtures of Gaussians (Unit 2).

---

## 11. Where Each Result Breaks

| Result | Breaks when | What to use instead |
|---|---|---|
| Chernoff exponential decay | Variables are dependent (extreme: all equal, $\mathrm{Var}(\bar X)=\sigma^2$) | Markov/Chebyshev, or martingale methods |
| Spherical Gaussian fit | Correlated or unequal-variance directions | Full covariance $\Sigma$ ($O(d^2)$ parameters); PCA/SVD (Week 4) |
| Sample mean as MLE | Outliers or heavy tails (one point can move $\hat\mu$ without bound) | Robust estimators |
| $\Delta=\Omega(d^{1/4})$ separation | More than 2 clusters, unequal variances, non-spherical covariance | Gaussian-mixture EM (Week 10) |

---

## 12. Quick Practice with Solutions

**Q1.** A non-negative variable has mean 10. Bound $\Pr[X\ge50]$.

**A1.** Markov: $\Pr[X\ge50]\le\frac{10}{50}=0.2$.

---

**Q2.** $X$ has mean 10 and variance 4. Bound $\Pr[\lvert X-10\rvert\ge6]$.

**A2.** Chebyshev: $\frac{4}{6^2}=\frac{4}{36}\approx0.11$.

---

**Q3.** $X$ is a sum of 300 independent fair coin flips. Bound $\Pr[X\ge 180]$ with Chernoff.

**A3.** $\mu=150$. $180=(1+\delta)150\Rightarrow\delta=0.2$.
$$\Pr[X\ge180]\le e^{-\mu\delta^2/3}=e^{-150\cdot0.04/3}=e^{-2}\approx0.135$$

---

**Q4.** Same as Q3 using Chebyshev. Which is better?

**A4.** $\sigma^2=300\cdot\frac14=75$, deviation $30$:
$$\frac{75}{30^2}=\frac{75}{900}\approx0.083$$
Here Chebyshev ($0.083$) beats the one-sided Chernoff ($0.135$) because $\mu\delta^2$ is small. Chernoff's advantage shows up as $n$ grows: it decays like $e^{-cn}$, Chebyshev only like $1/n$.

---

**Q5.** Fitting $N(\mu,I)$ in $d=50$ dimensions. How many samples guarantee every coordinate of $\hat\mu$ is within $0.2$ of $\mu$ with probability at least $0.9$?

**A5.** $\sigma=1$, $\epsilon=0.2$, $\eta=0.1$:
$$n\ge\frac{d\sigma^2}{\epsilon^2\eta}=\frac{50}{0.04\cdot0.1}=12{,}500$$

---

**Q6.** For $d=10^8$, roughly what mean gap $\Delta$ lets pairwise distances separate two unit-variance Gaussians? Compare with the cloud radius.

**A6.** $\Delta\sim d^{1/4}=(10^8)^{1/4}=100$. Radius is $\sqrt d=10^4$. The gap is only 1% of the radius.

---

**Q7.** Why does perfect correlation kill concentration?

**A7.** If $X_i=X_1$ for all $i$, then $\bar X=X_1$, so $\mathrm{Var}(\bar X)=\sigma^2$. Averaging removes no noise.

---

## 13. Exam Cheat Sheet

$$\textbf{Markov: }\Pr[X\ge a]\le\frac{E[X]}{a}\quad(X\ge0)$$

$$\textbf{Chebyshev: }\Pr[\lvert X-\mu\rvert\ge a]\le\frac{\sigma^2}{a^2}$$

$$\textbf{Weak law: }\Pr[\lvert\bar X-\mu\rvert\ge\epsilon]\le\frac{\sigma^2}{n\epsilon^2}$$

$$\textbf{Chernoff: }\Pr[X\ge(1+\delta)\mu]\le\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^\mu,\qquad \Pr[\lvert X-\mu\rvert\ge\delta\mu]\le2e^{-\mu\delta^2/3}\ (0<\delta\le1)$$

$$\textbf{Sample mean: }\hat\mu_j\sim N(\mu_j,\sigma^2/n),\qquad n\ge\frac{d\sigma^2}{\epsilon^2\eta}$$

$$\textbf{Variance estimate: }\hat\sigma^2=\frac1{nd}\sum_i\lVert x^{(i)}-\hat\mu\rVert^2$$

$$\textbf{Two Gaussians: }\lVert x-x'\rVert^2\approx2d,\quad\lVert x-y\rVert^2\approx2d+\Delta^2,\quad\text{separable if }\Delta=\Omega(d^{1/4})$$

**Proof recipes**
- Chebyshev = Markov on $(X-\mu)^2$.
- Chernoff = Markov on $e^{tX}$, factorise by independence, use $1+y\le e^y$, set $t=\ln(1+\delta)$.
- Separation = Gaussian Annulus twice, then need $\Delta^2\gg\sqrt d$.

**Remember**
- More assumptions give faster decay: $1/a\to1/a^2\to e^{-\Theta(a^2)}$.
- Independence is what buys exponential decay.
- Sample need grows linearly in $d$.
- High dimension can help: collective signal $\Delta^2$ beats per-cloud noise $\sqrt d$.

**Next:** Ch.3, Best-Fit Subspaces and SVD (power method, Eckart-Young, PCA).
