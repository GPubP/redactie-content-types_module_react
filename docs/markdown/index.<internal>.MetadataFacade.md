# Class: MetadataFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).MetadataFacade

## Hierarchy

- `BaseEntityFacade`<[`MetadataStore`](../wiki/index.%3Cinternal%3E.MetadataStore), [`MetadataApiService`](../wiki/index.%3Cinternal%3E.MetadataApiService), [`MetadataQuery`](../wiki/index.%3Cinternal%3E.MetadataQuery)\>

  ↳ **`MetadataFacade`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.MetadataFacade#constructor)

### Properties

- [metadata$](../wiki/index.%3Cinternal%3E.MetadataFacade#metadata$)

### Methods

- [createMetadata](../wiki/index.%3Cinternal%3E.MetadataFacade#createmetadata)
- [updateMetadata](../wiki/index.%3Cinternal%3E.MetadataFacade#updatemetadata)

## Constructors

### constructor

• **new MetadataFacade**(`store`, `service`, `query`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`MetadataStore`](../wiki/index.%3Cinternal%3E.MetadataStore) |
| `service` | [`MetadataApiService`](../wiki/index.%3Cinternal%3E.MetadataApiService) |
| `query` | [`MetadataQuery`](../wiki/index.%3Cinternal%3E.MetadataQuery) |

#### Overrides

BaseEntityFacade&lt;
	MetadataStore,
	MetadataApiService,
	MetadataQuery
\&gt;.constructor

#### Defined in

public/lib/store/metadata/metadata.facade.ts:23

## Properties

### metadata$

• `Readonly` **metadata$**: `Observable`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)[]\>

#### Defined in

public/lib/store/metadata/metadata.facade.ts:21

## Methods

### createMetadata

▸ **createMetadata**(`siteId`, `contentType`, `payload`, `containerId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentType` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) |
| `payload` | [`MetadataCreateRequest`](../wiki/index.%3Cinternal%3E#metadatacreaterequest) |
| `containerId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/metadata/metadata.facade.ts:27

___

### updateMetadata

▸ **updateMetadata**(`siteId`, `contentType`, `metadataId`, `payload`, `containerId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentType` | [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse) |
| `metadataId` | `string` |
| `payload` | [`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse) |
| `containerId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/metadata/metadata.facade.ts:57
