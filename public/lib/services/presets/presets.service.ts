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

	public getPreset(uuid: string, searchParams: SearchParams = {}): Promise<PresetDetailResponse> {
		return api.get(`${PRESETS_PREFIX_URL}/${uuid}?${parseSearchParams(searchParams)}`).json();
	}

	public createPreset(payload: CreatePresetPayload): Promise<PresetDetailResponse> {
		return api.post(`${PRESETS_PREFIX_URL}`, { json: payload }).json();
	}

	public updatePreset({ body, uuid }: UpdatePresetPayload): Promise<PresetDetailResponse> {
		return api.put(`${PRESETS_PREFIX_URL}/${uuid}`, { json: body }).json();
	}

	public activate(uuid: string): Promise<void> {
		return api.put(`${PRESETS_PREFIX_URL}/${uuid}/activate`).json();
	}

	public deactivate(uuid: string): Promise<void> {
		return api.put(`${PRESETS_PREFIX_URL}/${uuid}/deactivate`).json();
	}
}

export const presetsApiService = new PresetsApiService();
