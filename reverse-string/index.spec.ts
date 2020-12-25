import { reverseString } from './index'

describe.each([
  ['', ''],
  ['a', 'a'],
  ['ab', 'ba'],
  ['abcd', 'dcba'],
  ['Hello World!', '!dlroW olleH']
])('reverseString(%i)', (a, expected) => {
  it(`returns ${expected}`, () => {
    expect(reverseString(a)).toBe(expected)
  })
})