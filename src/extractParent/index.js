export const extractParent = fullNodeName => {
  const lastSeparator = fullNodeName.lastIndexOf(':');
  if (lastSeparator === -1) return null;
  return fullNodeName.substr(0, lastSeparator);
};