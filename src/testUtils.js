import {view, set} from 'ramda';

export const testLens = ({
  lens, 
  zoomInInput, 
  zoomInOutput,
  zoomOutInput,
  zoomOutOutput,
}) => {
  expect(zoomInOutput).toEqual(view(lens, zoomInInput));
  expect(zoomOutOutput).toEqual(set(lens, zoomOutInput, zoomInInput));
};