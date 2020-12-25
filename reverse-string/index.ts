function recursiveReverseString(originalString: string, reversedString: string | undefined): string {
  if (originalString.length === 0) {
    return reversedString;
  } else {
    const last = originalString.slice(-1)
    const rest = originalString.slice(0, -1)

    return recursiveReverseString(rest, `${reversedString}${last}`)
  }
}

export function reverseString(string: string): string {
  return recursiveReverseString(string, '')
}