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