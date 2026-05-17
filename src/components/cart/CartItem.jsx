import "./CartItem.css";
import { MdAdd, MdRemove, MdDeleteOutline } from "react-icons/md";
import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  // Extrai dispatch do contexto para evitar erros de props indefinidas
  const { dispatch } = useCart();

  // Caminho da imagem
  const getImageUrl = (imageName) => {
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  };

  return (
    <div className="cart-item">
      <img src={getImageUrl(item.image)} alt={item.title} />

      <div className="item-info">
        <h4>{item.title}</h4>

        {/* Mostra o preço unitário com desconto no CartContext */}
        <div className="cart-price-area">
          <span className="item-price">{item.price.toFixed(2)}€</span>
          {/* badge se houver desconto original no livro */}
          {item.discount > 0 && <span className="promo-badge">Promo</span>}
        </div>

        <div className="quantity-controls">
          <button onClick={() => dispatch({ type: "DECREASE", id: item.id })}>
            <MdRemove />
          </button>

          <span>{item.quantity}</span>

          <button onClick={() => dispatch({ type: "INCREASE", id: item.id })}>
            <MdAdd />
          </button>

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
