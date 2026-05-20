import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllBooks } from "../../services/booksService";
import BookList from "../../components/book/BookList";
import Pagination from "../../components/ui/Pagination";
import Filters from "../../components/ui/Filters";

function Home() {
  const [books] = useState(() => getAllBooks() || []);
  const { searchTerm } = useOutletContext() || { searchTerm: "" };

  // Filtros que vêm do componente Filters
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 200,
    sortOrder: "",
  });

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(12);

  // Efeito para detetar tamanho do ecrã
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBooksPerPage(4);
      } else {
        setBooksPerPage(12);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lógica da filtragem e ordenação
  const getFilteredAndSortedBooks = () => {
    let result = [...books];

    if (searchTerm) {
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtro por faixa de preço
    result = result.filter((book) => {
      const currentPrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
      return currentPrice <= activeFilters.priceRange;
    });

    // Filtro ordenação
    if (activeFilters.sortOrder === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (activeFilters.sortOrder === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } else if (activeFilters.sortOrder === "price-low") {
      result.sort((a, b) => {
        const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return pA - pB;
      });
    } else if (activeFilters.sortOrder === "price-high") {
      result.sort((a, b) => {
        const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return pB - pA;
      });
    }

    return result;
  };

  const finalBooks = getFilteredAndSortedBooks();

  // Cálculos paginação
  const totalPages = Math.ceil(finalBooks.length / booksPerPage);
  const validatedPage = currentPage > totalPages ? 1 : currentPage;
  const indexOfLastBook = validatedPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = finalBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Funções para Filters
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({ priceRange: 500, sortOrder: "" });
    setCurrentPage(1);
  };

  return (
    <div className="home-container" style={{ padding: "2rem" }}>
      <Filters
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {currentBooks.length > 0 ? (
        <>
          <BookList books={currentBooks} />

          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p>Nenhum livro encontrado para os critérios selecionados.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
