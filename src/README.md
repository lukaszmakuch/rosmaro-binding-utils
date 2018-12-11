# Rosmaro binding utilities

A set of utilities for writing [Rosmaro](https://rosmaro.js.org) handlers.

## Snippet

```javascript
import {typeHandler, defaultHandler, partialReturns, targetedActions, callChildren} from 'rosmaro-binding-utils';

const makeHandler = handlerPlan => targetedActions()(partialReturns(typeHandler({defaultHandler})(handlerPlan)));
```
