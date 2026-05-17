import "./CartSidebar.css";
import { MdClose } from "react-icons/md";
import CartItem from "./CartItem";
import { useCart } from "../../context/CartContext";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, dispatch } = useCart();

  // Cálculo do total do carrinho
  const totalValue = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

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
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total">
              <span>Total:</span>
              <span>{totalValue.toFixed(2)} €</span>
            </div>

            <button className="checkout-btn">Finalizar Compra</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
