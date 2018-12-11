const makeToNode = (id) => action => ({...action, target: id});

const isTarget = ({action: {target}, node: {id}}) => !target || target.startsWith(id);

const emptyResult = ({context}) => ({
  context, 
  arrows: [], 
  result: {
    data: undefined,
    effect: []
  }
});

export const targetedActions = () => handler => (opts) => {
  return isTarget(opts)
    ? handler({...opts, toNode: makeToNode(opts.node.id)})
    : emptyResult(opts)
};