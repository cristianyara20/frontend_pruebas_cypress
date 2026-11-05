import axios from "axios"

const API_URL = "http://localhost:3001/api/v1"

const getToken = () => localStorage.getItem("token")

export const getUsersService = async () => {
  const response = await axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  return response.data
}

export const createUserService = async (userData) => {
  const response = await axios.post(`${API_URL}/user`, userData)
  return response.data
}

export const updateUserService = async (id, userData) => {
  const response = await axios.put(`${API_URL}/user/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  return response.data
}