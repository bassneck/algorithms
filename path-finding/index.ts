import { Graph } from './graph'
export interface SearchContext {
  startNode: string,
  targetNode: string,
  currentNode: string,
  visitedNodes: string[],
  queue: string[]
}

type PathNode = [node: number, parent?: number]

export function * traverseBreadthFirst(graph: Graph, startNode: string, targetNode: string): Generator<SearchContext> {
  const queue: string[] = [startNode]
  const visitedNodes: string[] = []

  while (queue.length > 0) {
    const currentNode = queue.shift()!

    const adjacentNodes = graph.adjacentNodes(currentNode)
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

export function * traverseDepthFirst(graph: Graph, startNode: string, targetNode: string): Generator<SearchContext> {
  const queue: string[] = [startNode]
  const visitedNodes: string[] = []

  while (queue.length > 0) {
    const currentNode = queue.pop()!

    const adjacentNodes = graph.adjacentNodes(currentNode)
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