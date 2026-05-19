import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext"; // Assumindo que tens este provider

// IMPORTAÇÕES DO REACT TOASTIFY
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // OBRIGATÓRIO: Importa o estilo padrão dos toasts

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>

          {/* As tuas rotas normais da aplicação */}
          <AppRoutes />

          {/* CONTENTOR GLOBAL DE TOASTS: Fica à escuta de disparos em qualquer página */}
          {/* O autoClose={3000} faz o toast sumir sozinho após 3 segundos */}
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
