# Rosmaro binding utilities

A set of utilities for writing [Rosmaro](https://rosmaro.js.org) handlers.

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
## defaultHandler

Acts like `callChildren` except for nodes which have just one child. Then the result is in the form of `ChildResult` instead of `{Child: ChildResult}`.

```javascript
import 'defaultHandler' from 'rosmaro-binding-utils';
```
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
## extractParent

Extracts the parent node.

```javascript
import {extractParent} from 'rosmaro-binding-utils';
```

```javascript
extractParent('a') // null
```

```javascript
extractParent('a:b:c') // 'a:b'
```

## initialValueLens

Allows to set an initial value for parts which are undefined.

```javascript
import {initialValueLens} from 'rosmaro-binding-utils';
```

```javascript
// Alters the context if it is undefined.
testLens({
  lens: initialValueLens({a: 123}),
  zoomInInput: undefined, 
  zoomInOutput: {a: 123},
  zoomOutInput: {a: 123},
  zoomOutOutput: {a: 123},
})
```

```javascript
// Does not alter empty objects.
testLens({
  lens: initialValueLens({a: 123}),
  zoomInInput: {}, 
  zoomInOutput: {},
  zoomOutInput: {},
  zoomOutOutput: {},
})
```
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
## partialReturns

Takes a handler which may return just some of the data and returns a handler that always returns an object like `{result: {data, effect}, arrows, context}`.

```javascript
import {partialReturns} from 'rosmaro-binding-utils';
```

```javascript
// Allows to return just some result.
partialReturns(
  opts => ({resultOf: opts})
)({context: {a: 123}})
/*
({
  result: {
    data: {resultOf: {context: {a: 123}}},
    effect: undefined,
  },
  arrows: [],
  context: {a: 123}
})
*/
```

```javascript
// Allows to return just an arrow.
partialReturns(
  opts => ({arrow: 'x'})
)({context: {a: 123}, node: {id: 'main:a:b'}})
/*
({
  result: {
    data: undefined,
    effect: undefined,
  },
  arrows: [[['main:a:b', 'x']]],
  context: {a: 123}
})
*/
```

```javascript
// Allows to return just an effect.
partialReturns(
  opts => ({effect: {type: 'TICK'}})
)({context: {a: 123}})
/*
({
  result: {
    data: undefined,
    effect: {type: 'TICK'},
  },
  arrows: [],
  context: {a: 123}
})
*/
```

```javascript
// Allows to return just some data and an effect.
partialReturns(
  opts => ({result: {theResult: opts.context}, effect: {type: 'TICK'}})
)({context: {a: 123}})
/*
({
  result: {
    data: {theResult: {a: 123}},
    effect: {type: 'TICK'},
  },
  arrows: [],
  context: {a: 123}
})
*/
```

```javascript
// Allows to return an arrow, an effect, a context and some data
partialReturns(
  opts => ({
    arrow: 'x', 
    result: {theResult: opts.context}, 
    context: {a: 567}, 
    effect: {type: 'TICK'}
  })
)({context: {a: 123}, node: {id: 'main:a:b'}})
/*
({
  result: {
    data: {theResult: {a: 123}},
    effect: {type: 'TICK'},
  },
  arrows: [[['main:a:b', 'x']]],
  context: {a: 567}
})
*/
```

```javascript
// Does not touch a result meeting the format requirements.
partialReturns(
  opts => ({
    arrows: [[['main:a:b', 'x']]], 
    result: {data: {theResult: opts.context}, effect: {type: 'TICK'}}, 
    context: {a: 567}, 
  })
)({context: {a: 123}})
/*
({
  arrows: [[['main:a:b', 'x']]], 
  result: {data: {theResult: {a: 123}}, effect: {type: 'TICK'}}, 
  context: {a: 567}, 
})
*/
```
## sliceLens

Used to slice the context.

```javascript
import {sliceLens} from 'rosmaro-binding-utils';
```

```javascript
// Allows to work with just part of an object.
testLens({
  lens: sliceLens('b'),
  zoomInInput: {a: 123, b: {c: 456}}, 
  zoomInOutput: {c: 456},
  zoomOutInput: {c: 987},
  zoomOutOutput: {a: 123, b: {c: 987}}, 
})
```

```javascript
// Returns undefined if the desired property does not exist.
testLens({
  lens: sliceLens('b'),
  zoomInInput: {a: 123}, 
  zoomInOutput: undefined,
  zoomOutInput: {c: 987},
  zoomOutOutput: {a: 123, b: {c: 987}}, 
})
```
## targetedActions

Allows to dispatch an action targeted at a particular node.

The `targetedActions` function is used to modify a [handler](https://rosmaro.js.org/doc/#bindings-node-bindings) in two ways.

First, it makes it ignore an action if it has a `target` property that doesn't start with the `node.id` value passed to the handler. In other words, an action with `target: 'main:a:b'` is consumed by `main`, `main:a` and `main:a:b` handlers, but not by the `main:a:c` handler.

To make building targeted actions easier, every handler is injected a `toNode` function. It takes an action and returns a new one which is targeted at the handler's node.

```javascript
import {targetedActions} from 'rosmaro-binding-utils';

const baseHandler = ({toNode}) => ({
  //...
  result: {
    'action targeted at this node': toNode({type: 'SOME_TARGETED_ACTION'})
  }
});

const handler = targetedActions()(baseHandler);
```
## transparentLens

Does nothing to the context

```javascript
import {transparentLens} from 'rosmaro-binding-utils';

testLens({
  lens: transparentLens,
  zoomInInput: {a: 123, b: {c: 987}}, 
  zoomInOutput: {a: 123, b: {c: 987}},
  zoomOutInput: {a: 123, b: {c: 987}},
  zoomOutOutput: {a: 123, b: {c: 987}},
})
```

## typeHandler

Associated handlers with action types.

```javascript
import {typeHandler} from 'rosmaro-binding-utils';

// The handler which is going to be used when the
// given action is neither FIRST_ACTION nor SECOND_ACTION.
const defaultHandler = (opts) => ({UNSUPPORTED_ACTION: opts});

// Handles actions of 'FIRST_ACTION' type.
const firstActionHandler = (opts) => ({FIRST_ACTION: opts});

// Handles actions of 'SECOND_ACTION' type.
const secondActionHandler = (opts) => ({SECOND_ACTION: opts});

// The whole handler.
const handler = typeHandler({defaultHandler})({
  // Actions of 'FIRST_ACTION' type are dispatched to this handler.
  FIRST_ACTION: firstActionHandler,
  // Actions of 'SECOND_ACTION' type are dispatched to this handler.
  SECOND_ACTION: secondActionHandler,
});

handler({action: {type: 'FIRST_ACTION'}, something: 'else'})
// {FIRST_ACTION: {action: {type: 'FIRST_ACTION'}, something: 'else'}}

handler({action: {type: 'SECOND_ACTION'}, something: 'else'})
// {SECOND_ACTION: {action: {type: 'SECOND_ACTION'}, something: 'else'}}

handler({action: {type: 'THIRD_ACTION'}, something: 'else'})
// {UNSUPPORTED_ACTION: {action: {type: 'THIRD_ACTION'}, something: 'else'}}
```
