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

  context('When model.state is unusualType', function() {
    context('default reducers/actions', function() {
      specify('dispatch.model.set works', function() {
        const initialState = getState().modelWithUnusualState
        const newState = new Map([['key', 'val']])

        dispatch.modelWithUnusualState.set(newState)
        expect(getState().modelWithUnusualState).not.to.equal(initialState)
        expect(getState().modelWithUnusualState).to.equal(newState)
      })

      specify('dispatch.model.reset works', function() {
        const initialState = getState().modelWithUnusualState
        const newState = new Map([['key', 'val']])

        dispatch.modelWithUnusualState.set(newState)
        expect(getState().modelWithUnusualState).to.equal(newState)
        dispatch.modelWithUnusualState.reset()
        expect(getState().modelWithUnusualState).to.equal(initialState)
      })
    })
  })
})
