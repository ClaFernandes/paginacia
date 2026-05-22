import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "./BookItem.css";

// Componente para exibir um livro individualmente, usado na listagem de livros
const BookItem = ({ id, title, author, price, image, discount }) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Calcula o preço final considerando o desconto, se houver
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;
  const favorited = isFavorite(id);

  // Formatação da moeda
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);

  // Verifica se user está logado antes de adicionar aos favoritos
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Precisa de iniciar sessão para adicionar livros aos favoritos!");
      navigate("/auth");
      return;
    }
    toggleFavorite({ id, title, author, price, image, discount });
  };

  return (
    <div className="book-card">
      {/* Imagem e título do livro */}
      <Link to={`/books/${id}`} className="book-link">
        <div className="image-container">
          <img
            src={new URL(`../../assets/images/${image}`, import.meta.url).href}
            alt={title}
            className="book-image"
          />
          {hasDiscount && <span className="discount-tag">-{discount}%</span>}
        </div>
        <h3 className="book-title">{title}</h3>
      </Link>

      {/* Autor */}
      <p className="book-author">{author}</p>

      <div className="book-footer">
        {/* Preço com formatação e desconto, se aplicável */}
        <div className="price-container">
          {hasDiscount ? (
            <>
              <span className="old-price" style={{ textDecoration: 'line-through', color: '#6B7280', fontSize: '0.85rem' }}>
                {formatCurrency(price)}
              </span>
              <span className="book-price discount-active">
                {formatCurrency(finalPrice)}
              </span>
            </>
          ) : (
            <span className="book-price">{formatCurrency(price)}</span>
          )}
        </div>

        {/* Ações do livro */}
        <div className="book-actions">
          <button className="cart-button" onClick={() => addToCart(id)}>
            <MdOutlineShoppingCart />
          </button>

          <button
            className={`favorite-button ${favorited ? "is-favorited" : ""}`}
            onClick={handleFavoriteClick}
            title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {favorited
              ? <MdFavorite style={{ color: "#e11d48" }} />
              : <MdFavoriteBorder />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;