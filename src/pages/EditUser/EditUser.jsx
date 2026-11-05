import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUsersService, updateUserService } from "../../services/user.service"
import { getRolesService } from "../../services/role.service"
import { getUserStatusService } from "../../services/userStatus.service"

function EditUser() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [statusId, setStatusId] = useState("")
  const [roles, setRoles] = useState([])
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const rolesData = await getRolesService()
      const statusData = await getUserStatusService()
      const usersData = await getUsersService()

      setRoles(rolesData.data || rolesData.body || [])
      setStatuses(statusData.body || statusData.data || [])

      const user = usersData.body.find((u) => u.user_id === id)
      if (user) {
        setEmail(user.user_user)
        setRoleId(user.role_fk)
        setStatusId(user.userStatus_fk)
      }
    } catch (err) {
      setError("Error al cargar los datos")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await updateUserService(id, {
        user_user: email,
        user_password: password,
        userStatus_fk: parseInt(statusId),
        role_fk: parseInt(roleId),
      })
      setSuccess("¡Usuario actualizado exitosamente!")
      setTimeout(() => navigate("/users"), 1500)
    } catch (err) {
      setError("Error al actualizar el usuario")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) return <p style={{ padding: "32px" }}>Cargando datos...</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={() => navigate("/users")} style={styles.backBtn}>
            ← Volver
          </button>
          <h2 style={styles.title}>Editar Usuario</h2>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nueva contraseña <span style={styles.optional}>(opcional)</span></label>
          <input
            type="password"
            placeholder="Dejar vacío para no cambiar"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Rol</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Estado</label>
          <select
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Selecciona un estado --</option>
            {statuses.map((status) => (
              <option key={status.userStatus_id} value={status.userStatus_id}>
                {status.userStatus_name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? "Actualizando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "24px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  title: {
    color: "#333",
    margin: 0,
  },
  backBtn: {
    padding: "6px 12px",
    backgroundColor: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#555",
    fontSize: "14px",
  },
  optional: {
    color: "#aaa",
    fontSize: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
  },
  success: {
    color: "green",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
  },
}

export default EditUser