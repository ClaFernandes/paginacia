import logoImage from "../../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

import { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { MdOutlineShoppingCart, MdSearch, MdMenu, MdClose } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { GrFavorite } from "react-icons/gr";

import "./Header.css";

const Header = ({ onOpenCart, searchTerm, setSearchTerm }) => {
  // Menu hambúrguer mobile 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Caixinha flutuante do perfil 
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  // Contextos globais e roteamento
  const { cart } = useCart();
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  // Efeito para fechar popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // Remove o evento ao sair do componente 
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Funções de interface
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleCloseMenu = () => { setIsMenuOpen(false); setIsPopoverOpen(false); };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo com link para a página inicial */}
        <div className="header-logo">
          <Link to="/"><img src={logoImage} alt="logo-app" className="logo-img" /></Link>
        </div>

        {/* Botão mobile */}
        <button className="menu-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <MdClose /> : <MdMenu />}
        </button>

        {/* Links de navegação */}
        <nav className={`header-menu ${isMenuOpen ? "open" : ""}`}>
          <Link to="/categories" className="menu-item" onClick={handleCloseMenu}>Categorias</Link>
          <Link to="/new-books" className="menu-item" onClick={handleCloseMenu}>Lançamentos</Link>
          <Link to="/best-sellers" className="menu-item" onClick={handleCloseMenu}>Mais Vendidos</Link>
          <Link to="/low-prices" className="menu-item highlight-alert" onClick={handleCloseMenu}>Promoções</Link>
        </nav>

        {/* Pesquisa e ícones */}
        <div className="header-right">
          <div className="header-search">
            <MdSearch className="search-icon" />
            <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>

          <div className="header-icons-group">
            <div className="header-avatar-wrapper" ref={popoverRef} style={{ position: "relative" }}>
              <button className="avatar-btn" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                <RxAvatar className="icon-style" />
              </button>

              {isPopoverOpen && (
                <div className="popover-content">
                  {/* Se o utilizador não estiver logado */}
                  {!isLoggedIn ? (
                    <div className="auth-prompt">
                      <h3>Bem Vindo!</h3>
                      <p>Inicia uma sessão ou cria uma conta para uma experiência personalizada!</p>
                      <button onClick={() => { handleCloseMenu(); navigate("/auth?mode=login"); }}>INICIAR SESSÃO</button>
                      <button onClick={() => { handleCloseMenu(); navigate("/auth?mode=register"); }}>CRIAR CONTA</button>
                    </div>
                  ) : (
                    // Se o utilizador estiver logado
                    <div className="user-menu">
                      <p className="user-greeting">Olá, <strong>{user?.nome || "Utilizador"}</strong></p>
                      <button onClick={() => { handleCloseMenu(); navigate("/profile"); }}>Ver Perfil</button>
                      <button onClick={() => { logout(); handleCloseMenu(); }}>Terminar Sessão</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link to="/favorites" title="Meus Favoritos"><GrFavorite className="icon-style" /></Link>

            <div className="header-cart" onClick={onOpenCart}>
              <MdOutlineShoppingCart className="icon-style" />
              {cart?.length > 0 && <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;