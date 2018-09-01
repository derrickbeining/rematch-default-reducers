import R from 'ramda'
import {_createTypedSetterFor} from './utils'
import {
  _concat,
  _filter,
  _insert,
  _insertAll,
  _map,
  _popN,
  _push,
  _remove,
  _removeAll,
  _replace,
  _shiftN,
  _unshift,
} from './utils.array'

export const handleInitialStateArray = R.curry(
  (opts, initialState, modelName) => {
    return {
      concat: _concat,
      concatTo: R.flip(_concat),
      filterWhere: _filter,
      insert: _insert,
      insertAll: _insertAll,
      map: _map,
      pop: _popN,
      push: _push,
      remove: _remove,
      removeAll: _removeAll,
      replace: _replace,
      reset: () => initialState,
      'rootState/reset': () => initialState,
      'rootState/set': (state, payload) => {
        return payload[modelName]
          ? _createTypedSetterFor({
              opts,
              initialState,
              modelName,
              actionName: 'rootState/set',
            })(state, payload[modelName])
          : state
      },
      set: _createTypedSetterFor({
        opts,
        initialState,
        modelName,
        actionName: `${modelName}/set`,
      }),
      shift: _shiftN,
      unshift: _unshift,
    }
  }
)
