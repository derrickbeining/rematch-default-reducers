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
    context('and state.property is type Object', function() {
      context('default reducers/actions', function() {
        specify('dispatch.model.setObj works', function() {
          const updater = {
            otherWords: ['charlatan'],
            otherObj: {deep: 'so derp'},
          }
          const expected = R.merge(getState().modelWithObjectState.obj, updater)
          dispatch.modelWithObjectState.setObj(updater)
          const actual = getState().modelWithObjectState.obj

          expect(actual).to.deep.equal(expected)
        })

        specify('dispatch.model.resetObj works', function() {
          const updater = {
            otherString: 'changed!',
            otherNumber: 100,
            otherBoolean: true,
            otherWords: ['charlatan'],
            otherObj: {deep: 'so derp'},
          }

          const expected = getState().modelWithObjectState.obj

          dispatch.modelWithObjectState.setObj(updater)
          dispatch.modelWithObjectState.resetObj()

          const actual = getState().modelWithObjectState.obj
          expect(actual).to.deep.equal(expected)
        })
      })

      context('withDefaultReducers(models, {typeCheck: true})', function() {
        context('`meta` argument {typeCheck: true} (default)', function() {
          specify(
            "dispatch.model.setObj throws TypeError if payload would alter the model's intial interface".format(),
            function() {
              const withWrongType = {
                otherObj: {deep: ['wrong', 'type']},
              }

              const withExcessKey = {
                excessKey: 'not allowed!',
              }

              const initial = getState().modelWithObjectState.obj

              const wrongType = dispatch.modelWithObjectState
                .setObj(withWrongType)
                .then((res) => expect(res).not.to.exist)
                .catch((err) => expect(err).to.be.instanceOf(TypeError))

              const excessKey = dispatch.modelWithObjectState
                .setObj(withExcessKey)
                .then((res) => expect(res).not.to.exist)
                .catch((err) => expect(err).to.be.instanceOf(TypeError))

              const actual = getState().modelWithObjectState.obj

              return Promise.all([
                wrongType,
                excessKey,
                expect(actual).to.deep.equal(initial),
              ])
            }
          )
        })

        context('`meta` argument {typeCheck: false}', function() {
          specify(
            [
              "dispatch.model.setObj allows payload to alter model's interface if",
              'passed the `meta` argument {typeCheck: false}',
            ].join('\n\t'),
            function() {
              const initial = getState().modelWithObjectState.obj
              const withWrongType = {
                otherObj: {deep: ['wrong', 'type']},
              }

              const withExcessKey = {
                excessKey: 'not allowed!',
              }

              const wrongType = dispatch.modelWithObjectState
                .setObj(withWrongType, {
                  typeCheck: false,
                })
                .then((res) => expect(res).to.exist)
                .catch((err) => expect(err).not.to.exist)

              const excessKey = dispatch.modelWithObjectState
                .setObj(withExcessKey, {
                  typeCheck: false,
                })
                .then((res) => expect(res).to.exist)
                .catch((err) => expect(err).not.to.exist)

              const expected = {
                ...initial,
                ...withExcessKey,
                ...withWrongType,
              }

              const actual = getState().modelWithObjectState.obj
              return Promise.all([
                wrongType,
                excessKey,
                expect(actual).to.deep.equal(expected),
              ])
            }
          )
        })
      })
    })
  })
})
