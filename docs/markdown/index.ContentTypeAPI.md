# Interface: ContentTypeAPI

[index](../wiki/index).ContentTypeAPI

## Table of contents

### Properties

- [helpers](../wiki/index.ContentTypeAPI#helpers)
- [hooks](../wiki/index.ContentTypeAPI#hooks)
- [parseFields](../wiki/index.ContentTypeAPI#parsefields)
- [registerCTDetailTab](../wiki/index.ContentTypeAPI#registerctdetailtab)
- [store](../wiki/index.ContentTypeAPI#store)
- [views](../wiki/index.ContentTypeAPI#views)

## Properties

### helpers

• **helpers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `configurationCompartmentValidator` | (`values`: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail), `fieldType?`: [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), `preset?`: [`Preset`](../wiki/index.%3Cinternal%3E#preset), `languages`: `LanguageSchema`[]) => `boolean` |
| `createInitialValuesFromChecks` | (`checks`: (`ValidationCheck` \| `ValicationCheckWithFields` \| `ValicationCheckWithAllowedFields`)[]) => `FormValues` |
| `defaultValueCompartmentValidator` | (`field`: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail), `fieldType?`: [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), `preset?`: [`Preset`](../wiki/index.%3Cinternal%3E#preset), `languages?`: `LanguageSchema`[]) => `boolean` |
| `generateConfig` | (`fieldTypeData`: [`FieldTypeData`](../wiki/index.%3Cinternal%3E.FieldTypeData), `preset?`: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)) => `Record`<`string`, `any`\> |
| `generateConfigFromValidationData` | (`data`: `FormikValues`, `preset?`: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse), `fieldConfig?`: { `[key: string]`: `any`; `fields?`: [`Field`](../wiki/index.Field)<[`DataType`](../wiki/index.%3Cinternal%3E.DataType), [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), [`Preset`](../wiki/index.%3Cinternal%3E#preset) \| [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)\>[]  }, `schema?`: `FormSchema`) => `Record`<`string`, `any`\> |
| `generateFormSchemaFromFieldTypeData` | (`fieldTypeData`: [`FieldTypeData`](../wiki/index.%3Cinternal%3E.FieldTypeData)) => `FormSchema` |
| `generateFormSchemaFromPreset` | (`preset`: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse)) => `FormSchema` |
| `generateValidationChecks` | (`data`: `FormikValues`, `fieldTypeData`: [`FieldTypeData`](../wiki/index.%3Cinternal%3E.FieldTypeData), `preset?`: [`PresetDetailResponse`](../wiki/index.%3Cinternal%3E#presetdetailresponse), `ctField?`: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail) \| [`PresetDetailField`](../wiki/index.%3Cinternal%3E#presetdetailfield)) => [`Validation`](../wiki/index.Validation) |
| `settingsCompartmentValidator` | (`values`: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)) => `boolean` |
| `validationCompartmentValidator` | (`values`: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail), `fieldType?`: [`FieldType`](../wiki/index.%3Cinternal%3E.FieldType), `preset?`: [`Preset`](../wiki/index.%3Cinternal%3E#preset)) => `boolean` |

#### Defined in

public/lib/contentTypes.types.ts:209

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useActiveFieldType` | [`UseActiveFieldType`](../wiki/index.%3Cinternal%3E#useactivefieldtype) |
| `useActivePreset` | [`UseActivePreset`](../wiki/index.%3Cinternal%3E#useactivepreset) |
| `useContentType` | [`UseContentType`](../wiki/index.%3Cinternal%3E#usecontenttype) |
| `useFieldType` | [`UseFieldType`](../wiki/index.%3Cinternal%3E#usefieldtype) |
| `useFieldTypes` | [`UseFieldTypes`](../wiki/index.%3Cinternal%3E#usefieldtypes) |
| `useFieldTypesUIStates` | [`UseFieldTypesUIStates`](../wiki/index.%3Cinternal%3E#usefieldtypesuistates) |
| `useNavItemMatcher` | [`UseNavItemMatcher`](../wiki/index.%3Cinternal%3E#usenavitemmatcher) |
| `usePaginatedPresets` | [`UsePaginatedPresets`](../wiki/index.%3Cinternal%3E#usepaginatedpresets) |
| `usePreset` | [`UsePreset`](../wiki/index.%3Cinternal%3E#usepreset) |
| `usePresets` | [`UsePresets`](../wiki/index.%3Cinternal%3E#usepresets) |
| `usePresetsUIStates` | [`UsePresetsUIStates`](../wiki/index.%3Cinternal%3E#usepresetsuistates) |

#### Defined in

public/lib/contentTypes.types.ts:185

___

### parseFields

• **parseFields**: (`fields?`: `ContentTypeFieldSchema`[], `options?`: `ParseFieldsOptions`) => `FieldSchema`[]

#### Type declaration

▸ (`fields?`, `options?`): `FieldSchema`[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `fields?` | `ContentTypeFieldSchema`[] |
| `options?` | `ParseFieldsOptions` |

##### Returns

`FieldSchema`[]

#### Defined in

public/lib/contentTypes.types.ts:166

___

### registerCTDetailTab

• **registerCTDetailTab**: (`name`: `string`, `options`: [`ExternalTabOptions`](../wiki/index.ExternalTabOptions)) => `void`

#### Type declaration

▸ (`name`, `options`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalTabOptions`](../wiki/index.ExternalTabOptions) |

##### Returns

`void`

#### Defined in

public/lib/contentTypes.types.ts:165

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentTypes` | { `facade`: [`ContentTypesFacade`](../wiki/index.%3Cinternal%3E.ContentTypesFacade) ; `service`: [`ContentTypesApiService`](../wiki/index.%3Cinternal%3E.ContentTypesApiService)  } |
| `contentTypes.facade` | [`ContentTypesFacade`](../wiki/index.%3Cinternal%3E.ContentTypesFacade) |
| `contentTypes.service` | [`ContentTypesApiService`](../wiki/index.%3Cinternal%3E.ContentTypesApiService) |
| `fieldTypes` | { `facade`: [`FieldTypesFacade`](../wiki/index.%3Cinternal%3E.FieldTypesFacade) ; `service`: [`FieldTypesApiService`](../wiki/index.%3Cinternal%3E.FieldTypesApiService)  } |
| `fieldTypes.facade` | [`FieldTypesFacade`](../wiki/index.%3Cinternal%3E.FieldTypesFacade) |
| `fieldTypes.service` | [`FieldTypesApiService`](../wiki/index.%3Cinternal%3E.FieldTypesApiService) |
| `metadata` | { `facade`: [`MetadataFacade`](../wiki/index.%3Cinternal%3E.MetadataFacade) ; `service`: [`MetadataApiService`](../wiki/index.%3Cinternal%3E.MetadataApiService)  } |
| `metadata.facade` | [`MetadataFacade`](../wiki/index.%3Cinternal%3E.MetadataFacade) |
| `metadata.service` | [`MetadataApiService`](../wiki/index.%3Cinternal%3E.MetadataApiService) |
| `presets` | { `facade`: [`PresetsFacade`](../wiki/index.%3Cinternal%3E.PresetsFacade) ; `service`: [`PresetsApiService`](../wiki/index.%3Cinternal%3E.PresetsApiService)  } |
| `presets.facade` | [`PresetsFacade`](../wiki/index.%3Cinternal%3E.PresetsFacade) |
| `presets.service` | [`PresetsApiService`](../wiki/index.%3Cinternal%3E.PresetsApiService) |

#### Defined in

public/lib/contentTypes.types.ts:167

___

### views

• **views**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tenant` | { `ContentTypesCCConfig`: `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\> ; `ContentTypesCCSettings`: `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\> ; `ContentTypesCCValidation`: `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\>  } |
| `tenant.ContentTypesCCConfig` | `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\> |
| `tenant.ContentTypesCCSettings` | `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\> |
| `tenant.ContentTypesCCValidation` | `FC`<[`ContentTypesCCRouteProps`](../wiki/index.%3Cinternal%3E.ContentTypesCCRouteProps)\> |

#### Defined in

public/lib/contentTypes.types.ts:202
