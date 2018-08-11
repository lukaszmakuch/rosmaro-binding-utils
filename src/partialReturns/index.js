import {either, complement, is, anyPass, map, has} from 'ramda';

export const partialReturns = handler => opts => {
  const returned = handler(opts);
  const nonEmptyReturned = returned || {};
  const arrows = nonEmptyReturned.arrows || (nonEmptyReturned.arrow ? [[[opts.node.id, nonEmptyReturned.arrow]]] : []);
  const context = nonEmptyReturned.context || opts.context;
  const effect = (nonEmptyReturned.result || {}).effect || nonEmptyReturned.effect;
  const hasNone = props => either(complement(is(Object)), complement(anyPass(map(has, props))))
  const data = 
    (nonEmptyReturned.result || {}).data 
    || nonEmptyReturned.result 
    || (hasNone(['arrows', 'arrow', 'result', 'context', 'effect'])(returned) ? returned : undefined);
  return {
    arrows,
    result: {effect, data},
    context
  }
};