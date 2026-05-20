import { useCart } from "../../context/CartContext";
import { MdAdd, MdRemove, MdDeleteOutline } from "react-icons/md";
import "./CartItem.css";

function CartItem({ item }) {
  // Extrai dispatch do contexto para evitar erros de props indefinidas
  const { dispatch } = useCart();

  // Imagem
  const getImageUrl = (imageName) => {
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  };

  return (
    <div className="cart-item">
      <img src={getImageUrl(item.image)} alt={item.title} />

      <div className="item-info">
        <h4>{item.title}</h4>

        {/* Preço unitário com desconto */}
        <div className="cart-price-area">
          <span className="item-price">{item.price.toFixed(2)}€</span>
          {item.discount > 0 && <span className="promo-badge">Promo</span>}
        </div>

        {/* Botão diminuir quantidade, até remover */}
        <div className="quantity-controls">
          <button onClick={() => dispatch({ type: "DECREASE", id: item.id })}>
            <MdRemove />
          </button>

          <span>{item.quantity}</span>

          {/* Botão aumentar quantidade */}
          <button onClick={() => dispatch({ type: "INCREASE", id: item.id })}>
            <MdAdd />
          </button>

          {/* Botão remover */}
          <button
            className="remove-btn"
            onClick={() => dispatch({ type: "REMOVE", id: item.id })}
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
