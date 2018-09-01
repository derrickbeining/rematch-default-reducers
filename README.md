# Rematch Default Reducers

[![npm](https://img.shields.io/npm/v/rematch-default-reducers.svg?style=flat)](https://www.npmjs.com/package/rematch-default-reducers)
[![codecov](https://codecov.io/gh/derrickbeining/rematch-default-reducers/branch/master/graph/badge.svg)](https://codecov.io/gh/derrickbeining/rematch-default-reducers)
[![Build Status](https://travis-ci.com/derrickbeining/rematch-default-reducers.svg?branch=master)](https://travis-ci.com/derrickbeining/rematch-default-reducers)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[rematch](https://rematch.gitbooks.io/rematch/#getting-started) makes working
with [redux](https://redux.js.org/) a breeze, but there's still a bit of
boilerlate that needs to be automated: _reducers_ (or "actions" as I call them).

If you're tired of writing reducers like `setThing`, `addThing`, `removeThing`,
or `resetThing` for every single piece of state, then this library is for you.

---

## Installation

```sh
npm install --save rematch-default-reducers
```

## Usage:

```javascript
import {init} from '@rematch/core'
import {withDefaultReducers} from 'rematch-default-reducers'
import {tonsOfModelsWithTonsOfState} from '../models'

export default init({
  models: withDefaultReducers(tonsOfModelsWithTonsOfState),
})
```

---

## Documentation

Below is the API for `withDefaultReducers` and the reducers it generates.

- [`withDefaultReducers(models, [opts])`](#withdefaultreducersmodels-opts)
- [`dispatch.${modelName}.set(payload, [meta])`](#dispatchmodelnamesetpayload-meta)
- [`dispatch.${modelName}.reset()`](#dispatchmodelnamereset)
- [`dispatch.rootState.reset()`](#dispatchrootstatereset)
- [**When `${modelName}.state` is a `{}`-Object**](#when-modelnamestate-is-a--object)

  - [`dispatch.${modelName}.set${PropName}(payload, [meta])`](#dispatchmodelnamesetpropnamepayload-meta)
  - [`dispatch.${modelName}.reset${PropName}`](#dispatchmodelnameresetpropname)
  - [**Extra Reducers for `Array` Type Properties**](#extra-reducers-for-array-type-properties)

- [**When `${modelName}.state` is `[]` (`Array`)**](#when-modelnamestate-is--array)

---

### `withDefaultReducers(models, [opts])`

> the named and only export of `rematch-default-reducer`

- `models: {[modelName]: {state: any, reducers?: {[reducerName]: function}}}`
  - the `models` config expected by `init()` from `@rematch/core`
  - `state` may not contain `null` or `undefined` values, or else `TypeError`
    will be thrown. `null`/`undefined` may be allowed by passing
    `{allowNil: true}` as `opts`
- `opts?: {allowNil, typeCheck}`
  - `allowNil?: boolean` (default: `true`) - if `false`, models' `state` may
    contain `null`/`undefined`, but reducers will not be generated for those
    slices of the `redux` store
  - `typeCheck?: boolean` (default: `true`) - if `false`, default reducer
    actions will not perform type checking to ensure `payload`s preserve the
    type/interface the model was initialized with.

---

### **Common Default Reducers**

> these default reducers are provided for all models

#### `dispatch.${modelName}.set(payload, [meta])`

- `payload`: `any` (required) - the value to set `${modelName}.state` to

- `meta?: {typeCheck?: boolean}` (optional) - options for the currently
  dispatched action
  - `typeCheck?: boolean` (optional) - enables/disables type-checking that
    prevents `set` from altering the type/interface of the model. **Default:
    `true`**.

When `${modelName}.state` is a `{}`-Object

- `set` performs a **deep merge** between `state` and `payload`.

When `${modelName}.state` is **NOT** a `{}`-Object

- `set` overwrites `model.state` with the value of `payload`

> **Note**: If the `payload` of `set` would alter the type/interface with which
> `${modelName}.state` was initialized, then a `TypeError` will be thrown,
> unless `{typeCheck: false}` has been passed as an option to
> `withDefaultReducers` or as a `meta` option to `dispatch.${modelName}.set`.

---

#### `dispatch.${modelName}.reset()`

Sets `${modelName}.state` to the value it was initialized with.

---

### **The `rootState` Model and Reducers**

> `withDefaultReducers` adds a pseudo-model called `rootState`. It has no
> `state` of its own, and only exists to provide a couple default reducers for
> performing updates across multiple models in a single action.

#### `dispatch.rootState.set(payload, [meta])`

- `payload: {[modelName: string]: any}` - an updater object which will
  effectively be deep-merged with the `redux` store in order to produce the next
  state in a single action.
- `meta?: {typeCheck?: boolean}` (optional) - options for the currently
  dispatched action
  - `typeCheck?: boolean` (optional) - enables/disables type-checking that
    prevents `set` from altering the type/interface of the model. **Default:
    `true`**.

---

#### `dispatch.rootState.reset()`

Resets all models back to their initial state.

---

---

---

### **When `${modelName}.state` is a `{}`-Object**

When a model's `state` is a `{}`-Object, default reducers are generated for each
property of a model's `state`, in addition to [`dispatch.${modelName}.set`]()
and [`dispatch.${modelName}.reset`](). The reducer names are auto-generated
based on the property's name and follow a camel-case naming convention.

---

#### `dispatch.${modelName}.set${PropName}(payload, [meta])`

- `payload` (type depends on property's intial state) - the value with which to
  update the the property

- `meta?: {typeCheck?: boolean}` (optional) - options for the currently
  dispatched action
  - `typeCheck?: boolean` (optional) - enables/disables type-checking that
    prevents `set${PropName}` from altering the type/interface of the model.
    **Default: `true`**.

If the property being set is a `{}`-Object, then it set the property to the
result of performing a **deep merge** between the property's current state and
the `payload`.

Otherwise, it simply overwrites the value of the property with `payload`.

> **Note**: If the `payload` of `set${PropName}` would alter the type/interface
> with which `${modelName}.state` was initialized, then a `TypeError` will be
> thrown, unless `{typeCheck: false}` has been passed as an option to
> `withDefaultReducers` or as a `meta` option to
> `dispatch.${modelName}.set${PropName}`.

**Example:**

```js
const {dispatch, getState} = init({
  models: withDefaultReducers({
    user: {
      state: {
        name: '',
        things: [],
        address: {
          street: {
            primary: '',
            secondary: '',
          },
          city: ''
          state: '',
        },
      },
    },
  }),
})

dispatch.user.setAddress({
  street: { primary: '123 ABC Lane'}
})

dispatch.user.setName('Anderson')

dispatch.user.setThings(['thing1', 'thing2'])

getState().user
/* {
      name: 'Anderson',
      things: ['thing1', 'thing2'],
      address: {
        street: {
          primary: '123 ABC Lane',
          secondary: '',
        },
        city: ''
        state: '',
    }
} */
```

---

#### `dispatch.${modelName}.reset${PropName}`

Resets the property to its initial state

---

#### **Extra Reducers for `Array` Type Properties**

When a property of `${modelName}.state` is an `Array`, that property gets
several other reducers in addition to
[`set${PropName}`](#dispatchmodelnamesetpropnamepayload-meta) and
[`reset${PropName}`](#dispatchmodelnameresetpropname).

For the sake of example and readability, let's assume that we have store
initialized like so:

```js
const {dispatch, getState} = init({
  models: withDefaultReducers({
    myModel: {
      state: {things: []},
    },
  }),
})
```

The following reducers would be generated:

- [`dispatch.myModel.concatThings(payload: any[])`](#dispatchmymodelconcatthingspayload-any)
- [`dispatch.myModel.concatThingsTo(payload: any[])`](#dispatchmymodelconcatthingstopayload-any)
- [`dispatch.myModel.filterThings(payload: { where })`](#dispatchmymodelfilterthingspayload--where)
- [`dispatch.myModel.insertThing(payload: { where, payload })`](#dispatchmymodelinsertthingpayload--where-payload)
- [`dispatch.myModel.insertThings(payload: { where, payload })`](#dispatchmymodelinsertthingspayload--where-payload)
- [`dispatch.myModel.mapThings(mapFn)`](#dispatchmymodelmapthingsmapfn)
- [`dispatch.myModel.popThings(n?: number)`](#dispatchmymodelpopthingsn-number)
- [`dispatch.myModel.pushThing(payload: any)`](#dispatchmymodelpushthingpayload-any)
- [`dispatch.myModel.removeThing(payload: any)`](#dispatchmymodelremovethingpayload-any)
- [`dispatch.myModel.removeThing(payload: { where })`](#dispatchmymodelremovethingpayload--where)
- [`dispatch.myModel.removeThings(payload: { where })`](#dispatchmymodelremovethingspayload--where)
- [`dispatch.myModel.replaceThing(payload: { where, payload })`](#dispatchmymodelreplacethingpayload--where-payload)
- [`dispatch.myModel.shiftThings(n?: number)`](#dispatchmymodelshiftthingsn-number)
- [`dispatch.myModel.unshiftThing(payload: any)`](#dispatchmymodelunshiftthingpayload-any)

> Take note that some reducers refer to the property name in the singular and
> some in the plural.

---

#### `dispatch.myModel.concatThings(payload: any[])`

- `payload: any[]`

Sets `myModel.state.things` to the result of concatentating `payload` to the end
of `myModel.state.things`

**Example:**

```js
store.getState().myModel.things // => ['world']
dispatch.myModel.concatThings(['hello'])
store.getState().myModel.things // => ['world', 'hello']
```

---

#### `dispatch.myModel.concatThingsTo(payload: any[])`

- `payload: any[]`

Sets `myModel.state.things` to the result of concatenating
`myModel.state.things` to the end of `payload`

**Example:**

```js
store.getState().myModel.things // => ['world']
dispatch.myModel.concatThingsTo(['henlo'])
store.getState().myModel.things // => ['henlo', 'world']
```

---

#### `dispatch.myModel.filterThings(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Filters `myModel.state.things` down to the elements that return `true` when
passed to the predicate function on `payload.where` along with the element's
`index`.

**Example:**

```js
store.getState().myModel.things // ['blah', 4, 'blah]
dispatch.myModel.filterThings({where: (el, i) => typeof el === 'string'})
store.getState().myModel.things // ['blah', 'blah]
```

---

#### `dispatch.myModel.insertThing(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`
- `payload.payload: any`

**Note singular** | Inserts `payload.payload` at the first index where
`payload.where` returns `true`. Pre-existing elements from that index onwards
have their indexes incremented by one.

**Example:**

```js
getState().myModel.things // => [{name: 'George'}, {name: 'Abe'}]
dispatch.myModel.insertThing({where: (el, i) => i === 1, {name: 'Ben'}})
getState().myModel.things // => [{name: 'George'}, {name: 'Ben'}}, {name: 'Abe'}]
```

---

#### `dispatch.myModel.insertThings(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`

* `payload.payload: any[]`

Inserts the contents of `payload.payload` starting at the first index where
`payload.where` returns `true`. Pre-existing elements from that index onwards
have their indexes incremented by the length of `payload.payload`.

**Example:**

```js
getState().myModel.things // => [1, 2, 3]
dispatch.myModel.insertThings({where: (el, i) => i === 1, [4, 5, 6]})
getState().myModel.things // => [1, 4, 5, 6, 2, 3]
```

---

#### `dispatch.myModel.mapThings(mapFn)`

- `mapFn: function(elmt: any, index: number): any`

Sets `myModel.things` to the array returned from `mapFn`. Behaves mostly like
`Array.prototype.map`, except it only has arity 1 and `mapFn` has only arity 2.

**Example:**

```js
store.getState().myModel.things // => ['henlo', 'world']
dispatch.myModel.mapThings((el, idx) => el.toUpperCase())
store.getState().myModel.things // => ['HENLO', 'WORLD']
```

---

#### `dispatch.myModel.popThings(n?: number)`

- `n?: number` (optional) - number of elements to "pop" from list. **Default:
  1**

Sets `myModel.things` to a copy of itself with the last `n` elements removed.

**Example:**

```js
store.getState().myModel.things // => [1, 2, 3, 4, 5]
dispatch.myModel.popThings()
store.getState().myModel.things // => [1, 2, 3, 4]
dispatch.myModel.popThings(2)
store.getState().myModel.things // => [1, 2]
```

---

#### `dispatch.myModel.pushThing(payload: any)`

- `payload: any` - the value to append to the end of the list

Sets `myModel.things` to a copy of itself with `payload` appended as the last
element.

To append multiple elements see
[dispatch.myModel.concatThings](#dispatchmymodelconcatthingspayload).

**Example:**

```js
store.getState().myModel.things // => [1, 2, 3]
dispatch.myModel.pushThing(4)
store.getState().myModel.things // => [1, 2, 3, 4]
```

---

#### `dispatch.myModel.removeThing(payload: any)`

- `payload: any` - the value to remove

Sets `myModel.things` to a copy of itself omitting the first element found to be
strictly equal (`===`) to `payload`.

**Example:**

```js
const [george] = getState().myModel.things // => [{name: 'George'}, {name: 'Abe'}]
dispatch.myModel.removeThing(george)
getState().myModel.things // => [{name: 'Abe'}]
```

---

#### `dispatch.myModel.removeThing(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Sets `myModel.things` to a copy of itself omitting the first element for which
`payload.where` returns `true`.

**Example:**

```js
getState().myModel.things // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.removeThing({where: (el, idx) => el.length < 3})
getState().myModel.things // => ["won't", 'you', 'my', 'neighbor?']
```

---

#### `dispatch.myModel.removeThings(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Sets `myModel.things` to a copy of itself omitting **all** elements for which
`payload.where` returns `true`.

**Example:**

```js
getState().myModel.things // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.removeThings({where: (el, idx) => el.length < 3})
getState().myModel.things // => ["won't", 'you', 'neighbor?']
```

---

#### `dispatch.myModel.replaceThing(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`
- `payload.payload: any`

Sets `myModel.things` to a copy of itself with the first element for which
`payload.where` returns `true` replaced with the value of `payload.payload`.

**Example:**

```js
getState().myModel.things // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.replaceThing({where: (el, idx) => el.length < 3, 'find'})
getState().myModel.things // => ["won't", 'you', 'find', 'my', 'neighbor?']
```

---

#### `dispatch.myModel.shiftThings(n?: number)`

- `n?: number` (optional) - the number of elements to remove from the front of
  the list. **Default: 1**

Sets `myModel.things` to a copy of itself with the first `n` elements removed.

**Example:**

```js
getState().myModel.things // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.shiftThings()
getState().myModel.things // => ['you', 'be', 'my', 'neighbor?']
dispatch.myModel.shiftThings(2)
getState().myModel.things // => ['my', 'neighbor?']
```

---

#### `dispatch.myModel.unshiftThing(payload: any)`

- `payload: any` - the value to prepend to the list

Sets `myModel.things` to a copy of itself with `payload` prepended to the list.

To prepend multiple elements, see
[dispatch.myModel.concatThingsTo](#dispatchmymodelconcatthingstopayload)

**Example:**

```js
getState().myModel.things // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.unshiftThing('Howdy!')
getState().myModel.things // => ['Howdy!', "won't", 'you', 'be', 'my', 'neighbor?']
```

---

### **When `${modelName}.state` is `[]` (`Array`)**

When `${modelName}.state` is an `Array`, that model gets several other reducers
in addition to [`set`](#dispatchmodelnamesetpropnamepayload-meta) and
[`reset`](#dispatchmodelnameresetpropname).

For the sake of example and readability, let's assume that we have store
initialized like so:

```js
const {dispatch, getState} = init({
  models: withDefaultReducers({
    myModel: {
      state: [],
    },
  }),
})
```

The following reducers that would be generated:

- [`dispatch.myModel.concat(payload: any[])`](#dispatchmymodelconcatpayload-any)
- [`dispatch.myModel.concatTo(payload: any[])`](#dispatchmymodelconcattopayload-any)
- [`dispatch.myModel.filter(payload: { where })`](#dispatchmymodelfilterpayload--where)
- [`dispatch.myModel.insert(payload: { where, payload })`](#dispatchmymodelinsertpayload--where-payload)
- [`dispatch.myModel.insertAll(payload: { where, payload })`](#dispatchmymodelinsertallpayload--where-payload)
- [`dispatch.myModel.map(mapFn)`](#dispatchmymodelmapmapfn)
- [`dispatch.myModel.pop(n?: number)`](#dispatchmymodelpopn-number)
- [`dispatch.myModel.push(payload: any)`](#dispatchmymodelpushpayload-any)
- [`dispatch.myModel.remove(payload: any)`](#dispatchmymodelremovepayload-any)
- [`dispatch.myModel.remove(payload: { where })`](#dispatchmymodelremovepayload--where)
- [`dispatch.myModel.removeAll(payload: { where })`](#dispatchmymodelremoveallpayload--where)
- [`dispatch.myModel.replace(payload: { where, payload })`](#dispatchmymodelreplacepayload--where-payload)
- [`dispatch.myModel.shift(n?: number)`](#dispatchmymodelshiftn-number)
- [`dispatch.myModel.unshift(payload: any)`](#dispatchmymodelunshiftpayload-any)

---

#### `dispatch.myModel.concat(payload: any[])`

- `payload: any[]`

Sets `myModel.state` to the result of concatentating `payload` to the end of
`myModel.state`

```js
store.getState().myModel // => ['world']
dispatch.myModel.concat(['hello'])
store.getState().myModel // => ['world', 'hello']
```

---

#### `dispatch.myModel.concatTo(payload: any[])`

- `payload: any[]`

Sets `myModel.state` to the result of concatenating `myModel.state` to the end
of `payload`

```js
store.getState().myModel // => ['world']
dispatch.myModel.concatTo(['henlo'])
store.getState().myModel // => ['henlo', 'world']
```

---

#### `dispatch.myModel.filter(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Filters `myModel.state` down to the elements that return `true` when passed to
the predicate function on `payload.where` along with the element's `index`.

**Example:**

```js
store.getState().myModel // ['blah', 4, 'blah]
dispatch.myModel.filter({where: (el, i) => typeof el === 'string'})
store.getState().myModel // ['blah', 'blah]
```

---

#### `dispatch.myModel.insert(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`
- `payload.payload: any`

**Note singular** | Inserts `payload.payload` at the first index where
`payload.where` returns `true`. Pre-existing elements from that index onwards
have their indexes incremented by one.

```js
getState().myModel // => [{name: 'George'}, {name: 'Abe'}]
dispatch.myModel.insert({where: (el, i) => i === 1, {name: 'Ben'}})
getState().myModel // => [{name: 'George'}, {name: 'Ben'}}, {name: 'Abe'}]
```

---

#### `dispatch.myModel.insertAll(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`

* `payload.payload: any[]`

Inserts the contents of `payload.payload` starting at the first index where
`payload.where` returns `true`. Pre-existing elements from that index onwards
have their indexes incremented by the length of `payload.payload`.

```js
getState().myModel // => [1, 2, 3]
dispatch.myModel.insertAll({where: (el, i) => i === 1, [4, 5, 6]})
getState().myModel // => [1, 4, 5, 6, 2, 3]
```

---

#### `dispatch.myModel.map(mapFn)`

- `mapFn: function(elmt: any, index: number): any`

Sets `myModel` to the array returned from `mapFn`. Behaves mostly like
`Array.prototype.map`, except it only has arity 1 and `mapFn` has only arity 2.

```js
store.getState().myModel // => ['henlo', 'world']
dispatch.myModel.map((el, idx) => el.toUpperCase())
store.getState().myModel // => ['HENLO', 'WORLD']
```

---

#### `dispatch.myModel.pop(n?: number)`

- `n?: number` (optional) - number of elements to "pop" from list. **Default:
  1**

Sets `myModel` to a copy of itself with the last `n` elements removed.

```js
store.getState().myModel // => [1, 2, 3, 4, 5]
dispatch.myModel.pop()
store.getState().myModel // => [1, 2, 3, 4]
dispatch.myModel.pop(2)
store.getState().myModel // => [1, 2]
```

---

#### `dispatch.myModel.push(payload: any)`

- `payload: any` - the value to append to the end of the list

Sets `myModel` to a copy of itself with `payload` appended as the last element.

To append multiple elements see
[dispatch.myModel.concat](#dispatchmymodelconcatpayload-any).

```js
store.getState().myModel // => [1, 2, 3]
dispatch.myModel.pushThing(4)
store.getState().myModel // => [1, 2, 3, 4]
```

---

#### `dispatch.myModel.remove(payload: any)`

- `payload: any` - the value to remove

Sets `myModel` to a copy of itself omitting the first element found to be
strictly equal (`===`) to `payload`.

**Example:**

```js
const [george] = getState().myModel // => [{name: 'George'}, {name: 'Abe'}]
dispatch.myModel.remove(george)
getState().myModel // => [{name: 'Abe'}]
```

---

#### `dispatch.myModel.remove(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Sets `myModel` to a copy of itself omitting the first element for which
`payload.where` returns `true`.

**Example:**

```js
getState().myModel // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.remove({where: (el, idx) => el.length < 3})
getState().myModel // => ["won't", 'you', 'my', 'neighbor?']
```

---

#### `dispatch.myModel.removeAll(payload: { where })`

- `payload.where: function(elmt: any, index: number): boolean`

Sets `myModel` to a copy of itself omitting **all** elements for which
`payload.where` returns `true`.

**Example:**

```js
getState()
  .myModel // => ["won't", 'you', 'be', 'my', 'neighbor?']
  .dispatch.myModel.remove({where: (el, idx) => el.length < 3})
getState().myModel // => ["won't", 'you', 'neighbor?']
```

---

#### `dispatch.myModel.replace(payload: { where, payload })`

- `payload.where: function(elmt: any, index: number): boolean`
- `payload.payload: any`

Sets `myModel` to a copy of itself with the first element for which
`payload.where` returns `true` replaced with the value of `payload.payload`.

**Example:**

```js
getState().myModel // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.replace({where: (el, idx) => el.length < 3, 'find'})
getState().myModel // => ["won't", 'you', 'find', 'my', 'neighbor?']
```

---

#### `dispatch.myModel.shift(n?: number)`

- `n?: number` (optional) - the number of elements to remove from the front of
  the list. **Default: 1**

Sets `myModel` to a copy of itself with the first `n` elements removed.

**Example:**

```js
getState().myModel // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.shift()
getState().myModel // => ['you', 'be', 'my', 'neighbor?']
dispatch.myModel.shift(2)
getState().myModel // => ['my', 'neighbor?']
```

---

#### `dispatch.myModel.unshift(payload: any)`

- `payload: any` - the value to prepend to the list

Sets `myModel` to a copy of itself with `payload` prepended to the list.

To prepend multiple elements, see
[dispatch.myModel.concatTo](#dispatchmymodelconcattopayload-any)

**Example:**

```js
getState().myModel // => ["won't", 'you', 'be', 'my', 'neighbor?']
dispatch.myModel.unshift('Howdy!')
getState().myModel // => ['Howdy!', "won't", 'you', 'be', 'my', 'neighbor?']
```
