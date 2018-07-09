/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
import * as R from 'ramda'
import {init} from '@rematch/core'
import {expect} from 'chai'
import {withDefaultReducers} from '../src/index'
import {models} from './fixtures/models'

context('Integration with @rematch/core', function() {
  /* eslint-disable-next-line fp/no-let */
  let dispatch, getState

  beforeEach('initialize a new store', function() {
    const store = init({models: withDefaultReducers(models)})
    dispatch = store.dispatch
    getState = store.getState
  })

  context('rootState action(s)', function() {
    specify(
      'dispatch.rootState.reset resets all models to initial state',
      function() {
        const initialRootState = getState()
        // ------------- MODIFY ALL MODELS -----------------
        ;(function setupUnsupportedState() {
          const initialState = getState().modelWithUnusualState
          const newState = new Map([['key', 'val']])

          dispatch.modelWithUnusualState.set(newState)
          expect(getState().modelWithUnusualState).not.to.equal(initialState)
          expect(getState().modelWithUnusualState).to.equal(newState)
        })()
        ;(function setupArrayState() {
          const initialState = models.modelWithArrayState.state

          dispatch.modelWithArrayState.set(['howdy'])
          expect(getState().modelWithArrayState).not.to.equal(initialState)
          expect(getState().modelWithArrayState).to.deep.equal(['howdy'])
        })()
        ;(function setupBooleanState() {
          const initialState = getState().modelWithBooleanState
          const newState = !initialState

          dispatch.modelWithBooleanState.set(newState)
          expect(getState().modelWithBooleanState).not.to.equal(initialState)
          expect(getState().modelWithBooleanState).to.deep.equal(newState)
        })()
        ;(function setupNumberState() {
          const initialState = getState().modelWithNumberState
          const newState = initialState + 1

          dispatch.modelWithNumberState.set(newState)
          expect(getState().modelWithNumberState).not.to.equal(initialState)
          expect(getState().modelWithNumberState).to.equal(newState)
        })()
        ;(function setupObjState() {
          const initial = getState().modelWithObjectState
          const updater = {
            someNumber: 2,
            words: ['hello'],
            obj: {
              otherString: 'do you?',
              otherWords: ['good-bye'],
              otherObj: {deep: 'so derp'},
            },
            unusualType: new Map([['key', 'val']]),
          }

          const expected = R.mergeDeepRight(initial, updater)
          dispatch.modelWithObjectState.set(updater)
          const actual = getState().modelWithObjectState

          expect(actual).to.deep.equal(expected)
        })()
        ;(function setupStringState() {
          const initialState = getState().modelWithStringState
          const newState = 'howdy'

          dispatch.modelWithStringState.set(newState)
          expect(getState().modelWithStringState).not.to.equal(initialState)
          expect(getState().modelWithStringState).to.equal(newState)
        })()

        // --------- TEST ---------------
        expect(getState()).not.to.deep.equal(initialRootState)
        dispatch.rootState.reset()
        expect(getState()).to.deep.equal(initialRootState)
      }
    )
  })
})
