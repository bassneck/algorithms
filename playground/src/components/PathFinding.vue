<template>
  <div class="grid grid-cols-2 px-5 gap-4 p-6 items-start">
    <div>
      <div class="grid grid-flow-row gap-2">
        <input v-model.number="chosenStartNode" type="text" class="bg-gray-600 px-2 py-1" />
        <input v-model.number="chosenTargetNode" type="text" class="bg-gray-600 px-2 py-1" />
        <button @click="findPath()">Find Path</button>
      </div>

      <div>
        {{ JSON.stringify(adjacencyList) }}
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
        class="grid grid-flow-col gap-x-px"
      >
        <div 
          v-for="(col, j) in row" :key="`col-${j}`"
          :class="cellClassBinding(i, j, row.length)"
        >
          {{ getCellId(i, j, row.length) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { gridToAdjacencyList, findPathBreadthFirst, SearchContext } from '../../../path-finding/index'

const grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
]

export default defineComponent({
  setup() {
    const chosenStartNode = ref<number>(0)
    const chosenTargetNode = ref<number>(99)

    const adjacencyList = gridToAdjacencyList(grid)

    const searchContext = ref<SearchContext>()

    function findPath() {
      const generator = findPathBreadthFirst(adjacencyList, chosenStartNode.value, chosenTargetNode.value)

      let interval = window.setInterval(() => {
        const result = generator.next()
        if (result.done) {
          console.log('Finished')
          window.clearInterval(interval)
        }

        console.log(result)
        searchContext.value = result.value!
      }, 250)
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
      chosenStartNode,
      chosenTargetNode,
      getCellId,
      cellClassBinding
    }
  }
});
</script>