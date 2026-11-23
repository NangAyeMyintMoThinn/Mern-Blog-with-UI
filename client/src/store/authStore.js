import { create } from 'zustand'

const useAuthStore = create((set) => ({
    currentUser: JSON.parse(localStorage.getItem('user')) || null,

    login: (userData) => {
        localStorage.setItem('token', userData.token)

        const user = {
            id: userData.id,
            name: userData.name,
        }

        localStorage.setItem('user', JSON.stringify(user))

        set({ currentUser: user })
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        set({ currentUser: null })
    },

    updateUser: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))

        set({ currentUser: userData })
    },
}))

export default useAuthStore