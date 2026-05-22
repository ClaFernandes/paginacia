import { createContext, useContext, useEffect, useReducer, useMemo } from "react";
import { getBookById } from "../services/booksService";
import { toast } from "react-toastify";
const CartContext = createContext();

// Tenta recuperar itens guardados
const init = () => {
  try {
    const saved = localStorage.getItem("my-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

//Reducer do Carrinho
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      // Verifica se o item já está no carrinho
      const exists = state.find((item) => item.id === action.payload.id);

      if (exists) {
        // Se existe, incrementa a quantidade 
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Se é um item novo, adiciona com quantidade inicial de 1
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "INCREASE":
      // Aumenta a quantidade com base no ID
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item,
      );

    case "DECREASE":
      // Diminui a quantidade e filtra itens que chegarem a zero
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);

    case "REMOVE":
      // Remove o item completamente do array
      return state.filter((item) => item.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

// Provider Component: envolve a aplicação para prover o estado do carrinho
export const CartProvider = ({ children }) => {
  // useReducer gerencia o estado do carrinho
  const [cartItems, dispatch] = useReducer(cartReducer, [], init);

  // localStorage
  useEffect(() => {
    localStorage.setItem("my-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Busca os dados do livro pelo ID 
  function addToCart(bookId) {
    const book = getBookById(bookId);
    if (book) {
      // se tiver desconto, subtrai a % do preço original
      const finalPrice =
        book.discount > 0 ? book.price * (1 - book.discount / 100) : book.price;

      const bookWithDiscountedPrice = {
        ...book,
        price: finalPrice,
      };

      dispatch({ type: "ADD", payload: bookWithDiscountedPrice });
      toast.success(`${book.title} adicionado ao carrinho!`);
    }
  }

  // Cálculo do valor total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Memoriza o objeto do contexto e evita que componentes que consomem o contexto sofram re-renders
  const contextValue = useMemo(
    () => ({
      cartItems,
      dispatch,
      addToCart,
      totalPrice,
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [cartItems, totalPrice],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

//Hook customizado para acessar o contexto do carrinho
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
};
