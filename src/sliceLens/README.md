
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