import axios from 'axios'
import Store from './store'
const store = Store()
const token = store.getters.auth.userToken || localStorage.getItem('userToken')

const url = '/api/users'

const config = {
    headers: { Authorization: `Bearer ${token}` }
}

class TodoRequests {
    static async countUsers(filter) {
        try {
            const res = await axios.get(`${url}/count/${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async getAllUsers(descending, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}?descending=${descending}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async getUser(userId) {
        try {
            const res = await axios.get(`${url}/${userId}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async createUser(postData) {
        try {
            const res = await axios.post(`${url}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async editUser(postData, id) {
        try {
            const res = await axios.patch(`${url}/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async deleteUser(id) {
        try {
            const res = await axios.delete(`${url}/${id}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

export default TodoRequests
