import * as R from 'ramda'
import {singular} from 'pluralize'
import {
  _createTypedPropSetterFor,
  _createTypedSetterFor,
  _handleNil,
  _hasNilKeysDeep,
  _toTitle,
  _toPropSetter,
} from './utils'
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
import {isVanillaObj} from './utils.obj'

// TODO: implement and test all the other convenience actions
const addArrayActions = R.curry((opts, modelName, propName, initialState) => {
  // using arbitrary readable names for distinguishing singular and plural
  const People = _toTitle(propName)
  const Person = _toTitle(singular(People))

  //
  // ─── ACTIONS ────────────────────────────────────────────────────────────────────
  //
  const _concat_ = _toPropSetter(propName, _concat)
  const _concatTo_ = _toPropSetter(propName, R.flip(_concat))
  const _filter_ = _toPropSetter(propName, _filter)
  const _insert_ = _toPropSetter(propName, _insert)
  const _insertAll_ = _toPropSetter(propName, _insertAll)
  const _map_ = _toPropSetter(propName, _map)
  const _popN_ = _toPropSetter(propName, _popN)
  const _push_ = _toPropSetter(propName, _push)
  const _remove_ = _toPropSetter(propName, _remove)
  const _removeAll_ = _toPropSetter(propName, _removeAll)
  const _replace_ = _toPropSetter(propName, _replace)
  const _reset_ = _toPropSetter(propName, () => initialState)
  const _shiftN_ = _toPropSetter(propName, _shiftN)
  const _unshift_ = _toPropSetter(propName, _unshift)

  return {
    [`concat${People}`]: _concat_,
    [`concat${People}To`]: _concatTo_,
    [`filter${People}Where`]: _filter_,
    [`insert${Person}`]: _insert_,
    [`insert${People}`]: _insertAll_,
    [`map${People}`]: _map_,
    [`pop${People}`]: _popN_,
    [`push${Person}`]: _push_,
    [`remove${Person}`]: _remove_,
    [`remove${People}`]: _removeAll_,
    [`replace${Person}`]: _replace_,
    [`reset${People}`]: _reset_,
    [`set${People}`]: _createTypedPropSetterFor(
      opts,
      initialState,
      modelName,
      propName
    ),
    [`shift${People}`]: _shiftN_,
    [`unshift${People}`]: _unshift_,
  }
})

const addObjActions = R.curry((opts, modelName, propName, initialState) => {
  const PropName = _toTitle(propName)

  if (!opts.allowNil && _hasNilKeysDeep(initialState)) {
    return _handleNil(`${modelName}.${propName}`, initialState)
  }

  return {
    [`reset${PropName}`]: _toPropSetter(propName, () => initialState),
    [`set${PropName}`]: _createTypedPropSetterFor(
      opts,
      initialState,
      modelName,
      propName
    ),
  }
})

const addOtherTypeActions = R.curry(
  (opts, modelName, propName, initialState) => {
    const PropName = _toTitle(propName)

    return {
      [`reset${PropName}`]: _toPropSetter(propName, () => initialState),
      [`set${PropName}`]: _createTypedPropSetterFor(
        opts,
        initialState,
        modelName,
        propName
      ),
    }
  }
)

const fromPairsAccumActionsFor = R.curry(
  (modelName, opts) =>
    function _accumActions(accum, [propName, initialState]) {
      const nilIsNotAllowed = R.always(!opts.allowNil)

      return R.applyTo(initialState)(
        R.pipe(
          R.cond([
            [isVanillaObj, addObjActions(opts, modelName, propName)],
            [
              R.o(R.equals('Array'), R.type),
              addArrayActions(opts, modelName, propName),
            ],
            [
              R.anyPass([R.is(String), R.is(Boolean), R.is(Number)]),
              addOtherTypeActions(opts, modelName, propName),
            ],
            [
              R.both(nilIsNotAllowed, R.isNil),
              _handleNil(`${modelName}.${propName}`),
            ],
            [R.always(true), addOtherTypeActions(opts, modelName, propName)],
          ]),
          R.merge(accum)
        )
      )
    }
)

/**
 * :: (model, modelName) -> Object(reducers)
 */
export const handleInitialStateObject = R.curry(
  (opts, initialState, modelName) => {
    return R.applyTo(initialState)(
      R.pipe(
        R.toPairs,
        R.reduce(fromPairsAccumActionsFor(modelName, opts), {}),
        R.merge({
          reset: () => initialState,
          'rootState/reset': () => initialState,
          set: _createTypedSetterFor(opts, initialState, modelName),
        })
      )
    )
  }
)
