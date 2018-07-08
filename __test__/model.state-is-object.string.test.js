/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
import {init} from '@rematch/core'
import {expect} from 'chai'
import {withDefaultReducers} from '../src/index'
import {modelWithObjectState, models} from './fixtures/models'

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
      context('default reducers/actions', function() {
        specify('dispatch.model.setString works', function() {
          dispatch.modelWithObjectState.setSomeString('hi!')
          expect(getState().modelWithObjectState.someString).not.to.equal(
            modelWithObjectState.state.someString
          )
          expect(getState().modelWithObjectState.someString).to.equal('hi!')
        })

        specify('dispatch.model.resetString works', function() {
          dispatch.modelWithObjectState.setSomeString('hi!')
          expect(getState().modelWithObjectState.someString).not.to.equal(
            modelWithObjectState.state.someString
          )
          expect(getState().modelWithObjectState.someString).to.equal('hi!')

          dispatch.modelWithObjectState.resetSomeString()
          expect(getState().modelWithObjectState.someString).not.to.equal('hi!')
          expect(getState().modelWithObjectState.someString).to.equal(
            modelWithObjectState.state.someString
          )
        })
      })

      context('withDefaultReducers(models, {typeCheck: true})', function() {
        context('`meta` argument {typeCheck: true} (default)', function() {
          specify(
            "dispatch.model.setSomeString throws TypeError if payload would alter the model's intial interface".format(),
            function() {
              const initial = getState().modelWithObjectState.someString

              return dispatch.modelWithObjectState.setSomeString(5).then(
                (result) => expect(result).not.to.exist,
                (err) => {
                  expect(err).to.be.instanceOf(TypeError)
                  expect(getState().modelWithObjectState.someString).to.equal(
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
              const initial = getState().modelWithObjectState.someString

              return dispatch.modelWithObjectState
                .setSomeString(5, {typeCheck: false})
                .then((result) => {
                  expect(result).not.equals(undefined)
                  expect(getState().modelWithObjectState.someString).not.equal(
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
