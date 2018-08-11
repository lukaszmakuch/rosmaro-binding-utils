import {mergeContexts, extendArrows, mergeArrows} from './../';
import {values, cond, equals, always, keys, lte, head, map, prop, col} from 'ramda';

export const callChildren = (opts) => {
  const numOfChildren = values(opts.children).length;
  return cond([
    [equals(0), always(callNoChild)],
    [equals(1), always(callSingleChild)],
    [lte(2), always(callCompositeChildren)],
  ])(numOfChildren)(opts);
};

const callNoChild = ({context}) => ({
  context,
  result: {},
  arrows: [],
});

const callSingleChild = ({children, action}) => {
  const childResult = head(values(children))({action});
  const childName = head(keys(children));
  return {
    ...childResult,
    result: {[childName]: childResult.result},
    arrows: extendArrows(childResult.arrows),
  };
};

const callCompositeChildren = ({children, action, context: originalContext}) => {
  const childrenResults = map(child => child({action}), children);
  const col = name => map(prop(name), childrenResults);
  const result = col('result');
  const arrows = extendArrows(mergeArrows(values(col('arrows'))));
  const newContext = mergeContexts(originalContext, values(col('context')));
  return {result, arrows, context: newContext};
};