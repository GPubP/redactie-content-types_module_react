# Class: PresetsApiService

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).PresetsApiService

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.PresetsApiService#constructor)

### Methods

- [activate](../wiki/index.%3Cinternal%3E.PresetsApiService#activate)
- [createPreset](../wiki/index.%3Cinternal%3E.PresetsApiService#createpreset)
- [deactivate](../wiki/index.%3Cinternal%3E.PresetsApiService#deactivate)
- [getPreset](../wiki/index.%3Cinternal%3E.PresetsApiService#getpreset)
- [getPresets](../wiki/index.%3Cinternal%3E.PresetsApiService#getpresets)
- [updatePreset](../wiki/index.%3Cinternal%3E.PresetsApiService#updatepreset)

## Constructors

### constructor

• **new PresetsApiService**()

## Methods

### activate

▸ **activate**(`uuid`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/services/presets/presets.service.ts:32

___

### createPreset

▸ **createPreset**(`payload`): `Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`CreatePresetPayload`](../wiki/index.CreatePresetPayload) |

#### Returns

`Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/services/presets/presets.service.ts:24

___

### deactivate

▸ **deactivate**(`uuid`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/services/presets/presets.service.ts:36

___

### getPreset

▸ **getPreset**(`uuid`, `searchParams?`): `Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |
| `searchParams` | `SearchParams` |

#### Returns

`Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/services/presets/presets.service.ts:20

___

### getPresets

▸ **getPresets**(`searchParams?`): `Promise`<[`PresetsResponse`](../wiki/index.%3Cinternal%3E#presetsresponse)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `searchParams` | `SearchParams` | `DEFAULT_PRESETS_SEARCH_PARAMS` |

#### Returns

`Promise`<[`PresetsResponse`](../wiki/index.%3Cinternal%3E#presetsresponse)\>

#### Defined in

public/lib/services/presets/presets.service.ts:14

___

### updatePreset

▸ **updatePreset**(`__namedParameters`): `Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`UpdatePresetPayload`](../wiki/index.UpdatePresetPayload) |

#### Returns

`Promise`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/services/presets/presets.service.ts:28
