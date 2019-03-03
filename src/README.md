# Rosmaro binding utilities

A set of utilities for writing [Rosmaro](https://rosmaro.js.org) handlers.

## Snippet

```javascript
import {
  typeHandler,
  defaultHandler,
  partialReturns,
  targetedActions,
  callChildren,
  supportEntryActions,
  triggerEntryActions
} from 'rosmaro-binding-utils';

const makeHandler = handlerPlan => supportEntryActions(targetedActions()(partialReturns(typeHandler({defaultHandler})(handlerPlan))));

// ...

const model = triggerEntryActions(rosmaro({graph, bindings}));
```