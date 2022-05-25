# Class: MetadataApiService

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).MetadataApiService

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.MetadataApiService#constructor)

### Methods

- [createMetadata](../wiki/index.%3Cinternal%3E.MetadataApiService#createmetadata)
- [updateMetadata](../wiki/index.%3Cinternal%3E.MetadataApiService#updatemetadata)

## Constructors

### constructor

• **new MetadataApiService**()

## Methods

### createMetadata

▸ **createMetadata**(`siteId`, `contentTypeId`, `payload`): `Promise`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentTypeId` | `string` |
| `payload` | [`MetadataCreateRequest`](../wiki/index.%3Cinternal%3E#metadatacreaterequest) |

#### Returns

`Promise`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)\>

#### Defined in

public/lib/services/metadata/metadata.service.ts:11

___

### updateMetadata

▸ **updateMetadata**(`siteId`, `contentTypeId`, `metadataId`, `payload`): `Promise`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `siteId` | `string` |
| `contentTypeId` | `string` |
| `metadataId` | `string` |
| `payload` | [`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse) |

#### Returns

`Promise`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)\>

#### Defined in

public/lib/services/metadata/metadata.service.ts:26
