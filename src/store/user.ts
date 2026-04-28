import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  user_id: string | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    user_id: localStorage.getItem('user_id'),
    isLoggedIn: !!localStorage.getItem('token')
  }),
  actions: {
    login(token: string, user_id: string) {
      this.token = token
      this.user_id = user_id
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      localStorage.setItem('user_id', user_id)
    },
    logout() {
      this.token = null
      this.user_id = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('user_id')
    },
    checkLogin() {
      const token = localStorage.getItem('token')
      const user_id = localStorage.getItem('user_id')
      if (token && user_id) {
        this.token = token
        this.user_id = user_id
        this.isLoggedIn = true
      } else {
        this.logout()
      }
    }
  }
})