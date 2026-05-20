import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

import { MdOutlineShoppingCart } from "react-icons/md";
import { GrFavorite } from "react-icons/gr";

import { Link, useNavigate } from "react-router-dom";
import "./BookItem.css";

const BookItem = ({ id, title, author, price, image, discount }) => {
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Cálculo de desconto e preço final
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  // Verifica se o livro específico está nos favoritos
  const favorited = isFavorite(id);

  // Função para formatar a moeda
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  // Função do botão de favoritos
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    // Valida o login usando o AuthContext
    if (!isLoggedIn) {
      alert("Precisa de iniciar sessão para adicionar livros aos favoritos!");
      navigate("/auth");
      return;
    }
    // Se estiver logado, alterna o estado do favorito 
    if (favorited) {
      removeFavorite(id);
    } else {
      addFavorite({ id, title, author, price, image, discount });
    }
  };

  return (
    <div className="book-card">

      <Link to={`/books/${id}`} className="book-link">

        {/* Tag de desconto e imagem */}
        <div className="image-container">
          <img
            src={new URL(`../../assets/images/${image}`, import.meta.url).href}
            alt={title}
            className="book-image"
          />
          {/* Se houver desconto, mostra a etiqueta */}
          {hasDiscount && <span className="discount-tag">-{discount}%</span>}
        </div>

        <h3 className="book-title">{title}</h3>
      </Link>
      <p className="book-author">{author}</p>

      <div className="book-footer">
        <div className="price-container">
          {hasDiscount ? (
            <>
              {/* Preço original riscado, com desconto ativo */}
              <span className="old-price" style={{ textDecoration: 'line-through', color: '#6B7280', fontSize: '0.85rem' }}>
                {formatCurrency(price)}
              </span>
              <span className="book-price discount-active">
                {formatCurrency(finalPrice)}
              </span>
            </>
          ) :
            (<span className="book-price">{formatCurrency(price)}</span>
            )}
        </div>

        <div className="book-actions">
          {/* Botão do carrinho */}
          <button className="cart-button" onClick={() => addToCart(id)}>
            <MdOutlineShoppingCart />
          </button>

          {/* Botão de favoritos */}
          <button
            className={`favorite-button ${favorited ? "is-favorited" : ""}`}
            onClick={handleFavoriteClick}
            title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {/* O ícone pinta-se dinamicamente com base no estado do contexto global de favoritos */}
            <GrFavorite
              style={{
                color: favorited ? "#e11d48" : "inherit",
                fill: favorited ? "#e11d48" : "none"
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;