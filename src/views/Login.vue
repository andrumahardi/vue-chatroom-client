<template>
  <section class="login">
    <form @submit="login">
      <main>
        <header>
          <h2>Join Chatroom</h2>
        </header>
        <div class="input-wrapper">
          <input
            type="text"
            v-bind:class="usernameValid ? '' : 'login__invalid'"
            placeholder="Username"
            v-model="username">
          <small v-if="!usernameValid">
            {{errorMessages.username}}
          </small>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            v-bind:class="roomValid ? '' : 'login__invalid'"
            placeholder="RoomID"
            v-model="room">
          <small v-if="!roomValid">
            {{errorMessages.room}}
          </small>
        </div>
      </main>
      <button
        v-bind:disabled="loading"
        class="login__button"
        type="submit">
        {{loading ? 'Entering room...' : 'Login'}}
      </button>
    </form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

interface Generics {
  [key: string] : any
}

export default Vue.extend({
  data () {
    return {
      username: '',
      usernameValid: true,
      room: '',
      roomValid: true,
      loading: false,
      errorMessages: {
        username: 'Username should not be empty',
        room: 'RoomID should not be empty'
      }
    }
  },
  watch: {
    username (): void {
      this.usernameValid = this.username !== ''
    },
    room (): void {
      this.roomValid = this.room !== ''
    }
  },
  computed: {
    socket () {
      return this.$store.state.socket
    }
  },
  methods: {
    async login (e: Event): Promise<void> {
      e.preventDefault()

      if (this.validateInput()) {
        this.loading = true

        this.$store.dispatch('doLogin', { username: this.username, room: this.room })
          .then(({ data }: Generics) => {
            localStorage.setItem('user_id', data._id)
            this.$store.commit('SET_CURRENT_USER', data)

            this.$router.push('/')
            this.clearInputs()
          })
          .catch(({ response }: Generics) => {
            this.usernameValid = false
            this.errorMessages.username = response.data.message
          })
          .finally((): void => {
            this.loading = false
          })
      }
    },
    clearInputs (): void {
      this.username = ''
      this.usernameValid = true
      this.room = ''
      this.roomValid = true
      this.errorMessages = {
        username: 'Username should not be empty',
        room: 'RoomID should not be empty'
      }
    },
    validateInput (): boolean {
      this.usernameValid = (this.username !== '')
      this.roomValid = (this.room !== '')

      return this.usernameValid && this.roomValid
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
  $dark-grey: darken($color: $main-grey, $amount: 30);
  $dark-green: darken($color: $main-green, $amount: 30);
  $section-width: 90%;
  $border-radius: 0.5rem;
  $content-heigth: 2.5rem;

  .login {
    height: 100vh;
    width: 100vw;

    &__button {
      background: $main-green;
      width: $section-width;
      height: $content-heigth;
      border-radius: $border-radius;
      color: white;
      font-weight: bold;

      &:hover {
        background: $dark-green;
      }
      &:disabled {
        background: $dark-grey;
      }
    }

    &__invalid {
      border-color: red !important;
    }

    form {
      @include flexbox($justify: space-around, $align: center);
      height: 100%;
      width: 100%;

      main {
        @include flexbox($justify: center, $align: center);
        width: 100%;

        header {
          margin-bottom: 1rem;
        }
      }
    }
  }

  .input-wrapper {
    @include flexbox($justify: unset, $align: center);
    width: $section-width;
    position: relative;
    margin-bottom: 0.5rem;

    input {
      background: $main-grey;
      border: 1px solid $dark-grey;
      border-radius: $border-radius;
      width: calc(100% - (0.5rem * 2));
      margin-bottom: 1rem;
      height: $content-heigth;
      padding: 0 0.5rem 0 0.5rem;

      &::placeholder {
        color: $dark-grey;
      }
    }

    small {
      position: absolute;
      color: red;
      left: 0;
      bottom: 0rem;
    }
  }
</style>
