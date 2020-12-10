import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';

import { DEFAULT_PRESETS_SEARCH_PARAMS, PRESETS_PREFIX_URL } from './presets.service.const';
import {
	CreatePresetPayload,
	PresetDetailResponse,
	PresetsResponse,
	UpdatePresetPayload,
} from './presets.service.types';

export class PresetsApiService {
	public getPresets(
		searchParams: SearchParams = DEFAULT_PRESETS_SEARCH_PARAMS
	): Promise<PresetsResponse> {
		return api.get(`${PRESETS_PREFIX_URL}?${parseSearchParams(searchParams)}`).json();
	}

	public getPreset(uuid: string): Promise<PresetDetailResponse> {
		return api.get(`${PRESETS_PREFIX_URL}/${uuid}`).json();
	}

	public createPreset(payload: CreatePresetPayload): Promise<PresetDetailResponse> {
		return api.post(`${PRESETS_PREFIX_URL}`, { json: payload }).json();
	}

	public updatePreset({ body, uuid }: UpdatePresetPayload): Promise<PresetDetailResponse> {
		return api.put(`${PRESETS_PREFIX_URL}/${uuid}`, { json: body }).json();
	}
}

export const presetsApiService = new PresetsApiService();
