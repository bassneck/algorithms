import { factorial } from './index'

describe.each([
  [0, 1],
  [1, 1],
  [2, 2],
  [3, 6],
  [4, 24]
])('factorial(%i)', (a, expected) => {
  it(`returns ${expected}`, () => {
    expect(factorial(a)).toBe(expected)
  })
})