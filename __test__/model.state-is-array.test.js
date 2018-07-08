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

  context('When model.state is type Array', function() {
    context('default reducers/actions', function() {
      specify('dispatch.model.set works', function() {
        const initialState = models.modelWithArrayState.state

        dispatch.modelWithArrayState.set(['howdy'])
        expect(getState().modelWithArrayState).not.to.equal(initialState)
        expect(getState().modelWithArrayState).to.deep.equal(['howdy'])
      })

      specify('dispatch.model.reset works', function() {
        const initialState = models.modelWithArrayState.state

        dispatch.modelWithArrayState.set(['howdy'])
        expect(getState().modelWithArrayState).to.deep.equal(['howdy'])
        dispatch.modelWithArrayState.reset()
        expect(getState().modelWithArrayState).to.deep.equal(initialState)
      })

      //
      // CONCAT
      //

      specify('dispatch.model.concat works', function() {
        const initialState = getState().modelWithArrayState
        const words = ['hi there', 'how ya doin?']
        const expected = [...initialState, ...words]

        dispatch.modelWithArrayState.concat(words)

        const actual = getState().modelWithArrayState
        expect(actual).to.deep.equal(expected)
        expect(actual).not.to.deep.equal(initialState)
      })

      //
      // CONCAT TO
      //

      specify('dispatch.model.concatTo works', function() {
        const initialState = getState().modelWithArrayState
        const words = ['hi there', 'how ya doin?']
        const expected = [...words, ...initialState]

        dispatch.modelWithArrayState.concatTo(words)

        const actual = getState().modelWithArrayState
        expect(actual).to.deep.equal(expected)
        expect(actual).not.to.deep.equal(initialState)
      })

      //
      // FILTER WHERE
      //

      specify('dispatch.model.filterWhere works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']
        dispatch.modelWithArrayState.set([])
        dispatch.modelWithArrayState.concat(words)
        dispatch.modelWithArrayState.filterWhere(R.startsWith('a'))

        const expected = words.filter(R.startsWith('a'))
        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // INSERT WHERE
      //

      specify(
        'dispatch.model.insert({payload, where: predicate}) works',
        function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const predicate = R.equals(words[2])
          const payload = 'kiwi'

          dispatch.modelWithArrayState.set([])
          dispatch.modelWithArrayState.concat(words)
          dispatch.modelWithArrayState.insert({where: predicate, payload})

          const expected = R.converge(R.insert, [
            R.findIndex(predicate),
            R.always(payload),
            R.identity,
          ])(words)

          const actual = getState().modelWithArrayState

          expect(actual).to.deep.equal(expected)
        }
      )

      //
      // INSERT ALL WHERE
      //

      specify(
        'dispatch.model.insertAll({payload, where: predicate}) works',
        function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const predicate = R.equals(words[2])
          const payload = ['kiwi', 'coconut']

          dispatch.modelWithArrayState.set([])
          dispatch.modelWithArrayState.concat(words)
          dispatch.modelWithArrayState.insertAll({payload, where: predicate})

          const expected = R.converge(R.insertAll, [
            R.findIndex(predicate),
            R.always(payload),
            R.identity,
          ])(words)

          const actual = getState().modelWithArrayState

          expect(actual).to.deep.equal(expected)
        }
      )

      //
      // MAP
      //

      specify('dispatch.model.map works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']
        const mapper = R.toUpper

        dispatch.modelWithArrayState.set([])
        dispatch.modelWithArrayState.concat(words)
        dispatch.modelWithArrayState.map(mapper)

        const expected = words.map(mapper)

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // POP
      //

      specify('dispatch.model.pop works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set([])
        dispatch.modelWithArrayState.concat(words)
        dispatch.modelWithArrayState.pop()

        const expected = words.slice(0, -1)

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // POP(N)
      //

      specify('dispatch.model.pop(n) works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set([])
        dispatch.modelWithArrayState.concat(words)
        dispatch.modelWithArrayState.pop(2)

        const expected = words.slice(0, -2)

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // PUSH
      //

      specify('dispatch.model.push works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']
        const word = 'potato'

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.push(word)

        const expected = [...words, word]

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // REMOVE
      //

      specify('dispatch.model.remove works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.remove(words[1])

        const expected = words.filter((el) => el !== words[1])

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // REMOVE WHERE
      //

      specify('dispatch.model.remove({where: predicate}) works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.remove({where: (el, i) => i === 2})

        const expected = words.filter((el) => el !== words[2])

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // REMOVE ALL
      //

      specify('dispatch.model.remove works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.removeAll(R.take(2, words))

        const expected = words.slice(2)

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // REMOVE ALL WHERE
      //

      specify('dispatch.model.remove({where: predicate}) works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.removeAll({where: (el, i) => i >= 2})

        const expected = R.take(2, words)

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // REPLACE
      //

      specify('dispatch.model.replace works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']
        const payload = 'potato'
        const where = R.equals('apricot')

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.replace({where, payload})

        const expected = R.applyTo(words)(
          R.converge(R.set, [
            R.pipe(
              R.findIndex(where),
              R.ifElse(R.lte(0), R.identity, R.always(Infinity)),
              R.lensIndex
            ),
            R.always(payload),
            R.identity,
          ])
        )

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // SHIFT
      //

      specify('dispatch.model.shift works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.shift()

        const [__, ...expected] = words

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // SHIFT(N)
      //

      specify('dispatch.model.shift(n) works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.shift(words.length - 1)

        const expected = [R.last(words)]

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })

      //
      // UNSHIFT
      //

      specify('dispatch.model.unshift works', function() {
        const words = ['apple', 'apricot', 'clementine', 'anana']
        const addition = 'kiwi'

        dispatch.modelWithArrayState.set(words)
        dispatch.modelWithArrayState.unshift(addition)

        const expected = [addition, ...words]

        const actual = getState().modelWithArrayState

        expect(actual).to.deep.equal(expected)
      })
    })
  })

  context('withDefaultReducers(models, {typeCheck: true})', function() {
    context('`meta` argument {typeCheck: true} (default)', function() {
      specify(
        "dispatch.model.set throws TypeError if payload would alter the model's intial interface".format(),
        function() {
          const initial = getState().modelWithArrayState

          return dispatch.modelWithArrayState.set({}).then(
            (result) => expect(result).not.to.exist,
            (err) => {
              expect(err).to.be.instanceOf(TypeError)
              expect(getState().modelWithArrayState).to.deep.equal(initial)
            }
          )
        }
      )
    })

    context('`meta` argument {typeCheck: false}', function() {
      specify(
        "dispatch.model.set allows payload to alter model's interface".format(),
        function() {
          const initial = getState().modelWithArrayState

          return dispatch.modelWithArrayState
            .set({}, {typeCheck: false})
            .then((result) => {
              expect(result).not.equals(undefined)
              expect(getState().modelWithArrayState).not.deep.equal(initial)
            }, (err) => expect(err).not.to.exist)
        }
      )
    })
  })
})
