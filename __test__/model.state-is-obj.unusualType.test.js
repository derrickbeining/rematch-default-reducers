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

  context('When model.state is type Object', function() {
    context('and state.property is an unusualType', function() {
      context('default reducers/actions', function() {
        specify('dispatch.model.setUnusualType works', function() {
          const initial = getState().modelWithObjectState.unusualType
          const next = new Map([['key', 'val']])

          dispatch.modelWithObjectState.setUnusualType(next)
          expect(getState().modelWithObjectState.unusualType).not.to.equal(
            initial
          )
          expect(getState().modelWithObjectState.unusualType).to.equal(next)
        })

        specify('dispatch.model.resetUnusualType works', function() {
          const initial = getState().modelWithObjectState.unusualType
          const next = new Map([['key', 'val']])

          dispatch.modelWithObjectState.setUnusualType(next)
          expect(getState().modelWithObjectState.unusualType).not.to.equal(
            initial
          )
          expect(getState().modelWithObjectState.unusualType).to.equal(next)

          dispatch.modelWithObjectState.resetUnusualType()
          expect(getState().modelWithObjectState.unusualType).not.to.equal(next)
          expect(getState().modelWithObjectState.unusualType).to.equal(initial)
        })
      })
    })
  })
})
