import * as R from 'ramda'
import isPlainObj from 'ramda-adjunct/lib/isPlainObj'

/* eslint-disable-next-line fp/no-nil, better/explicit-return */
export const _handleNil = R.curry((pathToState, initialState) => {
  const stateString = JSON.stringify(initialState, null, '  ')

  throw new TypeError(
    `[rematch/withDefaultReducers]: invalid initial state for ${pathToState}.\n Attempted to initialize with ${stateString}\n which contains or is null/undefined.\n\n Default reducers cannot be generated for any state initialized with null/undefined values. For this and many other reasons, models should be initialized with the exact interface/types your application expects.\n\nTo avoid this error, either replace null/undefined in your models with values of the type your application expects, or pass the option \`{allowNil: true}\` to \`withDefaultReducers\`\n\n`,
  )
})

// prettier-ignore
const _toInterfaceSpec = R.map(val => isPlainObj(val)
  ? R.both(isPlainObj, R.where(_toInterfaceSpec(val)))
  : R.pipe(R.type, R.equals(R.type(val)))
)

// prettier-ignore
const _mapObjDeep = fn => R.map(
  val => isPlainObj(val)
    ? fn(_mapObjDeep(fn)(val))
    : fn(val)
)
// prettier-ignore
export const _hasNilKeysDeep = R.pipe(
  _mapObjDeep(R.ifElse(isPlainObj, R.toPairs, R.identity)),
  R.toPairs,
  R.flatten,
  R.any(R.isNil)
)
// prettier-ignore
const _describeInterface = R.map(val => isPlainObj(val)
  ? _describeInterface(val)
  : R.type(val)
)

export const _trace = R.tap(console.log)

export const _toTitle = R.ifElse(
  R.o(R.equals('String'), R.type),
  R.converge(R.concat, [R.o(R.toUpper, R.head), R.tail]),
  R.always(''),
)

export const _returnSecondArg = (state, payload) => payload

export const _toPropSetter = R.curry((propName, setter, state, payload) => ({
  ...state,
  [propName]: setter(state[propName], payload),
}))

export const _createTypedSetterFor = R.curry(
  /* eslint-disable-next-line fp/no-nil */
  (initialState, modelName, state, payload, meta = {typeCheck: true}) => {
    const initialType = R.type(initialState)
    const isCorrectType = R.type(payload) === initialType

    if (!meta.typeCheck && isPlainObj(payload)) {
      return R.mergeDeepRight(state, payload)
    }
    if (!meta.typeCheck) return payload
    if (isCorrectType && !isPlainObj(payload)) return payload
    if (!isCorrectType && !isPlainObj(payload)) {
      /* eslint-disable-next-line fp/no-unused-expression */
      console.error(
        `[rematch/withDefaulReducers]: ${modelName} was initialized as a(n) ${initialType}, but dispatch.${modelName}.set() attempted to set a non-${initialType} value. Model state should only be set to values of the type with which they are initialized.\n\nIf you wish override type-checking in default reducers, you can pass your action dispatchers the \`meta\` argument {typeCheck: false}.\nE.g. dispatch.model.action(payload, {typeCheck: false})\n\n`,
      )
    }

    const altersInterfaceOf = R.complement(R.where(_toInterfaceSpec(payload)))

    if (!altersInterfaceOf(initialState)) {
      return R.mergeDeepRight(state, payload)
    }

    const iface = _describeInterface(initialState)
    const initialInterface = JSON.stringify(iface, null, '  ')
    const payloadString = JSON.stringify(payload, null, '  ')
    /* eslint-disable-next-line fp/no-unused-expression */
    console.error(
      `[rematch/withDefaulReducers]: dispatch.${modelName}.set() attempted to alter the model's interface by setting values that differ from those with which the model was initialized.\n\nInitial interface for ${modelName}:\n ${initialInterface}\n\n Values attempted to set:\n${payloadString}\n\nIf you wish override type-checking in default reducers, you can pass your action dispatchers the \`meta\` argument {typeCheck: false}.\nE.g. dispatch.model.action(payload, {typeCheck: false})\n\n`,
    )
  },
)

export const _createTypedPropSetterFor = R.curry(
  /* eslint-disable-next-line fp/no-nil, fp/no-unused-expression */
  (
    initialState,
    modelName,
    propName,
    state,
    payload,
    meta = {typeCheck: true},
  ) => {
    const initialType = R.type(initialState)
    const isCorrectType = R.type(payload) === initialType
    const typeCheck = R.propOr(true, 'typeCheck')(meta)
    const setProp = _toPropSetter(propName, _returnSecondArg)
    const updateProp = _toPropSetter(propName, R.mergeDeepRight)

    if (!typeCheck && isPlainObj(payload)) return updateProp(state, payload)

    if (!typeCheck) return setProp(state, payload)

    if (isCorrectType && !isPlainObj(payload)) return setProp(state, payload)

    if (!isCorrectType && !isPlainObj(payload)) {
      const payloadString = JSON.stringify(payload, null, '  ')
      /* eslint-disable-next-line fp/no-unused-expression */
      console.error(
        `[rematch/withDefaulReducers]: dispatch.${modelName}.set${propName}() attempted to set a value of a type that does not match the type with which ${modelName}.${propName} was intialized.\n\n Initial type of ${modelName}.${propName}: ${initialType}.\nValue attempted to set: ${payloadString}\n\nIf you wish override type-checking in default reducers, you can pass your action dispatchers the \`meta\` argument {typeCheck: false}.\nE.g. dispatch.model.action(payload, {typeCheck: false})\n\n`,
      )

      return setProp(state, state[propName])
    }

    const altersInterfaceOf = R.complement(R.where(_toInterfaceSpec(payload)))

    if (!altersInterfaceOf(initialState)) return updateProp(state, payload)

    const iface = _describeInterface(initialState)
    const initialInterface = JSON.stringify(iface, null, '  ')
    const payloadString = JSON.stringify(payload, null, '  ')
    /* eslint-disable-next-line fp/no-unused-expression */
    console.error(
      // prettier-ignore
      `[rematch/withDefaulReducers]: dispatch.${modelName}.set${_toTitle(propName)}() attempted to alter the model's interface by setting values that differ from those with which the model was initialized.\n\nInitial interface for ${modelName}.${propName}:\n ${initialInterface}\n\n Values attempted to set:\n${payloadString}\n\nIf you wish override type-checking in default reducers, you can pass your action dispatchers the \`meta\` argument {typeCheck: false}.\nE.g. dispatch.model.action(payload, {typeCheck: false})\n\n`,
    )

    return _toPropSetter(propName, (state) => state)(state, payload)
  },
)
