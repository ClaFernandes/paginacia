import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  // Se houver só uma página, não mostra a barra
  if (totalPages <= 1) return null;

  //Calcula quais números de página devem aparecer (máx 3).
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);

    let adjustedStart = start;

    // Se estiver na última página, tenta mostrar as 2 anteriores
    if (end === totalPages && end - start < 2) {
      adjustedStart = Math.max(1, end - 2);
    }

    for (let i = adjustedStart; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      {/* Botão Anterior */}
      <button
        className="page-button nav-button"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      {/* Números das páginas baseados na lógica de janela */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`page-button ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      ))}

      {/* Botão Próxima */}
      <button
        className="page-button nav-button"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
