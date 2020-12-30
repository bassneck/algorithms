import { bubbleSort } from './index'

describe.each([
  [[1, 2], [1, 2]],
  [[2, 1], [1, 2]],
  [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
  [[23, 42, 8, 15, 4, 16], [4, 8, 15, 16, 23, 42]]
])('bubbleSort(%o)', (a, expected) => {
  it(`returns ${expected}`, () => {
    expect(bubbleSort(a)).toEqual(expected)
  })
})