# Class: PresetsListQuery

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).PresetsListQuery

## Hierarchy

- `CacheEntityQuery`<`any`, [`PresetsListState`](../wiki/index.%3Cinternal%3E#presetsliststate)\>

  ↳ **`PresetsListQuery`**

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.PresetsListQuery#constructor)

### Properties

- [detailQuery](../wiki/index.%3Cinternal%3E.PresetsListQuery#detailquery)
- [presets$](../wiki/index.%3Cinternal%3E.PresetsListQuery#presets$)
- [store](../wiki/index.%3Cinternal%3E.PresetsListQuery#store)

### Methods

- [getIsFetching](../wiki/index.%3Cinternal%3E.PresetsListQuery#getisfetching)
- [selectUIState](../wiki/index.%3Cinternal%3E.PresetsListQuery#selectuistate)

## Constructors

### constructor

• **new PresetsListQuery**(`store`, `detailQuery`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`PresetsListStore`](../wiki/index.%3Cinternal%3E.PresetsListStore) |
| `detailQuery` | [`PresetsDetailQuery`](../wiki/index.%3Cinternal%3E.PresetsDetailQuery) |

#### Overrides

CacheEntityQuery&lt;any, PresetsListState\&gt;.constructor

#### Defined in

public/lib/store/presets/list/presets-list.query.ts:13

## Properties

### detailQuery

• `Protected` **detailQuery**: [`PresetsDetailQuery`](../wiki/index.%3Cinternal%3E.PresetsDetailQuery)

___

### presets$

• **presets$**: `Observable`<[`Preset`](../wiki/index.%3Cinternal%3E#preset)[]\>

#### Defined in

public/lib/store/presets/list/presets-list.query.ts:17

___

### store

• `Protected` **store**: [`PresetsListStore`](../wiki/index.%3Cinternal%3E.PresetsListStore)

#### Inherited from

CacheEntityQuery.store

## Methods

### getIsFetching

▸ **getIsFetching**(): `boolean`

#### Returns

`boolean`

#### Defined in

public/lib/store/presets/list/presets-list.query.ts:19

___

### selectUIState

▸ **selectUIState**(): `Observable`<[`PresetUIModel`](../wiki/index.%3Cinternal%3E.PresetUIModel)\>

#### Returns

`Observable`<[`PresetUIModel`](../wiki/index.%3Cinternal%3E.PresetUIModel)\>

#### Defined in

public/lib/store/presets/list/presets-list.query.ts:23
