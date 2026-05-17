import { useState, useEffect } from "react";
import BookList from "../../components/book/BookList";
import Filters from "../../components/ui/Filters";
import Pagination from "../../components/ui/Pagination";
import "./CollectionPage.css";

const CollectionPage = ({ title, fetchFunction }) => {
  // Inicializa o estado diretamente com a função síncrona
  const [allBooks] = useState(() => fetchFunction() || []);

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(12);

  // Estado para guardar o título anterior e comparar
  const [prevTitle, setPrevTitle] = useState(title);

  // Se o título mudou, fazemos o reset da página imediatamente durante o render
  if (title !== prevTitle) {
    setPrevTitle(title);
    setCurrentPage(1);
  }

  // Estado dos Filtros
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 500,
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

  // Scroll ao topo quando muda a página ou o título
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title, currentPage]);

  // Lógica de Filtragem e Ordenação feita diretamente na renderização
  const getFilteredBooks = () => {
    let result = [...allBooks];

    // Filtro de Preço considerando desconto
    result = result.filter((book) => {
      const currentPrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
      return currentPrice <= activeFilters.priceRange;
    });

    // Ordenação por Nome e Preço
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

  // Cálculos de exibição e paginação protegida
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const validatedPage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastBook = validatedPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Resetar a página no momento exato em que os filtros mudam
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({ priceRange: 500, sortOrder: "" });
    setCurrentPage(1);
  };

  return (
    <main className="content">
      <header className="collection-header">
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
