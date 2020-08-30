import axios from 'axios'

const state = {
    user: {
        loggedIn: false,
        role: 'guest',
        isAdmin: false
    }
}

const getters = {
    auth(state) {
        return state.user
    }
}

const actions = {
    async checkIfLoggedIn({ commit }) {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
        }
        try {
            const res = await axios.get('http://localhost:7070/api/authentication/isLoggedIn', config)
            commit('setUser', res.data) 
        } catch (error) {
            console.log(error)
            
        }
    }
}

const mutations = {
    setUser: (state, user) => {
        state.user.loggedIn = true
        state.user.role = user.role
        state.user.isAdmin = user.role === 'admin'
    },
    logoutUser: (state, user) => {
        state.user.loggedIn = false
        state.user.role = 'guest'
        state.user.isAdmin = false
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
