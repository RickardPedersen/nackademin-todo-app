import axios from 'axios'

const url = 'http://localhost:7070/api/todos'
const userUrl = 'http://localhost:7070/api/users/user'

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
}

class TodoRequests {
    static async countTodos(filter) {
        try {
            const res = await axios.get(`${url}/count/${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async getAllTodos(order, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}/get/${order}/${skip}/${limit}/${sortBy}/${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async getUsersTodos(userId, order, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${userUrl}/${userId}/todos/${order}/${skip}/${limit}/${sortBy}/${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async countUserTodos(filter, userId) {
        try {
            const res = await axios.get(`${userUrl}/${userId}/count/${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async getDoneTodos() {
        try {
            const res = await axios.get(`${url}/get/done`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async createTodo(postData) {
        try {
            const res = await axios.post(`${url}/post`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async editTodo(postData, id) {
        try {
            const res = await axios.patch(`${url}/edit/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async doneTodo(postData, id) {
        try {
            const res = await axios.patch(`${url}/edit/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async deleteTodo(id) {
        try {
            const res = await axios.delete(`${url}/delete/${id}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default TodoRequests
