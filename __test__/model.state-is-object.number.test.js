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
    context('and state.property is type Number', function() {
      specify('dispatch.model.setNumber works', function() {
        dispatch.modelWithObjectState.setSomeNumber(5)
        expect(getState().modelWithObjectState.someNumber).not.to.equal(
          modelWithObjectState.state.someNumber,
        )
        expect(getState().modelWithObjectState.someNumber).to.equal(5)
      })

      specify('dispatch.model.resetNumber works', function() {
        dispatch.modelWithObjectState.setSomeNumber(5)
        expect(getState().modelWithObjectState.someNumber).not.to.equal(
          modelWithObjectState.state.someNumber,
        )
        expect(getState().modelWithObjectState.someNumber).to.equal(5)

        dispatch.modelWithObjectState.resetSomeNumber()
        expect(getState().modelWithObjectState.someNumber).not.to.equal(5)
        expect(getState().modelWithObjectState.someNumber).to.equal(
          modelWithObjectState.state.someNumber,
        )
      })
    })
  })
})
