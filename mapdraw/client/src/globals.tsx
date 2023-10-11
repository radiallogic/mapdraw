import { Provider, atom, useAtom, useSetAtom } from 'jotai'
import type { PrimitiveAtom } from 'jotai'
import { TSite } from './components/Sites/SiteTypes';
import { Path } from './components/Paths/PathTypes';

export const PathsAtom = atom<Path[]> ([])
export const SitesAtom = atom<PrimitiveAtom<TSite>[]>([])

