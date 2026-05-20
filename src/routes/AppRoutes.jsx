import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Home from "../pages/core/Home";
import About from "../pages/core/About";
import Contact from "../pages/core/Contact";
import TermsOfUse from "../pages/core/TermsOfUse";
import PrivacyPolicy from "../pages/core/PrivacyPolicy";
import NotFound from "../pages/core/NotFound";
import BookPage from "../pages/core/BookPage";
import Categories from "../pages/collections/Categories";
import BestSellers from "../pages/collections/BestSellers";
import NewBooks from "../pages/collections/NewBooks";
import LowPrices from "../pages/collections/LowPrices";
import Profile from "../pages/user/Profile";
import Favorites from "../pages/user/Favorites";
import Auth from "../pages/user/Auth";
import Checkout from "../pages/core/Checkout";
import { useAuth } from "../context/AuthContext";

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* AppLayout envolve todas as páginas, com Header e Footer constantes */}
      <Route path="/" element={<AppLayout isLoggedIn={isLoggedIn} />}>
        {/* Rota Padrão */}
        <Route index element={<Home />} />

        {/* Coleções e Categorias */}
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:slug" element={<Categories />} />
        <Route path="new-books" element={<NewBooks />} />
        <Route path="best-sellers" element={<BestSellers />} />
        <Route path="low-prices" element={<LowPrices />} />

        {/* Detalhes do Livro e Institucional */}
        <Route path="books/:id" element={<BookPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Termos de Uso e Política de Privacidade */}
        <Route path="terms" element={<TermsOfUse />} />
        <Route path="privacy" element={<PrivacyPolicy />} />

        {/* Autenticação */}
        <Route
          path="auth"
          element={isLoggedIn ? <Navigate to="/" /> : <Auth />}
        />

        {/* Rotas Privadas */}
        <Route
          path="profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/auth" />}
        />
        <Route
          path="favorites"
          element={isLoggedIn ? <Favorites /> : <Navigate to="/auth" />}
        />

        {/* Checkout */}
        <Route
          path="checkout"
          element={isLoggedIn ? <Checkout /> : <Navigate to="/auth" />}
        />

        {/* Rota de Erro 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
