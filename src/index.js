import dcopy from 'deep-copy';
import {reduce, concat, lens, identity, map, 
  prop, values, cond, equals, lte, always, head} from 'ramda';
import deep from 'deep-diff';
const diff = deep.diff
const applyChange = deep.applyChange

// Extracting the parent node:
export const extractParent = fullNodeName => {
  const lastSeparator = fullNodeName.lastIndexOf(':');
  if (lastSeparator === -1) return null;
  return fullNodeName.substr(0, lastSeparator);
};

// Extending arrows:
export const extendArrows = arrows => {
  return arrows.map(arrow => {
    if (arrow.length < 1) return arrow;
    const lastArrowPart = arrow[arrow.length - 1];
    const lastArrowPartParent = extractParent(lastArrowPart[0]);
    if (!lastArrowPartParent) return arrow;
    return [
      ...arrow,
      [lastArrowPartParent, lastArrowPart[1]]
    ];
  });
};

// Merging contexts:
export const mergeContexts = (original, newOnes) => {
  if (newOnes.length == 1) return newOnes[0];
  
  let diffs = newOnes
    .map(c => diff(original, c))
    .reduce((flat, arr) => [].concat(flat, arr), [])
  let result = dcopy(original);

  diffs
    .filter(a => a)
    .forEach(d => applyChange(result, true, d))

  return result
};

// Merging arrows:
export const mergeArrows = arrows => reduce(concat, [], arrows);

// The transparent lens:
export const transparentLens = lens(identity, identity);

// The initial value lens:
export const initialValueLens = initCtx => lens(
  (inObj) => (inObj === undefined) ? initCtx : inObj,
  (outObj, inObj) => outObj
);

// Context slicing lens:
export const sliceLens = slice => lens(
  (inObj) => inObj[slice],
  (outObj, inObj) => ({...inObj, [slice]: outObj})
);

// Calling children:
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
  result: undefined,
  arrows: [],
});

const callSingleChild = ({children, action}) => {
  const childResult = head(values(children))({action});
  return {
    ...childResult,
    arrows: extendArrows(childResult.arrows)
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

// Associating handlers with action types:
export const typeHandler = ({defaultHandler}) => handlerByType => (opts) => 
  (handlerByType[opts.action.type] || defaultHandler)(opts);
