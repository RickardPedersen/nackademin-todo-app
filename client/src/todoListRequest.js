import axios from 'axios'
import Store from './store'
const store = Store()
const token = store.getters.auth.userToken || localStorage.getItem('userToken')

const url = '/api/todoLists'
const userUrl = '/api/users'

const config = {
    headers: { Authorization: `Bearer ${token}` }
}

class TodoListRequests {
    static async addMember(listId, userId) {
        try {
            const body = {
                addMember: userId
            }
            const res = await axios.patch(`${url}/${listId}`, body, config)
            return res.data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async removeMember(listId, userId) {
        try {
            const body = {
                removeMember: userId
            }
            const res = await axios.patch(`${url}/${listId}`, body, config)
            return res.data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async getTodoListTodos(listId, descending, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}/${listId}/todos?descending=${descending}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async getTodoLists() {
        try {
            const res = await axios.get(`${url}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return error
        }
    }

    static async createTodoList(listData) {
        try {
            const res = await axios.post(`${url}`, listData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async updateTodoList(listData, listId) {
        try {
            const res = await axios.patch(`${url}/${listId}`, listData, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }

    static async deleteTodoList(listId) {
        try {
            const res = await axios.delete(`${url}/${listId}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

export default TodoListRequests
