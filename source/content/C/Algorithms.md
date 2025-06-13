## Dynamic Programming

Dynamic programming applies when the subproblems overlap—that is, when subproblems share subsubproblems. A dynamic-programming algorithm solves each subsubproblem just once and then saves its answer in a table, thereby avoiding the work of recomputing the answer every time it solves each subsubproblem. Basically, it is recursion but storing the values so we don't need to calculate again. 

If brute-force is exponential and you see overlapping subproblems, it's probably a DP problem.

When developing a dynamic-programming algorithm, we follow a sequence of
four steps:
- Characterize the structure of an optimal solution.
- Recursively define the value of an optimal solution.
- Compute the value of an optimal solution, typically in a bottom-up fashion.
- Construct an optimal solution from computed information.
Steps 1–3 form the basis of a dynamic-programming solution to a problem. If we
need only the value of an optimal solution, and not the solution itself, then we
can omit step 4. When we do perform step 4, we sometimes maintain additional
information during step 3 so that we can easily construct an optimal solution.

1. Bottom up 
```c
int dp[MAX];

// Base cases
dp[0] = BASE_0;
dp[1] = BASE_1;

// Loop from small subproblems to bigger ones
for (int i = 2; i <= N; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];  // Change this based on recurrence
}

printf("%d\n", dp[N]);

```