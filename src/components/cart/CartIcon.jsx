import { MdOutlineShoppingCart } from "react-icons/md";

function CartIcon() {
  return (
    <div className="cart-icon">
      <MdOutlineShoppingCart />
      <span className="cart-badge">0</span>
    </div>
  );
}

export default CartIcon;
