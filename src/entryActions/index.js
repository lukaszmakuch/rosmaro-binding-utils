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
  all
} from 'ramda';

const sanitizeEffects = effects => pipe(
  flatten,
  filter(complement(isNil))
)([effects])

const onEntryAction = {type: 'ON_ENTRY'};

const resultIsEmpty = data => {
  if (is(Object, data)) {
    return all(resultIsEmpty, values(data));
  } else {
    return isNil(data);
  }
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
  const noReaction = resultIsEmpty(runAttempt.result);
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
