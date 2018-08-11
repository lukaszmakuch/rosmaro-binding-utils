
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