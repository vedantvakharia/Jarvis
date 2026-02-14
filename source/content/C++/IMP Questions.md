- https://leetcode.com/problems/wiggle-sort-ii/submissions/1916310160/
- Rotated Search Array
```c++
class Solution {
public:

    int findMin(vector<int>& nums) {
        int pos = -1;
        int max = 0;
        int n = nums.size();

-----------------------------------------------------------------------        
		// Do the below steps if there are duplicate elements.
		
		// Do this if we need to find a target in a duplicate elements array
		if(n>1 && nums[0] == target) return true
		
		// We trim the end duplicate parts 
        while(n>1 && nums[0] == nums[n-1]){
            n--;
        }
-----------------------------------------------------------------------        

        for (int a = 1 << 13; a > 0; a >>= 1) {
            if (pos + a < n && nums[pos + a] >= nums[max]) { // Keep >= for duplicate, > for non duplicate
                pos += a;
                max = pos;
            }
        }

        if (max == n - 1) return nums[0];
        else return nums[max + 1];

    }

};
```

- https://leetcode.com/problems/split-array-largest-sum/description/
- https://leetcode.com/problems/maximum-running-time-of-n-computers/description/
- https://leetcode.com/problems/merge-intervals/
- https://leetcode.com/problems/reverse-pairs/description/