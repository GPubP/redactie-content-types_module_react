# Class: FieldTypesApiService

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).FieldTypesApiService

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.FieldTypesApiService#constructor)

### Methods

- [getFieldType](../wiki/index.%3Cinternal%3E.FieldTypesApiService#getfieldtype)
- [getFieldTypes](../wiki/index.%3Cinternal%3E.FieldTypesApiService#getfieldtypes)

## Constructors

### constructor

• **new FieldTypesApiService**()

## Methods

### getFieldType

▸ **getFieldType**(`uuid`): `Promise`<``null`` \| [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`Promise`<``null`` \| [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\>

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.ts:18

___

### getFieldTypes

▸ **getFieldTypes**(`searchParams?`): `Promise`<``null`` \| [`FieldTypesResponse`](../wiki/index.%3Cinternal%3E#fieldtypesresponse)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `searchParams` | `SearchParams` | `DEFAULT_FIELD_TYPES_SEARCH_PARAMS` |

#### Returns

`Promise`<``null`` \| [`FieldTypesResponse`](../wiki/index.%3Cinternal%3E#fieldtypesresponse)\>

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.ts:12
