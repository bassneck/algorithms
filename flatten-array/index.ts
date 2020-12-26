export function flattenArray(array: any[]): any[] {
  const result: any[] = []

  array.forEach((item) => {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item))
    } else {
      result.push(item)
    }
  })

  return result
}