import {typeHandler, defaultHandler} from './../';

describe('type handlers', () => {

  it('associates handlers with action types', () => {
    const defaultHandler = (opts) => ({UNSUPPORTED_ACTION: opts});
    const handler = typeHandler({defaultHandler})({
      FIRST_ACTION: (opts) => ({FIRST_ACTION: opts}),
      SECOND_ACTION: (opts) => ({SECOND_ACTION: opts}),
    });
    expect(
      handler({action: {type: 'FIRST_ACTION'}, something: 'else'})
    ).toEqual({FIRST_ACTION: {action: {type: 'FIRST_ACTION'}, something: 'else'}});
    expect(
      handler({action: {type: 'SECOND_ACTION'}, something: 'else'})
    ).toEqual({SECOND_ACTION: {action: {type: 'SECOND_ACTION'}, something: 'else'}});
    expect(
      handler({action: {type: 'THIRD_ACTION'}, something: 'else'})
    ).toEqual({UNSUPPORTED_ACTION: {action: {type: 'THIRD_ACTION'}, something: 'else'}});
  });

});