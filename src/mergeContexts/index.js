import dcopy from 'deep-copy';
import deep from 'deep-diff';
const diff = deep.diff
const applyChange = deep.applyChange

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