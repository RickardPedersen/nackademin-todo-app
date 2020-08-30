import axios from 'axios'

const state = {
    user: {
        loggedIn: false,
        role: 'guest'
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
        };
        console.log(config)
        try {
            const res = await axios.get('http://localhost:7070/api/authentication/isLoggedIn', config)
            console.log(res.data)
            console.log(res)
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
    },
    logoutUser: (state, user) => {
        state.user.loggedIn = false
        state.user.role = 'guest'
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
