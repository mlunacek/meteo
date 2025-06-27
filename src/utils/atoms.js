import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

export const useAsyncAtom = (anAtom) => useAtomValue(loadable(anAtom));


