/* eslint-disable fp/no-unused-expression, fp/no-mutation, fp/no-nil, better/explicit-return */
import * as R from 'ramda'
import {expect} from 'chai'
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

  it(`takes a @rematch/core "models" object, and returns a new "models" object with the same models plus a "reducers" property`, function() {
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
      }),
    )
  })

  it('does not overwrite user-defined reducers with default reducers', function() {
    const modelsWithUserDefinedReducer = {
      someModel: {state: {count: 1}, reducers: {setCount: () => 5}},
    }
    const modelsWithDefaultReducers = withDefaultReducers(
      modelsWithUserDefinedReducer,
    )

    const originalReducer =
      modelsWithUserDefinedReducer.someModel.reducers.setCount

    const processedReducer =
      modelsWithDefaultReducers.someModel.reducers.setCount

    const isNotOverwritten = originalReducer === processedReducer

    expect(isNotOverwritten).to.equal(true)
  })

  it("by default does not allow models' initial state to contain nil values", function() {
    expect(() => withDefaultReducers(modelsWithShallowNull)).to.throw(TypeError)
    expect(() => withDefaultReducers(modelsWithDeepNull)).to.throw(TypeError)
  })

  it('allows initial state to contain nil values if passed the option {allowNil: true}', function() {
    const opts = {allowNil: true}
    const initiateShallowNull = () =>
      withDefaultReducers(modelsWithShallowNull, opts)
    const initiateDeepNull = () => withDefaultReducers(modelsWithDeepNull, opts)

    expect(initiateShallowNull).not.to.throw(TypeError)
    expect(initiateDeepNull).not.to.throw(TypeError)
  })
})
