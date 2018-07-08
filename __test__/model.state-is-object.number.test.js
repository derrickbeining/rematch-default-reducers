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
    context('and state.property is type Number', function() {
      context('default reducers/actions', function() {
        specify('dispatch.model.setNumber works', function() {
          const initial = getState().modelWithObjectState.someNumber
          dispatch.modelWithObjectState.setSomeNumber(5)
          expect(getState().modelWithObjectState.someNumber).not.to.equal(
            initial
          )
          expect(getState().modelWithObjectState.someNumber).to.equal(5)
        })

        specify('dispatch.model.resetNumber works', function() {
          const initial = getState().modelWithObjectState.someNumber
          dispatch.modelWithObjectState.setSomeNumber(5)
          expect(getState().modelWithObjectState.someNumber).not.to.equal(
            initial
          )
          expect(getState().modelWithObjectState.someNumber).to.equal(5)

          dispatch.modelWithObjectState.resetSomeNumber()
          expect(getState().modelWithObjectState.someNumber).not.to.equal(5)
          expect(getState().modelWithObjectState.someNumber).to.equal(initial)
        })
      })

      context('withDefaultReducers(models, {typeCheck: true})', function() {
        context('`meta` argument {typeCheck: true} (default)', function() {
          specify(
            "dispatch.model.setSomeNumber throws TypeError if payload would alter the model's intial interface".format(),
            function() {
              const initial = getState().modelWithObjectState.someNumber

              return dispatch.modelWithObjectState.setSomeNumber('5').then(
                (result) => expect(result).not.to.exist,
                (err) => {
                  expect(err).to.be.instanceOf(TypeError)
                  expect(getState().modelWithObjectState.someNumber).to.equal(
                    initial
                  )
                }
              )
            }
          )
        })

        context('`meta` argument {typeCheck: false}', function() {
          specify(
            "dispatch.model.set allows payload to alter model's interface".format(),
            function() {
              const initial = getState().modelWithObjectState.someNumber

              return dispatch.modelWithObjectState
                .setSomeNumber('5', {typeCheck: false})
                .then((result) => {
                  expect(result).not.equals(undefined)
                  expect(getState().modelWithObjectState.someNumber).not.equal(
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
