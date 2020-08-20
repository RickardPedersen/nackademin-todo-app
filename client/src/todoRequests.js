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
}

export default TodoRequests
