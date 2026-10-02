
# CS F320: Concentration Inequalities, Solutions

## Cheat sheet (formulas used below)

| Name | Statement |
|---|---|
| Union bound | $P(\cup A_i) \le \sum P(A_i)$ |
| Markov ($x \ge 0$, $a>0$) | $P(x \ge a) \le \dfrac{E(x)}{a}$ |
| Chebyshev | $P(\lvert x-E(x)\rvert \ge c) \le \dfrac{\mathrm{Var}(x)}{c^2}$ |
| Markov on powers | $P(x \ge a) \le \dfrac{E(x^r)}{a^r}$ |
| $1+x \le e^x$ | used to turn $(1-p)^n$ into $e^{-pn}$ |
| Chernoff (sum of independent 0/1, $m=E(s)$, $0<\delta\le 1$) | $P(s<(1-\delta)m)\le e^{-m\delta^2/2}$, $\;P(s>(1+\delta)m)\le e^{-m\delta^2/3}$ |
| Gaussian tail | $Z\sim N(0,1)$: $P(\lvert Z\rvert \ge t)\le 2e^{-t^2/2}$ |
| Sample mean | $\mathrm{Var}(m_s)=\sigma^2/n$ |

---

# Section A: Markov, Chebyshev, Chernoff

## A1. Union bound

**Claim.** $P(A_1\cup\cdots\cup A_n)\le \sum_{i=1}^n P(A_i)$.

**Idea.** Overlaps get counted twice in the sum, so the sum can only be bigger. Make the events non-overlapping to prove it.

**Proof.** Define
$$B_1=A_1,\qquad B_i = A_i \setminus (A_1\cup\cdots\cup A_{i-1}).$$

- The $B_i$ are pairwise disjoint.
- $\bigcup B_i=\bigcup A_i$ (each outcome is put in the first $A_i$ that contains it).
- $B_i\subseteq A_i$, so $P(B_i)\le P(A_i)$.

Because the $B_i$ are disjoint, probabilities add:
$$P\Big(\bigcup A_i\Big)=\sum P(B_i)\le \sum P(A_i)$$

---

## A2. Markov is tight

**Goal.** Find $x\ge 0$ with $P(x\ge a)=E(x)/a$ exactly.

**Construction.** Put all mass at $0$ and $a$:
$$P(x=a)=\frac1a,\qquad P(x=0)=1-\frac1a.$$
This is a valid distribution because $a\ge 1$ makes $1/a\le 1$.

**Check.**
$$E(x)=a\cdot\frac1a=1,\qquad P(x\ge a)=\frac1a=\frac{E(x)}{a}. \checkmark$$

**(1) Specific values**

| $a$ | $P(x=0)$ | $P(x=a)$ |
|---|---|---|
| 2 | 1/2 | 1/2 |
| 3 | 2/3 | 1/3 |
| 4 | 3/4 | 1/4 |

**(2) Arbitrary $a\ge1$.** The same construction works. Markov is tight when all the mass sits exactly at $0$ or exactly at the threshold $a$.

---

## A3. Why no bound $P(x\le a)\le E(x)/a$?

**Why Markov works.** 
$$E(x)\ge \sum_{x\ge a} x\,p(x)\ge a\,P(x\ge a).$$
We throw away the part with $x<a$ because it is $\ge 0$ (needs $x\ge0$). Large values *force* $E(x)$ to be large.

**Why the lower tail fails.** Small values contribute almost nothing to $E(x)$, so $E(x)$ says nothing about how much mass is small.

**Counterexample 1.** $x=0$ always. Then $P(x\le a)=1$ but $E(x)/a=0$. The claimed bound says $1\le 0$. False.

**Counterexample 2 (large mean, still mostly small).** $x=0$ w.p. $1-\varepsilon$, $x=M$ w.p. $\varepsilon$. Then $E(x)=\varepsilon M$ can be as large as we like, yet $P(x\le a)=1-\varepsilon\approx1$. So $E(x)$ alone cannot give a useful upper bound on $P(x\le a)$.

---

## A4. $x$ uniform on $[0,4]$ (density $1/4$)

Useful moments:
$$E(x^r)=\int_0^4 \frac{x^r}{4}\,dx=\frac{4^r}{r+1}.$$
So $E(x)=2$, $E(x^2)=\frac{16}{3}$. (True value: $P(x\ge3)=\frac14$.)

**(1) Markov.**
$$P(x\ge3)\le\frac{E(x)}{3}=\frac23\approx0.667.$$

**(2) Use $x^2$.** $P(x\ge3)=P(x^2\ge9)$, so
$$P(x\ge 3)\le \frac{E(x^2)}{9}=\frac{16/3}{9}=\frac{16}{27}\approx0.593.$$
Tighter.

**(3) Use $x^r$.**
$$P(x\ge3)\le\frac{E(x^r)}{3^r}=\frac{4^r}{(r+1)3^r}=\frac{(4/3)^r}{r+1}.$$

| $r$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| bound | 0.667 | 0.593 | 0.593 | 0.632 |

**Best $r$.** Minimise $r\ln\frac43-\ln(r+1)$. Derivative zero gives
$$\ln\tfrac43=\frac1{r+1}\;\Rightarrow\; r+1=\frac1{\ln(4/3)}\approx3.48,\; r\approx2.48,$$
giving a bound of about $0.587$. Even the best $r$ stays well above the true $0.25$. Larger $r$ helps at first, then the bound gets worse again.

---

## A5. $p(x=0)=1-\frac1a,\; p(x=a)=\frac1a$

Moments:
$$E(x)=1,\quad E(x^2)=a^2\cdot\tfrac1a=a,\quad E(x^4)=a^4\cdot\tfrac1a=a^3.$$

Bounds on $P(x\ge a)$:

| Method | Bound |
|---|---|
| Markov on $x$ | $\dfrac{1}{a}$ |
| Markov on $x^2$ | $\dfrac{E(x^2)}{a^2}=\dfrac{a}{a^2}=\dfrac1a$ |
| Markov on $x^4$ | $\dfrac{E(x^4)}{a^4}=\dfrac{a^3}{a^4}=\dfrac1a$ |
| True value | $\dfrac1a$ |

**Plot description.** All four curves are the *same* curve $y=1/a$ (starts at 1 at $a=1$, decays towards 0). No bound beats another here.

**Why.** This is the tight example from A2: all mass is at $0$ or $a$, so raising to a power changes nothing useful.

| $a$ | 1 | 2 | 4 | 8 | 16 |
|---|---|---|---|---|---|
| all bounds = true | 1 | 0.5 | 0.25 | 0.125 | 0.0625 |

---

## A6. Chebyshev is tight

(The statement means $P(\lvert x-E(x)\rvert\ge c)=\mathrm{Var}(x)/c^2$.)

**Construction.** For $c\ge1$:
$$x=\begin{cases} +c & \text{w.p. } \frac{1}{2c^2}\\ -c & \text{w.p. } \frac{1}{2c^2}\\ 0 & \text{w.p. } 1-\frac1{c^2}\end{cases}$$
Valid since $c\ge1$ gives $1/c^2\le1$.

**Check.**
- $E(x)=0$ by symmetry.
- $\mathrm{Var}(x)=E(x^2)=c^2\cdot\frac1{c^2}=1$.
- $P(\lvert x\rvert\ge c)=\frac{1}{2c^2}+\frac1{2c^2}=\frac1{c^2}=\frac{\mathrm{Var}(x)}{c^2}$. $\checkmark$

Chebyshev is tight when all non-mean mass sits exactly at distance $c$ from the mean.

---

## A7. Compare Markov and Chebyshev

Both bound a tail $P(x\ge a)$. Chebyshev version: for $a>E(x)$,
$$P(x\ge a)\le P(\lvert x-E(x)\rvert\ge a-E(x))\le\frac{\mathrm{Var}(x)}{(a-E(x))^2}.$$

### (1) $x=1$ always

$E(x)=1$, $\mathrm{Var}(x)=0$. For $a>1$:

- True: $P(x\ge a)=0$.
- Markov: $\frac1a$ (positive, loose).
- Chebyshev: $\frac{0}{(a-1)^2}=0$ (exact).

Zero variance means Chebyshev is perfect, Markov does not use variance.

### (2) $x$ uniform on $[0,2]$

$E(x)=1$, $\mathrm{Var}(x)=\frac{(2-0)^2}{12}=\frac13$. True: $P(x\ge a)=\frac{2-a}{2}$.

- Markov: $\frac1a$.
- Chebyshev (for $a>1$): $\dfrac{1/3}{(a-1)^2}$.

| $a$ | True | Markov | Chebyshev |
|---|---|---|---|
| 1.5 | 0.25 | 0.667 | 1.333 (useless, above 1) |
| 1.9 | 0.05 | 0.526 | 0.412 |
| 2 | 0 | 0.5 | 0.333 |
| 3 | 0 | 0.333 | 0.083 |

**Crossover.** $\frac1a=\frac1{3(a-1)^2}\Rightarrow 3a^2-7a+3=0\Rightarrow a\approx1.77$.
- For $a<1.77$ Markov is better.
- For $a>1.77$ Chebyshev is better.

**Takeaway.** Chebyshev wins when the threshold is many standard deviations from the mean. Neither is tight here, since the uniform distribution is not an extreme case.

---

## A8. $1+x\le e^x$

**Proof.** Let $f(x)=e^x-1-x$.
- $f'(x)=e^x-1$, which is $0$ only at $x=0$.
- $f''(x)=e^x>0$, so $x=0$ is a global minimum.
- $f(0)=0$.

So $f(x)\ge0$ for all $x$, i.e. $1+x\le e^x$. $\blacksquare$

**When is $1+x$ within $0.01$ of $e^x$?** Need $e^x-1-x\le0.01$. Taylor: $e^x-1-x\approx\frac{x^2}{2}$, so $x^2\lesssim0.02$, $\lvert x\rvert\lesssim0.14$. Solving exactly:
$$-0.145\lesssim x\lesssim 0.138.$$
Rule of thumb: $\lvert x\rvert\le 0.14$.

---

## A9. Symmetric difference

Let $\lvert U\rvert=N$ and $\lvert X\triangle Y\rvert=\frac N{10}$.

- One random pick lies in $X\triangle Y$ with probability $\frac1{10}$, so it misses with probability $0.9$.
- Picks are independent (with replacement), so
$$P(\text{none of } n \text{ picks in } X\triangle Y)=(0.9)^n=(1-0.1)^n.$$
- By A8 with $x=-0.1$: $1-0.1<e^{-0.1}$ (strict, since $x\ne0$). So
$$(1-0.1)^n< e^{-0.1n}. \qquad\blacksquare$$

---

## A10. Chernoff for $s=\sum x_i$, $x_i\sim\mathrm{Bernoulli}(p)$

$m=E(s)=np$. Chernoff bounds for $0<\delta\le1$:
$$P(s<(1-\delta)m)\le e^{-m\delta^2/2},\qquad P(s>(1+\delta)m)\le e^{-m\delta^2/3}.$$
(Problem's $\varepsilon$ is the target failure probability.)

**(1) Lower tail.** Want $e^{-m\delta^2/2}<\varepsilon$:
$$\frac{m\delta^2}{2}>\ln\frac1\varepsilon\;\Rightarrow\;\boxed{\delta>\sqrt{\frac{2\ln(1/\varepsilon)}{m}}}$$

**(2) Upper tail.** Want $e^{-m\delta^2/3}<\varepsilon$:
$$\boxed{\delta>\sqrt{\frac{3\ln(1/\varepsilon)}{m}}}$$

**Reading the result.**
- $\delta$ shrinks like $1/\sqrt m=1/\sqrt{np}$. More samples means tighter concentration around the mean.
- The result is meaningful only when $\delta\le1$, i.e. $m\ge2\ln(1/\varepsilon)$ (lower) or $m\ge3\ln(1/\varepsilon)$ (upper).
- Upper tail needs the bigger constant (3 vs 2), so it is a bit looser.

---

# Section B: Fitting a Spherical Gaussian

## B1. Why divide by $n-1$

**Step 1: variance of the sample mean.** The $x_i$ are independent, so variances add:
$$\mathrm{Var}(m_s)=\frac1{n^2}\sum\mathrm{Var}(x_i)=\frac{n\sigma^2}{n^2}=\frac{\sigma^2}{n}.$$

**Step 2: rewrite the deviation.** 
$$x_i-m_s=(x_i-\mu)-(m_s-\mu).$$
Square and average over $i$:
$$\frac1n\sum(x_i-m_s)^2=\frac1n\sum(x_i-\mu)^2-2(m_s-\mu)\cdot\frac1n\sum(x_i-\mu)+(m_s-\mu)^2.$$
Since $\frac1n\sum(x_i-\mu)=m_s-\mu$, the last two terms combine:
$$\sigma_s^2=\frac1n\sum(x_i-\mu)^2-(m_s-\mu)^2.$$

**Step 3: take expectations.**
- $E\big[\frac1n\sum(x_i-\mu)^2\big]=\sigma^2$.
- $E[(m_s-\mu)^2]=\mathrm{Var}(m_s)=\frac{\sigma^2}{n}$.

$$E(\sigma_s^2)=\sigma^2-\frac{\sigma^2}{n}=\frac{n-1}{n}\sigma^2. \qquad\blacksquare$$

**Meaning.** The sample mean $m_s$ is, by construction, the point closest to the data, so deviations from $m_s$ are smaller than deviations from the true $\mu$. This makes the estimate too small by a factor $\frac{n-1}{n}$. Fix: divide by $n-1$ instead:
$$\frac1{n-1}\sum(x_i-m_s)^2 \text{ is unbiased.}$$

---

## B2. Estimating the center of a Gaussian in $d$ dimensions

Setup: $x\sim N(\mu,I_d)$ (variance 1 in each direction). Take $n$ samples and let $m_s$ be the average.

**Key fact.** Each coordinate of $m_s$ is an average of $n$ independent $N(\mu_i,1)$ values, so
$$m_{s,i}-\mu_i\sim N\Big(0,\frac1n\Big).$$

### Part 1: $\lVert\mu-m_s\rVert_\infty\le\varepsilon$ (every coordinate close)

Write $m_{s,i}-\mu_i=Z_i/\sqrt n$ with $Z_i\sim N(0,1)$. Gaussian tail:
$$P(\lvert m_{s,i}-\mu_i\rvert\ge\varepsilon)=P(\lvert Z_i\rvert\ge\varepsilon\sqrt n)\le2e^{-n\varepsilon^2/2}.$$

Union bound over $d$ coordinates:
$$P(\text{some coordinate off by}\ge\varepsilon)\le2d\,e^{-n\varepsilon^2/2}.$$

Want this $\le0.01$:
$$2d\,e^{-n\varepsilon^2/2}\le0.01\;\Rightarrow\; n\ge\frac{2}{\varepsilon^2}\ln(200d).$$
$$\boxed{n=O\Big(\frac{\log d}{\varepsilon^2}\Big)}$$

Only $\log d$ because the failure probability per coordinate decays exponentially, so the union bound over $d$ coordinates costs just a $\ln d$.

### Part 2: $\lVert\mu-m_s\rVert_2\le\varepsilon$ (total distance close)

$$\lVert m_s-\mu\rVert_2^2=\sum_{i=1}^d(m_{s,i}-\mu_i)^2,\qquad E\big[\lVert m_s-\mu\rVert_2^2\big]=d\cdot\frac1n=\frac dn.$$

Markov on the squared distance:
$$P\big(\lVert m_s-\mu\rVert_2^2\ge\varepsilon^2\big)\le\frac{d/n}{\varepsilon^2}.$$
Want $\le0.01$:
$$\boxed{n\ge\frac{100\,d}{\varepsilon^2}=O\Big(\frac d{\varepsilon^2}\Big)}$$

**Why $d$ is unavoidable.** The expected squared error is $d/n$, so we need $d/n\lesssim\varepsilon^2$, i.e. $n\gtrsim d/\varepsilon^2$.

**Compare.** Using Part 1 with $\varepsilon/\sqrt d$ in each coordinate also works (since $\lVert v\rVert_2\le\sqrt d\,\lVert v\rVert_\infty$) but costs $O(d\log d/\varepsilon^2)$, worse than Markov's $O(d/\varepsilon^2)$.

---

## B3. Object on a line, noisy GPS

**Model.** Position at minute $k$ is $p_0+vk$ (constant velocity). GPS reading:
$$y_k=p_0+vk+\text{noise}_k,\qquad \text{noise}_k\sim N(0,\sigma^2)\text{ independent}.$$
Do each coordinate (latitude, longitude) separately.

**Why not just average the readings?** The object moves, so old readings are stale. Using only the latest reading ignores all earlier information (variance stays $\sigma^2$).

**Method: least squares (= maximum likelihood for Gaussian noise).** The log-likelihood is
$$-\frac1{2\sigma^2}\sum_k(y_k-p_0-vk)^2+\text{const},$$
so maximising likelihood means minimising $\sum_k(y_k-p_0-vk)^2$, a straight-line fit.

With readings $k=1,\dots,n$, $\bar k=\frac1n\sum k$, $\bar y=\frac1n\sum y_k$:
$$\hat v=\frac{\sum_k(k-\bar k)(y_k-\bar y)}{\sum_k(k-\bar k)^2},\qquad \hat p_0=\bar y-\hat v\,\bar k.$$

**Current position (time $n$):**
$$\boxed{\hat p(n)=\hat p_0+\hat v\,n}$$

**Special case: velocity known.** Then $y_k-vk=p_0+\text{noise}_k$ are noisy copies of $p_0$. Average them:
$$\hat p(n)=\frac1n\sum_k(y_k-vk)+vn,\qquad\mathrm{Var}=\frac{\sigma^2}n.$$
Error shrinks like $1/\sqrt n$, as in B2.

---

## B4. Generating 10 points from $N(5,9)$

The density $\frac1{3\sqrt{2\pi}}e^{-\frac12\left(\frac{x-5}3\right)^2}$ is $N(\mu=5,\sigma^2=9)$ with $\sigma=3$.

**Generate.** $x_i=5+3z_i$ with $z_i\sim N(0,1)$ (e.g. `5 + 3*np.random.randn(10)`). One run (seed 320):

$$8.879,\;7.478,\;9.164,\;4.622,\;7.782,\;4.088,\;3.395,\;4.508,\;3.161,\;5.749$$

**(a) Estimate $\mu$.**
$$m=\frac1{10}\sum x_i=5.883,\qquad\lvert m-5\rvert=0.883.$$
Expected error is about $\sigma/\sqrt n=3/\sqrt{10}\approx0.95$, so this is typical.

**(b) Known mean, divide by 10.**
$$\frac1{10}\sum(x_i-5)^2=5.40,\qquad\lvert5.40-9\rvert=3.60.$$

**(c) Sample mean $m$, divide by 10.**
$$\frac1{10}\sum(x_i-m)^2=4.62,\qquad\lvert4.62-9\rvert=4.38.$$

**(d) Sample mean $m$, divide by 9.**
$$\frac19\sum(x_i-m)^2=5.14,\qquad\lvert5.14-9\rvert=3.86.$$

**What to notice.**
- (c) is smaller than (d) by exactly the factor $\frac9{10}$ (B1: dividing by $n$ is biased low).
- (d) is closer than (c) here, matching B1's prediction on average.
- All estimates of $\sigma^2$ are far from $9$. With only 10 points the variance estimate is very noisy. Individual runs vary, so your numbers will differ. Averaged over many runs, (b) and (d) center on $9$, (c) centers on $8.1$.

---

# Section C: Separating Two Gaussians

## C1. Two unit balls, separation $s\gg\frac1{\sqrt{d-1}}$

**Setup.** $A$: unit ball at origin. $B$: unit ball centered at $s\,e_1$. Mixture: pick $A$ or $B$ w.p. $\frac12$, then a uniform point in it. We say a point is ambiguous if it lies in $A\cap B$ (the lens). Show: for any $\varepsilon>0$ there is $c$ so that $s\ge\frac{2c}{\sqrt{d-1}}$ gives $P(x\in A\cap B)<\varepsilon$.

### Step 1: reduce the lens to a cap

Reflect space across the hyperplane $x_1=s/2$. This swaps $A$ and $B$, so the lens maps to itself and the two halves of the lens have equal volume:
$$\mathrm{vol}(\text{lens})=2\,\mathrm{vol}(\text{lens}\cap\{x_1\ge s/2\}).$$
The right half of the lens is inside $A$, so it is inside the cap $\{x\in A: x_1\ge s/2\}$. Hence
$$P(\text{uniform point of }A\text{ lies in }B)=\frac{\mathrm{vol(lens)}}{\mathrm{vol}(A)}\le 2\,P_{x\sim A}\big(x_1\ge s/2\big).$$

### Step 2: cap bound. For uniform $x$ in the unit ball and $c>0$:

$$P\Big(x_1\ge\frac{c}{\sqrt{d-1}}\Big)\le\frac{e^{-c^2/2}}{c}.$$

**Numerator (cap volume).** Slicing at height $x_1$ gives a $(d-1)$-ball of radius $\sqrt{1-x_1^2}$. With $V_{d-1}$ the volume of the unit $(d-1)$-ball and $t=\frac c{\sqrt{d-1}}$:
$$\text{cap}=V_{d-1}\int_t^1(1-x_1^2)^{\frac{d-1}2}dx_1\le V_{d-1}\int_t^\infty e^{-\frac{(d-1)x_1^2}{2}}dx_1,$$
using $1-u\le e^{-u}$. For $x_1\ge t$ we have $1\le x_1/t$, so
$$\int_t^\infty e^{-\frac{(d-1)x_1^2}2}dx_1\le\int_t^\infty\frac{x_1}{t}e^{-\frac{(d-1)x_1^2}2}dx_1=\frac{e^{-(d-1)t^2/2}}{(d-1)t}=\frac{e^{-c^2/2}}{c\sqrt{d-1}}.$$

**Denominator (ball volume).** The ball contains a cylinder of radius $\sqrt{1-\frac1{d-1}}$ and height $\frac2{\sqrt{d-1}}$, so
$$\mathrm{vol(ball)}\ge V_{d-1}\Big(1-\frac1{d-1}\Big)^{\frac{d-1}2}\frac2{\sqrt{d-1}}\ge V_{d-1}\frac1{\sqrt{d-1}},$$
since $\big(1-\frac1{m}\big)^{m/2}\ge\frac12$ for $m\ge2$.

**Ratio.**
$$\frac{\text{cap}}{\text{ball}}\le\frac{V_{d-1}\,e^{-c^2/2}/(c\sqrt{d-1})}{V_{d-1}/\sqrt{d-1}}=\frac{e^{-c^2/2}}{c}.$$

### Step 3: combine

Choose $s=\frac{2c}{\sqrt{d-1}}$, so $s/2=\frac c{\sqrt{d-1}}$. By Steps 1 and 2:
$$P(\text{point from }A\text{ is in }B)\le\frac{2e^{-c^2/2}}{c}.$$
The same holds for points from $B$ by symmetry, so
$$P(x\in A\cap B)\le\frac{2e^{-c^2/2}}{c}\xrightarrow{c\to\infty}0.$$
Pick $c$ large enough that this is $<\varepsilon$. Any $s\ge\frac{2c}{\sqrt{d-1}}$ then works. $\blacksquare$

**Intuition.** In high dimensions almost all the volume of a ball sits near its "equator" (within about $\frac1{\sqrt d}$ of any central hyperplane). The two balls only share points near the hyperplane $x_1=s/2$, where each ball has very little volume. So a tiny shift of $\frac1{\sqrt d}$ is already enough to tell the two clusters apart.

---

## C2. Best stretching of coordinates

**Goal.** Choose $a_i$ with $\sum a_i^2=d$ to maximise $E\big[\lVert ax-ay\rVert^2\big]$ where $(ax)_i=a_ix_i$. Assume $x$ and $y$ independent, $y_i\in\{0,1\}$ w.p. $\frac12$ each.

**Step 1: split by coordinate.**
$$E\big[\lVert ax-ay\rVert^2\big]=\sum_{i=1}^da_i^2\,E\big[(x_i-y_i)^2\big]=\sum_ia_i^2\,w_i,\qquad w_i:=E\big[(x_i-y_i)^2\big].$$

**Step 2: compute $w_i$.** Using $E(y_i)=\frac12$, $E(y_i^2)=\frac12$, and independence:
$$w_i=E(x_i^2)-2E(x_i)E(y_i)+E(y_i^2)=E(x_i^2)-E(x_i)+\frac12.$$
Equivalently,
$$w_i=E\Big[\big(x_i-\tfrac12\big)^2\Big]+\frac14.$$

**Step 3: optimise.** Let $b_i=a_i^2\ge0$ with $\sum b_i=d$. We maximise the linear function $\sum b_iw_i$. A linear function over this set is maximised by putting *all* the weight on the largest $w_i$:
$$\boxed{a_{i^*}=\sqrt d,\quad a_j=0\ (j\ne i^*),\qquad i^*=\arg\max_i\,E\big[(x_i-\tfrac12)^2\big]}$$
The maximum value is $d\cdot w_{i^*}$.

**Meaning.** Pick the one coordinate where $x_i$ is on average farthest from $\frac12$ (the center of $y_i$). Spend the entire "stretch budget" there, and squash every other coordinate to zero. If several coordinates tie, any split among them is equally good.
