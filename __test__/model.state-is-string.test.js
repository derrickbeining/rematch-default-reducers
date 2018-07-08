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

  context('When model.state is type String', function() {
    context('default reducers/actions', function() {
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

    context('withDefaultReducers(models, {typeCheck: true})', function() {
      context('`meta` argument {typeCheck: true} (default)', function() {
        specify(
          "dispatch.model.set throws TypeError if payload would alter the model's intial interface".format(),
          function() {
            const initial = getState().modelWithStringState

            return dispatch.modelWithStringState.set({}).then(
              (result) => expect(result).not.to.exist,
              (err) => {
                expect(err).to.be.instanceOf(TypeError)
                expect(getState().modelWithStringState).to.deep.equal(initial)
              }
            )
          }
        )
      })

      context('`meta` argument {typeCheck: false}', function() {
        specify(
          "dispatch.model.set allows payload to alter model's interface if passed the `meta` argument {typeCheck: false}".format(),
          function() {
            const initial = getState().modelWithStringState

            return dispatch.modelWithStringState
              .set({}, {typeCheck: false})
              .then((result) => {
                expect(result).not.equals(undefined)
                expect(getState().modelWithStringState).not.deep.equal(initial)
              }, (err) => expect(err).not.to.exist)
          }
        )
      })
    })
  })
})
