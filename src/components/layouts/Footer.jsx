import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const { isLoggedIn } = useAuth();

  // Submissão newsletter fake
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    toast("Obrigado! Subscreveu a nossa newsletter com sucesso.");
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Coluna 1 */}
        <div className="footer-column">
          <span className="logo-title">Página & Cia.</span>
          <p className="mission">Descubra mundos, página a página.</p>

          <div className="contact-info">
            <Link to="/contact" className="contact-link">
              Entre em contacto connosco
            </Link>
          </div>
        </div>

        {/* Coluna 2 */}
        <div className="footer-column">
          <h3>Explorar</h3>
          <ul className="quick-links">
            <li>
              <Link to="/">Página inicial</Link>
            </li>
            <li>
              <Link to="/favorites">Favoritos</Link>
            </li>
            <li>
              {/* Se estiver logado, muda para Perfil, caso contrário Login */}
              {isLoggedIn ? (
                <Link to="/profile">A Minha Conta</Link>
              ) : (
                <Link to="/auth">Iniciar Sessão </Link>
              )}
            </li>
            <li>
              <Link to="/about">Sobre Nós</Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3 */}
        <div className="footer-column">
          <h3>Redes Sociais</h3>
          <div className="social-icons">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaInstagram />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaFacebookF />
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <FaYoutube />
            </a>
          </div>

          <h3>Newsletter</h3>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input type="email" placeholder="Seu e-mail" required />
            <button type="submit">Subscrever</button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © 2026 Página & Cia. Todos os direitos reservados, Lisboa, Portugal.{" "}
        <Link to="/terms">Termos de Uso</Link> |{" "}
        <Link to="/privacy">Política de Privacidade</Link>
      </div>
    </footer>
  );
}

export default Footer;
