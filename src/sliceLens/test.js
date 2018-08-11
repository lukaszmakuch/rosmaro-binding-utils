import {testLens} from './../testUtils';
import {sliceLens} from './../sliceLens';

describe('context slicing lens', () => {

  it('allows to work with just part of an object', () => {
    testLens({
      lens: sliceLens('b'),
      zoomInInput: {a: 123, b: {c: 456}}, 
      zoomInOutput: {c: 456},
      zoomOutInput: {c: 987},
      zoomOutOutput: {a: 123, b: {c: 987}}, 
    })
  });

  it('returns undefined if the desired property does not exist', () => {
    testLens({
      lens: sliceLens('b'),
      zoomInInput: {a: 123}, 
      zoomInOutput: undefined,
      zoomOutInput: {c: 987},
      zoomOutOutput: {a: 123, b: {c: 987}}, 
    })
  });

});