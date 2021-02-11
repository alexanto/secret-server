<template>
    <div>
      <h3>
        Save a new secret
      </h3>
      <form class="form" @submit.prevent="storeSecret">
        <input required class="input" type="text" v-model="secretText" name="hash" placeholder="Secret text...">
        <input required class="input" type="number" v-model="viewNumber" name="hash" placeholder="Maximum views...">
        <input class="input" type="number" v-model="expiresInMinutes" name="hash" placeholder="Expires in minutes...">
        <input type="submit" value="Save" class="btn">
      </form>
    </div>
</template>

<script>
export default {
  name: 'StoreSecret',
  data() {
    return {
      secretText: '',
      viewNumber: '',
      expiresInMinutes: ''
    }
  },
  methods: {
    storeSecret() {
        const secret = {
            secret: this.secretText,
            expireAfterViews: this.viewNumber,
            expireAfter: this.expiresInMinutes
        }
        this.$emit('store-secret', secret);
        this.secretText = '';
        this.viewNumber = '';
        this.expiresInMinutes = '';
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
    display: flex;
    flex-direction: column;
}

.input {
    margin-bottom: 20px;
}

.btn {
    align-self: center;
    width: 200px;
    height: 40px;
}
</style>

