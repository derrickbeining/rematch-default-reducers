/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
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
    context('and state.property is type Boolean', function() {
      context('default reducers/actions', function() {
        specify('dispatch.model.setBoolean works', function() {
          const initial = getState().modelWithObjectState.isBoolean
          dispatch.modelWithObjectState.setIsBoolean(!initial)
          expect(getState().modelWithObjectState.isBoolean).to.equal(!initial)
        })

        specify('dispatch.model.resetBoolean works', function() {
          const initial = getState().modelWithObjectState.isBoolean

          dispatch.modelWithObjectState.setIsBoolean(!initial)
          expect(getState().modelWithObjectState.isBoolean).to.equal(!initial)

          dispatch.modelWithObjectState.resetIsBoolean()
          expect(getState().modelWithObjectState.isBoolean).to.equal(initial)
        })
      })

      context('withDefaultReducers(models, {typeCheck: true})', function() {
        context('`meta` argument {typeCheck: true} (default)', function() {
          specify(
            "dispatch.model.setIsBoolean throws TypeError if payload would alter the model's intial interface".format(),
            function() {
              const initial = getState().modelWithObjectState.isBoolean

              return dispatch.modelWithObjectState.setIsBoolean('false').then(
                (result) => expect(result).not.to.exist,
                (err) => {
                  expect(err).to.be.instanceOf(TypeError)
                  expect(getState().modelWithObjectState.isBoolean).to.equal(
                    initial
                  )
                }
              )
            }
          )
        })

        context('`meta` argument {typeCheck: false}', function() {
          specify(
            "dispatch.model.set allows payload to alter model's interface if passed the `meta` argument {typeCheck: false}".format(),
            function() {
              const initial = getState().modelWithObjectState.isBoolean

              return dispatch.modelWithObjectState
                .setIsBoolean('false', {typeCheck: false})
                .then((result) => {
                  expect(result).not.equals(undefined)
                  expect(getState().modelWithObjectState.isBoolean).not.equal(
                    initial
                  )
                }, (err) => expect(err).not.to.exist)
            }
          )
        })
      })
    })
  })
})
