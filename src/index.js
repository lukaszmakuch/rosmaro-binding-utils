import dcopy from 'deep-copy';
import {reduce, concat} from 'ramda';
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