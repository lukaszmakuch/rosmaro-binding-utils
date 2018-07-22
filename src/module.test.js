import {
  extendArrows, 
  extractParent,
  mergeContexts,
  mergeArrows,
  initialValueLens,
  sliceLens,
  transparentLens,
  callChildren
} from '.';
import {view, set} from 'ramda';
import dcopy from 'deep-copy';

describe('Rosmaro binding utils', () => {

  describe('extracting the parent node', () => {

    it('returns null if the node has no parent', () => {
      expect(extractParent('a')).toEqual(null);
    });

    it('returns the parent node if the is any', () => {
      expect(extractParent('a:b:c')).toEqual('a:b');
    });

  });

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
  
  });

  describe('merging context', () => {

    const testMergingContext = ({initial: initialToCopy, newOnes, expected}) => {
      const initial = dcopy(initialToCopy);
      expect(mergeContexts(
        initial,
        newOnes
      )).toEqual(expected);
      expect({noChangesExpected: initial}).toEqual({noChangesExpected: initialToCopy});
    };

    it('allows to add new parts of the context', () => testMergingContext({
      initial: {a: 123, b: 456},
      newOnes: [
        {a: 123, b: 456},
        {a: 123, b: 456, c: 789},
        {a: 123, b: 456},
      ],
      expected: {a: 123, b: 456, c: 789}
    }));

    it('allows to remove parts of the context', () => testMergingContext({
      initial: {a: 123, b: 456, c: 789},
      newOnes: [
        {a: 123, b: 456, c: 789},
        {a: 123, b: 456},
        {a: 123, b: 456, c: 789},
      ],
      expected: {a: 123, b: 456}
    }));

    it('allows to alter parts of the context', () => testMergingContext({
      initial: {a: 123, b: 456, c: 789},
      newOnes: [
        {a: 123, b: 456, c: 789},
        {a: 123, b: 654, c: 789},
        {a: 123, b: 456, c: 789},
      ],
      expected: {a: 123, b: 654, c: 789},
    }));

    it('allows to merge deeper parts', () => testMergingContext({
      initial: {
        a: [
          1,
          {
            a: {
              a: [
                {a: 123, b: 567},
                4
              ],
              b: {x: 3}
            },
            b: 4
          },
          4
        ], 
      },
      newOnes: [
        {
          a: [
            1,
            {
              a: {
                a: [
                  {a: 123, b: 567},
                  4
                ],
                b: {x: 3}
              },
              b: 4
            },
            4
          ], 
        },
        {
          a: [
            1,
            {
              a: {
                a: [
                  {a: 123, b: 567},
                  4
                ],
                // new
                c: 3,
                  // altered
                b: {y: 3}
              },
              b: 4
            },
            // removed
            // 4
          ], 
        },
        {
          a: [
            1,
            {
              x: 3,
              a: {
                a: [
                  {a: 123, b: 567},
                  4
                ],
                b: {x: 3, z: 6}
              },
              b: 4
            },
            4
          ], 
        },
      ],
      expected: {
        a: [
          1,
          {
            x: 3,
            a: {
              a: [
                {a: 123, b: 567},
                4
              ],
              // new
              c: 3,
                // altered
              b: {y: 3, z: 6}
            },
            b: 4
          },
          // removed
          // 4
        ], 
      },
    }));

  });

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

  describe('calling children', () => {

    describe('leaf', () => {

      it('has no children', () => {
        const action = {type: 'DO_YOUR_JOB'};
        const context = {a: 1, b: 2};
        const children = {};
        expect(
          callChildren({context, action, children})
        ).toEqual({
          context: {a: 1, b: 2},
          result: undefined,
          arrows: []
        });
      });

    });

    describe('single child node', () => {

      it('just extends the arrow', () => {
        const action = {type: 'DO_YOUR_JOB'};
        const context = {a: 1, b: 2};
        const children = {
          A: ({action}) => ({
            arrows: [[['main:A', 'x']]],
            result: 'AResult',
            context: {a: 2, b: 4},
          })
        };
        expect(
          callChildren({context, action, children})
        ).toEqual({
          context: {a: 2, b: 4},
          result: 'AResult',
          arrows: [
            [['main:A', 'x'], ['main', 'x']],
          ]
        });
      });
    
    });

    describe('composite children', () => {
      const action = {type: 'DO_YOUR_JOB'};
      const context = {a: 1, b: 2};
      const children = {
        A: ({action}) => ({
          arrows: [[['main:A', 'x']]],
          result: 'AResult',
          context: {a: 2, b: 2},
        }),
        B: ({action}) => ({
          arrows: [[['main:B', 'y']]],
          result: 'BResult',
          context: {a: 1, b: 4},
        })
      };

      it('merges composites', () => {
        expect(
          callChildren({context, action, children})
        ).toEqual({
          context: {a: 2, b: 4},
          result: {A: 'AResult', B: 'BResult'},
          arrows: [
            [['main:A', 'x'], ['main', 'x']],
            [['main:B', 'y'], ['main', 'y']],
          ]
        });
      });

    });

  });

  describe('lenses', () => {
    const testLens = ({
      lens, 
      zoomInInput, 
      zoomInOutput,
      zoomOutInput,
      zoomOutOutput,
    }) => {
      expect(zoomInOutput).toEqual(view(lens, zoomInInput));
      expect(zoomOutOutput).toEqual(set(lens, zoomOutInput, zoomInInput));
    };

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
    
  });


});