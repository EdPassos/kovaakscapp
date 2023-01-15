<template>
  <nav>
    <router-link :to="{ name: 'home' }">Home</router-link>
  </nav>
  <router-view ref="view" />
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  name: 'App',
  data() {
    return {
    }
  },
  mounted() {
    ipcRenderer.on('scenario-updated', (event, scenario) => {
      this.$router.push({ name: 'scenario', params: { scenario } });
    });
    ipcRenderer.send('get-scenario-updates')
  }
}
</script>

<style lang="scss">
body, html {
  height: 100%;
  margin: 0;
}
html {
  font-size: 16px;
  background-color: #1a1a1a;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
