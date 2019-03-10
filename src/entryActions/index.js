import {
  flatten,
  pipe,
  filter,
  complement,
  isNil,
} from 'ramda';

const sanitizeEffects = pipe(
  effects => ([effects]),
  flatten,
  filter(complement(isNil))
);

const onEntryAction = {type: 'ON_ENTRY'};

const triggerUnlessNoMoreEntryActions = ({
  model, 
  callRes, 
  resultData, 
  prevEffects,
  anyArrowPreviouslyFollowed,
  firstAttempt = true
}) => {
  const runAttempt = model({state: callRes.state, action: onEntryAction});
  const effect = runAttempt.result.effect;
  const anyArrowCurrentlyFollowed = runAttempt.anyArrowFollowed;

  if (anyArrowCurrentlyFollowed) {
    return triggerUnlessNoMoreEntryActions({
      model, 
      callRes: runAttempt, 
      resultData,
      prevEffects: [...prevEffects, effect], 
      firstAttempt: false,
      anyArrowPreviouslyFollowed: anyArrowPreviouslyFollowed || anyArrowCurrentlyFollowed,
    });
  }

  if (!effect && firstAttempt) return callRes;

  return {
    ...runAttempt, 
    result: {
      effect: sanitizeEffects([...prevEffects, effect]),
      data: resultData,
    },
    anyArrowFollowed: anyArrowPreviouslyFollowed || anyArrowCurrentlyFollowed,
  };
};

export const triggerEntryActions = model => ({state, action}) => {
  const originalCallResult = model({state, action});
  return originalCallResult.anyArrowFollowed
    ? triggerUnlessNoMoreEntryActions({
      model,
      callRes: originalCallResult,
      resultData: originalCallResult.result.data,
      prevEffects: [originalCallResult.result.effect],
      anyArrowPreviouslyFollowed: originalCallResult.anyArrowFollowed,
    })
    : originalCallResult;
};
