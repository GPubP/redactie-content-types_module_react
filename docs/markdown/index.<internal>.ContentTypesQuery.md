# Class: ContentTypesQuery

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentTypesQuery

## Hierarchy

- `BaseEntityQuery`<[`ContentTypesState`](../wiki/index.%3Cinternal%3E.ContentTypesState)\>

  ↳ **`ContentTypesQuery`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.ContentTypesQuery#constructor)

### Properties

- [activeField$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#activefield$)
- [contentType$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#contenttype$)
- [contentTypes$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#contenttypes$)
- [fieldsByCompartments$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#fieldsbycompartments$)
- [isFetchingSiteModulesConfig$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#isfetchingsitemodulesconfig$)
- [isFetchingSiteOccurrences$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#isfetchingsiteoccurrences$)
- [isRemoving$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#isremoving$)
- [meta$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#meta$)
- [siteOccurrences$](../wiki/index.%3Cinternal%3E.ContentTypesQuery#siteoccurrences$)
- [store](../wiki/index.%3Cinternal%3E.ContentTypesQuery#store)

## Constructors

### constructor

• **new ContentTypesQuery**(`store`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`ContentTypesStore`](../wiki/index.%3Cinternal%3E.ContentTypesStore) |

#### Overrides

BaseEntityQuery&lt;ContentTypesState\&gt;.constructor

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:11

## Properties

### activeField$

• **activeField$**: `Observable`<`undefined` \| [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:34

___

### contentType$

• **contentType$**: `Observable`<`undefined` \| [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:19

___

### contentTypes$

• **contentTypes$**: `Observable`<[`ContentTypeResponse`](../wiki/index.%3Cinternal%3E.ContentTypeResponse)[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:18

___

### fieldsByCompartments$

• **fieldsByCompartments$**: `Observable`<[`FieldsByCompartment`](../wiki/index.%3Cinternal%3E.FieldsByCompartment)[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:36

___

### isFetchingSiteModulesConfig$

• **isFetchingSiteModulesConfig$**: `Observable`<`any`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:27

___

### isFetchingSiteOccurrences$

• **isFetchingSiteOccurrences$**: `Observable`<`LoadingState`\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:30

___

### isRemoving$

• **isRemoving$**: `Observable`<`LoadingState`\>

#### Overrides

BaseEntityQuery.isRemoving$

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:23

___

### meta$

• **meta$**: `Observable`<`undefined` \| [`ContentTypePaging`](../wiki/index.%3Cinternal%3E.ContentTypePaging)\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:15

___

### siteOccurrences$

• **siteOccurrences$**: `Observable`<`SiteResponse`[]\>

#### Defined in

public/lib/store/contentTypes/contentTypes.query.ts:20

___

### store

• `Protected` **store**: [`ContentTypesStore`](../wiki/index.%3Cinternal%3E.ContentTypesStore)

#### Inherited from

BaseEntityQuery.store
