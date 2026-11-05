import axios from "axios"

const API_URL = "http://localhost:3001/api/v1"

export const loginService = async (email, password) => {
  const response = await axios.post(`${API_URL}/user/login`, {
    email,
    password,
  })
  return response.data
}