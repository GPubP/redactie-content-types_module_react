# Interface: BasePreset<V, D, F\>

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).BasePreset

## Type parameters

| Name | Type |
| :------ | :------ |
| `V` | `string` |
| `D` | `string` |
| `F` | `string` |

## Table of contents

### Properties

- [\_id](../wiki/index.%3Cinternal%3E.BasePreset#_id)
- [data](../wiki/index.%3Cinternal%3E.BasePreset#data)
- [errorMessages](../wiki/index.%3Cinternal%3E.BasePreset#errormessages)
- [meta](../wiki/index.%3Cinternal%3E.BasePreset#meta)
- [uuid](../wiki/index.%3Cinternal%3E.BasePreset#uuid)
- [validateSchema](../wiki/index.%3Cinternal%3E.BasePreset#validateschema)

## Properties

### \_id

• **\_id**: `string`

#### Defined in

public/lib/services/presets/presets.service.types.ts:36

___

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultConfig` | `Record`<`string`, `any`\> |
| `description` | `string` |
| `fieldType` | `F` |
| `fields` | { `field`: [`PresetField`](../wiki/index.%3Cinternal%3E#presetfield)<`D`, `F`\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  } ; `validators`: `V`[]  }[] |
| `generalConfig` | { `allowDefault`: `boolean` ; `defaultTranslateValue`: `boolean` ; `isMultiple`: `boolean` ; `isQueryable`: `boolean` ; `isTranslatable`: `boolean` ; `mapValueToContentItemPath?`: [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] ; `removable?`: `boolean`  } |
| `generalConfig.allowDefault` | `boolean` |
| `generalConfig.defaultTranslateValue` | `boolean` |
| `generalConfig.isMultiple` | `boolean` |
| `generalConfig.isQueryable` | `boolean` |
| `generalConfig.isTranslatable` | `boolean` |
| `generalConfig.mapValueToContentItemPath?` | [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] |
| `generalConfig.removable?` | `boolean` |
| `label` | `string` |
| `name` | `string` |
| `validators` | `V`[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:38

___

### errorMessages

• **errorMessages**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `configuration` | `Record`<`string`, `string`\> |
| `validation` | { `dataSchema`: `Record`<`string`, `string`\> ; `formSchema`: `Record`<`string`, `string`\>  } |
| `validation.dataSchema` | `Record`<`string`, `string`\> |
| `validation.formSchema` | `Record`<`string`, `string`\> |

#### Defined in

public/lib/services/presets/presets.service.types.ts:80

___

### meta

• **meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `active` | `boolean` |
| `created` | `string` |
| `default` | `boolean` |
| `deleted` | `boolean` |
| `lastModified` | `string` |
| `occurrences` | { `name`: `string` ; `uuid`: `string`  }[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:62

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/presets/presets.service.types.ts:37

___

### validateSchema

• **validateSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `configuration` | `object` |
| `validation` | { `dataSchema`: `object` ; `formSchema`: `object`  } |
| `validation.dataSchema` | `object` |
| `validation.formSchema` | `object` |

#### Defined in

public/lib/services/presets/presets.service.types.ts:73
