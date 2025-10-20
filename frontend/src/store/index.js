import { createStore } from "vuex"
import axios from "axios"

export default createStore({
	state: {
        // Auth state
		user: null,
		isAuthenticated: false,
		error: null
	},
	getters: {
        // Selectors
		isAuthenticated: state => state.isAuthenticated,
		currentUser: state => state.user,
		userRoles: state => state.user?.roles || [],
		hasRole: state => role => state.user?.roles?.includes(role) || false,
		hasAnyRole: state => roles => roles.some(role => state.user?.roles?.includes(role)) || false,
		isAdmin: state => state.user?.roles?.includes('Admin') || false,
		isEditor: state => state.user?.roles?.includes('Editor') || false,
		username: state => state.user?.username || '',
		error: state => state.error
	},
	mutations: {
        // Mutations
		SET_USER(state, user) {
			state.user = user
			state.isAuthenticated = !!user
		},
		SET_ERROR(state, error) {
			state.error = error
		},
		CLEAR_ERROR(state) {
			state.error = null
		},
		LOGOUT(state) {
			state.user = null
			state.isAuthenticated = false
			state.error = null
		}
	},
	actions: {
        // Actions
		async login({ commit }, username) {
			commit('CLEAR_ERROR')
			
			try {
				const response = await axios.post(`/api/users/login/${username}`)
				// Normalize payload: support legacy { role } and new { roles }
				const payload = response.data || {}
				const roles = Array.isArray(payload.roles)
					? payload.roles
					: (payload.role ? [payload.role] : [])
				commit('SET_USER', { ...payload, roles, username })
				return response.data
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Login failed'
				commit('SET_ERROR', errorMessage)
				throw error
			}
		},
		
		async logout({ commit }) {
			commit('LOGOUT')
		}
	},
	modules: {}
})
