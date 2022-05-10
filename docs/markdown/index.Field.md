# Interface: Field<D, F, P\>

[index](../wiki/index).Field

## Type parameters

| Name | Type |
| :------ | :------ |
| `D` | `DataType` |
| `F` | `FieldType` |
| `P` | `Preset` \| `PresetDetailResponse` |

## Table of contents

### Properties

- [\_\_new](../wiki/index.Field#__new-1)
- [compartment](../wiki/index.Field#compartment-1)
- [config](../wiki/index.Field#config-1)
- [dataType](../wiki/index.Field#datatype-1)
- [defaultValue](../wiki/index.Field#defaultvalue-1)
- [fieldType](../wiki/index.Field#fieldtype-1)
- [generalConfig](../wiki/index.Field#generalconfig-1)
- [label](../wiki/index.Field#label-1)
- [module](../wiki/index.Field#module-1)
- [name](../wiki/index.Field#name-1)
- [operators](../wiki/index.Field#operators-1)
- [preset](../wiki/index.Field#preset-1)
- [uuid](../wiki/index.Field#uuid-1)
- [validation](../wiki/index.Field#validation-1)
- [validators](../wiki/index.Field#validators-1)

## Properties

### \_\_new

• `Optional` **\_\_new**: `boolean`

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:77

___

### compartment

• **compartment**: `FieldCompartment`

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
| `fields?` | [`Field`](../wiki/index.Field)<`DataType`, `FieldType`, `Preset` \| `PresetDetailResponse`\>[] |

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

• **operators**: `Operator`[]

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

• **validators**: `Validator`[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.types.ts:59
