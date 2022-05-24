# Class: ContentTypesApiService

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentTypesApiService

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentTypesApiService#constructor)

### Methods

- [createContentType](../wiki/index.%3Cinternal%3E.ContentTypesApiService#createcontenttype)
- [getContentType](../wiki/index.%3Cinternal%3E.ContentTypesApiService#getcontenttype)
- [getContentTypeSiteOccurrences](../wiki/index.%3Cinternal%3E.ContentTypesApiService#getcontenttypesiteoccurrences)
- [getContentTypes](../wiki/index.%3Cinternal%3E.ContentTypesApiService#getcontenttypes)
- [getSiteContentType](../wiki/index.%3Cinternal%3E.ContentTypesApiService#getsitecontenttype)
- [getSiteTenantContentTypes](../wiki/index.%3Cinternal%3E.ContentTypesApiService#getsitetenantcontenttypes)
- [parseContentTypeFields](../wiki/index.%3Cinternal%3E.ContentTypesApiService#parsecontenttypefields)
- [removeContentType](../wiki/index.%3Cinternal%3E.ContentTypesApiService#removecontenttype)
- [updateContentType](../wiki/index.%3Cinternal%3E.ContentTypesApiService#updatecontenttype)
- [updateContentTypeSiteWorkflow](../wiki/index.%3Cinternal%3E.ContentTypesApiService#updatecontenttypesiteworkflow)

## Constructors

### constructor

• **new ContentTypesApiService**()

## Methods

### createContentType

▸ **createContentType**(`contentType`): `Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeCreateRequest`](../wiki/index.%3Cinternal%3E.ContentTypeCreateRequest) |

#### Returns

`Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:166

___

### getContentType

▸ **getContentType**(`uuid`): `Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:94

___

### getContentTypeSiteOccurrences

▸ **getContentTypeSiteOccurrences**(`uuid`): `Promise`<`SitesResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`Promise`<`SitesResponse`\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:107

___

### getContentTypes

▸ **getContentTypes**(`searchParams?`): `Promise`<``null`` \| [`ContentTypesResponse`](../wiki/index.ContentTypesResponse)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `searchParams` | `SearchParams` | `DEFAULT_CONTENT_TYPES_SEARCH_PARAMS` |

#### Returns

`Promise`<``null`` \| [`ContentTypesResponse`](../wiki/index.ContentTypesResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:51

___

### getSiteContentType

▸ **getSiteContentType**(`siteUuid`, `contentTypeUuid`): `Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteUuid` | `string` |
| `contentTypeUuid` | `string` |

#### Returns

`Promise`<``null`` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:115

___

### getSiteTenantContentTypes

▸ **getSiteTenantContentTypes**(`siteId`, `searchParams?`): `Promise`<``null`` \| [`ContentTypesResponse`](../wiki/index.ContentTypesResponse)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `siteId` | `string` | `undefined` |
| `searchParams` | `SearchParams` | `DEFAULT_CONTENT_TYPES_SEARCH_PARAMS` |

#### Returns

`Promise`<``null`` \| [`ContentTypesResponse`](../wiki/index.ContentTypesResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:70

___

### parseContentTypeFields

▸ **parseContentTypeFields**(`fields`, `detailedFields`): [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`ContentTypeField`](../wiki/index.%3Cinternal%3E#contenttypefield)[] |
| `detailedFields` | [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)[] |

#### Returns

[`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)[]

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:37

___

### removeContentType

▸ **removeContentType**(`contentTypeUuid`): `Promise`<`Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentTypeUuid` | `string` |

#### Returns

`Promise`<`Response`\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:178

___

### updateContentType

▸ **updateContentType**(`contentType`): `Promise`<``null`` \| [`ContentTypeResponse`](../wiki/index.%3Cinternal%3E.ContentTypeResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contentType` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) |

#### Returns

`Promise`<``null`` \| [`ContentTypeResponse`](../wiki/index.%3Cinternal%3E.ContentTypeResponse)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:133

___

### updateContentTypeSiteWorkflow

▸ **updateContentTypeSiteWorkflow**(`payload`, `contentTypeId`, `siteId`): `Promise`<``null`` \| [`ModuleSettings`](../wiki/index.%3Cinternal%3E.ModuleSettings)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`ContentTypeWorkflowUpdateRequest`](../wiki/index.%3Cinternal%3E#contenttypeworkflowupdaterequest) |
| `contentTypeId` | `string` |
| `siteId` | `string` |

#### Returns

`Promise`<``null`` \| [`ModuleSettings`](../wiki/index.%3Cinternal%3E.ModuleSettings)\>

#### Defined in

public/lib/services/contentTypes/contentTypes.service.ts:149
