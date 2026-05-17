import "./Header.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import logoImage from "../../assets/logo.png";

import {
  MdOutlineShoppingCart,
  MdSearch,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { GrFavorite } from "react-icons/gr";

const Header = ({
  cartItems,
  onOpenCart,
  isLoggedIn,
  searchTerm,
  setSearchTerm,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/">
            <img src={logoImage} alt="logo-app" className="logo-img" />
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="menu-mobile-toggle"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <MdClose /> : <MdMenu />}
        </button>

        {/* Navbar - links */}
        <nav className={`header-menu ${isMenuOpen ? "open" : ""}`}>
          <Link
            to="/categories"
            className="menu-item"
            onClick={handleCloseMenu}
          >
            Categorias
          </Link>

          <Link to="/new-books" className="menu-item" onClick={handleCloseMenu}>
            Lançamentos
          </Link>

          <Link
            to="/best-sellers"
            className="menu-item"
            onClick={handleCloseMenu}
          >
            Mais Vendidos
          </Link>

          <Link
            to="/low-prices"
            className="menu-item highlight-alert"
            onClick={handleCloseMenu}
          >
            Promoções
          </Link>
        </nav>

        <div className="header-right">
          {/* Busca global */}
          <div className="header-search">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar livros ou autores..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/*Ícones */}
          <div className="header-icons-group">
            <Link
              to={isLoggedIn ? "/perfil" : "/auth"}
              onClick={handleCloseMenu}
            >
              <RxAvatar className="icon-style" />
            </Link>

            <Link to="/favorites" onClick={handleCloseMenu}>
              <GrFavorite className="icon-style" />
            </Link>

            <div className="header-cart" onClick={onOpenCart}>
              <MdOutlineShoppingCart className="icon-style" />

              {cartItems.length > 0 && (
                <span className="cart-badge">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
