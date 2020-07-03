import { isNil } from '@datorama/akita';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { BaseEntityQuery } from '../shared';

import { PresetsState } from './presets.model';
import { PresetsStore, presetsStore } from './presets.store';

export class PresetsQuery extends BaseEntityQuery<PresetsState> {
	constructor(protected store: PresetsStore) {
		super(store);
	}

	public presets$ = this.selectAll();
	public preset$ = this.select(state => state.preset).pipe(
		filter(preset => !isNil(preset), distinctUntilChanged())
	);
}

export const presetsQuery = new PresetsQuery(presetsStore);
