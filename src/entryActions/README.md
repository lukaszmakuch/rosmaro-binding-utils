
## triggerEntryActions

Enable entry actions for Rosmaro nodes.

### Installation

Import:
```javascript
import {triggerEntryActions} from 'rosmaro-binding-utils';
```

Wrap the model with `triggerEntryActions`:
```javascript
const myModel = rosmaro({bindings, graph});
const aModelThatTriggersEntryActions = triggerEntryActions(myModel);
```

### Usage

Follow arrows and return effects from the `ON_ENTRY` handler:
```javascript
{
  ON_ENTRY: ({context}) => ({
    arrow: 'started',
    effect: {type: 'START_AN_AWESOME_PROJECT'},
  })
}
```
