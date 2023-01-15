<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ul>
      <li v-for="scenario in scenarios" :key="scenario.id">
        {{ scenario }}
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import { ipcRenderer } from 'electron';

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      scenarios: [],
    }
  },
  methods: {
    async getScenarios() { // Get scenarios from the IPC
      let scenarios = ipcRenderer.sendSync('stats-get-scenarios');
      this.scenarios = scenarios;
    },
  },
  mounted() {
    this.getScenarios();
  },
}
</script>
