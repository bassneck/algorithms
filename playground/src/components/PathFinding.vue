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
        v-for="(row, i) in grid" :key="`row-${i}`"
        class="grid grid-flow-col auto-cols-fr gap-x-px h-8"
      >
        <div 
          v-for="(col, j) in row" :key="`col-${j}`"
          :class="['text-xs', cellClassBinding(i, j, row.length)]"
        >
          {{ getCellId(i, j, row.length) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, unref } from 'vue';
import { gridToAdjacencyList, findPathBreadthFirst, findPathDepthFirst, SearchContext } from '../../../path-finding/index'

const grid = [
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

    console.log(result)
    callback(result)
  }, ms)
}

export default defineComponent({
  setup() {
    const algorithms = [
      { name: 'BFS', func: findPathBreadthFirst },
      { name: 'DFS', func: findPathDepthFirst },
    ]
    const chosenStartNode = ref<number>(0)
    const chosenTargetNode = ref<number>(137)
    const chosenAlgorithm = ref<{ name: string, func: Function}>(algorithms[0])

    const adjacencyList = gridToAdjacencyList(grid)

    const searchContext = ref<SearchContext>()

    function findPath() {
      const generator = chosenAlgorithm.value.func(adjacencyList, chosenStartNode.value, chosenTargetNode.value)

      nextUntilDone(generator, 25, (result) => {
        searchContext.value = result.value!
      })
    }

    function getCellId(row: number, col: number, maxCol: number): number {
      return (row + col + ((maxCol - 1) * row))
    }

    function cellClassBinding(row: number, col: number, width: number) {
      const cellId = getCellId(row, col, width)
      const cellValue = grid[row][col]
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
      adjacencyList,
      searchContext,
      findPath,
      algorithms,
      chosenAlgorithm,
      chosenStartNode,
      chosenTargetNode,
      getCellId,
      cellClassBinding
    }
  }
});
</script>