
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
