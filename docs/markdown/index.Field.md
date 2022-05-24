# Interface: Field<D, F, P\>

[index](../wiki/index).Field

## Type parameters

| Name | Type |
| :------ | :------ |
| `D` | [`DataType`](../wiki/index.%3Cinternal%3E.DataType) |
| `F` | [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType) |
| `P` | [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse) |

## Table of contents

### Properties

- [\_\_new](../wiki/index.Field#__new)
- [compartment](../wiki/index.Field#compartment)
- [config](../wiki/index.Field#config)
- [dataType](../wiki/index.Field#datatype)
- [defaultValue](../wiki/index.Field#defaultvalue)
- [fieldType](../wiki/index.Field#fieldtype)
- [generalConfig](../wiki/index.Field#generalconfig)
- [label](../wiki/index.Field#label)
- [module](../wiki/index.Field#module)
- [name](../wiki/index.Field#name)
- [operators](../wiki/index.Field#operators)
- [preset](../wiki/index.Field#preset)
- [uuid](../wiki/index.Field#uuid)
- [validation](../wiki/index.Field#validation)
- [validators](../wiki/index.Field#validators)

## Properties

### \_\_new

• `Optional` **\_\_new**: `boolean`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:77

___

### compartment

• **compartment**: [`FieldCompartment`](../wiki/index.%3Cinternal%3E.FieldCompartment)

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:76

___

### config

• **config**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fields?` | [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[] |

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:54

___

### dataType

• **dataType**: `D`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:73

___

### defaultValue

• `Optional` **defaultValue**: `any`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:58

___

### fieldType

• **fieldType**: `F`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:74

___

### generalConfig

• **generalConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `combinedOutput?` | `boolean` |
| `disabled?` | `boolean` |
| `guideline` | `string` |
| `hidden?` | `boolean` |
| `max?` | `number` |
| `min?` | `number` |
| `multiLanguage?` | `boolean` |
| `placeholder?` | `string` |
| `required?` | `boolean` |

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:62

___

### label

• **label**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:51

___

### module

• **module**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:52

___

### name

• **name**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:53

___

### operators

• **operators**: [`Operator`](../wiki/index.%3Cinternal%3E.Operator)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:60

___

### preset

• `Optional` **preset**: `P`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:75

___

### uuid

• **uuid**: `string`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:50

___

### validation

• `Optional` **validation**: [`Validation`](../wiki/index.Validation)

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:61

___

### validators

• **validators**: [`Validator`](../wiki/index.%3Cinternal%3E.Validator)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:59
