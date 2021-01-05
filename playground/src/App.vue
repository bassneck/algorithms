<template>
  <PathFinding />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PathFinding from './components/PathFinding.vue'

export default defineComponent({
  components: { PathFinding },
  name: 'App',
});
</script>

<style>
@import 'assets/tailwind.css';

html, body {
  padding: 0;
  margin: 0;
  background: #374151;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  padding: 0;
  margin: 0;

  width: 100vw;
  height: 100vh;
}
</style>
