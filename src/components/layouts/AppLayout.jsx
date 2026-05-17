import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "../cart/CartSidebar";

import { useCart } from "../../context/CartContext";

// Layout global: header, footer, sidebar, outlet
function AppLayout({ isLoggedIn }) {
  const { cartItems } = useCart();

  // UI state local do layout
  const [isCartOpen, setIsCartOpen] = useState(false);

  // estado global de busca
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Header */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        isLoggedIn={isLoggedIn}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Conteúdo das páginas */}
      <main>
        <Outlet context={{ searchTerm }} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sidebar do Carrinho */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default AppLayout;
