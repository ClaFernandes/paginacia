import "./BookItem.css";
import { MdOutlineShoppingCart } from "react-icons/md";
import { GrFavorite } from "react-icons/gr";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const BookItem = ({ id, title, author, price, image, discount, onToggleFavorite }) => {
  const { addToCart } = useCart();

  // Se houver desconto, calcula o preço final
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  // Função para formatar a moeda
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  return (
    <div className="book-card">
      <Link to={`/books/${id}`} className="book-link">
        {/* tag de desconto */}
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
              {/* Preço original riscado */}
              <span className="old-price" style={{ textDecoration: 'line-through', color: '#6B7280', fontSize: '0.85rem' }}>
                {formatCurrency(price)}
              </span>
              {/* Preço novo */}
              <span className="book-price discount-active">
                {formatCurrency(finalPrice)}
              </span>
            </>
          ) : (
            <span className="book-price">{formatCurrency(price)}</span>
          )}
        </div>

        <div className="book-actions">
          <button className="cart-button" onClick={() => addToCart(id)}>
            <MdOutlineShoppingCart />
          </button>

          <button
            className="favorite-button"
            onClick={() => onToggleFavorite && onToggleFavorite(id)}
          >
            <GrFavorite />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
