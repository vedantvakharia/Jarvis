One of the most impactful ways to decrease the computational time and energy consumption of
neural networks is quantization. In neural network quantization, the weights and activation tensors
are stored in lower bit precision than the 16 or 32-bit precision they are usually trained in. When moving from 32 to 8 bits, the memory overhead of storing tensors decreases by a factor of 4 while the computational cost for matrix multiplication reduces quadratically by a factor of 16. Neural networks have been shown to be robust to quantization, meaning they can be quantized to lower bit-widths with a relatively small impact on the network’s accuracy. Besides, neural network quantization can often be applied along with other common methods for neural network optimization, such as neural architecture search, compression, and pruning.

Quantization refers to techniques for performing computations and storing tensors at lower bit-widths than floating point precision. A quantized model executes some or all of the operations on tensors with integers rather than floating point values. This allows for a more compact model representation and the use of high performance vectorized operations on many hardware platforms. This technique is in particular useful at the inference time since it saves a lot of inference computation cost without sacrificing too much inference accuracies.

## Quantization

### Quantization Mapping

Quantization maps a floating point value $x \in [\alpha, \beta]$ to a b-bit integer $x_q \in [\alpha_q, \beta_q]$.

Mathematically, the de-quantization process is defined as $x = c(x_q + d)$ and the quantization process is defined as $x_q = \text{round}(\frac{1}{c}x - d)$ where $c$ and $d$ are variables.

In order to derive $c$ and $d$, we have to make sure that $\alpha$ maps to $\alpha_q$ and $\beta$ maps to $\beta_q$. So we would just have to solve the linear system
$$
\beta = c(\beta_q + d)
\\
\alpha = c(\alpha_q + d)
$$
The solutions is
$$
c = \frac{\beta - \alpha}{\beta_q - \alpha_q}
\\
d = \frac{\alpha\beta_q - \beta\alpha_q}{\beta - \alpha}
$$
In practice, we would have to ensure that 0 in floating point is represented exactly with no error after quantization.

Mathematically, we need to ensure
$$
\begin{aligned}
x_q &= \text{round}(\frac{1}{c}0 - d) \\
&= \text{round}(-d) \\
&= -\text{round}(d) \\
&= -d
\end{aligned}
$$
This means that
$$
\begin{aligned}
d &= \text{round}(d) \\
&= \text{round}(\frac{\alpha\beta_q - \beta\alpha_q}{\beta - \alpha})
\end{aligned}
$$

To summarize, the de-quantization process is defined as
$$x = s(x_q - z)$$

and the quantization process is defined as
$$x_q = \text{round}(\frac{1}{s}x + z)$$

The value of scale $s$ and zero point $z$ are$$s = \frac{\beta - \alpha}{\beta_q - \alpha_q}$$$$z = \text{round}(\frac{\beta\alpha_q - \alpha\beta_q}{\beta - \alpha})$$
Note that $z$ is an integer and $s$ is a *positive* floating point number.

### Value Clipping

In practice, the quantization process will have chance to have $x$ that is outside the range of $[\alpha, \beta]$, thus the quantized value $x_q$ will also be outside the range of $[\alpha_q, \beta_q]$. If the integer type is signed `INTb` and $(\alpha_q, \beta_q) = (-2^{b-1}, 2^{b-1} - 1)$, or unsigned `UINTb` and $(\alpha_q, \beta_q) = (0, 2^b - 1)$, programming languages that have fixed type-precisions will clip the values that are outside the range.

More concretely, the quantization process will have an additional clip step.
$$x_q = \text{clip}\left(\text{round}(\frac{1}{s}x + z), \alpha_q, \beta_q\right)$$

where $\text{clip}(x, l, u)$ function is defined as
$$
\text{clip}(x, l, u) = \begin{cases}
l & \text{if } x < l \\
x & \text{if } l \le x \le u \\
u & \text{if } x > u
\end{cases}
$$

### Affine Quantization Mapping

The quantization mapping we discussed above is also called affine quantization mapping.

### Scale Quantization Mapping

If the integer type is signed `INTb`, $(\alpha_q, \beta_q) = (-2^{b-1} + 1, 2^{b-1} - 1)$ and we force $z = 0$.

Mathematically, we have
$$
\begin{gathered}
\alpha_q = -\beta_q \\
\text{round}\left(\frac{\beta\alpha_q - \alpha\beta_q}{\beta - \alpha}\right) = 0
\end{gathered}
$$
This results in $\alpha = -\beta$. Therefore, we are mapping between the floating point range $[\alpha, -\alpha]$ and the integer range $[\alpha_q, -\alpha_q]$. Because it is exactly symmetric around 0, we also call it symmetric quantization mapping.

Note that scale quantization mapping is just a special case of the affine quantization mapping, and we have an unused bit in the integer range.

