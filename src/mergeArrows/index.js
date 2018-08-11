import {reduce, concat} from 'ramda';

export const mergeArrows = arrows => reduce(concat, [], arrows);