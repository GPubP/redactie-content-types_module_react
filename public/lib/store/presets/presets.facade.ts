import { presetsApiService, PresetsApiService, Preset, PresetDetail } from '../../services/presets';
import { BaseEntityFacade } from '../shared';

import { PresetsQuery, presetsQuery } from './presets.query';
import { PresetsStore, presetsStore } from './presets.store';

export class PresetsFacade extends BaseEntityFacade<PresetsStore, PresetsApiService, PresetsQuery> {
	constructor(store: PresetsStore, service: PresetsApiService, query: PresetsQuery) {
		super(store, service, query);
	}

	public readonly presets$ = this.query.presets$;
	public readonly preset$ = this.query.preset$;

	public getPresets(): void {
		this.store.setIsFetching(true);

		this.service
			.getPresets()
			.then(response => {
				if (response) {
					this.store.set(response);
				}
			})
			.catch(error => this.store.setError(error))
			.finally(() => this.store.setIsFetching(false));
	}

	public getPreset(uuid: string): Promise<PresetDetail | null> {
		this.store.setIsFetchingOne(true);

		return this.service
			.getPreset(uuid)
			.then(response => {
				if (response) {
					this.store.update({
						preset: response,
					});
				}
				return response;
			})
			.catch(error => {
				this.store.setError(error);
				return error;
			})
			.finally(() => this.store.setIsFetchingOne(false));
	}
}

export const presetsFacade = new PresetsFacade(presetsStore, presetsApiService, presetsQuery);
