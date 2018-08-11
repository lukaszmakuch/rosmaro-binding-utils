
## callChildren

Allows to call all the children at once.

```javascript
import {callChildren} from 'rosmaro-binding-utils';
```

```javascript
// It's transparent for the context of leaves.
const action = {type: 'DO_YOUR_JOB'};
const context = {a: 1, b: 2};
const children = {};
expect(
  fn({context, action, children})
).toEqual({
  context: {a: 1, b: 2},
  result: undefined,
  arrows: []
});
```

```javascript
// It extends the arrow followed by a single child node.

const action = {type: 'DO_YOUR_JOB'};
const context = {a: 1, b: 2};
const children = {
  A: ({action}) => ({
    arrows: [[['main:A', 'x']]],
    result: 'AResult',
    context: {a: 2, b: 4},
  })
};
expect(
  callChildren({context, action, children})
).toEqual({
  context: {a: 2, b: 4},
  result: 'AResult',
  arrows: [
    [['main:A', 'x'], ['main', 'x']],
  ]
});
```

```javascript
// Merges composites.
const action = {type: 'DO_YOUR_JOB'};
const context = {a: 1, b: 2};
const children = {
  A: ({action}) => ({
    arrows: [[['main:A', 'x']]],
    result: 'AResult',
    context: {a: 2, b: 2},
  }),
  B: ({action}) => ({
    arrows: [[['main:B', 'y']]],
    result: 'BResult',
    context: {a: 1, b: 4},
  })
};
expect(
  callChildren({context, action, children})
).toEqual({
  context: {a: 2, b: 4},
  result: {A: 'AResult', B: 'BResult'},
  arrows: [
    [['main:A', 'x'], ['main', 'x']],
    [['main:B', 'y'], ['main', 'y']],
  ]
});
```