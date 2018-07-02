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

  context('When model.state is type String', function() {
    specify('dispatch.model.set works', function() {
      const initialState = getState().modelWithStringState
      const newState = 'howdy'

      dispatch.modelWithStringState.set(newState)
      expect(getState().modelWithStringState).not.to.equal(initialState)
      expect(getState().modelWithStringState).to.equal(newState)
    })

    specify('dispatch.model.reset works', function() {
      const initialState = getState().modelWithStringState
      const newState = 'howdy'

      dispatch.modelWithStringState.set(newState)
      expect(getState().modelWithStringState).to.equal(newState)
      dispatch.modelWithStringState.reset()
      expect(getState().modelWithStringState).to.equal(initialState)
    })
  })
})
