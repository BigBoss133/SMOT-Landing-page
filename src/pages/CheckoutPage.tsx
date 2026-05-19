import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LoaderCircle } from "lucide-react";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status] = useState(sessionId ? "success" : "error");

  useEffect(() => {
    if (sessionId) {
      const timer = setTimeout(() => navigate("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  return (
    <div className="page">
      <Navbar />
      <div className="form-page">
        <div className="form-card" style={{ textAlign: "center" }}>
          {status === "loading" && (
            <>
              <LoaderCircle size={32} style={{ animation: "spin 1s linear infinite", color: "var(--indaco)", marginBottom: 16 }} />
              <h2>Elaborazione pagamento...</h2>
            </>
          )}
          {status === "success" && (
            <>
              <h2>Pagamento completato!</h2>
              <p className="subtitle">La tua licenza è attiva. Verrai reindirizzato alla dashboard.</p>
            </>
          )}
          {status === "error" && (
            <>
              <h2>Pagamento non completato</h2>
              <p className="subtitle">Nessuna sessione di pagamento trovata. Torna alla <a href="/pricing" style={{ color: "var(--indaco)" }}>pagina prezzi</a>.</p>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
