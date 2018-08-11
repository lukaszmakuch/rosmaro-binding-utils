
## mergeArrows

Merges arrows from two sources into one set of arrows.

```javascript
import {mergeContexts} from 'rosmaro-binding-utils';
```

```javascript
mergeArrows([
  [
    [['a:a:a', 'x'], ['a:a', 'x'], ['a', 'x']],
    [['c:a:a', 'x'], ['c:a', 'x'], ['c', 'x']],
  ],
  [
    [['a:a:b', 'x'], ['a:a', 'x'], ['a', 'x']],
  ]
])
/*
[
  [['a:a:a', 'x'], ['a:a', 'x'], ['a', 'x']],
  [['c:a:a', 'x'], ['c:a', 'x'], ['c', 'x']],
  [['a:a:b', 'x'], ['a:a', 'x'], ['a', 'x']],
]
*/
```