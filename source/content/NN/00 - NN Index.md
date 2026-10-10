# Neural Networks & Applications (BITS F445) — Index

Textbook: Michael Nielsen, *Neural Networks and Deep Learning*.

## Chapters
1. [[01 - Ch1 Perceptrons, Sigmoid Neurons and Gradient Descent]]
2. [[02 - Ch2 Backpropagation]]
3. [[03 - Ch3 Improving Learning]] (Part A + Part B)
4. [[04 - Ch4 Universality]]

## Practice Problems map (`Practice_Problems_1.pdf`)

| Problem | Topic | Chapter |
|---|---|---|
| Problem 2 | Sign of gradient, direction of GD update | [[01 - Ch1 Perceptrons, Sigmoid Neurons and Gradient Descent\|Ch1]] |
| Problem 3 | Full gradient vs mini-batch SGD | [[01 - Ch1 Perceptrons, Sigmoid Neurons and Gradient Descent\|Ch1]] |
| Question 4 | What gradient backprop computes | [[02 - Ch2 Backpropagation\|Ch2]] |
| Question 5 | Backpropagate the error (BP2, BP3, BP4) | [[02 - Ch2 Backpropagation\|Ch2]] |
| Question 7 | Cross-entropy vs quadratic, saturation | [[03 - Ch3 Improving Learning\|Ch3]] |
| Question 8 | Softmax + log-likelihood | [[03 - Ch3 Improving Learning\|Ch3]] |
| Question 9 | L1 vs L2 regularization | [[03 - Ch3 Improving Learning\|Ch3]] |
| Question 10 | Weight initialization, symmetry | [[03 - Ch3 Improving Learning\|Ch3]] |

(Problems 1 and 6 are not in the PDF.)

---

# ⚡ Formula Sheet

## Neuron
| | |
|---|---|
| Perceptron | $y = 1$ if $w\cdot x + b > 0$, else $0$ |
| Weighted input | $z = w\cdot x + b$ |
| Sigmoid | $\sigma(z) = \dfrac{1}{1+e^{-z}}$, $\ \sigma'(z) = \sigma(z)(1-\sigma(z))$, max $0.25$ |
| tanh | $\tanh z = \dfrac{e^z - e^{-z}}{e^z + e^{-z}}$, $\ \tanh' = 1 - a^2$, $\ \sigma(z) = \dfrac{1+\tanh(z/2)}{2}$ |
| ReLU | $\max(0,z)$, derivative $1$ if $z>0$ else $0$ |
| Softmax | $a^L_j = \dfrac{e^{z^L_j}}{\sum_k e^{z^L_k}}$ |

## Network
$$
z^l = w^la^{l-1} + b^l, \qquad a^l = \sigma(z^l)
$$
$w^l_{jk}$: from neuron $k$ (layer $l-1$) to neuron $j$ (layer $l$). Params of `[784,30,10]`: $30\cdot785 + 10\cdot31 = 23860$.

## Costs
| Cost | $C_x$ | $\delta^L$ (sigmoid/softmax out) |
|---|---|---|
| Quadratic | $\frac12\|y - a^L\|^2$ | $(a^L - y)\odot\sigma'(z^L)$ |
| Binary cross-entropy | $-\sum_j[y_j\ln a_j + (1-y_j)\ln(1-a_j)]$ | $a^L - y$ |
| Softmax + NLL | $-\ln a^L_y$ | $a^L - y$ |
| Linear output + quadratic | $\frac12\|y - a^L\|^2$ | $a^L - y$ |

Overall cost: $C = \frac1n\sum_x C_x$, $\ \nabla C = \frac1n\sum_x\nabla C_x$.

## Gradient descent
$$
\Delta C \approx \nabla C\cdot\Delta v, \qquad \Delta v = -\eta\nabla C \Rightarrow \Delta C \approx -\eta\|\nabla C\|^2 \le 0
$$
$$
v \to v - \eta\nabla C
$$
Mini-batch SGD:
$$
w \to w - \frac{\eta}{m}\sum_{x\in B}\frac{\partial C_x}{\partial w}, \qquad b \to b - \frac{\eta}{m}\sum_{x\in B}\frac{\partial C_x}{\partial b}
$$
Updates per epoch $= n/m$.

Single sigmoid neuron, quadratic: $\nabla C_x = (a-y)\,a(1-a)\,(x_1,\dots,x_n,1)^T$

## Backprop
$$
\begin{aligned}
\delta^L &= \nabla_{a^L}C\odot\sigma'(z^L) &\text{(BP1)}\\
\delta^l &= ((w^{l+1})^T\delta^{l+1})\odot\sigma'(z^l) &\text{(BP2)}\\
\partial C/\partial b^l_j &= \delta^l_j &\text{(BP3)}\\
\partial C/\partial w^l_{jk} &= a^{l-1}_k\,\delta^l_j &\text{(BP4)}
\end{aligned}
$$
Vector: $\nabla_{b^l}C = \delta^l$, $\ \nabla_{w^l}C = \delta^l(a^{l-1})^T$


$$
C_x = C(a^L)
$$

For the quadratic cost specifically:$$C_x = \frac12 * ||y - a^L||^2 = \frac12 * \sum_j (y_j - a^L_j)^2$$

### Worked example recipe (2-2-2 sigmoid net, quadratic cost)
Forward pass:
$$
z^2 = w^2a^1 + b^2,\quad a^2 = \sigma(z^2),\qquad z^3 = w^3a^2 + b^3,\quad a^3 = \sigma(z^3),\qquad C_x = \tfrac12\|y-a^3\|^2
$$
Sigmoid derivative in terms of activation (vector form):
$$
\sigma'(z^l) = a^l\odot(1-a^l)
$$
Output layer (BP1, quadratic + sigmoid):
$$
\delta^3 = (a^3 - y)\odot\sigma'(z^3) = (a^3-y)\odot a^3\odot(1-a^3)
$$
Output-layer gradients (BP3, BP4):
$$
\nabla_{b^3}C = \delta^3, \qquad \nabla_{w^3}C = \delta^3(a^2)^T, \qquad \frac{\partial C}{\partial w^3_{jk}} = a^2_k\,\delta^3_j
$$
Hidden layer (BP2):
$$
\delta^2 = \big((w^3)^T\delta^3\big)\odot\sigma'(z^2) = \big((w^3)^T\delta^3\big)\odot a^2\odot(1-a^2)
$$
Hidden-layer gradients (BP3, BP4):
$$
\nabla_{b^2}C = \delta^2, \qquad \nabla_{w^2}C = \delta^2(a^1)^T, \qquad a^1 = x
$$
Column $k$ of $\nabla_{w^l}C$ is $0$ whenever $a^{l-1}_k = 0$ (e.g. $x_k = 0$) → weights from an inactive input don't learn.

## Regularization
| | Cost | Update |
|---|---|---|
| L2 | $C_0 + \frac{\lambda}{2n}\sum_w w^2$ | $w \to (1 - \frac{\eta\lambda}{n})w - \frac{\eta}{m}\sum\frac{\partial C_x}{\partial w}$ |
| L1 | $C_0 + \frac{\lambda}{n}\sum_w\lvert w\rvert$ | $w \to w - \frac{\eta\lambda}{n}\operatorname{sgn}(w) - \frac{\eta}{m}\sum\frac{\partial C_x}{\partial w}$ |

Biases are **not** regularized. L2 epoch decay factor $\approx e^{-\eta\lambda/m}$.

Dropout: drop half the hidden neurons per mini-batch; at test time halve outgoing hidden weights.

## Initialization
- Old: $w \sim N(0,1)$ → $\operatorname{Var}(z) = (\#\text{active inputs}) + 1$ → saturation.
- New: $w \sim N(0, 1/n_{in})$, $b \sim N(0,1)$ → $\operatorname{Var}(z) = \frac{\#\text{active}}{n_{in}} + 1$.
- Never all-zero (symmetry).

### Ch3 practice-problem formulas (Q7–Q10)
**Q7 — saturation, sigmoid output** ($y=1$, $a=0.01$):
$$
\delta^L_{\text{quad}} = (a-y)\,a(1-a), \qquad \delta^L_{\text{CE}} = a - y
$$
Quadratic carries the factor $\sigma'(z)=a(1-a)$ → tiny when saturated; cross-entropy cancels it (gradient $\propto$ error).

**Q8 — softmax + NLL:**
$$
C_x = -\ln a^L_{c}\ (c = \text{correct class}), \qquad \delta^L = a^L - y, \qquad \frac{\partial C}{\partial z^L} = \delta^L
$$
$$
z \to z - \eta\,\delta^L \quad(\delta_j<0 \Rightarrow z_j\uparrow,\ \ \delta_j>0 \Rightarrow z_j\downarrow)
$$
Outputs share the denominator $\sum_k e^{z_k}$ and sum to $1$ → raising one logit lowers all other $a_k$.

**Q9 — L1 vs L2 shrink (data-gradient ignored):**
$$
\text{L2: } w \to \left(1-\frac{\eta\lambda}{n}\right)w, \qquad \text{L1: } w \to w - \frac{\eta\lambda}{n}\operatorname{sgn}(w)
$$
L2 shrinks proportionally to $w$ (bigger absolute shrink on large weights); L1 shrinks by a constant (bigger relative shrink on small weights → sparsity).

**Q10 — initialization variance** ($z=\sum_k w_kx_k + b$, $n_{in}$ inputs, $n_{act}$ of them $=1$, others $0$):
$$
E[z]=0, \qquad \operatorname{Var}(z) = n_{act}\operatorname{Var}(w) + \operatorname{Var}(b), \qquad \operatorname{SD}(z)=\sqrt{\operatorname{Var}(z)}
$$
$$
w\sim N(0,1): \operatorname{Var}(z) = 500+1 = 501,\ \operatorname{SD}\approx 22.4 \qquad
w\sim N(0,\tfrac{1}{n_{in}}): \operatorname{Var}(z) = \tfrac{500}{1000}+1 = 1.5,\ \operatorname{SD}\approx 1.22
$$
Large $|z|$ → $\sigma(z)\approx 0$ or $1$ → $\sigma'(z)\approx 0$ → slow learning. Variances of independent terms add; $\operatorname{Var}(cX)=c^2\operatorname{Var}(X)$.

## Momentum
$$
v \to \mu v - \eta\nabla C, \qquad w \to w + v, \qquad \mu \approx 0.9
$$

## Universality
- Step position $s = -b/w$ (large $w$).
- Bump = 2 steps with output weights $+h, -h$.
- Hidden layer approximates $\sigma^{-1}(f(x))$.
- ReLU step: $\max(0, wx+b) - \max(0, wx+b-h)$.

---

# Exam traps checklist
- $w^l_{jk}$ order: **to $j$, from $k$**.
- BP2 uses the **transpose** $(w^{l+1})^T$.
- $\delta = \partial C/\partial z$ (not $\partial C/\partial a$).
- Weight from an input with $a = 0$ (or $x_j = 0$) → gradient 0 for that example.
- Cross-entropy fixes slowdown at the **output only**, not hidden layers.
- Softmax outputs sum to 1; sigmoid outputs don't.
- Tune hyper-parameters on **validation**, never test data.
- L2 shrinks proportionally; L1 by a constant → L1 gives **sparse** weights.
- Linear activations everywhere → network collapses to one affine map.
- Backprop computes the gradient for **one example**; average for mini-batch/full gradient.
