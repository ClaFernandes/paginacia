import { Outlet } from "react-router-dom";

import { useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import CartSidebar from "../cart/CartSidebar";

function AppLayout() {
  // Estado para saber se sidebar do carrinho está visível ou oculta
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado de pesquisa 
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Conteúdo das páginas dinâmicas */}
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