import {triggerEntryActions, supportEntryActions} from './../';
import {lensPath, view} from 'ramda';

describe('supportEntryActions', () => {

  it('does nothing if it is some other action, not ON_ENTRY', () => {
    const handlerResult = {
      result: {
        data: 'some result', 
        effect: {type: 'SOME_EFFECT'}
      },
      arrows: [[['main:a:b', 'x']]],
    };
    const handler = supportEntryActions(opts => handlerResult);
    expect(handler({action: {type: 'SOME_ACTION'}})).toEqual(handlerResult);
  });

  it('sets the resullt for ON_ENTRY, if any arrow is followed', () => {
    const handler = supportEntryActions(opts => ({
      result: {
        data: undefined, 
        effect: {type: 'SOME_EFFECT'}
      },
      arrows: [[['main:a:b', 'x']]],
    }));
    expect(handler({action: {type: 'ON_ENTRY'}})).toEqual({
      result: {
        data: true, 
        effect: {type: 'SOME_EFFECT'}
      },
      arrows: [[['main:a:b', 'x']]],
    });
  });

  it('does NOT set the resullt for ON_ENTRY, if no arrow is followed', () => {
    const handler = supportEntryActions(opts => ({
      result: {
        data: undefined, 
        effect: {type: 'SOME_EFFECT'}
      },
      arrows: [],
    }));
    expect(handler({action: {type: 'ON_ENTRY'}})).toEqual({
      result: {
        data: undefined, 
        effect: {type: 'SOME_EFFECT'}
      },
      arrows: [],
    });
  });

});

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
      }
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
          }
        }
      },
      2: {
        ON_ENTRY: {
          state: 2,
          result: {
            effect: {type: 'ON_ENTRY_EFFECT'}
          }
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
      }
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
          }
        }
      },
      2: {
        ON_ENTRY: {
          state: 3,
          result: {
            data: true
          }
        }
      },
      3: {
        ON_ENTRY: {
          state: 4,
          result: {
            data: true,
            effect: {type: 'SECOND_EFFECT'}
          }
        }
      },
      4: {
        ON_ENTRY: {
          state: 5,
          result: {
            data: true,
            effect: [
              {type: 'THIRD_EFFECT'},
              [{type: 'FOURTH_EFFECT'}]
            ]
          }
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
      }
    });
  });

});