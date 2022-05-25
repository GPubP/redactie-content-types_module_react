# Interface: UpdatePresetPayload

[index](../wiki/index).UpdatePresetPayload

=========================
Payload types
- Define all payload interfaces
=========================

## Table of contents

### Properties

- [body](../wiki/index.UpdatePresetPayload#body)
- [uuid](../wiki/index.UpdatePresetPayload#uuid)

## Properties

### body

• **body**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | { `defaultConfig`: `Record`<`string`, `any`\> ; `description`: `string` ; `fieldType`: [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType) ; `fields`: { `field`: [`PresetField`](../wiki/index.%3Cinternal%3E#presetfield)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  } ; `validators`: [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[]  }[] ; `generalConfig`: { `allowDefault`: `boolean` ; `defaultTranslateValue`: `boolean` ; `isMultiple`: `boolean` ; `isQueryable`: `boolean` ; `isTranslatable`: `boolean` ; `mapValueToContentItemPath?`: [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] ; `removable?`: `boolean`  } ; `label`: `string` ; `name`: `string` ; `validators`: [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[]  } |
| `data.defaultConfig` | `Record`<`string`, `any`\> |
| `data.description` | `string` |
| `data.fieldType` | [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType) |
| `data.fields` | { `field`: [`PresetField`](../wiki/index.%3Cinternal%3E#presetfield)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  } ; `validators`: [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[]  }[] |
| `data.generalConfig` | { `allowDefault`: `boolean` ; `defaultTranslateValue`: `boolean` ; `isMultiple`: `boolean` ; `isQueryable`: `boolean` ; `isTranslatable`: `boolean` ; `mapValueToContentItemPath?`: [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] ; `removable?`: `boolean`  } |
| `data.generalConfig.allowDefault` | `boolean` |
| `data.generalConfig.defaultTranslateValue` | `boolean` |
| `data.generalConfig.isMultiple` | `boolean` |
| `data.generalConfig.isQueryable` | `boolean` |
| `data.generalConfig.isTranslatable` | `boolean` |
| `data.generalConfig.mapValueToContentItemPath?` | [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] |
| `data.generalConfig.removable?` | `boolean` |
| `data.label` | `string` |
| `data.name` | `string` |
| `data.validators` | [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:111

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/presets/presets.service.types.ts:110
