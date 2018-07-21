import {extendArrows} from '.';

describe('Rosmaro binding utils', () => {

  describe('extending arrows', () => {

    it('extends all of the given arrows', () => {
      expect(
        extendArrows(
          [
            [['a:a:a', 'x']], 
            [['a:a:b', 'y']]
          ]
        )
      ).toEqual(
        [
          [['a:a:a', 'x'], ['a:a', 'x']], 
          [['a:a:b', 'y'], ['a:a', 'y']]
        ]
      );
    });

    it('stops at the first node', () => {
      expect(
        extendArrows(
          [
            [['a:a:a', 'x']], 
            [['a', 'y']]
          ]
        )
      ).toEqual(
        [
          [['a:a:a', 'x'], ['a:a', 'x']], 
          [['a', 'y']]
        ]
      );
    });

    it('does not touch empty arrows', () => {
      expect(
        extendArrows(
          [
            [['a:a:a', 'x']], 
            []
          ]
        )
      ).toEqual(
        [
          [['a:a:a', 'x'], ['a:a', 'x']], 
          []
        ]
      );
    });
  
  })

});