<template>
  <div class="home">
    <ul class="scenarios">
      <li v-for="scenario in scenarios" :key="scenario.id" class="scenario">
        <router-link :to="{ name: 'scenario', params: { scenario: scenario.name } }">
          <span v-text="scenario.name"></span>
          <span v-text="scenario.plays"></span>
          <span v-text="scenario.best"></span>
          <span v-text="scenario.last_played_at"></span>
        </router-link>
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
      sortBy: 'last_played_at',
      sortOrder: 'desc',
    }
  },
  watch: {
    sortBy: {
      immediate: true,
      handler: function() {
        this.sortScenarios(this.sortBy);
      },
    },
    scenarios: {
      immediate: true,
      handler: function() {
        this.sortScenarios(this.sortBy);
      },
    },
  },
  methods: {
    async getScenarios() { // Get scenarios from the IPC
      let scenarios = ipcRenderer.sendSync('stats-get-scenarios');
      this.scenarios = scenarios;
    },
    compareStrings(a, b) {
      if( this.sortOrder === 'desc' ) {
        return b.localeCompare(a);
      }
      return a.localeCompare(b);
    },
    compareNumbers(a, b) {
      if( this.sortOrder === 'desc' ) {
        return b - a;
      }
      return a - b;
    },
    sortScenarios(sortBy) {
      console.log('Sorting by', sortBy)
      this.scenarios = this.scenarios.sort((a,b) => (typeof a[sortBy] === 'string') ? this.compareStrings(a[sortBy], b[sortBy]) : this.compareNumbers(a[sortBy], b[sortBy]));
    },
  },
  mounted() {
    this.getScenarios();
  },
}
</script>

<style lang="scss" scoped>
.scenarios {
  list-style: none;
  padding: 0;
  margin: 0;
}
.scenario {
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
  a {
    display: flex;
    grid-gap: 1rem;
    padding: 1rem;
    color: #fff;
    text-decoration: none;
    span {
      flex: 1;
      flex-basis: 0;
    }
    &:hover {
      background: #333;
    }
  }
}
</style>