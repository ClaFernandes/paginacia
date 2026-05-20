import { useState, useEffect } from "react";
import BookList from "../../components/book/BookList";
import Filters from "../../components/ui/Filters";
import Pagination from "../../components/ui/Pagination";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CollectionPage.css";

const CollectionPage = ({ title, fetchFunction }) => {
  // Inicializa o estado com função síncrona
  const [allBooks] = useState(() => fetchFunction() || []);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(12);

  // Estado para guardar o título anterior e comparar
  const [prevTitle, setPrevTitle] = useState(title);

  // Se o título mudou, faz o reset da página durante o render
  if (title !== prevTitle) {
    setPrevTitle(title);
    setCurrentPage(1);
  }

  // Estado dos filtros
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 200,
    sortOrder: "",
  });

  // Ajusta a quantidade de livros conforme o ecrã
  useEffect(() => {
    const handleResize = () => {
      setBooksPerPage(window.innerWidth < 768 ? 4 : 8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll ao topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title, currentPage]);

  // Lógica de filtros e ordenação
  const getFilteredBooks = () => {
    let result = [...allBooks];

    // Filtro de preço considerando desconto
    result = result.filter((book) => {
      const currentPrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
      return currentPrice <= activeFilters.priceRange;
    });

    // Ordenação por nome e preço
    if (activeFilters.sortOrder === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (activeFilters.sortOrder === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (activeFilters.sortOrder === "price-low") {
      result.sort(
        (a, b) =>
          a.price * (1 - a.discount / 100) - b.price * (1 - b.discount / 100),
      );
    } else if (activeFilters.sortOrder === "price-high") {
      result.sort(
        (a, b) =>
          b.price * (1 - b.discount / 100) - a.price * (1 - a.discount / 100),
      );
    }

    return result;
  };

  const filteredBooks = getFilteredBooks();

  // Cálculos de exibição e paginação
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const validatedPage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastBook = validatedPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Resetar a página quando os filtros mudam
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({ priceRange: 200, sortOrder: "" });
    setCurrentPage(1);
  };

  return (
    <main className="content">
      <header className="collection-header">

        <div className="back-home-container">
          <Link to="/" className="btn-back-home">
            <FaChevronLeft /> Voltar à Página Inicial
          </Link>
        </div>

        <h1 className="main-title">{title}</h1>
        <Filters
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </header>

      {currentBooks.length > 0 ? (
        <div className="collection-grid-wrapper">
          <BookList books={currentBooks} />

          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <div className="no-results-container">
          <p>Nenhum livro encontrado nesta coleção.</p>
        </div>
      )}
    </main>
  );
};

export default CollectionPage;
