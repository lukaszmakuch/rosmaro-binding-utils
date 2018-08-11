import {callChildren} from './../';

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
    return childrenResult;
  }
}