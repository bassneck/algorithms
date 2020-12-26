import { flattenArray } from './index'

describe.each([
  [[], []],
  [[1, 2, [3]], [1, 2, 3]],
  [[1, [2, [3]]], [1, 2, 3]],
  [[[1, 2, 3]], [1, 2, 3]]
])('flattenArray(%i)', (a, expected) => {
  it(`returns ${expected}`, () => {
    expect(flattenArray(a)).toEqual(expected)
  })
})