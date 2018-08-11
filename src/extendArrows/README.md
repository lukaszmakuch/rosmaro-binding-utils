
## extendArrows

"Extends" the given arrows in such a away that the parent nodes also follow them.

```javascript
import {extendArrows} from 'rosmaro-binding-utils';

extendArrows(
  [
    [['a:a:a', 'x']], 
    [['a:a:b', 'y']]
  ]
)
/*
[
  [['a:a:a', 'x'], ['a:a', 'x']], 
  [['a:a:b', 'y'], ['a:a', 'y']]
]
*/
```

```javascript
extendArrows(
  [
    [['a:a:a', 'x']], 
    [['a', 'y']]
  ]
)
/*
[
  [['a:a:a', 'x'], ['a:a', 'x']], 
  [['a', 'y']]
]
*/
```

```javascript
extendArrows(
  [
    [['a:a:a', 'x']], 
    []
  ]
)
/*
[
  [['a:a:a', 'x'], ['a:a', 'x']], 
  []
]
*/
```