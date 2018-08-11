import {extractParent} from './../extractParent';

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