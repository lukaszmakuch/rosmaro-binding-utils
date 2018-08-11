
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