import { createContext, useContext, useState } from "react";

// Contexto de Autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializa o token a partir do localStorage (se existir, mantém o login ativo)
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Inicializa o utilizador a partir do localStorage.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Função de Login
  const login = (userData, tokenData) => {
    setToken(tokenData);
    setUser(userData);
    // Guarda no localStorage
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Função de Logout
  const logout = () => {
    // Limpa os estados
    setToken(null);
    setUser(null);

    // Remove os dados de autenticação do navegador
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpa também os favoritos para que não fiquem acessíveis após o logout
    localStorage.removeItem("my-favorites");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
