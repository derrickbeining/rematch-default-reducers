/* eslint-disable fp/no-throw, better/no-new, better/no-ifs */
import * as R from 'ramda'
import {handleInitialStateArray} from './lib/handleStateArray'
import {handleInitialStateObject} from './lib/handleStateObj'
import {
  handleInitialStateString,
  handleInitialStateBoolean,
  handleInitialStateNumber,
  handleUnsupportedInitialStateType,
} from './lib/handleStatePrimitives'
import {_handleNil} from './lib/utils'
/**
 * :: opts -> (model, modelName -> modelWithDefaultReducers)
 *
 * @function createReducersFromModel
 * @param {{allowNil?: boolean}} opts
 * @param {{ state: {attr}, reducers?: {[key: string]: function}}} model
 * @param {string} modelName
 * @returns {reducers: {[key: string]: function}} model reducers
 */
const createReducersFromModel = (opts) =>
  R.pipe(
    R.useWith(
      R.cond([
        [R.is(Array), handleInitialStateArray],
        [R.is(Boolean), handleInitialStateBoolean],
        [R.is(Number), handleInitialStateNumber],
        [R.is(Object), handleInitialStateObject(opts)],
        [R.is(String), handleInitialStateString],
        [R.both(R.isNil, () => !opts.allowNil), R.flip(_handleNil)],
        [R.always(true), handleUnsupportedInitialStateType],
      ]),
      [R.prop('state'), R.identity],
    ),
    R.objOf('reducers'),
  )

/**
 * :: Object(state: any) -> Object(state: any, reducers: {reducer: Function})
 *
 * Takes a Rematch Model and returns a Rematch Reducers object
 * @public
 * @function withDefaultReducers
 * @param {{model: {state, reducers?: {reducer: function}}}} models
 * @param {{allowNull: boolean}} opts
 * @returns {{model: {state, reducers: {reducer: function}}}}
 */
export const withDefaultReducers = (models, opts = {}) => {
  const _opts = R.merge({allowNil: false}, opts)

  return R.applyTo(models)(
    R.pipe(
      R.converge(R.mergeDeepRight, [
        R.mapObjIndexed(createReducersFromModel(_opts)),
        R.identity,
      ]),
      R.mergeDeepRight({
        rootState: {reducers: {reset: () => null}, state: null},
      }),
    ),
  )
}
