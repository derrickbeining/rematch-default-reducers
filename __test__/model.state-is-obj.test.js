/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
import * as R from 'ramda'
import {init} from '@rematch/core'
import {expect} from 'chai'
import {singular} from 'pluralize'
import {withDefaultReducers} from '../src/index'
import {
  modelWithObjectState,
  modelWithArrayState,
  modelWithPrimitiveState,
  models,
} from './fixtures/models'
import {toTitle, _trace} from '../src/lib/utils'

context('Integration with @rematch/core', function() {
  /* eslint-disable-next-line fp/no-let */
  let dispatch, getState

  beforeEach('initialize a new store', function() {
    const store = init({models: withDefaultReducers(models)})
    dispatch = store.dispatch
    getState = store.getState
  })

  context('When model.state is type Object', function() {
    specify('model.set works', function() {
      const initial = getState().modelWithObjectState
      const updater = {
        someNumber: 2,
        words: ['hello'],
        obj: {
          otherString: 'do you?',
          otherWords: ['good-bye'],
          otherObj: {deep: 'so derp'},
        },
      }

      const expected = R.mergeDeepRight(initial, updater)
      dispatch.modelWithObjectState.set(updater)
      const actual = getState().modelWithObjectState

      expect(actual).to.deep.equal(expected)
    })

    specify('model.reset works', function() {
      const initial = getState().modelWithObjectState
      const updater = {
        someNumber: 2,
        words: ['hello'],
        obj: {
          otherString: 'do you?',
          otherWords: ['good-bye'],
          otherObj: {deep: 'so derp'},
        },
      }

      dispatch.modelWithObjectState.set(updater)
      dispatch.modelWithObjectState.reset()

      const actual = getState().modelWithObjectState
      expect(actual).to.deep.equal(initial)
    })
  })
})
