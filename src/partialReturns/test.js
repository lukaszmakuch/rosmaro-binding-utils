import {partialReturns} from './../';

describe('partial returns', () => {

  it('allows to return undefined', () => {
    expect(
      partialReturns(opts => undefined)({})
    ).toEqual(
      ({
        result: {
          data: undefined,
          effect: undefined,
        },
        arrows: [],
        context: undefined
      })
    )
  });

  it('allows to return just some string', () => {
    expect(
      partialReturns(opts => "string result")({})
    ).toEqual(
      ({
        result: {
          data: "string result",
          effect: undefined,
        },
        arrows: [],
        context: undefined
      })
    )
  });

  it('allows to return just some result object', () => {
    expect(
      partialReturns(opts => ({resultOf: opts}))({context: {a: 123}})
    ).toEqual(
      ({
        result: {
          data: {resultOf: {context: {a: 123}}},
          effect: undefined,
        },
        arrows: [],
        context: {a: 123}
      })
    )
  });

  it('allows to return just an arrow', () => {
    expect(
      partialReturns(opts => ({arrow: 'x'}))({context: {a: 123}, node: {id: 'main:a:b'}})
    ).toEqual(
      ({
        result: {
          data: undefined,
          effect: undefined,
        },
        arrows: [[['main:a:b', 'x']]],
        context: {a: 123}
      })
    )
  });

  it('allows to return just an effect', () => {
    expect(
      partialReturns(opts => ({effect: {type: 'TICK'}}))({context: {a: 123}})
    ).toEqual(
      ({
        result: {
          data: undefined,
          effect: {type: 'TICK'},
        },
        arrows: [],
        context: {a: 123}
      })
    )
  });

  it('allows to return just some data and an effect', () => {
    expect(
      partialReturns(opts => ({result: {theResult: opts.context}, effect: {type: 'TICK'}}))
      ({context: {a: 123}})
    ).toEqual(
      ({
        result: {
          data: {theResult: {a: 123}},
          effect: {type: 'TICK'},
        },
        arrows: [],
        context: {a: 123}
      })
    )
  });

  it('allows to return an arrow, an effect, a context and some data', () => {
    expect(
      partialReturns(opts => ({
        arrow: 'x', 
        result: {theResult: opts.context}, 
        context: {a: 567}, 
        effect: {type: 'TICK'}
      }))
      ({context: {a: 123}, node: {id: 'main:a:b'}})
    ).toEqual(
      ({
        result: {
          data: {theResult: {a: 123}},
          effect: {type: 'TICK'},
        },
        arrows: [[['main:a:b', 'x']]],
        context: {a: 567}
      })
    )
  });

  it('does not touch a result meeting the format requirements', () => {
    expect(
      partialReturns(opts => ({
        arrows: [[['main:a:b', 'x']]], 
        result: {data: {theResult: opts.context}, effect: {type: 'TICK'}}, 
        context: {a: 567}, 
      }))
      ({context: {a: 123}})
    ).toEqual(
      ({
        arrows: [[['main:a:b', 'x']]], 
        result: {data: {theResult: {a: 123}}, effect: {type: 'TICK'}}, 
        context: {a: 567}, 
      })
    )
  });

});