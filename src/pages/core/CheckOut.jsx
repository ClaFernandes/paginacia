import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

import {
  FaLock,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaEdit
} from "react-icons/fa";

import { toast } from "react-toastify";
import "./Checkout.css";

function Checkout() {
  const { user, isLoggedIn } = useAuth();
  const { cartItems: cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!isLoggedIn) {
      toast.warn("Necessário iniciar sessão para finalizar a compra.");
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  // Configuração do formulário com dados do utilizador
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      nome: user ? `${user.nome} ${user.apelido}` : "",
      nif: user?.nif || "",
      telemovel: user?.telemovel || "",
      morada: user?.morada?.logradouro || "",
      numero: user?.morada?.numero || "",
      andar: user?.morada?.andar || "",
      codigoPostal: user?.morada?.codigoPostal || "",
      cidade: user?.morada?.cidade || "",
      pais: user?.morada?.pais || "Portugal",
      metodoPagamento: "mbway",
    },
  });

  const selectedPayment = useWatch({ control, name: "metodoPagamento", defaultValue: "mbway" });

  // Função auxiliar para resolver o path das imagens
  const getImageUrl = (imageName) => {
    if (!imageName) return "";
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price ?? 0) * (item.quantity || 1), 0);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Finalização: limpa o carrinho e envia para a home
  const onOrderSubmit = (data) => {
    console.log("Encomenda submetida:", data);
    toast.success("Compra efetuada com sucesso!");
    clearCart();
    navigate("/");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-empty-state">
        <FaShoppingBag size={50} color="#ccc" />
        <h2>O seu carrinho está vazio.</h2>
        <button onClick={() => navigate("/")} className="btn-back-home">Continuar a comprar</button>
      </div>
    );
  }

  return (
    <div className="checkout-container-premium">
      <div className="checkout-steps-bar">
        <div className={`step-item ${currentStep >= 1 ? "active" : ""}`}><span className="step-number">1</span><span className="step-text">Entrega</span></div>
        <div className="step-line"></div>
        <div className={`step-item ${currentStep >= 2 ? "active" : ""}`}><span className="step-number">2</span><span className="step-text">Pagamento</span></div>
        <div className="step-line"></div>
        <div className={`step-item ${currentStep >= 3 ? "active" : ""}`}><span className="step-number">3</span><span className="step-text">Confirmação</span></div>
      </div>

      <form onSubmit={handleSubmit(onOrderSubmit)} className="checkout-layout-grid">
        <div className="checkout-main-content">
          {/* ETAPA 1: Entrega */}
          {currentStep === 1 && (
            <div className="checkout-card-step">
              <h2><FaMapMarkerAlt /> Onde devemos entregar a encomenda?</h2>
              {isEditing ? (
                <div className="edit-address-form">
                  <input {...register("nome")} placeholder="Nome" className="checkout-input-text" />
                  <input {...register("nif")} placeholder="NIF" className="checkout-input-text" />
                  <input {...register("telemovel")} placeholder="Telemóvel" className="checkout-input-text" />
                  <input {...register("morada")} placeholder="Logradouro" className="checkout-input-text" />
                  <input {...register("numero")} placeholder="Nº" className="checkout-input-text" />
                  <input {...register("andar")} placeholder="Andar" className="checkout-input-text" />
                  <input {...register("codigoPostal")} placeholder="CP" className="checkout-input-text" />
                  <input {...register("cidade")} placeholder="Cidade" className="checkout-input-text" />
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-save">Guardar Dados</button>
                </div>
              ) : (
                <div className="address-preview-box">
                  <p><strong>{user?.nome}</strong></p>
                  <p>{user?.morada?.logradouro}, nº {user?.morada?.numero}, {user?.morada?.andar}</p>
                  <p>{user?.morada?.codigoPostal} {user?.morada?.cidade}</p>
                  <p><strong>NIF:</strong> {user?.nif} | <strong>Tel:</strong> {user?.telemovel}</p>
                  <button type="button" className="edit-link" onClick={() => setIsEditing(true)}><FaEdit /> Editar Dados</button>
                </div>
              )}
              <div className="step-actions-footer">
                <Link to="/" className="btn-back-home"><FaChevronLeft /> Voltar à Página Inicial</Link>
                <button type="button" onClick={nextStep} className="btn-step-next">Seguinte <FaChevronRight /></button>
              </div>
            </div>
          )}

          {/* ETAPA 2: Pagamento */}
          {currentStep === 2 && (
            <div className="checkout-card-step">
              <h2><FaCreditCard /> Escolha o Método de Pagamento</h2>
              <div className="payment-options-list">
                {['mbway', 'multibanco', 'cartao'].map(m => (
                  <label key={m} className={`payment-selector-card ${selectedPayment === m ? "selected" : ""}`}>
                    <input type="radio" value={m} {...register("metodoPagamento")} /> {m.toUpperCase()}
                  </label>
                ))}
              </div>
              <div className="step-actions-footer">
                <button type="button" onClick={prevStep} className="btn-step-back"><FaChevronLeft /> Voltar</button>
                <button type="button" onClick={nextStep} className="btn-step-next">Seguinte <FaChevronRight /></button>
              </div>
            </div>
          )}

          {/* ETAPA 3: Confirmação */}
          {currentStep === 3 && (
            <div className="checkout-card-step">
              <h2><FaCheckCircle /> Confirmação</h2>
              <button type="submit" className="btn-confirm-order-premium"><FaLock /> FINALIZAR ENCOMENDA</button>
            </div>
          )}
        </div>

        {/* Resumo Lateral (com as capas preservadas) */}
        <div className="checkout-sidebar-summary">
          <div className="sidebar-sticky-card">
            <h3>Resumo da Encomenda</h3>
            <div className="sidebar-books-scroller">
              {cart.map((item) => (
                <div key={item.id} className="sidebar-book-item">
                  {item.image && <img src={getImageUrl(item.image)} alt={item.title} className="mini-cover" />}
                  <div className="mini-book-details">
                    <p className="mini-title">{item.title}</p>
                    <p className="mini-qty">Qtd: {item.quantity || 1}</p>
                    <p className="mini-price">{((item.price ?? 0) * (item.quantity || 1)).toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="total-calculation-box">
              <div className="price-row"><strong>TOTAL: {cartTotal.toFixed(2)}€</strong></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Checkout;