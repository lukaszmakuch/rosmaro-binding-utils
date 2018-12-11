import {callChildren} from './../';
import {isNil, is} from 'ramda';

export const defaultHandler = (opts) => {
  const childrenResult = callChildren(opts);
  const numOfResults = Object.keys(childrenResult.result).length;
  if (numOfResults == 0) {
    return {
      ...childrenResult,
      result: undefined
    };
  } else if (numOfResults == 1) {
    return {
      ...childrenResult,
      result: Object.values(childrenResult.result)[0]
    };
  } else {
    return {
      context: childrenResult.context,
      arrows: childrenResult.arrows,
      result: Object.keys(childrenResult.result).reduce(
        (soFar, child) => {
          const data = childrenResult.result[child].data;
          const maybeEffect = childrenResult.result[child].effect;
          const effectArray =
            isNil(maybeEffect) ? []
            : is(Array)(maybeEffect) ? maybeEffect
            : [maybeEffect];
          return {
            data: {
              ...soFar.data,
              [child]: data,
            },
            effect: [
              ...soFar.effect,
              ...effectArray
            ]
          };
        },
        {data: {}, effect: []}
      )
    };
  }
}