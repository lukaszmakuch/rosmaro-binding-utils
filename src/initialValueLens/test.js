import {testLens} from './../testUtils';
import {initialValueLens} from './../initialValueLens';

describe('initial context lens', () => {

  it('alters the context if it is undefined', () => {
    testLens({
      lens: initialValueLens({a: 123}),
      zoomInInput: undefined, 
      zoomInOutput: {a: 123},
      zoomOutInput: {a: 123},
      zoomOutOutput: {a: 123},
    })
  });

  it('does not alter empty objects', () => {
    testLens({
      lens: initialValueLens({a: 123}),
      zoomInInput: {}, 
      zoomInOutput: {},
      zoomOutInput: {},
      zoomOutOutput: {},
    })
  });

});