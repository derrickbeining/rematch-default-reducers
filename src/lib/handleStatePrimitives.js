import * as R from 'ramda'
import {_returnSecondArg} from './utils'
const _guardTypes = R.curry((reducers, initialState, modelName) =>
  R.applyTo(reducers)(
    R.mapObjIndexed((reducer, reducerName) => (state, payload) => {
      const initialStateType = R.type(initialState)
      const result = reducer(state, payload)

      if (R.not(R.equals(initialStateType, R.type(result)))) {
        throw new TypeError(
          `${modelName} was initialized as a(n) ${initialStateType}, but dispatch.${modelName}.${reducerName}() attempted to perform an operation that would set it to a non-${initialStateType} value. You should only set your models and their properties to values of the type with which you initialize them.`,
        )
      }

      return result
    }),
  ),
)

/**
 * :: (model, modelName) -> Object(reducers)
 */
export const handleInitialStateString = (initialState, modelName) => {
  const createStringReducers = _guardTypes({
    reset: () => initialState,
    'rootState/reset': () => initialState,
    set: _returnSecondArg,
    // concat: R.concat,
    // replace: R.flip(R.replace),
    // toLower: R.toLower,
    // toUpper: R.toUpper,
    // trim: R.trim,
  })

  return createStringReducers(initialState, modelName)
}

/**
 * :: (model, modelName) -> Object(reducers)
 */
export const handleInitialStateBoolean = (initialState, modelName) => {
  const createBooleanReducers = _guardTypes({
    reset: () => initialState,
    'rootState/reset': () => initialState,
    set: _returnSecondArg,
    // setFalse: () => false,
    // setTrue: () => true,
    // toggle: (state) => !state,
  })

  return createBooleanReducers(initialState, modelName)
}

/**
 * :: (model, modelName) -> Object(reducers)
 */
export const handleInitialStateNumber = (initialState, modelName) => {
  const createNumberReducers = _guardTypes({
    // add: (state, payload) => state + payload,
    // decrement: (state) => state - 1,
    // divBy: (state, payload) => state / payload,
    // increment: (state) => state + 1,
    // multBy: (state, payload) => state * payload,
    reset: () => initialState,
    'rootState/reset': () => initialState,
    set: _returnSecondArg,
    // subtract: (state, payload) => state - payload,
  })

  return createNumberReducers(initialState, modelName)
}

export const handleUnsupportedInitialStateType = () => ({})
