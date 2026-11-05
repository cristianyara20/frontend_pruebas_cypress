import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserService } from "../../services/user.service";
import { getRolesService } from "../../services/role.service";
import { getUserStatusService } from "../../services/userStatus.service";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const rolesData = await getRolesService();
      const statusData = await getUserStatusService();
      setRoles(rolesData.data || rolesData.body || []);
      setStatuses(statusData.body || statusData.data || []);
    } catch (err) {
      setError("Error al cargar roles y estados");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createUserService({
        user_user: email,
        user_password: password,
        userStatus_fk: parseInt(statusId),
        role_fk: parseInt(roleId),
      });
      setSuccess("¡Usuario creado exitosamente!");
      setTimeout(() => navigate("/users"), 1500);
    } catch (err) {
      setError("Error al crear el usuario. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={() => navigate("/login")} style={styles.backBtn}>
            ← Volver
          </button>
          <h2 style={styles.title}>Registrar Usuario</h2>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Correo electrónico</label>
          <input
            type="email"
            placeholder="usuario@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 7 caracteres"
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
          {loading ? "Registrando..." : "Registrar Usuario"}
        </button>
      </div>
    </div>
  );
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
};

export default Register;
