export class Graph {
  nodes: { [key: string]: string } = {}
  edges: { [key: string]: string[] } = {}

  addNode(label: string): string {
    return this.nodes[label] = label
  }

  addEdge(node1: string, node2: string) {
    if (!this.edges[node1]) {
      this.edges[node1] = []
    }
    this.edges[node1].push(node2)
  }

  adjacentNodes(node: string): string[] {
    return this.edges[node]
  }
}
