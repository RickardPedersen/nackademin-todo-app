import axios from 'axios'

const url = 'http://localhost:7070/api/todos'

class TodoRequests {
    static async getAllTodos() {
        try {
            const res = await axios.get(`${url}/get`)
            console.log(res)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async createTodo(postData) {
        try {
            const res = await axios.post(`${url}/post`, postData)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async editTodo(postData, id) {
        try {
            const res = await axios.put(`${url}/edit/${id}`, postData)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async deleteTodo(id) {
        try {
            const res = await axios.delete(`${url}/delete/${id}`)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default TodoRequests
