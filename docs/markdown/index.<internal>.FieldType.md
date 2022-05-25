# Interface: FieldType

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).FieldType

## Table of contents

### Properties

- [\_id](../wiki/index.%3Cinternal%3E.FieldType#_id)
- [data](../wiki/index.%3Cinternal%3E.FieldType#data)
- [errorMessages](../wiki/index.%3Cinternal%3E.FieldType#errormessages)
- [meta](../wiki/index.%3Cinternal%3E.FieldType#meta)
- [uuid](../wiki/index.%3Cinternal%3E.FieldType#uuid)
- [validateSchema](../wiki/index.%3Cinternal%3E.FieldType#validateschema)

## Properties

### \_id

• **\_id**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:71

___

### data

• **data**: [`FieldTypeData`](../wiki/index.%3Cinternal%3E.FieldTypeData)

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:73

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

public/lib/services/fieldTypes/fieldTypes.service.types.ts:82

___

### meta

• **meta**: [`FieldTypeMeta`](../wiki/index.%3Cinternal%3E.FieldTypeMeta)

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:74

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:72

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

public/lib/services/fieldTypes/fieldTypes.service.types.ts:75
