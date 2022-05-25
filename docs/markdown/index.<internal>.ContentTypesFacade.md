# Class: ContentTypesFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentTypesFacade

## Hierarchy

- `BaseEntityFacade`<[`ContentTypesStore`](../wiki/index.%3Cinternal%3E.ContentTypesStore), [`ContentTypesApiService`](../wiki/index.%3Cinternal%3E.ContentTypesApiService), [`ContentTypesQuery`](../wiki/index.%3Cinternal%3E.ContentTypesQuery)\>

  ↳ **`ContentTypesFacade`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentTypesFacade#constructor)

### Properties

- [activeField$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#activefield$)
- [contentType$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#contenttype$)
- [contentTypes$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#contenttypes$)
- [fieldsByCompartments$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#fieldsbycompartments$)
- [isFetchingSiteModulesConfig$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#isfetchingsitemodulesconfig$)
- [isFetchingSiteOccurrences$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#isfetchingsiteoccurrences$)
- [isRemoving$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#isremoving$)
- [meta$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#meta$)
- [siteOccurrences$](../wiki/index.%3Cinternal%3E.ContentTypesFacade#siteoccurrences$)

### Methods

- [addCompartment](../wiki/index.%3Cinternal%3E.ContentTypesFacade#addcompartment)
- [addField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#addfield)
- [clearActiveField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#clearactivefield)
- [clearContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#clearcontenttype)
- [createContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#createcontenttype)
- [deleteField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#deletefield)
- [fetchSiteModulesConfig](../wiki/index.%3Cinternal%3E.ContentTypesFacade#fetchsitemodulesconfig)
- [getContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getcontenttype)
- [getContentTypeSiteOccurrences](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getcontenttypesiteoccurrences)
- [getContentTypes](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getcontenttypes)
- [getDynamicFieldValue](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getdynamicfieldvalue)
- [getSiteContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getsitecontenttype)
- [getSiteTenantContentTypes](../wiki/index.%3Cinternal%3E.ContentTypesFacade#getsitetenantcontenttypes)
- [removeCompartment](../wiki/index.%3Cinternal%3E.ContentTypesFacade#removecompartment)
- [removeContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#removecontenttype)
- [setActiveField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#setactivefield)
- [updateActiveField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updateactivefield)
- [updateCompartment](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatecompartment)
- [updateCompartments](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatecompartments)
- [updateContentType](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatecontenttype)
- [updateContentTypeSiteWorkflow](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatecontenttypesiteworkflow)
- [updateField](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatefield)
- [updateFieldCompartment](../wiki/index.%3Cinternal%3E.ContentTypesFacade#updatefieldcompartment)

## Constructors

### constructor

• **new ContentTypesFacade**(`store`, `service`, `query`, `presetFacade`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`ContentTypesStore`](../wiki/index.%3Cinternal%3E.ContentTypesStore) |
| `service` | [`ContentTypesApiService`](../wiki/index.%3Cinternal%3E.ContentTypesApiService) |
| `query` | [`ContentTypesQuery`](../wiki/index.%3Cinternal%3E.ContentTypesQuery) |
| `presetFacade` | [`PresetsFacade`](../wiki/index.%3Cinternal%3E.PresetsFacade) |

#### Overrides

BaseEntityFacade&lt;
	ContentTypesStore,
	ContentTypesApiService,
	ContentTypesQuery
\&gt;.constructor

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:46

## Properties

### activeField$

• `Readonly` **activeField$**: `Observable`<`undefined` \| [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:42

___

### contentType$

• `Readonly` **contentType$**: `Observable`<`undefined` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:37

___

### contentTypes$

• `Readonly` **contentTypes$**: `Observable`<[`ContentTypeResponse`](../wiki/index.%3Cinternal%3E.ContentTypeResponse)[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:36

___

### fieldsByCompartments$

• `Readonly` **fieldsByCompartments$**: `Observable`<[`FieldsByCompartment`](../wiki/index.%3Cinternal%3E.FieldsByCompartment)[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:43

___

### isFetchingSiteModulesConfig$

• `Readonly` **isFetchingSiteModulesConfig$**: `Observable`<`any`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:41

___

### isFetchingSiteOccurrences$

• `Readonly` **isFetchingSiteOccurrences$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:40

___

### isRemoving$

• `Readonly` **isRemoving$**: `Observable`<`LoadingState`\>

#### Overrides

BaseEntityFacade.isRemoving$

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:39

___

### meta$

• `Readonly` **meta$**: `Observable`<`undefined` \| [`ContentTypePaging`](../wiki/index.%3Cinternal%3E.ContentTypePaging)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:35

___

### siteOccurrences$

• `Readonly` **siteOccurrences$**: `Observable`<`SiteResponse`[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:38

## Methods

### addCompartment

▸ **addCompartment**(`compartment`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `compartment` | [`Compartment`](../wiki/index.%3Cinternal%3E.Compartment) |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:574

___

### addField

▸ **addField**(`field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail) |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:395

___

### clearActiveField

▸ **clearActiveField**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:631

___

### clearContentType

▸ **clearContentType**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:261

___

### createContentType

▸ **createContentType**(`payload`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`ContentTypeCreateRequest`](../wiki/index.%3Cinternal%3E.ContentTypeCreateRequest) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:227

___

### deleteField

▸ **deleteField**(`uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:420

___

### fetchSiteModulesConfig

▸ **fetchSiteModulesConfig**(`siteUuid`, `contentTypeUuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteUuid` | `string` |
| `contentTypeUuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:201

___

### getContentType

▸ **getContentType**(`uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:118

___

### getContentTypeSiteOccurrences

▸ **getContentTypeSiteOccurrences**(`uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:145

___

### getContentTypes

▸ **getContentTypes**(`payload`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `SearchParams` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:62

___

### getDynamicFieldValue

▸ **getDynamicFieldValue**(): ``null`` \| [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)

#### Returns

``null`` \| [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:56

___

### getSiteContentType

▸ **getSiteContentType**(`siteUuid`, `contentTypeUuid`, `forceReload?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `siteUuid` | `string` | `undefined` |
| `contentTypeUuid` | `string` | `undefined` |
| `forceReload` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:169

___

### getSiteTenantContentTypes

▸ **getSiteTenantContentTypes**(`siteId`, `payload`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `payload` | `SearchParams` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:90

___

### removeCompartment

▸ **removeCompartment**(`uuid`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:447

___

### removeContentType

▸ **removeContentType**(`contentType`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:361

___

### setActiveField

▸ **setActiveField**(`payload`): `void`

Active Field actions

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail) |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:589

___

### updateActiveField

▸ **updateActiveField**(`payload`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Partial`<[`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)\> |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:595

___

### updateCompartment

▸ **updateCompartment**(`uuid`, `compartment`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |
| `compartment` | `Partial`<[`Compartment`](../wiki/index.%3Cinternal%3E.Compartment)\> |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:484

___

### updateCompartments

▸ **updateCompartments**(`compartments`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `compartments` | [`Compartment`](../wiki/index.%3Cinternal%3E.Compartment)[] |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:503

___

### updateContentType

▸ **updateContentType**(`payload`, `containerId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) |
| `containerId` | [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:267

___

### updateContentTypeSiteWorkflow

▸ **updateContentTypeSiteWorkflow**(`payload`, `contentType`, `siteId`, `containerId?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `payload` | [`ContentTypeWorkflowUpdateRequest`](../wiki/index.%3Cinternal%3E#contenttypeworkflowupdaterequest) | `undefined` |
| `contentType` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) | `undefined` |
| `siteId` | `string` | `undefined` |
| `containerId` | [`ALERT_CONTAINER_IDS`](../wiki/index.%3Cinternal%3E.ALERT_CONTAINER_IDS) | `ALERT_CONTAINER_IDS.update` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:312

___

### updateField

▸ **updateField**(`updatedField`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `updatedField` | [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail) |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:432

___

### updateFieldCompartment

▸ **updateFieldCompartment**(`fieldUuid`, `targetCompartmentUuid`, `sourcePosition`, `targetPosition`, `moveFieldToCompartment`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldUuid` | `string` |
| `targetCompartmentUuid` | `string` |
| `sourcePosition` | `number` |
| `targetPosition` | `number` |
| `moveFieldToCompartment` | `boolean` |

#### Returns

`void`

#### Defined in

public/lib/store/contentTypes/contentTypes.facade.ts:517
