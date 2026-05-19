import "./CartSidebar.css";
import { MdClose } from "react-icons/md";
import CartItem from "./CartItem";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, dispatch } = useCart();
  const navigate = useNavigate();

  const safeCart = cartItems || [];

  // Cálculo do total, considerando desconto se aplicável
  const totalValue = cartItems.reduce((acc, item) => {
    const price = item.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  // Redirecionamento para checkout ao clicar no botão
  const handleCheckoutRedirect = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay - fecha sidebar ao clicar fora */}
      <div
        className={`cart-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <h2>Carrinho</h2>

          <button onClick={onClose} className="close-btn">
            <MdClose size={32} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p className="empty-msg">O seu carrinho está vazio.</p>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} dispatch={dispatch} />
            ))
          )}
        </div>

        {/* Footer */}
        {safeCart.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>{totalValue.toFixed(2)} €</span>
            </div>

            {/* Redirecionamento */}
            <button className="checkout-btn" onClick={handleCheckoutRedirect}>
              Finalizar Compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
