# Interface: ContentTypesCCRouteProps

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentTypesCCRouteProps

## Hierarchy

- [`ContentTypesRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesRouteProps)

  ↳ **`ContentTypesCCRouteProps`**

## Table of contents

### Properties

- [CTField](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#ctfield)
- [activeLanguages](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#activelanguages)
- [contentType](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#contenttype)
- [dynamicFieldSettingsContext](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#dynamicfieldsettingscontext)
- [fieldType](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#fieldtype)
- [formikRef](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#formikref)
- [hasSubmit](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#hassubmit)
- [parentPreset](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#parentpreset)
- [preset](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#preset)
- [routes](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#routes)

### Methods

- [onDelete](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#ondelete)
- [onSubmit](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps#onsubmit)

## Properties

### CTField

• `Readonly` **CTField**: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)

#### Defined in

public/lib/contentTypes.types.ts:111

___

### activeLanguages

• **activeLanguages**: `LanguageSchema`[]

#### Defined in

public/lib/contentTypes.types.ts:125

___

### contentType

• **contentType**: [`ContentTypeResponse`](../wiki/index.%3Cinternal%3E.ContentTypeResponse)

#### Defined in

public/lib/contentTypes.types.ts:124

___

### dynamicFieldSettingsContext

• `Optional` `Readonly` **dynamicFieldSettingsContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dynamicField` | [`DynamicFieldDetailModel`](../wiki/index.%3Cinternal%3E#dynamicfielddetailmodel) |
| `getCreatePath` | (`isPreset`: `boolean`, `fieldTypeUuid`: `string`) => `string` |
| `getEditPath` | (`uuid`: `string`) => `string` |
| `setDynamicField` | (`field`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>) => `void` |

#### Defined in

public/lib/contentTypes.types.ts:115

___

### fieldType

• `Readonly` **fieldType**: [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)

#### Defined in

public/lib/contentTypes.types.ts:112

___

### formikRef

• **formikRef**: `undefined` \| (`instance`: `any`) => `void`

#### Defined in

public/lib/contentTypes.types.ts:123

___

### hasSubmit

• **hasSubmit**: `boolean`

#### Defined in

public/lib/contentTypes.types.ts:126

___

### parentPreset

• `Optional` `Readonly` **parentPreset**: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)

#### Defined in

public/lib/contentTypes.types.ts:114

___

### preset

• `Optional` `Readonly` **preset**: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)

#### Defined in

public/lib/contentTypes.types.ts:113

___

### routes

• **routes**: `ModuleRouteConfig`[]

#### Inherited from

[ContentTypesRouteProps](../wiki/index.%3Cinternal%3E.ContentTypesRouteProps).[routes](../wiki/index.%3Cinternal%3E.ContentTypesRouteProps#routes)

#### Defined in

public/lib/contentTypes.types.ts:69

## Methods

### onDelete

▸ `Optional` **onDelete**(): `void`

#### Returns

`void`

#### Defined in

public/lib/contentTypes.types.ts:121

___

### onSubmit

▸ **onSubmit**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`void`

#### Defined in

public/lib/contentTypes.types.ts:122
