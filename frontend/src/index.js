import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// ⚠️ Remplacez par l'URL de votre Flask déployé sur Render
const API_URL = "https://flask-render-iac-charlottegrml.onrender.com/";

const styles = {
  body: {
    margin: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
    background: "#0f172a",
    color: "#e2e8f0",
    minHeight: "100vh",
    padding: "32px 16px",
  },
  container: { maxWidth: 700, margin: "0 auto" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4, color: "#f1f5f9" },
  subtitle: { color: "#94a3b8", marginBottom: 32, fontSize: 14 },
  card: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: 600, marginBottom: 14, color: "#7dd3fc" },
  row: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 140,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  btnDanger: {
    padding: "4px 10px",
    borderRadius: 6,
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "8px 10px",
    textAlign: "left",
    borderBottom: "1px solid #334155",
    color: "#94a3b8",
    fontWeight: 600,
  },
  td: { padding: "8px 10px", borderBottom: "1px solid #1e293b" },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  },
  error: { color: "#f87171", fontSize: 13, marginTop: 8 },
  empty: { color: "#64748b", textAlign: "center", padding: 20 },
};

function App() {
  const [students, setStudents]   = useState([]);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [error, setError]         = useState("");
  const [info, setInfo]           = useState(null);
  const [loading, setLoading]     = useState(false);

  // Charge les étudiants au démarrage
  useEffect(() => {
    fetchStudents();
    fetchInfo();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch(`${API_URL}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch {
      setError("Impossible de joindre l'API Flask.");
    }
  }

  async function fetchInfo() {
    try {
      const res = await fetch(`${API_URL}/info`);
      const data = await res.json();
      setInfo(data);
    } catch { /* silencieux */ }
  }

  async function addStudent() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Nom et email sont requis.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setEmail("");
      await fetchStudents();
    } catch {
      setError("Erreur lors de l'ajout.");
    }
    setLoading(false);
  }

  async function deleteStudent(id) {
    try {
      await fetch(`${API_URL}/api/students/${id}`, { method: "DELETE" });
      await fetchStudents();
    } catch {
      setError("Erreur lors de la suppression.");
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>🚀 Plateforme Dev</h1>
        <p style={styles.subtitle}>React → Flask → PostgreSQL</p>

        {/* Info Flask */}
        {info && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>⚙️ Infos API Flask</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              <span style={{ ...styles.badge, background: "#1d4ed8", color: "#bfdbfe", marginRight: 8 }}>
                {info.app}
              </span>
              <span style={{ ...styles.badge, background: "#166534", color: "#bbf7d0", marginRight: 8 }}>
                {info.version}
              </span>
              <span>👤 {info.student}</span>
            </div>
          </div>
        )}

        {/* Formulaire ajout */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>➕ Ajouter un étudiant</div>
          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addStudent()}
            />
            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addStudent()}
            />
            <button style={styles.btn} onClick={addStudent} disabled={loading}>
              {loading ? "..." : "Ajouter"}
            </button>
          </div>
          {error && <div style={styles.error}>⚠️ {error}</div>}
        </div>

        {/* Liste des étudiants */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            🎓 Étudiants ({students.length})
          </div>
          {students.length === 0 ? (
            <div style={styles.empty}>Aucun étudiant pour l'instant.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td style={{ ...styles.td, color: "#64748b" }}>#{s.id}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={{ ...styles.td, color: "#7dd3fc" }}>{s.email}</td>
                    <td style={styles.td}>
                      <button style={styles.btnDanger} onClick={() => deleteStudent(s.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
