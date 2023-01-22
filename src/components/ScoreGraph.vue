<template>
  <div class="graph">
    <canvas ref="chart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import { shallowRef } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'ScenarioView',
  props: {
    scenario: { required: true },
    limit: { type: Number, default: 100 },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    createGraph() {
      if( !this.scenario ) return;
      if( !this.$refs.chart ) return;
      let scores = this.scenario.scores.map(row => ({
        score: row.score,
        movingAverage: row.movingAverage,
        played_at: row.played_at,
        exponentialMovingAverage: row.exponentialMovingAverage
      }));
      scores.sort((a, b) => a.played_at - b.played_at);
      let lastScores = scores.slice(-this.limit);
      let lastSimpleMovingAverages = this.scenario.simpleMovingAverages.slice(-this.limit);
      let lastExponentialMovingAverages = this.scenario.exponentialMovingAverages.slice(-this.limit);
      this.chart = shallowRef( new Chart(
        this.$refs.chart,
        {
          type: 'line',
          data: {
            labels: lastScores.map(row => row.played_at),
            datasets: [
              {
                label: 'Moving Average',
                data: lastSimpleMovingAverages,
                tension: 0.3,
                pointRadius: 0,
              },
              {
                label: 'Exponential Moving Average',
                data: lastExponentialMovingAverages,
                tension: 0.3,
                pointRadius: 0,
              },
              {
                label: 'Score',
                data: lastScores.map(row => row.score),
                tension: 0.3,
                pointRadius: 0,
              },
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
      ));
    },
    updateGraph() {
      if( !this.chart ) {
        this.createGraph();
      } else {
        let scenario = this.scenario
        this.chart.data.labels = scenario.scores.map(row => row.played_at);
        this.chart.data.datasets[0].data = scenario.scores.map(row => row.score);
        this.chart.data.datasets[1].data = scenario.simpleMovingAverages;
        this.chart.data.datasets[2].data = scenario.exponentialMovingAverages;
        this.chart.update('none');
      }
    }
  },
  computed: {
  },
  watch: {
    scenario: {
      immediate: true,
      handler() {
        this.updateGraph()
      },
    },
  },
  mounted() {
    this.updateGraph();
    console.log('mounted')
  },
};
</script>

<style lang="scss" scoped>
.graph { //card like design dark mode
  background-image: linear-gradient(315deg, #2d3436 0%, #1d1416 74%);
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
</style>
