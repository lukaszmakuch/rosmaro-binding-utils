import {mergeArrows} from './../';

describe('merging arrows', () => {

  it('merges all the arrows', () => {
    expect(mergeArrows([
      [
        [['a:a:a', 'x'], ['a:a', 'x'], ['a', 'x']],
        [['c:a:a', 'x'], ['c:a', 'x'], ['c', 'x']],
      ],
      [
        [['a:a:b', 'x'], ['a:a', 'x'], ['a', 'x']],
      ]
    ])).toEqual(
      [
        [['a:a:a', 'x'], ['a:a', 'x'], ['a', 'x']],
        [['c:a:a', 'x'], ['c:a', 'x'], ['c', 'x']],
        [['a:a:b', 'x'], ['a:a', 'x'], ['a', 'x']],
      ]
    );
  });

});