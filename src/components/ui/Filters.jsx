import { useState } from "react";
import { MdFilterList, MdClose } from "react-icons/md";
import "./Filters.css";

const Filters = ({ onFilterChange, onClear }) => {
  // Estado que controla sidebar
  const [isOpen, setIsOpen] = useState(false);

  // Estado local para o slider de preço máximo
  const [priceRange, setPriceRange] = useState(200);

  // Estados independentes para seletores
  const [alphabeticalSort, setAlphabeticalSort] = useState("");
  const [priceSort, setPriceSort] = useState("");

  // Calcula a percentagem do slider de preço
  const sliderPercentage = (priceRange / 200) * 100;

  // Agrupa as escolhas locais e envia o resultado consolidado para o componente pai
  const handleApply = () => {
    // Usa a ordenação alfabética ou a de preço (uma anula a outra)
    const currentSortOrder = alphabeticalSort || priceSort || "";

    onFilterChange({ priceRange, sortOrder: currentSortOrder });
    setIsOpen(false); // Fecha a sidebar após aplicar
  };

  // Restaura as definições originais de fábrica do componente de filtros
  const handleReset = () => {
    setPriceRange(200);
    setAlphabeticalSort("");
    setPriceSort("");
    onClear(); // Avisa o pai que os filtros foram limpos
    setIsOpen(false); // Fecha a sidebar
  };

  // Garante que ao escolher ordenação alfabética, o seletor por preço é limpo
  const handleAlphabeticalChange = (value) => {
    setAlphabeticalSort(value);
    if (value !== "") {
      setPriceSort("");
    }
  };

  // Garante que ao escolher ordenação por preço, o seletor alfabético é limpo
  const handlePriceSortChange = (value) => {
    setPriceSort(value);
    if (value !== "") {
      setAlphabeticalSort("");
    }
  };

  return (
    <div className="filters-wrapper">
      {/* Botão de disparo que abre a barra lateral de filtros */}
      <button className="filter-trigger-btn" onClick={() => setIsOpen(true)}>
        <MdFilterList size={20} />
        <span>Filtros</span>
      </button>

      {/* Contentor do Sidebar */}
      <aside className={`filters-sidebar ${isOpen ? "open" : ""}`}>
        {/* Cabeçalho com o Título e o Botão X */}
        <div className="sidebar-header">
          <h3>Filtros</h3>
          <button
            className="close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Corpo da Sidebar */}
        <div className="sidebar-body">
          {/* Seção 1: Ordem Alfabética */}
          <div className="filter-section">
            <label className="filter-label">Ordem Alfabética</label>
            <select
              className="filter-select"
              value={alphabeticalSort}
              onChange={(e) => handleAlphabeticalChange(e.target.value)}
            >
              <option value="">Relevância</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
            </select>
          </div>

          {/* Seção 2: Ordenação por Faixas de Preço */}
          <div className="filter-section">
            <label className="filter-label">Ordem por Preço</label>
            <select
              className="filter-select"
              value={priceSort}
              onChange={(e) => handlePriceSortChange(e.target.value)}
            >
              <option value="">Relevância</option>
              <option value="price-low">Preço: mais baixo</option>
              <option value="price-high">Preço: mais alto</option>
            </select>
          </div>

          {/* Ranger de Preço Máximo */}
          <div className="filter-section">
            <label className="filter-label">
              Preço Máximo: <span>{priceRange}€</span>
            </label>

            <input
              type="range"
              className="price-slider"
              min="0"
              max="200"
              step="10"
              value={priceRange}
              style={{
                background: `linear-gradient(to right, #1a3a3a 0%, #1a3a3a ${sliderPercentage}%, #e0e0e0 ${sliderPercentage}%, #e0e0e0 100%)`,
              }}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />

            {/* Etiquetas de limites inferiores e superiores */}
            <div className="price-labels">
              <span>0€</span>
              <span>200€</span>
            </div>
          </div>
        </div>

        {/* Rodapé fixo com os botões de ação estruturados */}
        <div className="sidebar-footer">
          <button className="btn-apply-filters" onClick={handleApply}>
            Aplicar Filtros
          </button>
          <button className="btn-clear-filters" onClick={handleReset}>
            Limpar
          </button>
        </div>
      </aside>

      {/* Overlay quando a barra expande */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
};

export default Filters;
