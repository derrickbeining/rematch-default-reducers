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
    context('and state.property is type Array', function() {
      context('default reducers/actions', function() {
        //
        // MODEL.STATE = {}; ARRAY-PROP # SET
        //

        specify('dispatch.model.setWords works', function() {
          dispatch.modelWithObjectState.setWords([1, 2])
          const actual = getState().modelWithObjectState.words
          expect(actual).to.deep.equal([1, 2])
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # RESET
        //

        specify('dispatch.model.resetWords works', function() {
          const initialState = getState().modelWithObjectState.words
          dispatch.modelWithObjectState.setWords([1, 2])
          dispatch.modelWithObjectState.resetWords()

          const actual = getState().modelWithObjectState.words
          expect(actual).to.deep.equal(initialState)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # CONCAT
        //

        specify('dispatch.model.concatWords works', function() {
          dispatch.modelWithObjectState.setWords([])
          const initialState = getState().modelWithObjectState.words
          const words = ['hi there', 'how ya doin?']
          const expected = [...initialState, ...words]

          dispatch.modelWithObjectState.concatWords(words)

          const actual = getState().modelWithObjectState.words
          expect(actual).to.deep.equal(expected)
          expect(actual).not.to.deep.equal(initialState)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # CONCAT TO
        //

        specify('dispatch.model.concatWordsTo works', function() {
          dispatch.modelWithObjectState.setWords([])
          const initialState = getState().modelWithObjectState.words
          const words = ['hi there', 'how ya doin?']
          const expected = [...words, ...initialState]

          dispatch.modelWithObjectState.concatWordsTo(words)

          const actual = getState().modelWithObjectState.words
          expect(actual).to.deep.equal(expected)
          expect(actual).not.to.deep.equal(initialState)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # FILTER WHERE
        //

        specify('dispatch.model.filterWordsWhere works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          dispatch.modelWithObjectState.setWords([])
          dispatch.modelWithObjectState.concatWords(words)
          dispatch.modelWithObjectState.filterWordsWhere(R.startsWith('a'))

          const expected = words.filter(R.startsWith('a'))
          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # INSERT WHERE
        //

        specify(
          'dispatch.model.insertWord({payload, where: predicate}) works',
          function() {
            const words = ['apple', 'apricot', 'clementine', 'anana']
            const predicate = R.equals(words[2])
            const payload = 'kiwi'

            dispatch.modelWithObjectState.setWords([])
            dispatch.modelWithObjectState.concatWords(words)
            dispatch.modelWithObjectState.insertWord({
              payload,
              where: predicate,
            })

            const expected = R.converge(R.insert, [
              R.findIndex(predicate),
              R.always(payload),
              R.identity,
            ])(words)

            const actual = getState().modelWithObjectState.words

            expect(actual).to.deep.equal(expected)
          }
        )

        //
        // MODEL.STATE = {}; ARRAY-PROP # INSERT ALL WHERE
        //

        specify(
          'dispatch.model.insertWords({payload, where: predicate}) works',
          function() {
            const words = ['apple', 'apricot', 'clementine', 'anana']
            const predicate = R.equals(words[2])
            const payload = ['kiwi', 'coconut']

            dispatch.modelWithObjectState.setWords([])
            dispatch.modelWithObjectState.concatWords(words)
            dispatch.modelWithObjectState.insertWords({
              payload,
              where: predicate,
            })

            const expected = R.converge(R.insertAll, [
              R.findIndex(predicate),
              R.always(payload),
              R.identity,
            ])(words)

            const actual = getState().modelWithObjectState.words

            expect(actual).to.deep.equal(expected)
          }
        )

        //
        // MODEL.STATE = {}; ARRAY-PROP # MAP
        //

        specify('dispatch.model.mapWords works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const mapper = R.toUpper

          dispatch.modelWithObjectState.setWords([])
          dispatch.modelWithObjectState.concatWords(words)
          dispatch.modelWithObjectState.mapWords(mapper)

          const expected = words.map(mapper)

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # POP
        //

        specify('dispatch.model.popWords works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords([])
          dispatch.modelWithObjectState.concatWords(words)
          dispatch.modelWithObjectState.popWords()

          const expected = words.slice(0, -1)

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # POP(N)
        //

        specify('dispatch.model.popWords(n) works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords([])
          dispatch.modelWithObjectState.concatWords(words)
          dispatch.modelWithObjectState.popWords(2)

          const expected = words.slice(0, -2)

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # PUSH
        //

        specify('dispatch.model.pushWord works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const word = 'potato'

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.pushWord(word)

          const expected = [...words, word]

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # REMOVE
        //

        specify('dispatch.model.removeWord works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.removeWord(words[1])

          const expected = words.filter((el) => el !== words[1])

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # REMOVE WHERE
        //

        specify(
          'dispatch.model.removeWords({where: predicate}) works',
          function() {
            const words = ['apple', 'apricot', 'clementine', 'anana']

            dispatch.modelWithObjectState.setWords(words)
            dispatch.modelWithObjectState.removeWord({
              where: (el, i) => i === 2,
            })

            const expected = words.filter((el) => el !== words[2])

            const actual = getState().modelWithObjectState.words

            expect(actual).to.deep.equal(expected)
          }
        )

        //
        // MODEL.STATE = {}; ARRAY-PROP # REMOVE ALL
        //

        specify('dispatch.model.remove works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.removeWords(R.take(2, words))

          const expected = words.slice(2)

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # REMOVE ALL WHERE
        //

        specify('dispatch.model.remove({where: predicate}) works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.removeWords({where: (el, i) => i >= 2})

          const expected = R.take(2, words)

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # REPLACE
        //

        specify('dispatch.model.replaceWord works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const payload = 'potato'
          const where = R.equals('apricot')

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.replaceWord({where, payload})

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

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # REPLACE
        //

        specify('dispatch.model.replaceWord works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const payload = 'potato'
          const where = R.equals('apricot')

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.replaceWord({where, payload})

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

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # SHIFT
        //

        specify('dispatch.model.shiftWords works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.shiftWords()

          const [first, ...expected] = words

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # SHIFT(N)
        //

        specify('dispatch.model.shift(n) works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.shiftWords(words.length - 1)

          const expected = [R.last(words)]

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })

        //
        // MODEL.STATE = {}; ARRAY-PROP # UNSHIFT
        //

        specify('dispatch.model.unshift works', function() {
          const words = ['apple', 'apricot', 'clementine', 'anana']
          const addition = 'kiwi'

          dispatch.modelWithObjectState.setWords(words)
          dispatch.modelWithObjectState.unshiftWords(addition)

          const expected = [addition, ...words]

          const actual = getState().modelWithObjectState.words

          expect(actual).to.deep.equal(expected)
        })
      })

      context('withDefaultReducers(models, {typeCheck: true})', function() {
        context('`meta` argument {typeCheck: true} (default)', function() {
          specify(
            "dispatch.model.setWords throws TypeError if payload would alter the model's intial interface".format(),
            function() {
              const initial = getState().modelWithObjectState.words

              return dispatch.modelWithObjectState
                .setWords('I should be an array')
                .then(
                  (result) => expect(result).not.to.exist,
                  (err) => {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(getState().modelWithObjectState.words).to.deep.equal(
                      initial
                    )
                  }
                )
            }
          )
        })

        context('`meta` argument {typeCheck: false}', function() {
          specify(
            "dispatch.model.set allows payload to alter model's interface if passed the `meta` argument {typeCheck: false}".format(),
            function() {
              const initial = getState().modelWithObjectState.words

              return dispatch.modelWithObjectState
                .setWords('I should be an array', {typeCheck: false})
                .then((result) => {
                  expect(result).not.equals(undefined)
                  expect(getState().modelWithObjectState.words).not.deep.equal(
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
