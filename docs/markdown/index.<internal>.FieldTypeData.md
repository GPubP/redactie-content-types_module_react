# Interface: FieldTypeData

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).FieldTypeData

## Table of contents

### Properties

- [componentName](../wiki/index.%3Cinternal%3E.FieldTypeData#componentname)
- [dataType](../wiki/index.%3Cinternal%3E.FieldTypeData#datatype)
- [defaultConfig](../wiki/index.%3Cinternal%3E.FieldTypeData#defaultconfig)
- [defaultValidatorValues](../wiki/index.%3Cinternal%3E.FieldTypeData#defaultvalidatorvalues)
- [fieldType](../wiki/index.%3Cinternal%3E.FieldTypeData#fieldtype)
- [formSchema](../wiki/index.%3Cinternal%3E.FieldTypeData#formschema)
- [generalConfig](../wiki/index.%3Cinternal%3E.FieldTypeData#generalconfig)
- [label](../wiki/index.%3Cinternal%3E.FieldTypeData#label)
- [module](../wiki/index.%3Cinternal%3E.FieldTypeData#module)
- [name](../wiki/index.%3Cinternal%3E.FieldTypeData#name)
- [operators](../wiki/index.%3Cinternal%3E.FieldTypeData#operators)
- [validators](../wiki/index.%3Cinternal%3E.FieldTypeData#validators)

## Properties

### componentName

• **componentName**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:39

___

### dataType

• **dataType**: [`DataType`](../wiki/index.%3Cinternal%3E.DataType)

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:47

___

### defaultConfig

• **defaultConfig**: `any`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:42

___

### defaultValidatorValues

• **defaultValidatorValues**: [`Validation`](../wiki/index.Validation)

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:41

___

### fieldType

• `Optional` **fieldType**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:43

___

### formSchema

• **formSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fields` | [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[] |

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:44

___

### generalConfig

• **generalConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `allowDefault` | `boolean` |
| `defaultGuideline?` | `string` |
| `defaultLabel?` | `string` |
| `defaultTranslateValue` | `boolean` |
| `isMultiple` | `boolean` |
| `isQueryable` | `boolean` |
| `isTranslatable` | `boolean` |
| `mapValueToContentItemPath?` | [`MapValueToContentItemPath`](../wiki/index.%3Cinternal%3E.MapValueToContentItemPath)[] |
| `removable?` | ``false`` |

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:48

___

### label

• **label**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:37

___

### module

• **module**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:60

___

### name

• **name**: `string`

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:38

___

### operators

• **operators**: [`Operator`](../wiki/index.%3Cinternal%3E.Operator)[]

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:59

___

### validators

• **validators**: `any`[]

#### Defined in

public/lib/services/fieldTypes/fieldTypes.service.types.ts:40
