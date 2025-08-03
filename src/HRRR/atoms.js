import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

export const hrrrViewAtom = atomWithStorage('hrrr-view', "basic");
export const locationsAtom = atomWithStorage('locations', []);
export const locationAtom = atom()

export const yExtentAtom = atom()
export const zoomTransformAtom = atom()