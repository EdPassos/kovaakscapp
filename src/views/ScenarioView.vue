<template>
  <div class="scenario">
    <h1 v-text="scenario"></h1>
    <h2 v-text="scenarioData.best" v-if="scenarioData"></h2>
    <h2 v-text="average"></h2>
    <h2 v-text="movingAverage"></h2>

    <ScoreGraph :scenario="scenarioData" v-if="scenarioData"></ScoreGraph>

    <div class="sort" v-if="scenarioData">
      <button
        v-for="key in Object.keys(scenarioData.scores[0])"
        :key="key"
        :class="{ 'active': sortBy === key }"
        @click="sortBy = key; sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'">
        {{ key }}
      </button>
    </div>

    <ul v-if="scenarioData">
      <li v-for="score, index in scenarioData.scores" :key="score.played_at">
        <div class="score">
          <span v-text="score.score"></span>
          <span
            class="diff"
            :class="{ 'negative': scoreDiff(score, index) < 0 }"
            v-text="scoreDiff(score, index)"
            v-if="index != scenarioData.scores.length - 1">
          </span>
          <span v-text="score.movingAverage"></span>
        </div>
        <span v-text="scoreDateFormat(score)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

import ScoreGraph from '@/components/ScoreGraph.vue'

export default {
  name: 'ScenarioView',
  components: {
    ScoreGraph
  },
  props: {
    scenario: { type: String, required: true }
  },
  data() {
    return {
      scenarioData: null,
      updateListener: null,
      sortBy: 'played_at',
      sortOrder: 'desc',
      chart: null,
    };
  },
  methods: {
    scoreDiff(score, index) {
      if (index != this.scenarioData.scores.length - 1) {
        let diff = score.score - this.scenarioData.scores[index + 1].score;
        return diff > 0 ? `+${diff}` : diff;
      }
      return 0;
    },
    scoreDateFormat(score) {
      // compact date format with time in a 24-hour clock
      let played_at = new Date(score.played_at);
      return played_at.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }, 
    getScenario() {
      this.scenarioData = ipcRenderer.sendSync('stats-get-scenario', this.scenario);
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
    color: var(--main-color);
  }
  ul {
    max-width: 400px;
    margin: 0 auto;
    li {
      display: flex;
      justify-content: space-between;

      .score {
        display: flex;
        align-items: center;
        .diff {
          margin-left: 10px;
          color: var(--main-color);
          &.negative {
            color: red;
          }
        }
      }

    }
  }
}
</style>
