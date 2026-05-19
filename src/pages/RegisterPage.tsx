import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.includes("@")) return "Inserisci un'email valida.";
    if (password.length < 6) return "La password deve essere almeno 6 caratteri.";
    if (password !== confirm) return "Le password non coincidono.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (ex: unknown) {
      setError(ex instanceof Error ? ex.message : "Errore durante la registrazione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="form-page">
        <div className="form-card">
          <h2>Crea il tuo account</h2>
          <p className="subtitle">Registrati per ottenere la licenza di SMOT.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@esempio.it" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caratteri" required minLength={6} />
            </div>
            <div className="form-group">
              <label>Conferma password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Riscrivi la password" required minLength={6} />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Registrazione..." : "Registrati"}
            </button>
          </form>
          <div className="form-footer">
            Hai già un account? <Link to="/login">Accedi</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
