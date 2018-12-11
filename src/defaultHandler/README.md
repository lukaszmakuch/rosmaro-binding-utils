
## defaultHandler

```javascript
import 'defaultHandler' from 'rosmaro-binding-utils';
```

If a node has just one child, this handler is simply transparent.

If a node has many children, let's say `A` and `B`, then the result looks like this:
```javascript
{
  data: {A: 'AResult', B: 'BResult'},
  effect: [
    {type: 'A_EFFECT_1'},
    {type: 'A_EFFECT_2'},
    {type: 'B_EFFECT_1'}
  ]
}
```