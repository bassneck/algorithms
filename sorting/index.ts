export function bubbleSort(array: any[]): any[] {
  const result = [...array]

  let swapped = false

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i; j++) {
      if (result[j] > result[j + 1]) {
        const temp = result[j + 1]
        
        result[j + 1] = result[j]
        result[j] = temp

        swapped = true
      }
    }

    if (!swapped) {
      break
    }
  }

  return result
}