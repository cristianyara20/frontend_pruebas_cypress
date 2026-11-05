import axios from "axios"

const API_URL = "http://localhost:3001/api/v1"

export const getRolesService = async () => {
  const response = await axios.get(`${API_URL}/role`)
  return response.data
}