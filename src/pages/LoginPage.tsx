import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Inserisci un'email valida."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "Email o password errati.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Helmet>
        <title>Accedi — SMOT</title>
        <meta name="description" content="Accedi al tuo account SMOT per gestire la licenza e scaricare l'app desktop." />
        <meta property="og:title" content="Accedi — SMOT" />
        <meta property="og:description" content="Accedi al tuo account SMOT per gestire la licenza." />
        <meta property="og:url" content="https://smot.app/login" />
      </Helmet>
      <Navbar />
      <div className="form-page">
        <div className="form-card">
          <h2>Accedi</h2>
          <p className="subtitle">Bentornato. Inserisci le tue credenziali.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@esempio.it" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Accesso..." : "Accedi"}
            </button>
          </form>
          <div className="form-footer">
            Non hai un account? <Link to="/register">Registrati</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
