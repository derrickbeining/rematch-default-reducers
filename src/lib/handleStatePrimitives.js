/* eslint-disable fp/no-unused-expression, better/explicit-return */
import * as R from 'ramda'
import {_returnSecondArg} from './utils'
const _guardTypes = R.curry((opts, reducers, initialState, modelName) =>
  R.applyTo(reducers)(
    R.mapObjIndexed((reducer, reducerName) => (state, payload, meta) => {
      const {typeCheck} = R.merge(opts, meta)
      const initialStateType = R.type(initialState)
      const result = reducer(state, payload)

      if (typeCheck && R.not(R.equals(initialStateType, R.type(result)))) {
        throw new TypeError(
          `${modelName} was initialized as a(n) ${initialStateType}, but dispatch.${modelName}.${reducerName}() attempted to perform an operation that would set it to a non-${initialStateType} value. You should only set your models and their properties to values of the type with which you initialize them.`
        )
      }

      return result
    })
  )
)

export const handleInitialStateOther = R.curry(
  (opts, initialState, modelName) => {
    const createOtherTypesReducers = _guardTypes(opts)({
      reset: () => initialState,
      'rootState/reset': () => initialState,
      set: _returnSecondArg,
    })

    return createOtherTypesReducers(initialState, modelName)
  }
)
