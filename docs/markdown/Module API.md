# Module: Module API

## Table of contents

### Variables

- [helpers](../wiki/Module%20API#helpers-1)
- [hooks](../wiki/Module%20API#hooks-1)
- [store](../wiki/Module%20API#store-1)
- [views](../wiki/Module%20API#views-1)

### Functions

- [parseFields](../wiki/Module%20API#parsefields-1)
- [registerCTDetailTab](../wiki/Module%20API#registerctdetailtab-1)

## Variables

### helpers

• `Const` **helpers**: [`ContentTypeAPI`](../wiki/index.ContentTypeAPI)[``"helpers"``]

#### Defined in

public/lib/api/helpers.ts:15

___

### hooks

• `Const` **hooks**: [`ContentTypeAPI`](../wiki/index.ContentTypeAPI)[``"hooks"``]

#### Defined in

public/lib/api/hooks.ts:16

___

### store

• `Const` **store**: [`ContentTypeAPI`](../wiki/index.ContentTypeAPI)[``"store"``]

#### Defined in

public/lib/api/store.ts:11

___

### views

• `Const` **views**: [`ContentTypeAPI`](../wiki/index.ContentTypeAPI)[``"views"``]

#### Defined in

public/lib/api/views.ts:8

## Functions

### parseFields

▸ **parseFields**(`fields?`, `options?`): `FieldSchema`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields?` | `ContentTypeFieldSchema`[] |
| `options?` | `ParseFieldsOptions` |

#### Returns

`FieldSchema`[]

#### Defined in

public/lib/api/api.ts:12

___

### registerCTDetailTab

▸ **registerCTDetailTab**(`name`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `options` | [`ExternalTabOptions`](../wiki/index.ExternalTabOptions) |

#### Returns

`void`

#### Defined in

public/lib/api/registerCTDetailTab.ts:3
