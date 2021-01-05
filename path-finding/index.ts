export function gridToAdjacencyList(grid: number[][]): number[][] {
  const result: number[][] = []

  function cellId(row: number, col: number, maxCol: number) {
    return (row + col + ((maxCol - 1) * row))
  }

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i]

    for (let j = 0; j < row.length; j++) {
      const nodeId = cellId(i, j, row.length)
      const nodeValue = row[j]
      const adjacentNodes: number[] = []
      
      if (i > 0) {
        // node above
        if (grid[i - 1][j] === 0) {
          adjacentNodes.push(cellId(i - 1, j, row.length))
        }
      }

      if (j < row.length - 1) {
        // node on the right
        if (grid[i][j + 1] === 0) {
          adjacentNodes.push(cellId(i, j + 1, row.length))
        }
      }

      if (i < grid.length - 1) {
        // node below
        if (grid[i + 1][j] === 0) {
          adjacentNodes.push(cellId(i + 1, j, row.length))
        }
      }

      if (j > 0) {
        // node on the left
        if (grid[i][j - 1] === 0) {
          adjacentNodes.push(cellId(i, j - 1, row.length))
        }
      }

      result.push(adjacentNodes)
    }
  }

  return result
}

export interface SearchContext {
  startNode: number,
  targetNode: number,
  currentNode: number,
  visitedNodes: number[],
  queue: number[]
}

export function * findPathBreadthFirst(adjacencyList: number[][], startNode: number, targetNode: number): Generator<SearchContext> {
  const queue: number[] = [startNode]
  const visitedNodes: number[] = []

  while (queue.length > 0) {
    const currentNode = queue.shift()!

    const adjacentNodes = adjacencyList[currentNode]
    visitedNodes.push(currentNode)

    yield { startNode, targetNode, currentNode, visitedNodes, queue }

    for (const node of adjacentNodes) {
      if (node === targetNode) {
        return { startNode, targetNode, currentNode, visitedNodes, queue }
      } else if (!visitedNodes.includes(node) && !queue.includes(node)) {
        queue.push(node)
      }
    }
  }
}

export function * findPathDepthFirst(adjacencyList: number[][], startNode: number, targetNode: number): Generator<SearchContext> {
  const queue: number[] = [startNode]
  const visitedNodes: number[] = []

  while (queue.length > 0) {
    const currentNode = queue.pop()!

    const adjacentNodes = adjacencyList[currentNode]
    visitedNodes.push(currentNode)

    yield { startNode, targetNode, currentNode, visitedNodes, queue }

    for (const node of adjacentNodes) {
      if (node === targetNode) {
        return { startNode, targetNode, currentNode, visitedNodes, queue }
      } else if (!visitedNodes.includes(node) && !queue.includes(node)) {
        queue.push(node)
      }
    }
  }
}