import axios from 'axios'
import Store from './store'
const store = Store()
const token = store.getters.auth.userToken || localStorage.getItem('userToken')

const url = '/api/todos'
const userUrl = '/api/users'

const config = {
    headers: { Authorization: `Bearer ${token}` }
}

class TodoRequests {
    static async getAllTodos(descending, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}?descending=${descending}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async getUsersTodos(userId, descending, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${userUrl}/${userId}/todos?descending=${descending}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async getDoneTodos() {
        try {
            const res = await axios.get(`${url}/get/done`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async createTodo(postData) {
        try {
            const res = await axios.post(`${url}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async editTodo(postData, id) {
        try {
            const res = await axios.patch(`${url}/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async doneTodo(postData, id) {
        try {
            const res = await axios.patch(`${url}/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async deleteTodo(id) {
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
