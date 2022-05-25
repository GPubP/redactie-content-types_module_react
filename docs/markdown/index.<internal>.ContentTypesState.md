# Interface: ContentTypesState

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).ContentTypesState

## Hierarchy

- `BaseEntityState`<[`ContentTypeModel`](../wiki/index.%3Cinternal%3E#contenttypemodel), `string`\>

  ↳ **`ContentTypesState`**

## Table of contents

### Properties

- [activeField](../wiki/index.%3Cinternal%3E.ContentTypesState#activefield)
- [contentType](../wiki/index.%3Cinternal%3E.ContentTypesState#contenttype)
- [isFetchingOccurrences](../wiki/index.%3Cinternal%3E.ContentTypesState#isfetchingoccurrences)
- [isRemoving](../wiki/index.%3Cinternal%3E.ContentTypesState#isremoving)
- [meta](../wiki/index.%3Cinternal%3E.ContentTypesState#meta)
- [siteOccurences](../wiki/index.%3Cinternal%3E.ContentTypesState#siteoccurences)

## Properties

### activeField

• `Optional` **activeField**: [`ContentTypeFieldDetail`](../wiki/index.%3Cinternal%3E#contenttypefielddetail)

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:18

___

### contentType

• `Optional` **contentType**: [`ContentTypeDetailResponse`](../wiki/index.%3Cinternal%3E.ContentTypeDetailResponse)

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:17

___

### isFetchingOccurrences

• **isFetchingOccurrences**: `boolean`

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:20

___

### isRemoving

• **isRemoving**: `boolean`

#### Overrides

BaseEntityState.isRemoving

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:21

___

### meta

• `Optional` **meta**: [`ContentTypePaging`](../wiki/index.%3Cinternal%3E.ContentTypePaging)

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:16

___

### siteOccurences

• **siteOccurences**: `SiteResponse`[]

#### Defined in

public/lib/store/contentTypes/contentTypes.model.ts:19
