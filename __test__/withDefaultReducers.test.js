/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
import * as R from 'ramda'
import {expect} from 'chai'
import {init} from '@rematch/core'
import {withDefaultReducers} from '../src/index'
import {
  modelsWithShallowNull,
  modelsWithDeepNull,
  models,
} from './fixtures/models'

describe('withDefaultReducers', function() {
  it('exists as a Function', function() {
    expect(withDefaultReducers).to.be.instanceOf(Function)
  })

  it(
    `takes a @rematch/core "models" object, and returns a new "models" object with the same models plus a "reducers" property`.format(),
    function() {
      const newModels = withDefaultReducers(models)
      const isNewObject = R.not(R.identical(models, newModels))

      expect(isNewObject).to.equal(true)
      expect(newModels).to.satisfy(
        R.where({
          modelWithObjectState: R.where({
            state: R.equals(models.modelWithObjectState.state),
            reducers: R.o(R.equals('Object'), R.type),
          }),
          modelWithArrayState: R.where({
            state: R.equals(models.modelWithArrayState.state),
            reducers: R.o(R.equals('Object'), R.type),
          }),
          modelWithStringState: R.where({
            state: R.equals(models.modelWithStringState.state),
            reducers: R.o(R.equals('Object'), R.type),
          }),
          modelWithNumberState: R.where({
            state: R.equals(models.modelWithNumberState.state),
            reducers: R.o(R.equals('Object'), R.type),
          }),
          modelWithBooleanState: R.where({
            state: R.equals(models.modelWithBooleanState.state),
            reducers: R.o(R.equals('Object'), R.type),
          }),
        })
      )
    }
  )

  it('does not overwrite user-defined reducers with default reducers', function() {
    const modelsWithUserDefinedReducer = {
      someModel: {state: {count: 1}, reducers: {setCount: () => 5}},
    }
    const modelsWithDefaultReducers = withDefaultReducers(
      modelsWithUserDefinedReducer
    )

    const originalReducer =
      modelsWithUserDefinedReducer.someModel.reducers.setCount

    const processedReducer =
      modelsWithDefaultReducers.someModel.reducers.setCount

    const isNotOverwritten = originalReducer === processedReducer

    expect(isNotOverwritten).to.equal(true)
  })

  context('Options', function() {
    context('allowNil: boolean', function() {
      it(
        "by default will throw TypeError if models' initial state contain null/undefined".format(),
        function() {
          expect(() => withDefaultReducers(modelsWithShallowNull)).to.throw(
            TypeError
          )
          expect(() => withDefaultReducers(modelsWithDeepNull)).to.throw(
            TypeError
          )
        }
      )

      specify(
        'if passed the option {allowNil: true}, initial state may contain null/undefined values'.format(),
        function() {
          const opts = {allowNil: true}
          const initiateShallowNull = () =>
            withDefaultReducers(modelsWithShallowNull, opts)
          const initiateDeepNull = () =>
            withDefaultReducers(modelsWithDeepNull, opts)

          expect(initiateShallowNull).not.to.throw(TypeError)
          expect(initiateDeepNull).not.to.throw(TypeError)
        }
      )
    })

    context('typeCheck', function() {
      specify(
        'by default, reducer actions will throw a TypeError when dispatched if they attempt to set a value onto a model that is not of the same type as the value with which that part of the model was initialized'.format(),
        function() {
          const {dispatch, getState} = init({
            models: withDefaultReducers({numberModel: {state: 0}}),
          })

          const result = dispatch.numberModel
            .set('not a number')
            .then((res) => expect(res).not.to.exist)
            .catch((err) => expect(err).to.be.instanceOf(TypeError))

          expect(getState().numberModel).not.to.equal('not a number')
          expect(getState().numberModel).to.equal(0)

          return result
        }
      )

      specify(
        "if passed the option {typeCheck: false}, it allows actions to set values onto models that are not of the same type as the values with which the model's state was initialized".format(),
        function() {
          const {dispatch, getState} = init({
            models: withDefaultReducers(
              {numberModel: {state: 0}},
              {typeCheck: false}
            ),
          })

          const result = dispatch.numberModel
            .set('not a number')
            .catch((err) => expect(err).not.to.exist)

          expect(getState().numberModel).to.equal('not a number')
          expect(getState().numberModel).not.to.equal(0)

          return result
        }
      )
    })
  })
})
