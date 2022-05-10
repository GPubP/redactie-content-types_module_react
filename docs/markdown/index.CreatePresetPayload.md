# Interface: CreatePresetPayload

[index](../wiki/index).CreatePresetPayload

## Table of contents

### Properties

- [data](../wiki/index.CreatePresetPayload#data-1)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fieldType` | `string` |
| `fields?` | { `field`: `PresetField`<`DataType`, `FieldType`\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<`DataType`, `FieldType`, `Preset` \| `PresetDetailResponse`\>[]  } ; `validators`: `Validator`[]  }[] |
| `label` | `string` |
| `name` | `string` |
| `validators?` | `string`[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:117
