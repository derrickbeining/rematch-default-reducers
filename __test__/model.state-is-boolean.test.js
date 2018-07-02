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

  context('When model.state is type Boolean', function() {
    specify('dispatch.model.set works', function() {
      const initialState = getState().modelWithBooleanState
      const newState = !initialState

      dispatch.modelWithBooleanState.set(newState)
      expect(getState().modelWithBooleanState).not.to.equal(initialState)
      expect(getState().modelWithBooleanState).to.deep.equal(newState)
    })

    specify('dispatch.model.reset works', function() {
      const initialState = getState().modelWithBooleanState
      const newState = !initialState

      dispatch.modelWithBooleanState.set(newState)
      expect(getState().modelWithBooleanState).to.deep.equal(newState)
      dispatch.modelWithBooleanState.reset()
      expect(getState().modelWithBooleanState).to.deep.equal(initialState)
    })
  })
})
