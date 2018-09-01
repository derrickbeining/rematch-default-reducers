import * as R from 'ramda'
import {isVanillaObj} from './utils.obj'

/* eslint-disable-next-line fp/no-nil, better/explicit-return */
export const _handleNil = R.curry((pathToState, initialState) => {
  const stateString = JSON.stringify(initialState, null, '  ')

  throw new TypeError(
    `[rematch/withDefaultReducers]: invalid initial state for ${pathToState}.\n Attempted to initialize with ${stateString}\n which contains or is null/undefined.\n\n Default reducers cannot be generated for any state initialized with null/undefined values. For this and many other reasons, models should be initialized with the exact interface/types your application expects.\n\nTo avoid this error, either replace null/undefined in your models with values of the type your application expects, or forego default reducers for any models or model properties you initialize as null by passing the option \`{allowNil: true}\` to \`withDefaultReducers\`\n\n`
  )
})

// prettier-ignore
const _toInterfaceSpec = R.map(val => isVanillaObj(val)
  ? R.both(isVanillaObj, R.where(_toInterfaceSpec(val)))
  : R.pipe(R.type, R.equals(R.type(val)))
)

// prettier-ignore
const _mapObjDeep = fn => R.map(
  val => isVanillaObj(val)
    ? fn(_mapObjDeep(fn)(val))
    : fn(val)
)
// prettier-ignore
export const _hasNilKeysDeep = R.pipe(
  _mapObjDeep(R.ifElse(isVanillaObj, R.toPairs, R.identity)),
  R.toPairs,
  R.flatten,
  R.any(R.isNil)
)
// prettier-ignore
const _describeInterface = R.map(val => isVanillaObj(val)
  ? _describeInterface(val)
  : R.type(val)
)

export const _trace = R.tap(console.log)

export const _toTitle = R.ifElse(
  R.o(R.equals('String'), R.type),
  R.converge(R.concat, [R.o(R.toUpper, R.head), R.tail]),
  R.always('')
)

export const _returnSecondArg = (state, payload) => payload

export const _toPropSetter = R.curry((propName, setter, state, payload) => ({
  ...state,
  [propName]: setter(state[propName], payload),
}))

/* eslint-disable-next-line fp/no-nil */
export const _createTypedSetterFor = ({
  opts,
  initialState,
  modelName,
  actionName,
}) => (state, payload, meta = {}) => {
  const {typeCheck} = R.merge(opts, meta)
  const initialType = R.type(initialState)
  const payloadType = R.type(payload)
  const isCorrectType = payloadType === initialType

  if (!typeCheck && R.all(isVanillaObj)([initialState, payload])) {
    return R.mergeDeepRight(state, payload)
  }
  if (!typeCheck) return payload

  if (isCorrectType && !isVanillaObj(payload)) return payload
  if (!isCorrectType) {
    /* eslint-disable-next-line fp/no-unused-expression */
    const payloadString = JSON.stringify(payload, null, '  ')
    throw new TypeError(
      `[rematch/withDefaulReducers]: The \`payload\` of ${actionName} does not satisfy ${modelName}'s initial interface.\n"${modelName}" was initialized as type: ${initialType}\nBut tried to set: ${payloadString}\n\nTo avoid this error you should initialize your models with the exact interface/types your application expects AND avoid setting values that do not satify that interface (best-practice)\nOr if you wish to disable type checking, you can:\n1.) Disable type checking on individual dispatches by passing your action dispatchers {typeCheck: false} as the 2nd (\`meta\`) argument.\n\tE.g. dispatch.model.action(payload, {typeCheck: false})\n2.) Disable type checking for all default reducers by passing {typeCheck: false} as an option to \`withDefaultReducers\`.\n\n`
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
  throw new TypeError(
    `[rematch/withDefaulReducers]: ${actionName} attempted to alter ${modelName}'s interface by setting values that differ from those with which ${modelName} was initialized.\n\nInitial interface for ${modelName}:\n ${initialInterface}\n\n Values attempted to set:\n${payloadString}\n\nTo avoid this error you should initialize your models with the exact interface/types your application expects AND avoid setting values that do not satify that interface (best-practice)\nOr if you wish to disable type checking, you can:\n1.) Disable type checking on individual dispatches by passing your action dispatchers {typeCheck: false} as the 2nd (\`meta\`) argument.\n\tE.g. dispatch.model.action(payload, {typeCheck: false})\n2.) Disable type checking for all default reducers by passing {typeCheck: false} as an option to \`withDefaultReducers\`.\n\n`
  )
}

export const _createTypedPropSetterFor = R.curry(
  /* eslint-disable-next-line fp/no-nil, fp/no-unused-expression */
  (opts, initialState, modelName, propName, state, payload, meta = {}) => {
    const {typeCheck} = R.merge(opts, meta)
    const initialType = R.type(initialState)
    const isCorrectType = R.type(payload) === initialType
    const setProp = _toPropSetter(propName, _returnSecondArg)
    const updateProp = _toPropSetter(propName, R.mergeDeepRight)

    if (!typeCheck && isVanillaObj(payload)) return updateProp(state, payload)

    if (!typeCheck) return setProp(state, payload)

    if (isCorrectType && !isVanillaObj(payload)) return setProp(state, payload)

    if (!isCorrectType && !isVanillaObj(payload)) {
      const payloadString = JSON.stringify(payload, null, '  ')
      /* eslint-disable-next-line fp/no-unused-expression */
      throw new TypeError(
        `[rematch/withDefaulReducers]: dispatch.${modelName}.set${_toTitle(
          propName
        )}() attempted to set a value of a type that does not match the type with which ${modelName}.${propName} was intialized.\n\n Initial type of ${modelName}.${propName}: ${initialType}.\nValue attempted to set: ${payloadString}\n\nTo avoid this error you should initialize your models with the exact interface/types your application expects AND avoid setting values that do not satify that interface (best-practice)\nOr if you wish to disable type checking, you can:\n1.) Disable type checking on individual dispatches by passing your action dispatchers {typeCheck: false} as the 2nd (\`meta\`) argument.\n\tE.g. dispatch.model.action(payload, {typeCheck: false})\n2.) Disable type checking for all default reducers by passing {typeCheck: false} as an option to \`withDefaultReducers\`.\n\n`
      )
    }

    const altersInterfaceOf = R.complement(R.where(_toInterfaceSpec(payload)))

    if (!altersInterfaceOf(initialState)) return updateProp(state, payload)

    const iface = _describeInterface(initialState)
    const initialInterface = JSON.stringify(iface, null, '  ')
    const payloadString = JSON.stringify(payload, null, '  ')
    /* eslint-disable-next-line fp/no-unused-expression */
    throw new TypeError(
      // prettier-ignore
      `[rematch/withDefaulReducers]: dispatch.${modelName}.set${_toTitle(propName)}() attempted to alter the model's interface by setting values that differ from those with which the model was initialized.\n\nInitial interface for ${modelName}.${propName}:\n ${initialInterface}\n\n Values attempted to set:\n${payloadString}\n\nIf you wish to override type-checking in default reducers, you can:\n1.) Pass your action dispatchers {typeCheck: false} as the 2nd (\`meta\`) argument.\n\tE.g. dispatch.model.action(payload, {typeCheck: false})\n2. Pass {typeCheck: false} as an option to \`withDefaultReducers\`.\n\n`
    )
  }
)
