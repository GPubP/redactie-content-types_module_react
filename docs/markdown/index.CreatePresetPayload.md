# Interface: CreatePresetPayload

[index](../wiki/index).CreatePresetPayload

## Table of contents

### Properties

- [data](../wiki/index.CreatePresetPayload#data)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fieldType` | `string` |
| `fields?` | { `field`: [`PresetField`](../wiki/index.%3Cinternal%3E#presetfield)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\> ; `formSchema`: { `fields`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  } ; `validators`: [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[]  }[] |
| `label` | `string` |
| `name` | `string` |
| `validators?` | `string`[] |

#### Defined in

public/lib/services/presets/presets.service.types.ts:117
