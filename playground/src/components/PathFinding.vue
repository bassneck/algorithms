<template>
  <div class="grid grid-cols-2 px-5 gap-4 p-6 items-start">
    <div>
      <div class="grid grid-flow-row gap-2">
        <select v-model="chosenAlgorithm" class="bg-gray-600 px-2 py-1">
          <option v-for="option in algorithms" :key="option.name" :value="option">
            {{ option.name }}
          </option>
        </select>
        <input v-model.number="chosenStartNode" type="text" class="bg-gray-600 px-2 py-1" />
        <input v-model.number="chosenTargetNode" type="text" class="bg-gray-600 px-2 py-1" />
        <button @click="findPath()">Find Path</button>
      </div>

      <div class="grid grid-flow-row gap-2 py-8">
        <div>
          currentNode: {{ searchContext?.currentNode }}
        </div>
        <div>
          visitedNodes: {{ searchContext?.visitedNodes }}
        </div>
        <div>
          queue: {{ searchContext?.queue }}
        </div>
      </div>
    </div>

    <div class="grid grid-flow-row gap-px">
      <div 
        v-for="(row, i) in grid.cells" :key="`row-${i}`"
        class="grid grid-flow-col auto-cols-fr gap-x-px h-8"
      >
        <div 
          v-for="(col, j) in row" :key="`col-${j}`"
          :class="['text-xs', cellClassBinding(grid, i, j)]"
        >
          {{ grid.cellId(i, j) }}
          <template v-if="`${grid.cellId(i, j)}` === chosenStartNode">
            🕵️‍♀️
          </template>
          <template v-if="`${grid.cellId(i, j)}` === chosenTargetNode">
            🍰
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { Grid, gridToGraph, gridCellId } from '../../../path-finding/grid'
import { traverseBreadthFirst, traverseDepthFirst, SearchContext } from '../../../path-finding/index'

const gridDefinition = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
]

function nextUntilDone(generator: Generator, ms: number, callback: (...arg: any) => any) {
  let interval = window.setInterval(() => {
    const result = generator.next()
    if (result.done) {
      console.log('Finished')
      window.clearInterval(interval)
    }

    callback(result)
  }, ms)
}

export default defineComponent({
  setup() {
    const algorithms = [
      { name: 'BFS', func: traverseBreadthFirst },
      { name: 'DFS', func: traverseDepthFirst },
    ]
    const chosenStartNode = ref<string>('0')
    const chosenTargetNode = ref<string>('137')
    const chosenAlgorithm = ref<{ name: string, func: Function}>(algorithms[0])

    const grid = new Grid(gridDefinition)
    const graph = gridToGraph(grid)

    const searchContext = ref<SearchContext>()

    function findPath() {
      const generator = chosenAlgorithm.value.func(graph, chosenStartNode.value.toString(), chosenTargetNode.value.toString())

      nextUntilDone(generator, 25, (result) => {
        searchContext.value = result.value!
      })
    }

    function cellClassBinding(grid: Grid, row: number, col: number) {
      const cellId = grid.cellId(row, col).toString()
      const cellValue = grid.cellAt(row, col)
      const searchContextValue = searchContext.value

      if (cellValue === 1) {
        return 'bg-gray-900'
      } else if (searchContextValue?.startNode === cellId) {
        return 'bg-yellow-400'
      } else if (searchContextValue?.targetNode === cellId) {
        return 'bg-yellow-600'
      } else if (searchContextValue?.queue?.includes(cellId)) {
        return 'bg-green-200'
      } else if (searchContextValue?.visitedNodes?.includes(cellId)) {
        return 'bg-green-400'
      } else {
        return 'bg-gray-600'
      }
    }

    return {
      grid: grid,
      graph,
      searchContext,
      findPath,
      algorithms,
      chosenAlgorithm,
      chosenStartNode,
      chosenTargetNode,
      gridCellId,
      cellClassBinding
    }
  }
});
</script>