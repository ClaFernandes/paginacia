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
  FaEdit,
} from "react-icons/fa";

import { toast } from "react-toastify";
import "./Checkout.css";

function Checkout() {
  const { user, isLoggedIn } = useAuth();
  const { cartItems: cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); //controla qual etapa do checkout está ativa
  const [isEditing, setIsEditing] = useState(false);

  // Proteção de rota 
  useEffect(() => {
    if (!isLoggedIn) {
      toast.warn("Necessário iniciar sessão para finalizar a compra.");
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  // Formulário (React Hook Form) 
  const { register, handleSubmit, control } = useForm({
    // defaultValues: pré-preenche os campos com os dados do user
    defaultValues: {
      nome: user?.nome || "",
      apelido: user?.apelido || "",
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

  // useWatch observa o campo metodoPagamento 
  const selectedPayment = useWatch({
    control,
    name: "metodoPagamento",
    defaultValue: "mbway",
  });

  // Imagens
  const getImageUrl = (imageName) => {
    if (!imageName) return "";
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  };

  // Total do carrinho 
  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity || 1),
    0
  );

  // Funções para avançar/recuar entre etapas.
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Submissão final: chamada pelo handleSubmit do RHF
  const onOrderSubmit = (data) => {
    console.log("Encomenda submetida:", data);
    toast.success("Compra efetuada com sucesso!");
    clearCart();
    navigate("/");
  };

  // Labels e descrições para pagamento
  const paymentLabels = {
    mbway: { label: "MB WAY", desc: "Pague pelo telemóvel" },
    multibanco: { label: "Multibanco", desc: "Referência bancária" },
    cartao: { label: "Cartão", desc: "Visa / Mastercard" },
  };

  //Carrinho vazio - evita mostrar um checkout sem itens
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-empty-state">
        <div className="empty-icon-wrap">
          <FaShoppingBag size={36} />
        </div>
        <h2>O seu carrinho está vazio.</h2>
        <p>Explore o nosso catálogo e encontre a sua próxima leitura.</p>
        <button onClick={() => navigate("/")} className="btn-back-home">
          Continuar a comprar
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      {/* Passos */}
      <nav className="stepper">
        {[
          { n: 1, label: "Entrega" },
          { n: 2, label: "Pagamento" },
          { n: 3, label: "Confirmação" },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="stepper-group">
            <div className={`stepper-node ${currentStep >= n ? "active" : ""} ${currentStep === n ? "current" : ""}`}>
              {/* ✓ nos passos concluídos, número nos restantes */}
              <span className="stepper-num">{currentStep > n ? "✓" : n}</span>
              <span className="stepper-label">{label}</span>
            </div>
            {/* Só renderiza se não for o último item */}
            {i < arr.length - 1 && (
              <div className={`stepper-track ${currentStep > n ? "filled" : ""}`} />
            )}
          </div>
        ))}
      </nav>

      <div className="checkout-container">
        <form onSubmit={handleSubmit(onOrderSubmit)} className="checkout-body">

          <div className="checkout-main">

            {/* Etapa 1: Entrega */}
            {currentStep === 1 && (
              <div className="step-card animate-in">
                <div className="step-card-header">
                  <FaMapMarkerAlt />
                  <h2>Morada de Entrega</h2>
                </div>

                {isEditing ? (
                  // Modo edição: inputs ligados ao React Hook Form via register()
                  <div className="edit-grid">
                    <div className="field-group">
                      <label>Nome</label>
                      <input {...register("nome")} placeholder="Nome" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>Apelido</label>
                      <input {...register("apelido")} placeholder="Apelido" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>NIF</label>
                      <input {...register("nif")} placeholder="000 000 000" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>Telemóvel</label>
                      <input {...register("telemovel")} placeholder="+351 9xx xxx xxx" className="field-input" />
                    </div>
                    <div className="field-group" style={{ flex: "2 1 200px" }}>
                      <label>Logradouro</label>
                      <input {...register("morada")} placeholder="Rua, Avenida…" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>Nº</label>
                      <input {...register("numero")} placeholder="12" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>Andar/Porta</label>
                      <input {...register("andar")} placeholder="2º Dto" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label>Código Postal</label>
                      <input {...register("codigoPostal")} placeholder="0000-000" className="field-input" />
                    </div>
                    {/* Cidade e País na mesma linha — flex: "1 1 45%" força os dois a partilhar a linha */}
                    <div className="field-group" style={{ flex: "1 1 45%" }}>
                      <label>Cidade</label>
                      <input {...register("cidade")} placeholder="Lisboa" className="field-input" />
                    </div>
                    <div className="field-group" style={{ flex: "1 1 45%" }}>
                      <label>País</label>
                      <input {...register("pais")} placeholder="Portugal" className="field-input" />
                    </div>
                    <div className="field-group full">
                      <button type="button" onClick={() => setIsEditing(false)} className="btn-save">
                        Guardar Dados
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo leitura: dados do utilizador vindos do AuthContext
                  <div className="address-card">
                    <div className="address-card-body">
                      <p className="address-name">{user?.nome} {user?.apelido}</p>
                      <p className="address-line">
                        {user?.morada?.logradouro}, nº {user?.morada?.numero}
                        {user?.morada?.andar ? `, ${user?.morada?.andar}` : ""}
                      </p>
                      <p className="address-line">
                        {user?.morada?.codigoPostal} {user?.morada?.cidade}
                      </p>
                      <p className="address-line">
                        {user?.morada?.pais}
                      </p>
                      <div className="address-meta">
                        <span><strong>NIF:</strong> {user?.nif}</span>
                        <span className="meta-sep">·</span>
                        <span><strong>Telemóvel:</strong> {user?.telemovel}</span>
                      </div>
                    </div>
                    <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
                      <FaEdit /> Editar
                    </button>
                  </div>
                )}

                <div className="step-footer">
                  <Link to="/" className="btn-ghost">
                    <FaChevronLeft /> Voltar
                  </Link>
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continuar <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 2: Pagamento */}
            {currentStep === 2 && (
              <div className="step-card animate-in">
                <div className="step-card-header">
                  <FaCreditCard />
                  <h2>Método de Pagamento</h2>
                </div>

                <div className="payment-grid">
                  {["mbway", "multibanco", "cartao"].map((m) => (
                    <label
                      key={m}
                      className={`payment-card ${selectedPayment === m ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        value={m}
                        {...register("metodoPagamento")} // regista no RHF
                        className="payment-radio"
                      />
                      <div className="payment-card-inner">
                        <span className="payment-label">{paymentLabels[m].label}</span>
                        <span className="payment-desc">{paymentLabels[m].desc}</span>
                      </div>
                      {/* Indicador visual circular do estado selecionado */}
                      <div className="payment-check" />
                    </label>
                  ))}
                </div>

                <div className="step-footer">
                  <button type="button" onClick={prevStep} className="btn-ghost">
                    <FaChevronLeft /> Voltar
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continuar <FaChevronRight />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 3: Confirmação */}
            {currentStep === 3 && (
              <div className="step-card animate-in">
                <div className="step-card-header">
                  <FaCheckCircle />
                  <h2>Confirmar Encomenda</h2>
                </div>

                <div className="confirm-summary">
                  <div className="confirm-row">
                    <span className="confirm-label">Entrega para</span>
                    <span className="confirm-value">
                      {user?.nome} {user?.apelido}
                    </span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Morada</span>
                    <span className="confirm-value">
                      {user?.morada?.logradouro}, nº {user?.morada?.numero},{" "}
                      {user?.morada?.codigoPostal} {user?.morada?.cidade} - {user?.morada?.pais}
                    </span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Pagamento</span>
                    <span className="confirm-value">
                      {paymentLabels[selectedPayment]?.label}
                    </span>
                  </div>
                  <div className="confirm-row confirm-total">
                    <span className="confirm-label">Total</span>
                    <span className="confirm-value">{cartTotal.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="step-footer">
                  <button type="button" onClick={prevStep} className="btn-ghost">
                    <FaChevronLeft /> Voltar
                  </button>
                  <button type="submit" className="btn-confirm">
                    <FaLock /> Finalizar Encomenda
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: resumo da encomenda visível em todas as etapas */}
          <aside className="checkout-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Resumo</h3>

              <div className="sidebar-items">
                {cart.map((item) => (
                  <div key={item.id} className="sidebar-item">
                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="sidebar-cover"
                      />
                    )}
                    <div className="sidebar-item-info">
                      <p className="sidebar-item-title">{item.title}</p>
                      <p className="sidebar-item-qty">Qtd. {item.quantity || 1}</p>
                    </div>
                    <p className="sidebar-item-price">
                      {/* Calcula o subtotal do item: preço × quantidade */}
                      {((item.price ?? 0) * (item.quantity || 1)).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="sidebar-divider" />

              <div className="sidebar-total">
                <span>Total</span>
                <span className="sidebar-total-value">{cartTotal.toFixed(2)} €</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
