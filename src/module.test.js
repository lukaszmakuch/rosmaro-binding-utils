import {
  extendArrows, 
  extractParent,
  mergeContexts,
  mergeArrows
} from '.';
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

});