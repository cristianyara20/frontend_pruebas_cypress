import axios from "axios"

const API_URL = "http://localhost:3001/api/v1"

const getToken = () => localStorage.getItem("token")

export const getUserStatusService = async () => {
  const response = await axios.get(`${API_URL}/userStatus`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })
  return response.data
}