import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import {
  MdOutlineSelfImprovement,
  MdOutlineExplore,
  MdOutlineMenuBook,
  MdOutlineScience,
  MdOutlineHistoryEdu,
  MdOutlineAutoAwesome,
  MdOutlineRocketLaunch,
  MdOutlineHistory,
  MdOutlineChildCare,
  MdOutlineBusinessCenter,
  MdOutlineFavoriteBorder,
  MdOutlineComputer,
  MdArrowBack,
  MdArrowForward,
} from "react-icons/md";

import booksData from "../../data/books.json";
import BookList from "../../components/book/BookList";
import Filters from "../../components/ui/Filters";
import Pagination from "../../components/ui/Pagination";
import "./Categories.css";

// Definição das Categorias com Slugs e Ícones
const CATEGORIES_DATA = [
  {
    id: 1,
    name: "Autoajuda",
    slug: "autoajuda",
    icon: <MdOutlineSelfImprovement />,
  },
  { id: 2, name: "Aventura", slug: "aventura", icon: <MdOutlineExplore /> },
  { id: 3, name: "Biografia", slug: "biografia", icon: <MdOutlineMenuBook /> },
  { id: 4, name: "Ciência", slug: "ciencia", icon: <MdOutlineScience /> },
  {
    id: 5,
    name: "Clássicos",
    slug: "classicos",
    icon: <MdOutlineHistoryEdu />,
  },
  { id: 6, name: "Fantasia", slug: "fantasia", icon: <MdOutlineAutoAwesome /> },
  { id: 7, name: "Ficção", slug: "ficcao", icon: <MdOutlineRocketLaunch /> },
  { id: 8, name: "História", slug: "historia", icon: <MdOutlineHistory /> },
  {
    id: 9,
    name: "Infantil & Juvenil",
    slug: "infantil-juvenil",
    icon: <MdOutlineChildCare />,
  },
  {
    id: 10,
    name: "Negócios",
    slug: "negocios",
    icon: <MdOutlineBusinessCenter />,
  },
  {
    id: 11,
    name: "Romance",
    slug: "romance",
    icon: <MdOutlineFavoriteBorder />,
  },
  {
    id: 12,
    name: "Tecnologia",
    slug: "tecnologia",
    icon: <MdOutlineComputer />,
  },
];

const Categories = () => {
  const { slug } = useParams();

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(12);

  // Declara o estado dos filtros
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 500,
    sortOrder: "",
  });

  // Sincroniza o reset da página quando o slug muda
  const [prevSlug, setPrevSlug] = useState(slug);
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setCurrentPage(1);
    // faz reset aos filtros também ao mudar de categoria
    setActiveFilters({ priceRange: 200, sortOrder: "" });
  }

  // Menos livros por página no telemóvel
  useEffect(() => {
    const handleResize = () => {
      setBooksPerPage(window.innerWidth < 768 ? 4 : 8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sempre que mudar a categoria ou página, volta ao topo do site
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, currentPage]);

  // Função para limpar acentos e espaços para comparação
  const normalize = (str) =>
    str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim()
      : "";

  // Lógica de Filtro dos Livros baseado no Slug da URL
  const getFilteredBooks = () => {
    if (!slug) return [];

    // Filtro por Categoria
    let result = booksData.filter((book) => {
      const urlSlug = slug;
      const bookCategories = Array.isArray(book.category)
        ? book.category
        : [book.category];

      return bookCategories.some((cat) => {
        const normalizedCat = normalize(cat);
        const normalizedSlug = normalize(urlSlug).replace(/s$/, "");

        if (urlSlug === "infantil-juvenil") {
          return (
            normalizedCat.includes("infantil") ||
            normalizedCat.includes("juvenil")
          );
        }
        return (
          normalizedCat.includes(normalizedSlug) ||
          normalizedSlug.includes(normalizedCat)
        );
      });
    });

    // Aplica Filtro de Faixa de Preço
    result = result.filter((book) => {
      const currentPrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;
      return currentPrice <= activeFilters.priceRange;
    });

    // Aplica Ordenação
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

  const allFilteredBooks = getFilteredBooks();

  // Cálculos paginação protegida
  const totalPages = Math.ceil(allFilteredBooks.length / booksPerPage);
  const validatedPage = currentPage > totalPages ? 1 : currentPage;

  const indexOfLastBook = validatedPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = allFilteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook,
  );

  const activeCategory = CATEGORIES_DATA.find((c) => c.slug === slug);

  // Controladores de mudança de filtros
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({ priceRange: 500, sortOrder: "" });
    setCurrentPage(1);
  };

  // Renderização de lista de livros de uma categoria selecionada
  if (slug) {
    return (
      <>
        <header className="results-header">
          <Link to="/categories" className="back-link">
            <MdArrowBack /> Voltar às Categorias
          </Link>
          <h2>
            Explore a coleção de{" "}
            <span className="category-highlight">
              {activeCategory?.name || slug}
            </span>
          </h2>
        </header>

        <Filters
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <div className="categories-results-view">
          {currentBooks.length > 0 ? (
            <>
              <div className="books-grid-wrapper">
                <BookList books={currentBooks} />
              </div>
              <Pagination
                currentPage={validatedPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          ) : (
            <div className="no-results">
              <p>
                Ainda não temos títulos disponíveis para{" "}
                <strong>{activeCategory?.name || slug}</strong> ou que
                correspondam aos filtros selecionados.
              </p>
              <Link
                to="/categories"
                className="back-link"
                style={{ marginTop: "20px" }}
              >
                Ver outras categorias
              </Link>
            </div>
          )}
        </div>
      </>
    );
  }

  // Visualização principal (Grade de todas as categorias)
  return (
    <section className="categories-section">
      <div className="categories-main-header">
        <h2>Descubra por Categoria</h2>
        <p>Mergulhe nos seus temas favoritos e encontre histórias incríveis</p>
      </div>

      <div className="categories-grid">
        {CATEGORIES_DATA.map((category) => (
          <Link
            to={`/categories/${category.slug}`}
            key={category.id}
            className="category-card"
          >
            <div className="category-icon-circle">{category.icon}</div>
            <h3 className="category-card-name">{category.name}</h3>
            <div className="category-card-arrow">
              <MdArrowForward />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
