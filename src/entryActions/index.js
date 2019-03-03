import {
  flatten,
  pipe,
  filter,
  complement,
  isNil,
  set,
  lensPath,
  isEmpty,
  is,
  values,
  all,
  without,
} from 'ramda';

const sanitizeEffects = effects => pipe(
  flatten,
  filter(complement(isNil))
)([effects])

const onEntryAction = {type: 'ON_ENTRY'};

const resultIsEmpty = result => {
  if (is(Object, result)) return all(resultIsEmpty, values(result));
  return isNil(result);
};

const triggerUnlessNoMoreEntryActions = ({
  model, 
  callRes, 
  resultData, 
  prevEffects, 
  firstAttempt = true
}) => {
  const runAttempt = model({state: callRes.state, action: onEntryAction});
  const effect = runAttempt.result.effect;
  const noReaction = !effect && resultIsEmpty(runAttempt.result);
  if (noReaction) {
    if (firstAttempt) {
      return callRes;
    } else {
      return {
        ...runAttempt, 
        result: {
          effect: sanitizeEffects([...prevEffects, effect]),
          data: resultData,
        }
      };
    }
  }

  return triggerUnlessNoMoreEntryActions({
    model, 
    callRes: runAttempt, 
    resultData,
    prevEffects: [...prevEffects, effect], 
    firstAttempt: false
  });
};

export const triggerEntryActions = model => ({state, action}) => {
  const originalCallResult = model({state, action});
  return triggerUnlessNoMoreEntryActions({
    model,
    callRes: originalCallResult,
    resultData: originalCallResult.result.data,
    prevEffects: [originalCallResult.result.effect]
  });
};

const resultDataLens = lensPath(['result', 'data']);

export const supportEntryActions = handler => opts => {
  const originalResult = handler(opts);
  if (opts.action.type !== 'ON_ENTRY') return originalResult;

  const anyArrowFollowed = !isEmpty(originalResult.arrows);
  if (anyArrowFollowed) {
    return set(resultDataLens, true, originalResult);
  } else {
    return originalResult;
  }
}
