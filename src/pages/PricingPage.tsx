import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createCheckout } from "../services/api";
import Navbar from "../components/Navbar";
import { Check } from "lucide-react";

const plans = [
  {
    id: "monthly" as const,
    name: "Mensile",
    price: "9.99",
    period: "/mese",
    savings: null,
    featured: false,
    features: ["Accesso completo all'app", "IA locale inclusa", "Aggiornamenti gratuiti", "Supporto via email"],
  },
  {
    id: "annual" as const,
    name: "Annuale",
    price: "89.99",
    period: "/anno",
    savings: "Risparmi 29.89 €/anno",
    featured: true,
    features: ["Tutto del piano Mensile", "2 mesi gratis", "Supporto prioritario", "Accesso anticipato alle novità"],
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async (plan: "monthly" | "annual") => {
    if (!isAuthenticated) { navigate("/register"); return; }
    try {
      const res = await createCheckout(plan);
      // eslint-disable-next-line react-hooks/immutability -- Stripe checkout redirect requires window.location.href
      window.location.href = res.url;
    } catch {
      alert("Errore durante la creazione del checkout. Riprova.");
    }
  };

  return (
    <div className="page">
      <Helmet>
        <title>Prezzi — SMOT | Piani Mensile e Annuale</title>
        <meta name="description" content="Scegli il piano SMOT più adatto a te: Mensile a 9.99 € o Annuale a 89.99 €. Prova gratuita 7 giorni sul primo pagamento." />
        <meta property="og:title" content="Prezzi — SMOT | Piani Mensile e Annuale" />
        <meta property="og:description" content="Piano Mensile 9.99 € o Annuale 89.99 €. Prova gratuita 7 giorni, annulla quando vuoi." />
        <meta property="og:url" content="https://smot.app/pricing" />
      </Helmet>
      <Navbar />
      <section className="pricing">
        <h2>Scegli il tuo piano</h2>
        <p className="subtitle">Prova gratuita 7 giorni sul primo pagamento. Annulla quando vuoi.</p>
        <div className="plans">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.featured ? "featured" : ""}`}>
              <h3>{plan.name}</h3>
              <div className="price">{plan.price}<span>{plan.period}</span></div>
              {plan.savings && <div className="savings">{plan.savings}</div>}
              <ul className="features">
                {plan.features.map((f, i) => (
                  <li key={i}><Check size={16} className="check" /> {f}</li>
                ))}
              </ul>
              <button className="btn btn-primary" onClick={() => handleCheckout(plan.id)}>
                {plan.featured ? "Prova Gratis" : "Acquista Ora"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
