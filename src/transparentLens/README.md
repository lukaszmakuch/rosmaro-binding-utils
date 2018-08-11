
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
