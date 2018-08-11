import {lens} from 'ramda';

export const sliceLens = slice => lens(
  (inObj) => inObj[slice],
  (outObj, inObj) => ({...inObj, [slice]: outObj})
);