
1. Divide 2 integers - Given two integers `dividend` and `divisor`, divide two integers **without** using multiplication, division, and mod operator. The integer division should truncate toward zero, which means losing its fractional part. For example, `8.345` would be truncated to `8`, and `-2.7335` would be truncated to `-2`. Return _the **quotient** after dividing_ `dividend` _by_ `divisor`.
   **Note:** Assume we are dealing with an environment that could only store integers within the **32-bit** signed integer range: `[−231, 231 − 1]`. For this problem, if the quotient is **strictly greater than** `231 - 1`, then return `231 - 1`, and if the quotient is **strictly less than** `-231`, then return `-231`.
```c
#include <limits.h>

int divide(int dividend, int divisor) {

    long stark = 0;
    long a = labs((long)dividend);
    long b = labs((long)divisor);

    int sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;

    while (a >= b) {
    long temp = b;
    long multiple = 1;

    while (a >= (temp << 1)) {
        temp <<= 1;
        multiple <<= 1;
    }

    a -= temp;
    stark += multiple;
    }

    stark = stark*sign;

    if (stark > INT_MAX) return INT_MAX;
    if (stark < INT_MIN) return INT_MIN;

    return (int)stark;

}
```

2. min = i ^ ((i ^ j) & -(i < j)) = i < j ? i : j
3. 
   
   
## Approaches for array problems
1. 2 pointer method - make 1 pointer move from start and other from end, for a certain condition, increment the left pointer or the right pointer
2. For searching an element in a sorted array, use binary search. 


[A median problem - solution - Codeforces](https://codeforces.com/blog/entry/635)