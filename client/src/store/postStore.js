import { create } from 'zustand'
import API from '../services/api'

const usePostStore = create((set) => ({
    posts: [],
    loading: false,
    error: null,

    fetchPosts: async (category = '') => {
        set({ loading: true, error: null })

        try {
            const response = category
                ? await API.get(`/posts/categories/${category}`)
                : await API.get('/posts')

            set({
                posts: response.data,
                loading: false,
            })
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch posts.',
                loading: false,
            })
        }
    },

    deletePost: async (postId) => {
        await API.delete(`/posts/${postId}`)

        set((state) => ({
            posts: state.posts.filter(
                (post) => post._id !== postId
            ),
        }))
    },

    setPosts: (posts) => set({ posts }),
}))

export default usePostStore