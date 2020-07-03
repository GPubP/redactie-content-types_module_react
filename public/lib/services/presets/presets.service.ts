import api, { parseSearchParams } from '../api/api.service';
import { SearchParams } from '../api/api.service.types';

import { DEFAULT_PRESETS_SEARCH_PARAMS, PRESETS_PREFIX_URL } from './presets.service.const';
import { Preset, PresetDetail, PresetsResponse } from './presets.service.types';

export class PresetsApiService {
	public async getPresets(
		searchParams: SearchParams = DEFAULT_PRESETS_SEARCH_PARAMS
	): Promise<Preset[] | null> {
		try {
			const response: PresetsResponse = await api
				.get(`${PRESETS_PREFIX_URL}?${parseSearchParams(searchParams)}`)
				.json();

			return response.data;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	public async getPreset(uuid: string): Promise<PresetDetail | null> {
		try {
			return await api.get(`${PRESETS_PREFIX_URL}/${uuid}`).json();
		} catch (err) {
			console.log(err);
			return null;
		}
	}
}

export const presetsApiService = new PresetsApiService();
