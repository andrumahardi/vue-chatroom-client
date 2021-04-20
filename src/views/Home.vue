<template>
  <section class="home">
    <header>
      <button @click="logout()">Exit</button>
      <h3>{{currentUser.room}}</h3>
    </header>
    <main>
      <chatroom />
    </main>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Chatroom from '../components/chatroom.vue'

export default Vue.extend({
  components: {
    chatroom: Chatroom
  },
  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    chats () {
      return this.$store.state.chats
    }
  },
  methods: {
    logout (): void {
      this.$store.dispatch('doLogout')
        .then(() => {
          localStorage.removeItem('user_id')
          this.$store.commit('SET_CURRENT_USER', {})
          this.$store.commit('SET_CHATS', [])
          this.$router.push('/login')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    fetchUser () {
      this.$store.dispatch('fetchUser')
        .then(({ data }) => {
          this.$store.commit('SET_CURRENT_USER', data)
        })
        .catch((err: Error) => {
          console.log(err)
        })
    },
    async fetchData () {
      Promise.all([
        this.$store.dispatch('fetchUser'),
        this.$store.dispatch('fetchChats')
      ])
        .then((responses) => {
          const [user, chats] = responses
          const roomChats = chats.data.results
            .filter((chat: { [key: string]: string }) => chat.room === user.data.room)

          this.$store.commit('SET_CURRENT_USER', user.data)
          this.$store.commit('SET_CHATS', roomChats)
        })
        .catch((err: Error) => {
          console.log(err)
        })
    }
  },
  created (): void {
    if (!this.currentUser.room || this.chats.length === 0) {
      this.fetchData()
    }
  }
})
</script>

<style lang="scss" scoped>
  @mixin flexbox($dir: column, $justify: center, $align: center, $wrap: wrap) {
    display: flex;
    flex-direction: $dir;
    justify-content: $justify;
    align-items: $align;
    flex-wrap: $wrap;
  }

  $main-grey: #E8E8E8;
  $main-green: #5DB075;
  $dark-grey: darken($color: $main-grey, $amount: 20);
  $dark-green: darken($color: $main-green, $amount: 30);

  .home{
    height: 100vh;
    width: 100vw;

    header {
      @include flexbox($justify: center, $align: center);
      height: 3rem;
      position: relative;
      box-shadow: 0 0 0.5rem $dark-grey;
      margin-bottom: 0.5rem;

      button {
        position: absolute;
        left: 0.5rem;
        padding: 0;
        background: none;
        color: $main-green;

        &:hover {
          color: $dark-green;
        }
      }
    }

    main {
      height: calc(100% - (3rem + 0.5rem));
    }
  }
</style>
