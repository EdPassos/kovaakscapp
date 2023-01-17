<template>
  <div id="draggable"></div>
  <div id="main">
    <nav>
      <router-link :to="{ name: 'home' }">Home</router-link>
    </nav>
    <router-view ref="view" />
  </div>
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
@import 'normalize.css';

$drag-height: 31px;
$bg-color: #1a1a1a;

* {
  box-sizing: border-box;
}

:root {
  --main-color: #d3a135;
  --bg-color: #{$bg-color};
  --drag-height: #{$drag-height};
  --windows-scrollbar-width: 17px;
  --scrollbar-width: var(--windows-scrollbar-width);
}

body, html {
  height: 100%;
  margin: 0;
}
html {
  font-size: 16px;
  background-color: var(--bg-color);
}

#draggable {
  width: 100%;
  height: var(--drag-height);
  -webkit-app-region: drag;
  background-color: var(--bg-color);
}

#main {
  height: calc(100vh - var(--drag-height));
  overflow: auto;
  position: relative;
  &::before {
    content: '';
    position: fixed;
    top: var(--drag-height);
    left: 0;
    width: calc(100% - var(--scrollbar-width));
    height: 50px;
    background-image: linear-gradient(180deg, rgba($bg-color, 1), rgba($bg-color, 0));
    z-index: 1;
    pointer-events: none;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
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
