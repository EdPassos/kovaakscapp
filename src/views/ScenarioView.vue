<template>
  <div class="scenario">
    <h1 v-text="scenario"></h1>
    <h2 v-text="scenarioData.best" v-if="scenarioData"></h2>
    <h2 v-text="average"></h2>
    <h2 v-text="movingAverage"></h2>

    <div class="graph">
      <canvas ref="chart" width="400" height="400"></canvas>
    </div>

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
      <li v-for="score, index in scenarioData.scores" :key="score.hash">
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
import { sort } from '../utils/sort.js'
import Chart from 'chart.js/auto'

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
      return score.played_at.toLocaleString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }, 
    getScenario() {
      let scenarioData = ipcRenderer.sendSync('stats-get-scenario', this.scenario);
      this.scenarioData = scenarioData;
    },
    createGraph() {
      if( !this.scenarioData ) return;
      if( !this.$refs.chart ) return;
      let scores = this.scenarioData.scores.map(row => ({
        score: row.score,
        movingAverage: row.movingAverage,
        played_at: row.played_at,
        exponentialMovingAverage: row.exponentialMovingAverage
      }));
      scores.sort((a, b) => a.played_at - b.played_at);
      this.chart = new Chart(
        this.$refs.chart,
        {
          type: 'line',
          data: {
            labels: scores.map(row => row.played_at),
            datasets: [
              {
                label: 'Score',
                data: scores.map(row => row.score),
                tension: 0.3,
              },
              {
                label: 'Moving Average',
                data: this.scenarioData.simpleMovingAverages,
                tension: 0.3,
              },
              {
                label: 'Exponential Moving Average',
                data: this.scenarioData.exponentialMovingAverages,
                tension: 0.3,
              }
            ]
          },
          options: {
            scales: {
              x: {
                display: false,
              }
            }
          }
        }
      );
    },
    updateGraph() {
      if( !this.chart ) {
        this.createGraph();
      } else {
        this.chart.data.datasets[0].data = this.scenarioData.scores.map(row => row.score);
        this.chart.data.datasets[1].data = this.scenarioData.simpleMovingAverages;
        this.chart.data.datasets[2].data = this.scenarioData.exponentialMovingAverages;
        this.chart.update();
      }
    }
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
        this.updateGraph()
      },
    },
    sortBy: {
      handler() {
        sort(this.scenarioData.scores, this.sortBy, this.sortOrder);
      },
    },
    sortOrder: {
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
    this.updateGraph();
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
