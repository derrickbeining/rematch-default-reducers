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
        [R.o(R.equals('Object'), R.type), handleInitialStateObject(opts)],
        [R.o(R.equals('Array'), R.type), handleInitialStateArray(opts)],
        [R.o(R.equals('Boolean'), R.type), handleInitialStateBoolean(opts)],
        [R.o(R.equals('String'), R.type), handleInitialStateString(opts)],
        [R.o(R.equals('Number'), R.type), handleInitialStateNumber(opts)],
        [R.both(R.isNil, () => !opts.allowNil), R.flip(_handleNil)],
        [R.always(true), handleUnsupportedInitialStateType],
      ]),
      [R.prop('state'), R.identity]
    ),
    R.objOf('reducers')
  )

/**
 * Takes a the `models` object for @rematch/core and decorates each model
 * with default reducers/actions generated from each models' inital state
 * @public
 * @function withDefaultReducers
 * @param {{
    [modelName: string]: {
      state,
      reducers?: {
        [actionName: string]: function
      }
    }
  }} models
 * @param {{allowNil: boolean, typeCheck: boolean}} opts
 * @returns {{model: {state, reducers: {[actionName: string]: function}}}}
 */
export const withDefaultReducers = (models, opts = {}) => {
  const _opts = R.merge({allowNil: false, typeCheck: true}, opts)

  return R.applyTo(models)(
    R.pipe(
      R.converge(R.mergeDeepRight, [
        R.mapObjIndexed(createReducersFromModel(_opts)),
        R.identity,
      ]),
      R.mergeDeepRight({
        rootState: {reducers: {reset: () => null}, state: null},
      })
    )
  )
}
