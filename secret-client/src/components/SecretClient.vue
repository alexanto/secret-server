<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      View and store secrets.
    </p>
  </div>
</template>

<script>
export default {
  name: 'SecretClient',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
