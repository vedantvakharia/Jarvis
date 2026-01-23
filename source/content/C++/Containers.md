
| Member Function    | vector | unordered_set/map | priority_queue | queue | stack | set/map | deque |
| :----------------- | :----: | :---------------: | :------------: | :---: | :---: | :-----: | :---: |
| **Iterators**      |        |                   |                |       |       |         |       |
| `begin` / `end`    |  Yes   |        Yes        |       -        |   -   |   -   |   Yes   |  Yes  |
| `rbegin` / `rend`  |  Yes   |         -         |       -        |   -   |   -   |   Yes   |  Yes  |
| **Capacity**       |        |                   |                |       |       |         |       |
| `empty`            |  Yes   |        Yes        |      Yes       |  Yes  |  Yes  |   Yes   |  Yes  |
| `size`             |  Yes   |        Yes        |      Yes       |  Yes  |  Yes  |   Yes   |  Yes  |
| `max_size`         |  Yes   |        Yes        |       -        |   -   |   -   |   Yes   |  Yes  |
| `reserve`          |  Yes   |        Yes        |       -        |   -   |   -   |    -    |   -   |
| `capacity`         |  Yes   |         -         |       -        |   -   |   -   |    -    |   -   |
| `resize`           |  Yes   |                   |                |       |       |         |  Yes  |
| `shrink_to_fit`    |  Yes   |   </span>    -    |       -        |   -   |   -   |    -    |  Yes  |
| **Element Access** |        |                   |                |       |       |         |       |
| `operator[]`       |  Yes   |   Only for map    |       -        |   -   |   -   |   map   |  Yes  |
| `at`               |  Yes   |   Only for map    |       -        |   -   |   -   |   map   |  Yes  |
| `front`            |  Yes   |         -         |       -        |  Yes  |   -   |    -    |  Yes  |
| `back`             |  Yes   |         -         |       -        |  Yes  |   -   |    -    |  Yes  |
| `top`              |   -    |         -         |      Yes       |   -   |  Yes  |    -    |   -   |
| **Modifiers**      |        |                   |                |       |       |         |       |
| `clear`            |  Yes   |        Yes        |       -        |   -   |   -   |   Yes   |  Yes  |
| `insert`           |  Yes   |        Yes        |       -        |   -   |   -   |   Yes   |  Yes  |
| `emplace`          | C++11  |       C++11       |      Yes       |   -   |  Yes  |  C++11  | C++11 |
| `erase`            |  Yes   |        Yes        |       -        |   -   |   -   |   Yes   |  Yes  |
| `push_back`        |  Yes   |         -         |       -        |  Yes  |   -   |    -    |  Yes  |
| `pop_back`         |  Yes   |         -         |       -        |  Yes  |  Yes  |    -    |  Yes  |
| `push_front`       |   -    |         -         |       -        |  Yes  |   -   |    -    |  Yes  |
| `pop_front`        |   -    |         -         |       -        |  Yes  |   -   |    -    |  Yes  |
| `swap`             |  Yes   |        Yes        |      Yes       |  Yes  |  Yes  |   Yes   |  Yes  |
| **Lookup**         |        |                   |                |       |       |         |       |
| `find`             |   -    |        Yes        |       -        |   -   |   -   |   Yes   |   -   |
| `count`            |   -    |        Yes        |       -        |   -   |   -   |   Yes   |   -   |
| `contains`         |   -    |       C++20       |       -        |   -   |   -   |  C++20  |   -   |
| `lower_bound`      |   -    |         -         |       -        |   -   |   -   |   Yes   |   -   |
| `upper_bound`      |   -    |         -         |       -        |   -   |   -   |   Yes   |   -   |


## Unordered map


- Have O(1) lookup for keys, not values. 
- If we do `map.find(target)` and target is not present in the map, then it points to end of map. 