import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Prezzi" },
    ...(isAuthenticated ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SMOT</Link>
      <button className="hamburger" onClick={() => setOpen(!open)} type="button">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div className={`navbar-links${open ? " open" : ""}`} onClick={() => setOpen(false)}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{ fontWeight: location.pathname === link.to ? 700 : undefined, color: location.pathname === link.to ? "var(--white)" : undefined }}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            Dashboard
          </Link>
        ) : (
          <Link to="/register" className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
            Inizia gratis
          </Link>
        )}
      </div>
    </nav>
  );
}
