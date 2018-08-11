
## supportTargetedActions

Allows to dispatch an action targeted at a particular node.

The `supportTargetedActions` function is used to modify a [handler](https://rosmaro.js.org/doc/#bindings-node-bindings) in two ways.

First, it makes it ignore an action if it has a `target` property that doesn't start with the `node.id` value passed to the handler. In other words, an action with `target: 'main:a:b'` is consumed by `main`, `main:a` and `main:a:b` handlers, but not by the `main:a:c` handler.

To make building targeted actions easier, every handler is injected a `toNode` function. It takes an action and returns a new one which is targeted at the handler's node.

```javascript
import {supportTargetedActions} from 'rosmaro-binding-utils';

const baseHandler = ({toNode}) => ({
  //...
  result: {
    'action targeted at this node': toNode({type: 'SOME_TARGETED_ACTION'})
  }
});

const handler = supportTargetedActions()(baseHandler);
```