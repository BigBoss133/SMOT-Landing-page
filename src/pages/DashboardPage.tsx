import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getLicenseStatus, getPaymentHistory, type LicenseStatus, type Payment } from "../services/api";
import Navbar from "../components/Navbar";
import { Copy, Check, Download } from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [license, setLicense] = useState<LicenseStatus | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getLicenseStatus().then(setLicense).catch(() => setError("Impossibile caricare la licenza."));
    getPaymentHistory().then((r) => setPayments(r.payments)).catch(() => {});
  }, []);

  const handleCopy = () => {
    if (!license) return;
    navigator.clipboard.writeText(license.key).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const badgeClass = (() => {
    if (!license) return "";
    if (license.blocked) return "badge-blocked";
    if (license.status === "grace") return "badge-grace";
    if (license.plan === "trial") return "badge-trial";
    return "badge-active";
  })();

  const statusLabel = (() => {
    if (!license) return "";
    if (license.blocked) return "Bloccata";
    if (license.status === "grace") return "In scadenza";
    if (license.plan === "trial") return "Trial";
    return "Attiva";
  })();

  return (
    <div className="page">
      <Navbar />
      <div className="dashboard container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{user?.email}</span>
            <button className="btn btn-ghost" onClick={logout}>Esci</button>
          </div>
        </div>

        {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h4>Stato licenza</h4>
            {license ? (
              <>
                <span className={`badge ${badgeClass}`} style={{ marginBottom: 12, display: "inline-block" }}>{statusLabel}</span>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Piano: <span style={{ color: "var(--white)", fontWeight: 600 }}>{license.plan}</span></div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Scadenza: <span style={{ color: "var(--white)" }}>{new Date(license.expires_at).toLocaleDateString()}</span></div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Giorni rimanenti: <span style={{ color: "var(--white)" }}>{license.days_left}</span></div>
                </div>
              </>
            ) : (
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Caricamento...</div>
            )}
          </div>

          <div className="dashboard-card">
            <h4>Chiave licenza</h4>
            {license ? (
              <div className="license-key">
                <span>{license.key}</span>
                <button className="copy-btn" onClick={handleCopy} type="button" title="Copia">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            ) : (
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Caricamento...</div>
            )}
          </div>

          <div className="dashboard-card">
            <h4>Scarica SMOT</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 16 }}>
              Scarica l'app desktop per iniziare ad archiviare i tuoi documenti.
            </p>
            <a
              href="https://github.com/BigBoss133/SMOT-APP/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: "inline-flex" }}
            >
              <Download size={16} /> Scarica SMOT
            </a>
          </div>
        </div>

        <div className="dashboard-card" style={{ marginTop: 24 }}>
          <h4>Storico pagamenti</h4>
          {payments.length === 0 ? (
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", padding: "16px 0" }}>Nessun pagamento effettuato.</div>
          ) : (
            <table className="payment-table">
              <thead>
                <tr><th>Data</th><th>Importo</th><th>Stato</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>{(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}</td>
                    <td>{p.status === "completed" ? "Completato" : p.status}</td>
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
