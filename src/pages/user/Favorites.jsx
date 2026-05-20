import { useState, useEffect } from "react";
import { useFavorites } from "../../context/FavoritesContext";
import BookList from "../../components/book/BookList";
import Pagination from "../../components/ui/Pagination";
import { Link } from "react-router-dom";
import { FaHeartBroken, FaChevronLeft } from "react-icons/fa";
import "./Favorites.css";

function Favorites() {
    // Extrai o array de favoritos guardado no contexto
    const { favorites } = useFavorites();

    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(8);

    // Cálculos de paginação
    const totalPages = Math.ceil(favorites.length / booksPerPage);
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = favorites.slice(indexOfFirstBook, indexOfLastBook);

    // Efeito para resetar a página atual caso o utilizador remova livros 
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [favorites, currentPage, totalPages]);

    return (
        <div className="favorites-container">

            <div className="back-home-container">
                <Link to="/" >
                    <FaChevronLeft /> Voltar à Página Inicial
                </Link>
            </div>

            {favorites.length > 0 && (
                <h1 className="favorites-title">
                    Os Meus Livros Favoritos
                </h1>
            )}

            {favorites.length === 0 ? (
                <div className="favorites-empty">
                    <FaHeartBroken className="icon-empty-favorites" />
                    <h2 className="empty-title">A sua lista de favoritos está vazia.</h2>
                    <p className="empty-text">
                        Explore a nossa livraria e guarde os seus livros preferidos aqui!
                    </p>
                </div>
            ) : (
                <div className="favorites-list-wrapper">
                    <BookList books={currentBooks} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}

export default Favorites;