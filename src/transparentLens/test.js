import {testLens} from './../testUtils';
import {transparentLens} from './../transparentLens';

describe('transparent lens', () => {

  it('does nothing to the context', () => {
    testLens({
      lens: transparentLens,
      zoomInInput: {a: 123, b: {c: 987}}, 
      zoomInOutput: {a: 123, b: {c: 987}},
      zoomOutInput: {a: 123, b: {c: 987}},
      zoomOutOutput: {a: 123, b: {c: 987}},
    })
  });

});