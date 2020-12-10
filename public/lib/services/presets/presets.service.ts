import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';

import { DEFAULT_PRESETS_SEARCH_PARAMS, PRESETS_PREFIX_URL } from './presets.service.const';
import {
	CreatePresetPayload,
	PresetDetail,
	PresetsResponse,
	UpdatePresetPayload,
} from './presets.service.types';

export class PresetsApiService {
	public getPresets(
		searchParams: SearchParams = DEFAULT_PRESETS_SEARCH_PARAMS
	): Promise<PresetsResponse> {
		return api.get(`${PRESETS_PREFIX_URL}?${parseSearchParams(searchParams)}`).json();
	}

	public getPreset(uuid: string): Promise<PresetDetail> {
		return api.get(`${PRESETS_PREFIX_URL}/${uuid}`).json();
	}

	public createPreset(payload: CreatePresetPayload): Promise<PresetDetail> {
		return api.post(`${PRESETS_PREFIX_URL}`, { json: payload }).json();
	}

	public updatePreset({ body, uuid }: UpdatePresetPayload): Promise<PresetDetail> {
		return api.put(`${PRESETS_PREFIX_URL}/${uuid}`, { json: body }).json();
	}
}

export const presetsApiService = new PresetsApiService();
