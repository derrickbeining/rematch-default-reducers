export const modelWithObjectState = {
  state: {
    isBoolean: true,
    someString: 'true',
    someNumber: 1,
    words: [],
    obj: {
      otherString: 'idk',
      otherNumber: 10,
      otherBoolean: false,
      otherWords: [],
      otherObj: {deep: 'so deep'},
    },
    unsupported: new Map(),
  },
}

export const modelWithArrayState = {
  state: ['of mind'],
}

export const modelWithStringState = {
  state: 'string',
}

export const modelWithBooleanState = {
  state: true,
}

export const modelWithNumberState = {
  state: 0,
}

export const modelWithUnsupportedState = {
  state: new Map(),
}

export const modelsWithShallowNull = {
  invalidModel: {
    state: null,
  },
}

export const modelsWithDeepNull = {
  invalidModel: {
    state: {
      someAttr: {
        deep: null,
      },
    },
  },
}

export const models = {
  modelWithObjectState,
  modelWithArrayState,
  modelWithStringState,
  modelWithBooleanState,
  modelWithNumberState,
  modelWithUnsupportedState,
}
