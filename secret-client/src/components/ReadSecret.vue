<template>
    <div>
        <h3>
        Read secrets by hash
        </h3>
        <form class="form" @submit.prevent="getSecret">
            <input class="input" type="text" v-model="hash" name="hash" placeholder="Secret hash...">
            <input type="submit" value="Submit" class="btn">
        </form>
    </div>
</template>

<script>
export default {
  name: 'ReadSecret',
  data() {
    return {
      hash: '',
    }
  },
  methods: {
    getSecret() {
      this.$emit('get-secret', this.hash);
      this.hash = '';
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
