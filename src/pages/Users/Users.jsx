import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUsersService } from "../../services/user.service"
import { useAuth } from "../../context/AuthContext"

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await getUsersService()
      setUsers(data.body)
    } catch (err) {
      setError("Error al cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Usuarios</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/register")} style={styles.registerBtn}>
            + Registrar Usuario
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {loading && <p style={styles.info}>Cargando usuarios...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <table style={styles.table}>
          <thead>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} style={styles.tr}>
                <td style={styles.td}>{user.user_id}</td>
                <td style={styles.td}>{user.user_user}</td>
                <td style={styles.td}>{user.userStatus_fk}</td>
                <td style={styles.td}>{user.role_fk}</td>6 
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: "32px",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    color: "#333",
    margin: 0,
  },
  registerBtn: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  th: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#555",
  },
  info: {
    color: "#888",
  },
  error: {
    color: "red",
  },
}

export default Users
