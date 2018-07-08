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

  context('When model.state is type Number', function() {
    context('default reducers/actions', function() {
      specify('dispatch.model.set works', function() {
        const initialState = getState().modelWithNumberState
        const newState = initialState + 1

        dispatch.modelWithNumberState.set(newState)
        expect(getState().modelWithNumberState).not.to.equal(initialState)
        expect(getState().modelWithNumberState).to.equal(newState)
      })

      specify('dispatch.model.reset works', function() {
        const initialState = getState().modelWithNumberState
        const newState = initialState + 1

        dispatch.modelWithNumberState.set(newState)
        expect(getState().modelWithNumberState).to.equal(newState)
        dispatch.modelWithNumberState.reset()
        expect(getState().modelWithNumberState).to.equal(initialState)
      })
    })

    context('withDefaultReducers(models, {typeCheck: true})', function() {
      context('`meta` argument {typeCheck: true} (default)', function() {
        specify(
          "dispatch.model.set throws TypeError if payload would alter the model's intial interface".format(),
          function() {
            const initial = getState().modelWithNumberState

            return dispatch.modelWithNumberState.set({}).then(
              (result) => expect(result).not.to.exist,
              (err) => {
                expect(err).to.be.instanceOf(TypeError)
                expect(getState().modelWithNumberState).to.deep.equal(initial)
              }
            )
          }
        )
      })

      context('`meta` argument {typeCheck: false}', function() {
        specify(
          "dispatch.model.set allows payload to alter model's interface if passed the `meta` argument {typeCheck: false}".format(),
          function() {
            const initial = getState().modelWithNumberState

            return dispatch.modelWithNumberState
              .set({}, {typeCheck: false})
              .then((result) => {
                expect(result).not.equals(undefined)
                expect(getState().modelWithNumberState).not.deep.equal(initial)
              }, (err) => expect(err).not.to.exist)
          }
        )
      })
    })
  })
})
