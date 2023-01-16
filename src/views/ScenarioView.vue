<template>
  <div class="scenario" v-if="scenarioData">
    <h1 v-text="scenario"></h1>
    <h2 v-text="scenarioData.best"></h2>
    <h2 v-text="average"></h2>
    <h2 v-text="movingAverage"></h2>
    <ul>
      <li v-for="score in scenarioData.scores" :key="score.hash">
        <span v-text="score.score"></span>
        <span v-text="scoreDateFormat(score)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { sort } from '../utils/sort.js'

export default {
  name: 'ScenarioView',
  props: {
    scenario: { type: String, required: true }
  },
  data() {
    return {
      scenarioData: null,
      updateListener: null,
      sortBy: 'played_at',
      sortOrder: 'desc',
    };
  },
  methods: {
    scoreDateFormat(score) {
      // compact date format with time in a 24-hour clock
      return score.played_at.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }, 
    getScenario() {
      let scenarioData = ipcRenderer.sendSync('stats-get-scenario', this.scenario);
      this.scenarioData = scenarioData;
    },
  },
  computed: {
    average() {
      if (this.scenarioData) {
        let total = 0;
        this.scenarioData.scores.forEach(score => {
          total += score.score;
        });
        return total / this.scenarioData.scores.length;
      }
      return 0;
    },
    movingAverage() {
      if (this.scenarioData) {
        let total = 0;
        let scores = this.scenarioData.scores.slice(0, 5);
        scores.forEach(score => {
          total += score.score;
        });
        return total / scores.length;
      }
      return 0;
    },
  },
  watch: {
    scenario: {
      immediate: true,
      handler: function() {
        this.getScenario();
      },
    },
    scenarioData: {
      immediate: true,
      handler() {
        sort(this.scenarioData.scores, this.sortBy, this.sortOrder);
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
  ul {
    max-width: 400px;
    margin: 0 auto;
    li {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
