import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Inicializa o estado diretamente a partir do localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Função que verifica se o ID já existe nos favoritos
  const isFavorite = (id) => favorites.some((item) => item.id === id);

  // Função para adicionar (mantém o objeto do livro)
  const addFavorite = (book) => {
    const updatedFavorites = [...favorites, book];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success(`"${book.title}" guardado nos favoritos! ❤️`);
  };

  // Função para remover (usa apenas o ID)
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.info("Livro removido dos favoritos.");
  };

  // Mantivemos o toggleFavorite caso queira usar em outros locais
  const toggleFavorite = (book) => {
    if (isFavorite(book.id)) {
      removeFavorite(book.id);
    } else {
      addFavorite(book);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  return useContext(FavoritesContext);
}
