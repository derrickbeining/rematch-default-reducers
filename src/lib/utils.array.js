import * as R from 'ramda'
import omitIndexes from 'ramda-adjunct/lib/omitIndexes'
import contained from 'ramda-adjunct/lib/contained'

const _insertWhere = (state, {predicate, payload}) =>
  R.applyTo(state)(
    R.converge(R.insert, [
      R.addIndex(R.findIndex)(predicate),
      R.always(payload),
      R.identity,
    ])
  )

const _insertAllWhere = R.pipe(
  _insertWhere,
  R.flatten
)

const _removeWhere = (state, predicate) =>
  R.applyTo(state)(
    R.converge(omitIndexes, [
      R.o(Array.of, R.addIndex(R.findIndex)(predicate)),
      R.identity,
    ])
  )

const _removeAllWhere = (state, predicate) =>
  state.filter((el, i) => !predicate(el, i))

export const _concat = (state, payload) => [...state, ...payload]

export const _filter = (state, predicate) => state.filter(predicate)

export const _insert = (state, specs) => {
  const {where, payload} = specs

  return _insertWhere(state, {
    predicate: where,
    payload: payload,
  })
}

export const _insertAll = (state, specs) => {
  const {where, payload} = specs

  return _insertAllWhere(state, {
    predicate: where,
    payload: payload,
  })
}

export const _map = (state, mapper) => state.map(mapper)

export const _popN = (state, payload) => state.slice(0, R.negate(payload || 1))

export const _push = (state, payload) => [...state, payload]

export const _remove = (state, payload) => {
  const {where} = payload

  if (where) return _removeWhere(state, where)
  return _removeWhere(state, (el) => el === payload)
}

export const _removeAll = (state, payload) => {
  const {where} = payload

  if (where) return _removeAllWhere(state, where)
  return _removeAllWhere(state, contained(payload))
}

export const _replace = (state, {where, payload}) =>
  R.applyTo(state)(
    R.converge(R.set, [
      R.pipe(
        R.addIndex(R.findIndex)(where),
        R.ifElse(R.lte(0), R.identity, R.always(Infinity)),
        R.lensIndex
      ),
      R.always(payload),
      R.identity,
    ])
  )

export const _shiftN = (state, payload) => state.slice(payload || 1, Infinity)

export const _unshift = (state, payload) => [payload, ...state]
