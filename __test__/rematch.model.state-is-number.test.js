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

  context('When model.state is type Number', function() {
    specify('dispatch.model.set works', function() {
      const {dispatch, getState} = init({models: withDefaultReducers(models)})
      const initialState = models.modelWithNumberState.state
      const newState = initialState + 1

      dispatch.modelWithNumberState.set(newState)
      expect(getState().modelWithNumberState).not.to.equal(initialState)
      expect(getState().modelWithNumberState).to.equal(newState)
    })

    specify('dispatch.model.reset works', function() {
      const {dispatch, getState} = init({models: withDefaultReducers(models)})
      const initialState = models.modelWithNumberState.state
      const newState = initialState + 1

      dispatch.modelWithNumberState.set(newState)
      expect(getState().modelWithNumberState).to.equal(newState)
      dispatch.modelWithNumberState.reset()
      expect(getState().modelWithNumberState).to.equal(initialState)
    })
  })
})
