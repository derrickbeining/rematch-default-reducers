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

  context('When model.state is unsupported type', function() {
    context('default reducers/actions', function() {
      specify(
        'no default reducers are created for state that is initialized with an unsupported data type'.format(),
        function() {
          const hasUnsupportedReducers = R.pipe(
            R.keys,
            R.length,
            R.lt(0)
          )

          expect(
            hasUnsupportedReducers(dispatch.modelWithUnsupportedState)
          ).to.equal(false)
        }
      )
    })
  })
})