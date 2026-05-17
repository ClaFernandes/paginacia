import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/paginacia">
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>,
);
