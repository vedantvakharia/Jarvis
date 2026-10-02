This excerpt from [FDS-Week2-HighDimensionalSpace-JL.md](file:///c:/Users/intel/OneDrive/Documents/GitHub/Jarvis/source/content/FDS/FDS-Week2-HighDimensionalSpace-JL.md#L64-L87) covers one of the most counterintuitive and foundational properties of high-dimensional geometry: **almost all the volume of a high-dimensional ball lies in an ultra-thin slab around the equator**.

---

### 1. What the Formal Statement Means

> **Statement:** For $x \sim \text{Uniform}(B^d)$ and any $c > 0$, at least $1 - \frac{2}{c}e^{-c^2/2}$ of the volume satisfies:
> $$|x_1| \le \frac{c}{\sqrt{d - 1}}$$

* **In 2D or 3D**, a point inside a unit ball can easily have a coordinate like $x_1 = 0.8$ or $0.9$.
* **In high dimensions ($d \gg 1$)**, the first coordinate $x_1$ is almost guaranteed to be tightly pinned near zero.
* **Concrete Example:** Suppose $d = 10,001$ and we set $c = 4$:
  * The threshold is $\frac{c}{\sqrt{d-1}} = \frac{4}{\sqrt{10,000}} = \frac{4}{100} = 0.04$.
  * The probability of $|x_1| \le 0.04$ is at least:
    $$1 - \frac{2}{4}e^{-4^2 / 2} = 1 - 0.5 e^{-8} \approx 1 - 0.000168 = 99.983\%$$
  * Even though the ball extends from $-1$ to $+1$, **$99.98\%$ of the ball's volume is crammed inside the thin slice $[-0.04, +0.04]$**.

---

### 2. Rotational Invariance: It Holds for *Any* Direction

Because the ball $B^d$ is perfectly spherically symmetric, the $x_1$-axis has no special status:
* For **any fixed unit vector $u$**, the projection $\langle x, u \rangle$ has the exact same distribution as $x_1 = \langle x, e_1 \rangle$.
* **Geometric interpretation:** Pick any direction $u$ as the "North Pole". The "equator" is the hyperplane perpendicular to $u$. The result states that almost the entire volume of the ball is concentrated in a razor-thin **equatorial slab** of width $O(1/\sqrt{d})$ around that equator.

> **Key distinction noted in the text:** This is a **per-direction** (marginal) guarantee for any *pre-chosen* unit vector $u$, not a guarantee that the maximum coordinate $\max_k |x_k|$ is $O(1/\sqrt{d})$. (By the union bound across all $d$ coordinates, the maximum coordinate typically scales as $\approx \sqrt{\frac{2\ln d}{d}}$, which is slightly larger, but still decays to 0 as $d \to \infty$).

---

### 3. The "Coordinate Budget" Intuition

Why does the $1/\sqrt{d}$ factor appear everywhere?

1. **Volume concentrates on the shell:** In high dimensions, almost all volume of $B^d$ is concentrated in a thin shell near the surface (i.e., $\|x\|_2 \approx 1$).
2. **The budget:**
   $$\sum_{k=1}^d x_k^2 = \|x\|_2^2 \approx 1$$
   You have a total "squared-length budget" of $1$ to distribute across $d$ dimensions.
3. **Equal distribution:** By symmetry, no coordinate can claim more variance than any other:
   $$\mathbb{E}[x_k^2] = \frac{1}{d} \implies |x_k| \approx \frac{1}{\sqrt{d}}$$

---

### 4. Direct Consequence: Random Vectors are Nearly Orthogonal

This budget logic immediately explains why two independent random points $x_i, x_j$ are almost orthogonal:

$$\langle x_i, x_j \rangle = \sum_{k=1}^d x_{i,k} x_{j,k}$$

* **Mean:** $\mathbb{E}[\langle x_i, x_j \rangle] = \sum_k \mathbb{E}[x_{i,k}]\mathbb{E}[x_{j,k}] = 0$ (by symmetry).
* **Variance:**
  $$\text{Var}(\langle x_i, x_j \rangle) = \sum_{k=1}^d \mathbb{E}[x_{i,k}^2]\mathbb{E}[x_{j,k}^2] = \sum_{k=1}^d \left(\frac{1}{d}\right)\left(\frac{1}{d}\right) = d \cdot \frac{1}{d^2} = \frac{1}{d}$$
* **Standard Deviation:** $\sigma = \frac{1}{\sqrt{d}}$.

Because the cosine similarity is $\cos \theta = \frac{\langle x_i, x_j \rangle}{\|x_i\| \|x_j\|} \approx 0 \pm O(1/\sqrt{d})$:
* $\cos \theta \approx 0 \implies \theta \approx 90^\circ$.
* In high dimensions, **any two randomly sampled vectors are almost perpendicular**.