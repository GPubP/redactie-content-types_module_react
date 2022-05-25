# Interface: Validator

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).Validator

=========================
Base types
=========================

## Table of contents

### Properties

- [data](../wiki/index.%3Cinternal%3E.Validator#data)
- [meta](../wiki/index.%3Cinternal%3E.Validator#meta)
- [uuid](../wiki/index.%3Cinternal%3E.Validator#uuid)

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dataTypes` | `string`[] |
| `defaultValue` | `Record`<`string`, `any`\> |
| `description` | `string` |
| `formSchema` | { `fields`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  } |
| `formSchema.fields` | [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[] |
| `label` | `string` |
| `name` | `string` |

#### Defined in

public/lib/services/presets/presets.service.types.ts:14

___

### meta

• **meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | `string` |
| `deleted` | `string` |
| `lastEditor` | `string` |
| `lastModified` | `string` |

#### Defined in

public/lib/services/presets/presets.service.types.ts:24

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/presets/presets.service.types.ts:13
