import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Shield, Search, MessageSquare, Cpu, Globe, Lock } from "lucide-react";

const features = [
  { icon: <Shield size={24} />, title: "100% Offline", desc: "Zero cloud, zero telemetria. Tutti i documenti rimangono sul tuo computer." },
  { icon: <Search size={24} />, title: "Ricerca Full-Text", desc: "Cerca in millisecondi in tutti i tuoi documenti, anche senza connessione." },
  { icon: <MessageSquare size={24} />, title: "Chat IA Locale", desc: "Interroga i tuoi documenti in linguaggio naturale con Ollama integrato." },
  { icon: <Cpu size={24} />, title: "AI sul tuo PC", desc: "Niente cloud, niente abbonamenti. La potenza dell'IA resta tua." },
  { icon: <Globe size={24} />, title: "Multilingua", desc: "Interfaccia italiana e inglese. Rilevamento automatico della lingua." },
  { icon: <Lock size={24} />, title: "Privacy First", desc: "Nessun account, nessun server esterno. I tuoi dati sono solo tuoi." },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <h1>Il tuo archivio intelligente, completamente offline</h1>
        <p>
          SMOT è un'applicazione desktop nativa per archiviare, cercare e
          interrogare i tuoi documenti con l'IA locale. Zero cloud, zero
          telemetria, massima privacy.
        </p>
        <div className="hero-actions">
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn btn-primary">
            Scarica gratis
          </Link>
          <Link to="/pricing" className="btn btn-outline">Vedi piani</Link>
        </div>
      </section>
      <div className="container">
        <section className="features">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
