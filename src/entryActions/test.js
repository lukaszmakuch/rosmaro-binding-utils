import {triggerEntryActions} from './../';
import {lensPath, view} from 'ramda';

describe('triggerEntryActions', () => {

  const mockModel = plan => ({state = 1, action}) => {
    const mockedResult = view(lensPath([state, action.type]), plan);
    const defaultResult = {state, result: {}}; 
    return mockedResult || defaultResult;
  }

  it('is transparent for models that do not support entry actions', () => {
    const expectedResult = {
      state: 1,
      result: {
        data: 'first call res',
        effect: undefined
      },
      anyArrowFollowed: false,
    };
    const simpleModel = mockModel({
      1: {SOME_ACTION: expectedResult}
    })
    const decoratedModel = triggerEntryActions(simpleModel);
    const state = undefined;
    const action = {type: 'SOME_ACTION'};
    expect(decoratedModel({state, action})).toEqual(expectedResult);
  });

  it('triggers ON_ENTRY', () => {
    const model = triggerEntryActions(mockModel({
      1: {
        NEXT: {
          state: 2,
          result: {
            data: 'first call res'
          },
          anyArrowFollowed: true,
        }
      },
      2: {
        ON_ENTRY: {
          state: 2,
          result: {
            effect: {type: 'ON_ENTRY_EFFECT'}
          },
          anyArrowFollowed: false,
        },
        RENDER: {
          state: 2,
          result: {
            data: 'some data',
            effect: [],
          },
          anyArrowFollowed: false,
        }
      },
    }));

    expect(
      model({state : 1, action: {type: 'NEXT'}})
    ).toEqual({
      state: 2,
      result: {
        data: 'first call res',
        effect: [{type: 'ON_ENTRY_EFFECT'}]
      },
      anyArrowFollowed: true,
    });

    expect(
      model({state : 2, action: {type: 'RENDER'}})
    ).toEqual({
      state: 2,
      result: {
        data: 'some data',
        effect: []
      },
      anyArrowFollowed: false,
    });
  });

  it('keeps calling entry actions unless there are no more entry actions', () => {
    const model = triggerEntryActions(mockModel({
      1: {
        NEXT: {
          state: 2,
          result: {
            data: 'first node result',
            effect: {type: 'FIRST_EFFECT'}
          },
          anyArrowFollowed: true
        }
      },
      2: {
        ON_ENTRY: {
          state: 3,
          result: {
            data: undefined
          },
          anyArrowFollowed: true
        }
      },
      3: {
        ON_ENTRY: {
          state: 4,
          result: {
            data: undefined,
            effect: {type: 'SECOND_EFFECT'}
          },
          anyArrowFollowed: true
        }
      },
      4: {
        ON_ENTRY: {
          state: 5,
          result: {
            data: undefined,
            effect: [
              {type: 'THIRD_EFFECT'},
              [{type: 'FOURTH_EFFECT'}]
            ]
          },
          anyArrowFollowed: true
        }
      },
      5: {
        ON_ENTRY: {
          state: 5,
          result: {
            data: {
              A: {data: undefined},
              B: {
                A: {data: undefined, effect: 'irrelevant'},
                B: {},
              },
              C: undefined
            },
            effect: {type: 'FIFTH_EFFECT'},
          },
          anyArrowFollowed: false
        },
      }
    }));

    expect(
      model({state : 1, action: {type: 'NEXT'}})
    ).toEqual({
      state: 5,
      result: {
        data: 'first node result',
        effect: [
          {type: 'FIRST_EFFECT'},
          {type: 'SECOND_EFFECT'},
          {type: 'THIRD_EFFECT'},
          {type: 'FOURTH_EFFECT'},
          {type: 'FIFTH_EFFECT'},
        ]
      },
      anyArrowFollowed: true,
    });
  });

});