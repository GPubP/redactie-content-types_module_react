# Class: PresetsFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).PresetsFacade

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.PresetsFacade#constructor)

### Properties

- [UIState$](../wiki/index.%3Cinternal%3E.PresetsFacade#uistate$)
- [activePreset$](../wiki/index.%3Cinternal%3E.PresetsFacade#activepreset$)
- [activePresetUI$](../wiki/index.%3Cinternal%3E.PresetsFacade#activepresetui$)
- [detailQuery](../wiki/index.%3Cinternal%3E.PresetsFacade#detailquery)
- [detailStore](../wiki/index.%3Cinternal%3E.PresetsFacade#detailstore)
- [isCreating$](../wiki/index.%3Cinternal%3E.PresetsFacade#iscreating$)
- [isFetching$](../wiki/index.%3Cinternal%3E.PresetsFacade#isfetching$)
- [listError$](../wiki/index.%3Cinternal%3E.PresetsFacade#listerror$)
- [listPaginator](../wiki/index.%3Cinternal%3E.PresetsFacade#listpaginator)
- [listQuery](../wiki/index.%3Cinternal%3E.PresetsFacade#listquery)
- [listStore](../wiki/index.%3Cinternal%3E.PresetsFacade#liststore)
- [presets$](../wiki/index.%3Cinternal%3E.PresetsFacade#presets$)
- [service](../wiki/index.%3Cinternal%3E.PresetsFacade#service)

### Methods

- [activatePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#activatepreset)
- [addField](../wiki/index.%3Cinternal%3E.PresetsFacade#addfield)
- [createPreset](../wiki/index.%3Cinternal%3E.PresetsFacade#createpreset)
- [deactivatePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#deactivatepreset)
- [deleteField](../wiki/index.%3Cinternal%3E.PresetsFacade#deletefield)
- [getIsFetching](../wiki/index.%3Cinternal%3E.PresetsFacade#getisfetching)
- [getPreset](../wiki/index.%3Cinternal%3E.PresetsFacade#getpreset)
- [getPresets](../wiki/index.%3Cinternal%3E.PresetsFacade#getpresets)
- [getPresetsPaginated](../wiki/index.%3Cinternal%3E.PresetsFacade#getpresetspaginated)
- [hasActivePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#hasactivepreset)
- [hasPreset](../wiki/index.%3Cinternal%3E.PresetsFacade#haspreset)
- [moveField](../wiki/index.%3Cinternal%3E.PresetsFacade#movefield)
- [removeActivePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#removeactivepreset)
- [resetDetailStore](../wiki/index.%3Cinternal%3E.PresetsFacade#resetdetailstore)
- [selectPreset](../wiki/index.%3Cinternal%3E.PresetsFacade#selectpreset)
- [selectPresetUIState](../wiki/index.%3Cinternal%3E.PresetsFacade#selectpresetuistate)
- [setActivePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#setactivepreset)
- [setIsFetching](../wiki/index.%3Cinternal%3E.PresetsFacade#setisfetching)
- [updateDetail](../wiki/index.%3Cinternal%3E.PresetsFacade#updatedetail)
- [updateField](../wiki/index.%3Cinternal%3E.PresetsFacade#updatefield)
- [updatePreset](../wiki/index.%3Cinternal%3E.PresetsFacade#updatepreset)

## Constructors

### constructor

• **new PresetsFacade**(`listStore`, `listQuery`, `listPaginator`, `detailStore`, `detailQuery`, `service`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listStore` | [`PresetsListStore`](../wiki/index.%3Cinternal%3E.PresetsListStore) |
| `listQuery` | [`PresetsListQuery`](../wiki/index.%3Cinternal%3E.PresetsListQuery) |
| `listPaginator` | `PaginatorPlugin`<[`PresetsListState`](../wiki/index.%3Cinternal%3E#presetsliststate)\> |
| `detailStore` | [`PresetsDetailStore`](../wiki/index.%3Cinternal%3E.PresetsDetailStore) |
| `detailQuery` | [`PresetsDetailQuery`](../wiki/index.%3Cinternal%3E.PresetsDetailQuery) |
| `service` | [`PresetsApiService`](../wiki/index.%3Cinternal%3E.PresetsApiService) |

#### Defined in

public/lib/store/presets/presets.facade.ts:44

## Properties

### UIState$

• `Readonly` **UIState$**: `Observable`<[`PresetUIModel`](../wiki/index.%3Cinternal%3E.PresetUIModel)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:57

___

### activePreset$

• `Readonly` **activePreset$**: `Observable`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:67

___

### activePresetUI$

• `Readonly` **activePresetUI$**: `Observable`<[`PresetDetailUIModel`](../wiki/index.PresetDetailUIModel)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:70

___

### detailQuery

• `Protected` **detailQuery**: [`PresetsDetailQuery`](../wiki/index.%3Cinternal%3E.PresetsDetailQuery)

___

### detailStore

• `Protected` **detailStore**: [`PresetsDetailStore`](../wiki/index.%3Cinternal%3E.PresetsDetailStore)

___

### isCreating$

• `Readonly` **isCreating$**: `Observable`<`boolean`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:66

___

### isFetching$

• `Readonly` **isFetching$**: `Observable`<`boolean`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:56

___

### listError$

• `Readonly` **listError$**: `Observable`<`any`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:55

___

### listPaginator

• **listPaginator**: `PaginatorPlugin`<[`PresetsListState`](../wiki/index.%3Cinternal%3E#presetsliststate)\>

___

### listQuery

• `Protected` **listQuery**: [`PresetsListQuery`](../wiki/index.%3Cinternal%3E.PresetsListQuery)

___

### listStore

• `Protected` **listStore**: [`PresetsListStore`](../wiki/index.%3Cinternal%3E.PresetsListStore)

___

### presets$

• `Readonly` **presets$**: `Observable`<[`Preset`](../wiki/index.%3Cinternal%3E#preset)[]\>

#### Defined in

public/lib/store/presets/presets.facade.ts:54

___

### service

• `Protected` **service**: [`PresetsApiService`](../wiki/index.%3Cinternal%3E.PresetsApiService)

## Methods

### activatePreset

▸ **activatePreset**(`presetId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:266

___

### addField

▸ **addField**(`presetId`, `field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `field` | [`PresetDetailField`](../wiki/index.%3Cinternal%3E#presetdetailfield) |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:337

___

### createPreset

▸ **createPreset**(`payload`, `options?`): `Promise`<`void` \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`CreatePresetPayload`](../wiki/index.CreatePresetPayload) |
| `options` | [`CreatePresetPayloadOptions`](../wiki/index.%3Cinternal%3E.CreatePresetPayloadOptions) |

#### Returns

`Promise`<`void` \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:198

___

### deactivatePreset

▸ **deactivatePreset**(`presetId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:285

___

### deleteField

▸ **deleteField**(`presetId`, `fieldId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `fieldId` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:378

___

### getIsFetching

▸ **getIsFetching**(): `boolean`

#### Returns

`boolean`

#### Defined in

public/lib/store/presets/presets.facade.ts:61

___

### getPreset

▸ **getPreset**(`presetId`, `searchParams?`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `searchParams?` | `SearchParams` |
| `options?` | [`GetPresetPayloadOptions`](../wiki/index.%3Cinternal%3E.GetPresetPayloadOptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/presets/presets.facade.ts:304

___

### getPresets

▸ **getPresets**(`searchParams?`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `searchParams?` | `SearchParams` |
| `options?` | [`GetPresetsPayloadOptions`](../wiki/index.%3Cinternal%3E.GetPresetsPayloadOptions) |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:130

___

### getPresetsPaginated

▸ **getPresetsPaginated**(`searchParams`, `options?`): `Observable`<`PaginationResponse`<[`Preset`](../wiki/index.%3Cinternal%3E#preset)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `searchParams` | `SearchParams` |
| `options?` | [`GetPresetsPaginatedPayloadOptions`](../wiki/index.%3Cinternal%3E.GetPresetsPaginatedPayloadOptions) |

#### Returns

`Observable`<`PaginationResponse`<[`Preset`](../wiki/index.%3Cinternal%3E#preset)\>\>

#### Defined in

public/lib/store/presets/presets.facade.ts:83

___

### hasActivePreset

▸ **hasActivePreset**(`presetId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`boolean`

#### Defined in

public/lib/store/presets/presets.facade.ts:182

___

### hasPreset

▸ **hasPreset**(`presetId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`boolean`

#### Defined in

public/lib/store/presets/presets.facade.ts:186

___

### moveField

▸ **moveField**(`presetId`, `fromIndex`, `toIndex`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `fromIndex` | `number` |
| `toIndex` | `number` |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:368

___

### removeActivePreset

▸ **removeActivePreset**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:177

___

### resetDetailStore

▸ **resetDetailStore**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:190

___

### selectPreset

▸ **selectPreset**(`presetId`): `Observable`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`Observable`<[`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:78

___

### selectPresetUIState

▸ **selectPresetUIState**(`presetId`): `Observable`<[`PresetDetailUIModel`](../wiki/index.PresetDetailUIModel)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`Observable`<[`PresetDetailUIModel`](../wiki/index.PresetDetailUIModel)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:74

___

### setActivePreset

▸ **setActivePreset**(`presetId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:172

___

### setIsFetching

▸ **setIsFetching**(`isFetching?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `isFetching` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:58

___

### updateDetail

▸ **updateDetail**(`presetId`, `preset`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `preset` | [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse) |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:194

___

### updateField

▸ **updateField**(`presetId`, `field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `presetId` | `string` |
| `field` | [`PresetDetailField`](../wiki/index.%3Cinternal%3E#presetdetailfield) |

#### Returns

`void`

#### Defined in

public/lib/store/presets/presets.facade.ts:352

___

### updatePreset

▸ **updatePreset**(`payload`, `options?`): `Promise`<`void` \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`UpdatePresetPayload`](../wiki/index.UpdatePresetPayload) |
| `options` | [`UpdatePresetPayloadOptions`](../wiki/index.%3Cinternal%3E.UpdatePresetPayloadOptions) |

#### Returns

`Promise`<`void` \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>

#### Defined in

public/lib/store/presets/presets.facade.ts:237
