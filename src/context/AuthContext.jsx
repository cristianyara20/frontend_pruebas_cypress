import { createContext, useState, useContext } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [user, setUser] = useState(null)

  const login = (data) => {
    setToken(data.token)
    setUser({ id: data.id })
    localStorage.setItem("token", data.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)