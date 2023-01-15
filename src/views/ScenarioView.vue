<template>
  <div class="scenario" v-if="scenarioData">
    <h1 v-text="scenario"></h1>
    <h2 v-text="scenarioData.best"></h2>
    <ul>
      <li v-for="score in lastScores" :key="score.hash">
        <span v-text="score.score"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'ScenarioView',
  props: {
    scenario: { type: String, required: true }
  },
  data() {
    return {
      scenarioData: null,
      updateListener: null,
    };
  },
  methods: {
    getScenario() {
      let scenarioData = ipcRenderer.sendSync('stats-get-scenario', this.scenario);
      this.scenarioData = scenarioData;
    },
  },
  computed: {
    lastScores() {
      let scores = this.scenarioData.scores;
      return this.scenarioData.scores.slice( scores.length - 10, scores.length)
    },
  },
  watch: {
    scenario: {
      immediate: true,
      handler: function() {
        this.getScenario();
      },
    },
  },
  mounted() {
    this.updateListener = (event, scenario) => {
      if (scenario === this.scenario) {
        this.getScenario();
      }
    };
    ipcRenderer.on('scenario-updated', this.updateListener);
  },
  unmounted() {
    ipcRenderer.removeListener('scenario-updated', this.updateListener);
  },
};
</script>

<style lang="scss" scoped>
.scenario {
  h1 {
    color: red;
  }
}
</style>
