<template>
    <div class="display-container">
        <div v-if="readSecret">
            <h4>
                Secret:
            </h4>
            <p><b>Secret Text: </b>{{readSecret.secretText}}</p>
            <p><b>Hash: </b>{{readSecret.hash}}</p>
            <p><b>Remaining Views: </b>{{readSecret.remainingViews}}</p>
            <p v-if="readSecret.expiresAt"><b>Secret expires at: </b>{{formatExpiry(readSecret.expiresAt)}}</p>
        </div>
        <p v-if="error" class="error">{{error}}</p>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'DisplaySecret',
  props: {
      readSecret: Object,
      error: String,
  },
  methods: {
      formatExpiry(expiresAt) {
        return dayjs(expiresAt).format('YYYY MM DD HH:mm:ss');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.display-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
}

h4, p {
    text-align: left;
}

p {
    margin-top: 5px;
    margin-bottom: 5px;
}

.error {
    color:#ff0000;
    margin-top: 40px;
    padding-left: 20px;
    padding-right: 20px;
}
</style>
