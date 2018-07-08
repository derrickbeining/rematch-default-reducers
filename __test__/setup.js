import R from 'ramda'
import chai from 'chai'
import asPromised from 'chai-as-promised'

const formatTestDescription = R.pipe(
  R.split(' '),
  R.reduce(
    (accum, str) =>
      R.length(`${R.last(accum)} ${str}`) > 65
        ? R.append(str, accum)
        : R.set(
            R.lensIndex(accum.length - 1),
            `${R.last(accum)} ${str}`,
            accum
          ),
    ['']
  ),
  R.join('\n\t    '),
  R.trim
)

String.prototype.format = function() {
  return formatTestDescription(this.valueOf())
}

export default chai.use(asPromised)
