# Interface: ContentTypeAPI

[index](../wiki/index).ContentTypeAPI

## Table of contents

### Properties

- [helpers](../wiki/index.ContentTypeAPI#helpers-1)
- [hooks](../wiki/index.ContentTypeAPI#hooks-1)
- [parseFields](../wiki/index.ContentTypeAPI#parsefields-1)
- [registerCTDetailTab](../wiki/index.ContentTypeAPI#registerctdetailtab-1)
- [store](../wiki/index.ContentTypeAPI#store-1)
- [views](../wiki/index.ContentTypeAPI#views-1)

## Properties

### helpers

• **helpers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `configurationCompartmentValidator` | (`values`: `ContentTypeFieldDetail`, `fieldType?`: `FieldType`, `preset?`: `Preset`) => `boolean` |
| `createInitialValuesFromChecks` | (`checks`: (`ValidationCheck` \| `ValicationCheckWithFields` \| `ValicationCheckWithAllowedFields`)[]) => `FormValues` |
| `defaultValueCompartmentValidator` | (`field`: `ContentTypeFieldDetail`, `fieldType?`: `FieldType`) => `boolean` |
| `generateConfig` | (`fieldTypeData`: `FieldTypeData`, `preset?`: `PresetDetailResponse`) => `Record`<`string`, `any`\> |
| `generateConfigFromValidationData` | (`data`: `FormikValues`, `preset?`: `PresetDetailResponse`, `fieldConfig?`: { `[key: string]`: `any`; `fields?`: [`Field`](../wiki/index.Field)<`DataType`, `FieldType`, `Preset` \| `PresetDetailResponse`\>[]  }, `schema?`: `FormSchema`) => `Record`<`string`, `any`\> |
| `generateFormSchemaFromFieldTypeData` | (`fieldTypeData`: `FieldTypeData`) => `FormSchema` |
| `generateFormSchemaFromPreset` | (`preset`: `PresetDetailResponse`) => `FormSchema` |
| `generateValidationChecks` | (`data`: `FormikValues`, `fieldTypeData`: `FieldTypeData`, `preset?`: `PresetDetailResponse`, `ctField?`: `ContentTypeFieldDetail` \| `PresetDetailField`) => [`Validation`](../wiki/index.Validation) |
| `settingsCompartmentValidator` | (`values`: `ContentTypeFieldDetail`) => `boolean` |
| `validationCompartmentValidator` | (`values`: `ContentTypeFieldDetail`, `fieldType?`: `FieldType`, `preset?`: `Preset`) => `boolean` |

#### Defined in

public/lib/contentTypes.types.ts:206

___

### hooks

• **hooks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `useActiveFieldType` | `UseActiveFieldType` |
| `useActivePreset` | `UseActivePreset` |
| `useContentType` | `UseContentType` |
| `useFieldType` | `UseFieldType` |
| `useFieldTypes` | `UseFieldTypes` |
| `useFieldTypesUIStates` | `UseFieldTypesUIStates` |
| `useNavItemMatcher` | `UseNavItemMatcher` |
| `usePaginatedPresets` | `UsePaginatedPresets` |
| `usePreset` | `UsePreset` |
| `usePresets` | `UsePresets` |
| `usePresetsUIStates` | `UsePresetsUIStates` |

#### Defined in

public/lib/contentTypes.types.ts:182

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

public/lib/contentTypes.types.ts:163

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

public/lib/contentTypes.types.ts:162

___

### store

• **store**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contentTypes` | { `facade`: `ContentTypesFacade` ; `service`: `ContentTypesApiService`  } |
| `contentTypes.facade` | `ContentTypesFacade` |
| `contentTypes.service` | `ContentTypesApiService` |
| `fieldTypes` | { `facade`: `FieldTypesFacade` ; `service`: `FieldTypesApiService`  } |
| `fieldTypes.facade` | `FieldTypesFacade` |
| `fieldTypes.service` | `FieldTypesApiService` |
| `metadata` | { `facade`: `MetadataFacade` ; `service`: `MetadataApiService`  } |
| `metadata.facade` | `MetadataFacade` |
| `metadata.service` | `MetadataApiService` |
| `presets` | { `facade`: `PresetsFacade` ; `service`: `PresetsApiService`  } |
| `presets.facade` | `PresetsFacade` |
| `presets.service` | `PresetsApiService` |

#### Defined in

public/lib/contentTypes.types.ts:164

___

### views

• **views**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tenant` | { `ContentTypesCCConfig`: `FC`<`ContentTypesCCRouteProps`\> ; `ContentTypesCCSettings`: `FC`<`ContentTypesCCRouteProps`\> ; `ContentTypesCCValidation`: `FC`<`ContentTypesCCRouteProps`\>  } |
| `tenant.ContentTypesCCConfig` | `FC`<`ContentTypesCCRouteProps`\> |
| `tenant.ContentTypesCCSettings` | `FC`<`ContentTypesCCRouteProps`\> |
| `tenant.ContentTypesCCValidation` | `FC`<`ContentTypesCCRouteProps`\> |

#### Defined in

public/lib/contentTypes.types.ts:199
