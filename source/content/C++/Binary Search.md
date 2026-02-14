Binary search only works on sorted/monotonic things. In order for binary search to work, the search space must look like something of the following form 
<center>true true true true true false false false false</center>

```c title:"Binary Search Algorithm"
// Intuitive version
Function binarySearch1
	left = lower bound of search space
	right = upper bound of search space
	ans = -1
	while left <= right do
		mid (left + right)/2
		if check(mid) then  // check(x) returns true if the answer of x is possible
			left = mid + 1
			ans = mid
		else
			right = mid + 1
	end
	return ans

// Shorter version
Function binarySearch2
	pos = 0
	max = upper bound of search space
	for (a = max; a >= 1; a /= 2) do
		while check(pos + a) do
			pos = pos + a
		end
	end
	return pos
```

In the check function, < gives the last element strictly smaller than the target. It is used for finding the lower bound, i.e., when you need the first occurrence of a number (the answer is `pos + 1`). 

In the check function, <= gives the last element that is not greater than the target. `pos` will point to the actual target (if it exists) or the last occurrence of it if there are duplicates. It is used for finding the upper bound. 