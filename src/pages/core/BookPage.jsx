import { useParams } from "react-router-dom";
import { getBookById } from "../../services/booksService";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import {
  MdOutlineShoppingCart,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { MdFiberManualRecord } from "react-icons/md";

import "./BookPage.css";
function BookPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Busca o livro pelo ID usando a função do serviço
  const book = getBookById(id);

  // Se o livro não for encontrado, exibe uma mensagem de carregamento ou erro
  if (!book) return <div className="loading">Livro não encontrado...</div>;

  // Calcula o preço final considerando o desconto, se houver
  const hasDiscount = book.discount > 0;
  const finalPrice = hasDiscount
    ? book.price * (1 - book.discount / 100)
    : book.price;

  // Caminho para imagem do livro
  const imgUrl = new URL(`../../assets/images/${book.image}`, import.meta.url).href;

  // Garante que a categoria seja sempre um array, mesmo que venha como string
  const categories = Array.isArray(book.category)
    ? book.category
    : book.category.split(",").map((c) => c.trim());

  // Verifica se o livro já está nos favoritos para alternar o ícone
  const alreadyFavorite = isFavorite(book.id);

  return (
    <main className="book-page-wrapper">
      <div className="book-details-container">

        <section className="book-visual-side">
          <div className="image-frame">
            <div className="badges-wrapper">
              {book.isBestSeller && <span className="badge-bestseller">Bestseller</span>}
              {book.isNew && <span className="badge-new">Novidade</span>}
            </div>
            <img src={imgUrl} alt={book.title} className="main-cover" />
          </div>
        </section>

        <section className="book-info-side">
          <header className="book-header-main">
            <div className="category-list-wrapper">
              {categories.map((cat, index) => (
                <span key={index} className="category-label">{cat}</span>
              ))}
            </div>
            <h1 className="main-title">{book.title}</h1>
            <p className="author-name">por <span>{book.author}</span></p>
          </header>

          <div className="meta-info-strip">
            <span>{book.pages} páginas</span>
            <MdFiberManualRecord className="dot-separator" />
            <span>{book.language || "Português"}</span>
            <MdFiberManualRecord className="dot-separator" />
            <span className="stock-status">Em stock</span>
          </div>

          <div className="purchase-card">
            <div className="price-section">
              {hasDiscount ? (
                <div className="discount-container-home">
                  <div className="promo-row">
                    <span className="old-price-line">{book.price.toFixed(2)}€</span>
                    <span className="discount-tag-home">-{book.discount}%</span>
                  </div>
                  <span className="final-price-main">{finalPrice.toFixed(2)}€</span>
                </div>
              ) : (
                <span className="final-price-main">{book.price.toFixed(2)}€</span>
              )}
            </div>

            <div className="action-area">
              <button className="buy-button-main" onClick={() => addToCart(book.id)}>
                <MdOutlineShoppingCart size={24} />
                <span>Comprar</span>
              </button>

              <button
                className={`favorite-btn-square ${alreadyFavorite ? "is-favorite" : ""}`}
                onClick={() => toggleFavorite(book)}
              >
                {alreadyFavorite
                  ? <MdFavorite size={26} />
                  : <MdFavoriteBorder size={26} />
                }
              </button>
            </div>
          </div>

          <article className="synopsis-section">
            <h3>Sobre o Livro</h3>
            <p>{book.description}</p>
          </article>

          <div className="tags-container">
            {book.tags.map((tag) => (
              <span key={tag} className="tag-pill">#{tag}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default BookPage;