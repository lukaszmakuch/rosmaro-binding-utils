import {defaultHandler} from './../';

describe('default handler', () => {

    describe('leaf', () => {

      it('has no children', () => {
        const action = {type: 'DO_YOUR_JOB'};
        const context = {a: 1, b: 2};
        const children = {};
        expect(
          defaultHandler({context, action, children})
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
          defaultHandler({context, action, children})
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
          result: {
            effect: [{type: 'A_EFFECT_1'}, {type: 'A_EFFECT_2'}],
            data: 'AResult'
          },
          context: {a: 2, b: 2},
        }),
        B: ({action}) => ({
          arrows: [[['main:B', 'y']]],
          result: {
            effect: {type: 'B_EFFECT_1'},
            data: 'BResult'
          },
          context: {a: 1, b: 4},
        })
      };

      it('merges composites', () => {
        expect(
          defaultHandler({context, action, children})
        ).toEqual({
          context: {a: 2, b: 4},
          result: {
            data: {A: 'AResult', B: 'BResult'},
            effect: [
              {type: 'A_EFFECT_1'},
              {type: 'A_EFFECT_2'},
              {type: 'B_EFFECT_1'}
            ]
          },
          arrows: [
            [['main:A', 'x'], ['main', 'x']],
            [['main:B', 'y'], ['main', 'y']],
          ]
        });
      });

    });

  });