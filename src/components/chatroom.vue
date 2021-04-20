<template>
  <section class="chatroom">
    <main id="chat-container">
      <div
        v-for="chat in chats"
        :key="chat._id"
        :class="chat.sender_id === userID ? 'chat chat__user' : 'chat chat__other'">
        <div>
          <h5
            v-if="chat.sender_id !== userID"
            class="chat__header">
            {{chat.sender}}
          </h5>
          <article class="chat__content">
            {{chat.text}}
          </article>
        </div>
      </div>
    </main>
    <form @submit="sendMessage">
      <div class="input-wrapper">
        <input
          v-model="text"
          type="text"
          placeholder="Message here...">
        <button type="submit">
          <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L6.70711 0.292893C6.31658 -0.0976312 5.68342 -0.0976312 5.29289 0.292893L6 1ZM10.2929 6.70711C10.6834 7.09763 11.3166 7.09763 11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289L10.2929 6.70711ZM0.292893 5.29289C-0.0976312 5.68342 -0.0976312 6.31658 0.292893 6.70711C0.683417 7.09763 1.31658 7.09763 1.70711 6.70711L0.292893 5.29289ZM5 15C5 15.5523 5.44772 16 6 16C6.55228 16 7 15.5523 7 15H5ZM5.29289 1.70711L10.2929 6.70711L11.7071 5.29289L6.70711 0.292893L5.29289 1.70711ZM5.29289 0.292893L0.292893 5.29289L1.70711 6.70711L6.70711 1.70711L5.29289 0.292893ZM5 1V8H7V1H5ZM5 8V15H7V8H5Z" fill="white"/>
          </svg>
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

interface Chat {
  [key: string]: string
}

interface LocalState {
  text: string
}

export default Vue.extend({
  data (): LocalState {
    return {
      text: ''
    }
  },
  computed: {
    chats (): Array<Chat> {
      return this.$store.state.chats
    },
    userID (): string {
      return this.$store.state.userID
    },
    currentUser (): { [key: string]: string } {
      return this.$store.state.currentUser
    },
    socket () {
      return this.$store.state.socket
    }
  },
  methods: {
    sendMessage (e: Event): void {
      e.preventDefault()

      if (this.text !== '') {
        const payload = {
          text: this.text,
          sender_id: this.userID,
          sender: this.currentUser.username
        }

        this.$store.dispatch('sendMessage', payload)
          .then(({ data }) => {
            this.socket.emit('send message', [...this.chats, data])
            this.$store.commit('SET_CHATS', [...this.chats, data])
            this.text = ''
          })
          .catch((err: Error) => {
            console.log(err)
          })
      }
    },
    scrollDown (): void {
      const chatContainer = this.$el.querySelector('#chat-container')

      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  },
  mounted (): void {
    setTimeout(() => {
      this.scrollDown()
    }, 500)

    this.socket.on('other sent message', (chats: Array<Chat>) => {
      this.$store.commit('SET_CHATS', chats)

      this.scrollDown()
    })
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

  @mixin content($color) {
    position: absolute;
    content: "";
    bottom: -0.8rem;
    border: 0.4rem solid white;

    @if $color == $main-green {
      right: 0;
      border-right-color: $color;
      border-top-color: $color;
    }
    @else {
      left: 0;
      border-top-color: $main-grey;
      border-left-color: $main-grey;
    }
  }

  $main-grey: #E8E8E8;
  $main-green: #5DB075;
  $dark-grey: darken($color: $main-grey, $amount: 30);
  $dark-green: darken($color: $main-green, $amount: 30);
  $padding-amount: 0.5rem;
  $padding-inline: 0 $padding-amount;
  $cir-btn-diameter: 2.5rem;

  .chatroom {
    @include flexbox($justify: space-between, $align: unset);
    height: 100%;

    main {
      padding: $padding-inline;
      height: calc(100% - (#{$cir-btn-diameter} + (#{$padding-amount} * 4)));
      overflow-y: auto;
    }

    form {
      padding: $padding-amount;
    }
  }

  .chat {
    margin-bottom: 1.5rem;

    &__user > div, &__other > div {
      width: fit-content;
      max-width: 45%;
    }

    &__user {
      @include flexbox($justify: unset, $align: flex-end);
    }

    &__user &__content {
      background: $main-green;
      border-radius: 0.5rem 0.5rem 0 0.5rem;
      position: relative;
      color: white;

      &::before {
        @include content($main-green);
      }
    }

    &__other &__content {
      background: $main-grey;
      border-radius: 0.5rem 0.5rem 0.5rem 0;

      position: relative;

      &::before {
        @include content($main-grey);
      }
    }

    &__content {
      width: fit-content;
      padding: $padding-amount $padding-amount * 2;
    }
  }

  .input-wrapper {
    @include flexbox(row, space-between, center);
    padding: $padding-inline;
    border: 1px solid $dark-grey;
    border-radius: 2rem;
    padding: $padding-amount / 2;
    background: $main-grey;

    input {
      width: calc(100% - 3.5rem);
      border: none;
      background: transparent;

      &::placeholder {
        color: $dark-grey;
      }
    }

    button{
      height: $cir-btn-diameter;
      width: $cir-btn-diameter;
      background: $main-green;
      border-radius: 50%;

      &:hover {
        background: $dark-green;
      }
    }
  }
</style>
