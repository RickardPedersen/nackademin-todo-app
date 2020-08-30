import axios from 'axios'

const url = 'http://localhost:7070/api/users'

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
};
console.log(config)

class TodoRequests {
    static async countUsers(filter) {
        try {
            const res = await axios.get(`${url}/count/${filter}`, config)
            //console.log(res)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async getAllUsers(order, skip, limit, sortBy, filter) {
        try {
            const res = await axios.get(`${url}/${order}/${skip}/${limit}/${sortBy}/${filter}`, config)
            //console.log(res)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async createUser(postData) {
        try {
            const res = await axios.post(`${url}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async editUser(postData, id) {
        try {
            const res = await axios.patch(`${url}/${id}`, postData, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }

    static async deleteUser(id) {
        try {
            const res = await axios.delete(`${url}/${id}`, config)
            const data = res.data
            return data
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default TodoRequests
