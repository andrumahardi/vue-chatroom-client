import Vue from 'vue'
import Vuex from 'vuex'
import { io } from 'socket.io-client'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: io(process.env.VUE_APP_SERVER_URL),
    serverUrl: process.env.VUE_APP_SERVER_URL,
    chats: [],
    currentUser: {}
  },
  mutations: {
    SET_CHATS (state, data) {
      state.chats = data
    },
    SET_CURRENT_USER (state, data) {
      state.currentUser = data
    }
  },
  actions: {
    doLogin ({ state }, data): Promise<Response> {
      return axios.post(`${state.serverUrl}/login`, data)
    },
    doLogout ({ state }): Promise<Response> {
      const id: string | null = localStorage.getItem('user_id')
      return axios.get(`${state.serverUrl}/logout/${id}`)
    },
    fetchUser ({ state }): Promise<Response> {
      const id: string | null = localStorage.getItem('user_id')
      return axios.get(`${state.serverUrl}/users/${id}`)
    },
    fetchChats ({ state }): Promise<Response> {
      return axios.get(`${state.serverUrl}/messages`)
    },
    sendMessage ({ state }, data): Promise<Response> {
      return axios.post(`${state.serverUrl}/messages`, data)
    }
  },
  modules: {
  }
})
