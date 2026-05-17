import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layouts/AppLayout";
import Home from "../pages/core/Home";
import About from "../pages/core/About";
import Contact from "../pages/core/Contact";
import NotFound from "../pages/core/NotFound";
import BookPage from "../pages/core/BookPage";
import Categories from "../pages/collections/Categories";
import BestSellers from "../pages/collections/BestSellers";
import NewBooks from "../pages/collections/NewBooks";
import LowPrices from "../pages/collections/LowPrices";
import Perfil from "../pages/user/Perfil";

function AppRoutes() {
    // Simulação de login
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <Routes>
            {/* AppLayout é o container principal que tem o Header e Footer */}
            <Route path="/" element={<AppLayout isLoggedIn={isLoggedIn} />}>

                {/* Rota Padrão: Home */}
                <Route index element={<Home />} />

                {/* Rotas de Categorias */}
                <Route path="categories" element={<Categories />} />
                <Route path="categories/:slug" element={<Categories />} />

                {/* Rotas de Coleções */}
                <Route path="new-books" element={<NewBooks />} />
                <Route path="best-sellers" element={<BestSellers />} />
                <Route path="low-prices" element={<LowPrices />} />

                {/* Detalhes do Livro e Institucional */}
                <Route path="books/:id" element={<BookPage />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />

                {/* Rota Privada */}
                <Route
                    path="perfil"
                    element={isLoggedIn ? <Perfil /> : <Navigate to="/" />}
                />

                {/* Erro 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;