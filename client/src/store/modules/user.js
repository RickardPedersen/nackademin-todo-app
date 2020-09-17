import axios from 'axios'

const state = {
    user: {
        loggedIn: false,
        role: 'guest',
        isAdmin: false,
        userId: null,
        userToken: null
    }
}

const getters = {
    auth(state) {
        return state.user
    }
}

const actions = {
    async checkIfLoggedIn({ commit }) {
        const token = state.user.userToken || localStorage.getItem('userToken')
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            const res = await axios.get('/api/authentication/isLoggedIn', config)
            commit('setUser', res.data) 
        } catch (error) {
            console.error(error)
            
        }
    },
    token({ commit }, tokenObject) {
        commit('setToken', tokenObject.token)
    },
    logout({ commit }) {
        commit('logoutUser')
    }
}

const mutations = {
    setToken: (state, token) => {
        state.user.userToken = token
    },
    setUser: (state, user) => {
        state.user.loggedIn = true
        state.user.role = user.role
        state.user.isAdmin = user.role === 'admin'
        state.user.userId = user.userId
    },
    logoutUser: (state) => {
        state.user.loggedIn = false
        state.user.role = 'guest'
        state.user.isAdmin = false
        state.user.userId = null
        state.user.userToken = null
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
