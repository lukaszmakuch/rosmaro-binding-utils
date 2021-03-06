import {callChildren} from './../';

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
          result: {},
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
          result: {A: 'AResult'},
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