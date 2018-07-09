import R from 'ramda'
import isPlainObj from 'ramda-adjunct/lib/isPlainObj'

export const isVanillaObj = R.both(isPlainObj, R.is(Object))
