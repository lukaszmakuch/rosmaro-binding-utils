import {lens} from 'ramda';

export const initialValueLens = initCtx => lens(
  (inObj) => (inObj === undefined) ? initCtx : inObj,
  (outObj, inObj) => outObj
);