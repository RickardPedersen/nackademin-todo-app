import axios from 'axios'

const url = 'http://localhost:7070/api/todoLists'
const userUrl = 'http://localhost:7070/api/users'

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
}

class TodoListRequests {
    static async getTodoListTodos(listId, descending, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}/${listId}/todos?descending=${descending}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async getTodoLists() {
        try {
            const res = await axios.get(`${url}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async createTodoList(listData) {
        try {
            const res = await axios.post(`${url}`, listData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async updateTodoList(listData, listId) {
        try {
            const res = await axios.patch(`${url}/${listId}`, listData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async deleteTodoList(listId) {
        try {
            const res = await axios.delete(`${url}/${listId}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default TodoListRequests
