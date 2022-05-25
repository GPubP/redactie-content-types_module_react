# Class: MetadataQuery

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).MetadataQuery

## Hierarchy

- `BaseEntityQuery`<[`MetadataState`](../wiki/index.%3Cinternal%3E.MetadataState)\>

  ↳ **`MetadataQuery`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.MetadataQuery#constructor)

### Properties

- [metadata$](../wiki/index.%3Cinternal%3E.MetadataQuery#metadata$)
- [store](../wiki/index.%3Cinternal%3E.MetadataQuery#store)

## Constructors

### constructor

• **new MetadataQuery**(`store`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`MetadataStore`](../wiki/index.%3Cinternal%3E.MetadataStore) |

#### Overrides

BaseEntityQuery&lt;MetadataState\&gt;.constructor

#### Defined in

public/lib/store/metadata/metadata.query.ts:7

## Properties

### metadata$

• **metadata$**: `Observable`<[`MetadataResponse`](../wiki/index.%3Cinternal%3E.MetadataResponse)[]\>

#### Defined in

public/lib/store/metadata/metadata.query.ts:11

___

### store

• `Protected` **store**: [`MetadataStore`](../wiki/index.%3Cinternal%3E.MetadataStore)

#### Inherited from

BaseEntityQuery.store
