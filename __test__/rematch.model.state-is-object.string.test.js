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
    context('and state.property is type String', function() {
      specify('dispatch.model.setString works', function() {
        dispatch.modelWithObjectState.setSomeString('hi!')
        expect(getState().modelWithObjectState.someString).not.to.equal(
          modelWithObjectState.state.someString,
        )
        expect(getState().modelWithObjectState.someString).to.equal('hi!')
      })

      specify('dispatch.model.resetString works', function() {
        dispatch.modelWithObjectState.setSomeString('hi!')
        expect(getState().modelWithObjectState.someString).not.to.equal(
          modelWithObjectState.state.someString,
        )
        expect(getState().modelWithObjectState.someString).to.equal('hi!')

        dispatch.modelWithObjectState.resetSomeString()
        expect(getState().modelWithObjectState.someString).not.to.equal('hi!')
        expect(getState().modelWithObjectState.someString).to.equal(
          modelWithObjectState.state.someString,
        )
      })
    })
  })
})
