import { fibonacci } from './index';

describe.each([
  [0, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 5],
  [6, 8],
  [7, 13],
  [8, 21]
])('fibonacci(%i)', (a, expected) => {
  it(`returns ${expected}`, () => {
    expect(fibonacci(a)).toBe(expected)
  })
})