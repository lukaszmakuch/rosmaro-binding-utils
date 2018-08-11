import {extractParent} from './../';

describe('extracting the parent node', () => {

  it('returns null if the node has no parent', () => {
    expect(extractParent('a')).toEqual(null);
  });

  it('returns the parent node if the is any', () => {
    expect(extractParent('a:b:c')).toEqual('a:b');
  });

});