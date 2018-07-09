/* eslint-disable fp/no-throw, better/no-new, better/no-ifs */
import * as R from 'ramda'
import {handleInitialStateArray} from './lib/handleStateArray'
import {handleInitialStateObject} from './lib/handleStateObj'
import {handleInitialStateOther} from './lib/handleStatePrimitives'
import {_handleNil} from './lib/utils'
import {isVanillaObj} from './lib/utils.obj'
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
        [isVanillaObj, handleInitialStateObject(opts)],
        [R.o(R.equals('Array'), R.type), handleInitialStateArray(opts)],
        [
          R.anyPass([R.is(String), R.is(Number), R.is(Boolean)]),
          handleInitialStateOther(opts),
        ],
        [R.both(R.isNil, () => !opts.allowNil), R.flip(_handleNil)],
        [R.always(true), handleInitialStateOther(opts)],
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
