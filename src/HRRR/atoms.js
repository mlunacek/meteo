import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

export const locationsAtom = atomWithStorage('locations', []);
export const locationAtom = atom()