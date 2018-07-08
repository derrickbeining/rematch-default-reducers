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
    context('default reducers/actions', function() {
      specify('dispatch.model.set works', function() {
        const initial = getState().modelWithObjectState
        const updater = {
          someNumber: 2,
          words: ['hello'],
          obj: {
            otherString: 'do you?',
            otherWords: ['good-bye'],
            otherObj: {deep: 'so derp'},
          },
        }

        const expected = R.mergeDeepRight(initial, updater)
        dispatch.modelWithObjectState.set(updater)
        const actual = getState().modelWithObjectState

        expect(actual).to.deep.equal(expected)
      })

      specify('dispatch.model.reset works', function() {
        const initial = getState().modelWithObjectState
        const updater = {
          someNumber: 2,
          words: ['hello'],
          obj: {
            otherString: 'do you?',
            otherWords: ['good-bye'],
            otherObj: {deep: 'so derp'},
          },
        }

        dispatch.modelWithObjectState.set(updater)
        dispatch.modelWithObjectState.reset()

        const actual = getState().modelWithObjectState
        expect(actual).to.deep.equal(initial)
      })
    })

    context('withDefaultReducers(models, {typeCheck: true})', function() {
      context('`meta` argument {typeCheck: true} (default)', function() {
        specify(
          "dispatch.model.set throws TypeError if payload would alter the model's intial type".format(),
          function() {
            const initial = getState().modelWithObjectState

            return dispatch.modelWithObjectState.set([]).then(
              (result) => expect(result).not.to.exist,
              (err) => {
                expect(err).to.be.instanceOf(TypeError)
                expect(getState().modelWithObjectState).to.deep.equal(initial)
              }
            )
          }
        )

        specify(
          "dispatch.model.set throws TypeError if payload would alter the model's intial interface by adding an excess key".format(),
          function() {
            const initial = getState().modelWithObjectState

            return dispatch.modelWithObjectState.set({excessKey: 'wut'}).then(
              (result) => expect(result).not.to.exist,
              (err) => {
                expect(err).to.be.instanceOf(TypeError)
                expect(getState().modelWithObjectState).to.deep.equal(initial)
              }
            )
          }
        )

        specify(
          "dispatch.model.set throws TypeError if payload would alter the model's intial interface by changing a property's data type".format(),
          function() {
            const initial = getState().modelWithObjectState

            return dispatch.modelWithObjectState
              .set({obj: {otherString: false}})
              .then(
                (result) => expect(result).not.to.exist,
                (err) => {
                  expect(err).to.be.instanceOf(TypeError)
                  expect(getState().modelWithObjectState).to.deep.equal(initial)
                }
              )
          }
        )
      })

      context('`meta` argument {typeCheck: false}', function() {
        specify(
          "dispatch.model.set allows payload to alter model's interface if passed the `meta` argument {typeCheck: false}".format(),
          function() {
            const initial = getState().modelWithObjectState
            const withExcessKey = {excessKey: 'whatevs'}
            return dispatch.modelWithObjectState
              .set({excessKey: 'whatevs'}, {typeCheck: false})
              .then((result) => {
                expect(result).not.equals(undefined)
                expect(getState().modelWithObjectState).to.deep.equal(
                  R.merge(initial, withExcessKey)
                )
              }, (err) => expect(err).not.to.exist)
          }
        )

        specify(
          "dispatch.model.set allows payload to alter model's type if passed the `meta` argument {typeCheck: false}".format(),
          function() {
            return dispatch.modelWithObjectState
              .set([], {typeCheck: false})
              .then((result) => {
                expect(result).not.equals(undefined)
                expect(getState().modelWithObjectState).to.deep.equal([])
              }, (err) => expect(err).not.to.exist)
          }
        )
      })
    })
  })
})
