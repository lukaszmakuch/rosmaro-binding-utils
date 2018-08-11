export const typeHandler = ({defaultHandler}) => handlerByType => (opts) => 
  (handlerByType[opts.action.type] || defaultHandler)(opts);