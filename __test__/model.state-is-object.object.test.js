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
    context('and state.property is type Object', function() {
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

      specify(
        "dispatch.model.setObj prevents changing the model's intial interface",
        function() {
          const withWrongType = {
            otherObj: {deep: ['wrong', 'type']},
          }

          const withExcessKey = {
            excessKey: 'not allowed!',
          }
          const initial = getState().modelWithObjectState.obj
          dispatch.modelWithObjectState.setObj(withWrongType)
          dispatch.modelWithObjectState.setObj(withExcessKey)
          const actual = getState().modelWithObjectState.obj

          expect(actual).to.deep.equal(initial)
        },
      )

      specify(
        'dispatch.model.setObj(alteredAPI, {typeCheck: false}) works',
        function() {
          const initial = getState().modelWithObjectState.obj
          const withWrongType = {
            otherObj: {deep: ['wrong', 'type']},
          }

          const withExcessKey = {
            excessKey: 'not allowed!',
          }

          dispatch.modelWithObjectState.setObj(withWrongType, {
            typeCheck: false,
          })
          dispatch.modelWithObjectState.setObj(withExcessKey, {
            typeCheck: false,
          })

          const expected = {
            ...initial,
            ...withExcessKey,
            ...withWrongType,
          }
          const actual = getState().modelWithObjectState.obj
          expect(actual).to.deep.equal(expected)
        },
      )
    })
  })
})
