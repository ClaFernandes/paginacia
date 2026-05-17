import { useParams } from "react-router-dom";
import { getBookById } from "../../services/booksService";
import { useCart } from "../../context/CartContext";

import {
  MdOutlineShoppingCart,
  MdFavoriteBorder,
  MdFiberManualRecord,
} from "react-icons/md";

import "./BookPage.css";

function BookPage() {
  // ID do livro diretamente da URL da página
  const { id } = useParams();

  // Função global do Context para adicionar itens ao carrinho
  const { addToCart } = useCart();

  // Busca o livro diretamente de forma síncrona usando o ID, já que os dados estão localmente disponíveis
  const book = getBookById(id);

  // Espera caso os dados ainda não tenham sido recuperados
  if (!book) return <div className="loading">Livro não encontrado...</div>;

  // Preço: verifica se há desconto para calcular o valor final
  const hasDiscount = book.discount > 0;
  const finalPrice = hasDiscount
    ? book.price * (1 - book.discount / 100)
    : book.price;

  // Construção dinâmica da URL da imagem usando a pasta assets local
  const imgUrl = new URL(`../../assets/images/${book.image}`, import.meta.url)
    .href;

  // Categorias: caso o dado venha como array ou como string separada por vírgula
  const categories = Array.isArray(book.category)
    ? book.category
    : book.category.split(",").map((c) => c.trim());

  return (
    <main className="book-page-wrapper">
      <div className="book-details-container">
        {/* Capa e Etiquetas */}
        <section className="book-visual-side">
          <div className="image-frame">
            {/* Etiquetas Bestseller e Novidade */}
            <div className="badges-wrapper">
              {book.isBestSeller && (
                <span className="badge-bestseller">Bestseller</span>
              )}
              {book.isNew && <span className="badge-new">Novidade</span>}
            </div>
            <img src={imgUrl} alt={book.title} className="main-cover" />
          </div>
        </section>

        {/* Textos e Botões */}
        <section className="book-info-side">
          <header className="book-header-main">
            {/* Mapeamento das categorias para que cada uma tenha seu próprio estilo */}
            <div className="category-list-wrapper">
              {categories.map((cat, index) => (
                <span key={index} className="category-label">
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="main-title">{book.title}</h1>
            <p className="author-name">
              por <span>{book.author}</span>
            </p>
          </header>

          {/* Informações técnicas separadas por pontos */}
          <div className="meta-info-strip">
            <span>{book.pages} páginas</span>
            <MdFiberManualRecord className="dot-separator" />
            <span>{book.language || "Português"}</span>
            <MdFiberManualRecord className="dot-separator" />
            <span className="stock-status">Em stock</span>
          </div>

          {/* Área de compra */}
          <div className="purchase-card">
            <div className="price-section">
              {hasDiscount ? (
                /* Bloco exibido apenas se houver desconto disponível */
                <div className="discount-container-home">
                  <div className="promo-row">
                    <span className="old-price-line">
                      {book.price.toFixed(2)}€
                    </span>
                    <span className="discount-tag-home">-{book.discount}%</span>
                  </div>
                  <span className="final-price-main">
                    {finalPrice.toFixed(2)}€
                  </span>
                </div>
              ) : (
                /* Bloco simples para preço sem desconto */
                <span className="final-price-main">
                  {book.price.toFixed(2)}€
                </span>
              )}
            </div>

            <div className="action-area">
              {/* Botão de compra que aciona a função do Contexto */}
              <button
                className="buy-button-main"
                onClick={() => addToCart(book.id)}
              >
                <MdOutlineShoppingCart size={24} />
                <span>Comprar</span>
              </button>

              {/* Botão de favoritos */}
              <button className="favorite-btn-square">
                <MdFavoriteBorder size={26} />
              </button>
            </div>
          </div>

          {/* Sinopse descritiva do livro */}
          <article className="synopsis-section">
            <h3>Sobre o Livro</h3>
            <p>{book.description}</p>
          </article>

          {/* Lista de tags */}
          <div className="tags-container">
            {book.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default BookPage;
