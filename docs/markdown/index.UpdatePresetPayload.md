# Interface: UpdatePresetPayload

[index](../wiki/index).UpdatePresetPayload

=========================
Payload types
- Define all payload interfaces
=========================

## Table of contents

### Properties

- [body](../wiki/index.UpdatePresetPayload#body-1)
- [uuid](../wiki/index.UpdatePresetPayload#uuid-1)

## Properties

### body

• **body**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | { `defaultConfig`: `Record`<`string`, `any`\> ; `description`: `string` ; `fieldType`: `FieldType` ; `fields`: { `field`: `PresetField`<`DataType`, `FieldType`\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<`DataType`, `FieldType`, `Preset` \| `PresetDetailResponse`\>[]  } ; `validators`: `Validator`[]  }[] ; `generalConfig`: { `allowDefault`: `boolean` ; `defaultTranslateValue`: `boolean` ; `isMultiple`: `boolean` ; `isQueryable`: `boolean` ; `isTranslatable`: `boolean` ; `mapValueToContentItemPath?`: `MapValueToContentItemPath`[] ; `removable?`: `boolean`  } ; `label`: `string` ; `name`: `string` ; `validators`: `Validator`[]  } |
| `data.defaultConfig` | `Record`<`string`, `any`\> |
| `data.description` | `string` |
| `data.fieldType` | `FieldType` |
| `data.fields` | { `field`: `PresetField`<`DataType`, `FieldType`\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<`DataType`, `FieldType`, `Preset` \| `PresetDetailResponse`\>[]  } ; `validators`: `Validator`[]  }[] |
| `data.generalConfig` | { `allowDefault`: `boolean` ; `defaultTranslateValue`: `boolean` ; `isMultiple`: `boolean` ; `isQueryable`: `boolean` ; `isTranslatable`: `boolean` ; `mapValueToContentItemPath?`: `MapValueToContentItemPath`[] ; `removable?`: `boolean`  } |
| `data.generalConfig.allowDefault` | `boolean` |
| `data.generalConfig.defaultTranslateValue` | `boolean` |
| `data.generalConfig.isMultiple` | `boolean` |
| `data.generalConfig.isQueryable` | `boolean` |
| `data.generalConfig.isTranslatable` | `boolean` |
| `data.generalConfig.mapValueToContentItemPath?` | `MapValueToContentItemPath`[] |
| `data.generalConfig.removable?` | `boolean` |
| `data.label` | `string` |
| `data.name` | `string` |
| `data.validators` | `Validator`[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:111

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/presets/presets.service.types.ts:110
