# Class: FieldTypesListQuery

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).FieldTypesListQuery

## Hierarchy

- `CacheEntityQuery`<`any`, [`FieldTypesListState`](../wiki/index.%3Cinternal%3E#fieldtypesliststate)\>

  ↳ **`FieldTypesListQuery`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.FieldTypesListQuery#constructor)

### Properties

- [fieldTypes$](../wiki/index.%3Cinternal%3E.FieldTypesListQuery#fieldtypes$)
- [store](../wiki/index.%3Cinternal%3E.FieldTypesListQuery#store)

## Constructors

### constructor

• **new FieldTypesListQuery**(`store`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`FieldTypesListStore`](../wiki/index.%3Cinternal%3E.FieldTypesListStore) |

#### Overrides

CacheEntityQuery&lt;any, FieldTypesListState\&gt;.constructor

#### Defined in

public/lib/store/fieldTypes/list/fieldTypes-list.query.ts:7

## Properties

### fieldTypes$

• **fieldTypes$**: `Observable`<[`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)[]\>

#### Defined in

public/lib/store/fieldTypes/list/fieldTypes-list.query.ts:11

___

### store

• `Protected` **store**: [`FieldTypesListStore`](../wiki/index.%3Cinternal%3E.FieldTypesListStore)

#### Inherited from

CacheEntityQuery.store
