<template>
    <router-view/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  created (): void {
    if (!localStorage.getItem('user_id')) {
      this.$router.push('/login')
    } else if (this.$route.path !== '/') {
      this.$router.push('/')
    }
  }
})
</script>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button {
  border: none;
  outline: none;
  padding: 0.5rem;
}

input {
  outline: none;
}

</style>
