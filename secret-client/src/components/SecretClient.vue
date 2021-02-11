<template>
  <div class="container">
    <div class="form-container">
      <ReadSecret v-on:get-secret="getSecret"/>
      <DisplaySecret v-if="secret || getSecretError" v-bind:readSecret="secret" v-bind:error="getSecretError"/>
    </div>
    <div class="form-container">
      <StoreSecret  v-on:store-secret="storeSecret"/>
      <DisplaySecret v-if="storedSecret || storeSecretError" v-bind:readSecret="storedSecret" v-bind:error="storeSecretError"/>
    </div>
  </div>
</template>

<script>
import ReadSecret from './ReadSecret.vue';
import StoreSecret from './StoreSecret.vue';
import DisplaySecret from './DisplaySecret.vue';
import axios from 'axios';

export default {
  name: 'SecretClient',
  components: {
    ReadSecret,
    StoreSecret,
    DisplaySecret
  },
  data() {
    return {
      secret: null,
      getSecretError: '',
      storedSecret: null,
      storeSecretError: '',
    }
  },
  methods: {
    getSecret(hash) {
      axios.get(`http://localhost:8081/api/secret/${hash}`)
        .then(res => {
          this.secret = res.data;
          this.getSecretError = '';
        })
        .catch((error) => {
          const errorMessage = error.response.data.msg;
          this.getSecretError = errorMessage;
          this.secret = null;
        });
    },
    storeSecret(secret) {
      axios.post(`http://localhost:8081/api/secret`, secret)
        .then(res => {
          this.storedSecret = res.data;
          this.storeSecretError = '';
        })
        .catch((error) => {
          const errorMessage = error.response.data.msg;
          this.storeSecretError = errorMessage;
          this.storedSecret = null;
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100%;
}
.form-container {
  border-radius: 6px;
  flex-basis: 460px;
  flex-grow: 1;
  padding: 20px;
  max-width: 600px;
  margin-top: 100px;
  min-height: 400px;
}

.form-container:first-of-type {
  margin-right: 20px;
}

.form-container:last-of-type {
  margin-left: 20px;
}

.input {
  margin-right: 10px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #888;
  font-size: 16px;
  padding: 5px;
  height: 40px;
}

.form {
  display: flex;
  margin-top: 40px;
}

.btn {
  background-color: #42b983;
  border: 2px solid #42b983;
  border-radius: 3px;
  width: 80px;
}
</style>
