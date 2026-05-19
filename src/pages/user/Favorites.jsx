import { useFavorites } from "../../context/FavoritesContext";
// Importa o hook para aceder aos livros favoritados
import BookList from "../../components/book/BookList";
// Reutiliza a listagem padrão de livros da app
import { Link } from "react-router-dom"; // Importa o Link para navegação interna
import { FaHeartBroken, FaHeart } from "react-icons/fa";
// Ícones importados do react-icons
import "./Favorites.css";

function Favorites() {
    // Extrai o array de favoritos guardado centralizadamente no contexto
    const { favorites } = useFavorites();

    return (
        <div className="favorites-container">
            {/* Wrapper que mantém a consistência do alinhamento do botão com as outras páginas */}
            <div className="back-home-wrapper">
                <Link to="/" className="btn-back-home">
                    ← Voltar para a Home
                </Link>
            </div>

            {/* CONDICIONAL: Se o array estiver vazio, renderiza o ecrã de aviso */}
            {favorites.length === 0 ? (
                /* --- ESTADO VAZIO: Utilizador não tem livros na lista --- */
                <div className="favorites-empty">
                    <FaHeartBroken className="icon-empty-favorites" />
                    <h2 className="empty-title">A sua lista de favoritos está vazia.</h2>
                    <p className="empty-text">
                        Explore a nossa livraria e guarde os seus livros preferidos aqui!
                    </p>
                </div>
            ) : (
                /* --- ESTADO COM ITENS: Utilizador tem livros guardados --- */
                <>
                    {/* Título da página com o ícone de coração do react-icons */}
                    <h1 className="favorites-title">
                        <FaHeart className="icon-title-favorites" />
                        Os Meus Livros Favoritos
                    </h1>

                    {/* Reutiliza o componente BookList global passando os favoritos */}
                    <div className="favorites-list-wrapper">
                        <BookList books={favorites} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Favorites;