# Class: FieldTypesFacade

[index](../wiki/index).[<internal>](../wiki/index.%3Cinternal%3E).FieldTypesFacade

## Table of contents

### Constructors

- [constructor](../wiki/index.%3Cinternal%3E.FieldTypesFacade#constructor)

### Properties

- [activeFieldType$](../wiki/index.%3Cinternal%3E.FieldTypesFacade#activefieldtype$)
- [activeFieldTypeUI$](../wiki/index.%3Cinternal%3E.FieldTypesFacade#activefieldtypeui$)
- [detailQuery](../wiki/index.%3Cinternal%3E.FieldTypesFacade#detailquery)
- [detailStore](../wiki/index.%3Cinternal%3E.FieldTypesFacade#detailstore)
- [fieldTypes$](../wiki/index.%3Cinternal%3E.FieldTypesFacade#fieldtypes$)
- [isFetching$](../wiki/index.%3Cinternal%3E.FieldTypesFacade#isfetching$)
- [listError$](../wiki/index.%3Cinternal%3E.FieldTypesFacade#listerror$)
- [listQuery](../wiki/index.%3Cinternal%3E.FieldTypesFacade#listquery)
- [listStore](../wiki/index.%3Cinternal%3E.FieldTypesFacade#liststore)
- [service](../wiki/index.%3Cinternal%3E.FieldTypesFacade#service)

### Methods

- [getFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#getfieldtype)
- [getFieldTypes](../wiki/index.%3Cinternal%3E.FieldTypesFacade#getfieldtypes)
- [hasActiveFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#hasactivefieldtype)
- [hasFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#hasfieldtype)
- [removeActiveFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#removeactivefieldtype)
- [selectFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#selectfieldtype)
- [selectFieldTypeUIState](../wiki/index.%3Cinternal%3E.FieldTypesFacade#selectfieldtypeuistate)
- [setActiveFieldType](../wiki/index.%3Cinternal%3E.FieldTypesFacade#setactivefieldtype)

## Constructors

### constructor

• **new FieldTypesFacade**(`listStore`, `listQuery`, `detailStore`, `detailQuery`, `service`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listStore` | [`FieldTypesListStore`](../wiki/index.%3Cinternal%3E.FieldTypesListStore) |
| `listQuery` | [`FieldTypesListQuery`](../wiki/index.%3Cinternal%3E.FieldTypesListQuery) |
| `detailStore` | [`FieldTypesDetailStore`](../wiki/index.%3Cinternal%3E.FieldTypesDetailStore) |
| `detailQuery` | [`FieldTypesDetailQuery`](../wiki/index.%3Cinternal%3E.FieldTypesDetailQuery) |
| `service` | [`FieldTypesApiService`](../wiki/index.%3Cinternal%3E.FieldTypesApiService) |

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:26

## Properties

### activeFieldType$

• `Readonly` **activeFieldType$**: `Observable`<[`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:40

___

### activeFieldTypeUI$

• `Readonly` **activeFieldTypeUI$**: `Observable`<`CacheEntityUI`\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:43

___

### detailQuery

• `Protected` **detailQuery**: [`FieldTypesDetailQuery`](../wiki/index.%3Cinternal%3E.FieldTypesDetailQuery)

___

### detailStore

• `Protected` **detailStore**: [`FieldTypesDetailStore`](../wiki/index.%3Cinternal%3E.FieldTypesDetailStore)

___

### fieldTypes$

• `Readonly` **fieldTypes$**: `Observable`<[`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)[]\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:35

___

### isFetching$

• `Readonly` **isFetching$**: `Observable`<`boolean`\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:37

___

### listError$

• `Readonly` **listError$**: `Observable`<`any`\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:36

___

### listQuery

• `Protected` **listQuery**: [`FieldTypesListQuery`](../wiki/index.%3Cinternal%3E.FieldTypesListQuery)

___

### listStore

• `Protected` **listStore**: [`FieldTypesListStore`](../wiki/index.%3Cinternal%3E.FieldTypesListStore)

___

### service

• `Protected` **service**: [`FieldTypesApiService`](../wiki/index.%3Cinternal%3E.FieldTypesApiService)

## Methods

### getFieldType

▸ **getFieldType**(`fieldTypeId`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |
| `options?` | [`GetFieldTypePayloadOptions`](../wiki/index.%3Cinternal%3E.GetFieldTypePayloadOptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:112

___

### getFieldTypes

▸ **getFieldTypes**(`searchParams?`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `searchParams?` | `SearchParams` |
| `options` | [`GetFieldTypesPayloadOptions`](../wiki/index.%3Cinternal%3E.GetFieldTypesPayloadOptions) |

#### Returns

`void`

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:56

___

### hasActiveFieldType

▸ **hasActiveFieldType**(`fieldTypeId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |

#### Returns

`boolean`

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:104

___

### hasFieldType

▸ **hasFieldType**(`fieldTypeId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |

#### Returns

`boolean`

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:108

___

### removeActiveFieldType

▸ **removeActiveFieldType**(): `void`

#### Returns

`void`

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:99

___

### selectFieldType

▸ **selectFieldType**(`fieldTypeId`): `Observable`<[`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |

#### Returns

`Observable`<[`FieldType`](../wiki/index.%3Cinternal%3E.FieldType)\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:50

___

### selectFieldTypeUIState

▸ **selectFieldTypeUIState**(`fieldTypeId`): `Observable`<`CacheEntityUI`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |

#### Returns

`Observable`<`CacheEntityUI`\>

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:47

___

### setActiveFieldType

▸ **setActiveFieldType**(`fieldTypeId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fieldTypeId` | `string` |

#### Returns

`void`

#### Defined in

public/lib/store/fieldTypes/fieldTypes.facade.ts:94
