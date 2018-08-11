
## mergeContexts

Applies differences between the initial context and the new contexts to the initial context.

```javascript
import {mergeContexts} from 'rosmaro-binding-utils';
```

```javascript
mergeContexts(
  {a: 123, b: 456},
  [
    {a: 123, b: 456},
    {a: 123, b: 456, c: 789},
    {a: 123, b: 456},
  ]
)
// {a: 123, b: 456, c: 789}
```

```javascript
mergeContexts(
  {a: 123, b: 456, c: 789},
  [
    {a: 123, b: 456, c: 789},
    {a: 123, b: 456},
    {a: 123, b: 456, c: 789},
  ]
)
// {a: 123, b: 456}
```

```javascript
mergeContexts(
  {a: 123, b: 456, c: 789},
  [
    {a: 123, b: 456, c: 789},
    {a: 123, b: 654, c: 789},
    {a: 123, b: 456, c: 789},
  ]
)
// {a: 123, b: 654, c: 789}
```