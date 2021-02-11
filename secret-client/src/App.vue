<template>
  <div id="app">
    <h1>Secret manager</h1>
    <p>
      View and store secrets.
    </p>
    <SecretClient />
  </div>
</template>

<script>
import SecretClient from './components/SecretClient.vue'

export default {
  name: 'App',
  components: {
    SecretClient
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
