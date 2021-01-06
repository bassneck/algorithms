import { Graph } from './graph'

export class Grid {
  constructor(
    public readonly cells: number[][]
  ) { }

  get width() {
    return this.cells[0].length
  }

  get height() {
    return this.cells.length
  }

  row(rowId: number): number[] {
    return this.cells[rowId]
  }

  cellAt(row: number, col: number): number {
    return this.cells[row][col]
  }

  cellId(row: number, col: number) {
    return row * this.width + col
  }

  isInBounds(row: number, col: number): boolean {
    if (row < 0) return false
    if (col < 0) return false
    if (row > this.height - 1) return false
    if (col > this.width - 1) return false
    return true
  }
}

export function gridCellId(grid: number[][], row: number, col: number) {
  const width = grid[0].length
  return row * width + col
}

export function gridToGraph(grid: Grid): Graph {
  const graph = new Graph()

  function tryNeighbour(grid: Grid, graph: Graph, node: string, row: number, col: number) {
    if (!grid.isInBounds(row, col)) return

    if (grid.cellAt(row, col) === 0) {
      const neighbourLabel = grid.cellId(row, col).toString()
      const neighbour = graph.addNode(neighbourLabel)
      graph.addEdge(node, neighbour)
    }
  }

  for (let i = 0; i < grid.width; i++) {
    const row = grid.row(i)

    for (let j = 0; j < row.length; j++) {
      const nodeLabel = grid.cellId(i, j).toString()
      const node = graph.addNode(nodeLabel)
      
      // node above
      tryNeighbour(grid, graph, node, i - 1, j)

      // node on the right
      tryNeighbour(grid, graph, node, i, j + 1)

      // node below
      tryNeighbour(grid, graph, node, i + 1, j)

      // node on the left
      tryNeighbour(grid, graph, node, i, j - 1)
    }
  }

  return graph
}