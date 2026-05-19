import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAuth } from "../../context/AuthContext"; // Importa o contexto de autenticação do utilizador
import { useCart } from "../../context/CartContext"; // Importa o contexto global do carrinho de compras
import { useNavigate } from "react-router-dom"; // Hook para redirecionamento de páginas

// IMPORTAÇÃO DOS ÍCONES (React Icons - FontAwesome 'Fa')
import {
  FaLock,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

import { toast } from "react-toastify"; // Para exibir as notificações modernas
import "./Checkout.css";

function Checkout() {
  // 1. CONTEXTOS E NAVEGAÇÃO
  const { user, isLoggedIn } = useAuth();
  const { cartItems: cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Estado do Passo Atual (1 = Entrega, 2 = Pagamento, 3 = Confirmação)
  const [currentStep, setCurrentStep] = useState(1);

  // 2. SEGURANÇA: Bloqueia utilizadores não autenticados
  useEffect(() => {
    if (!isLoggedIn) {
      toast.warn("Necessário iniciar sessão para finalizar a compra.");
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  // 3. CONFIGURAÇÃO DOS DADOS PADRÃO DO FORMULÁRIO (useForm)
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      nome: user ? `${user.nome} ${user.apelido}` : "",
      nif: user?.nif || "",
      telemovel: user?.telemovel || "",
      morada: user?.morada?.logradouro
        ? `${user.morada.logradouro}, nº ${user.morada.numero || ""}`
        : "",
      andar: user?.morada?.andar || "",
      codigoPostal: user?.morada?.codigoPostal || "",
      cidade: user?.morada?.cidade || "",
      pais: user?.morada?.pais || "Portugal",
      metodoPagamento: "mbway",
    },
  });

  // Monitoriza qual o rádio button de pagamento está selecionado
  const selectedPayment = useWatch({
    control,
    name: "metodoPagamento",
    defaultValue: "mbway",
  });

  // 4. RESOLUÇÃO DINÂMICA DA IMAGEM (IGUAL AO TEU CARTITEM)
  // Esta função analisa o nome do ficheiro (ex: "livro.jpg") e gera o caminho correto absoluto para a pasta assets
  const getImageUrl = (imageName) => {
    if (!imageName) return "";
    return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
  };

  // 5. CÁLCULOS MATEMÁTICOS DO TOTAL
  // Multiplica o preço de cada livro pela sua respetiva quantidade guardada e soma tudo acumulado
  const cartTotal = cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity || 1),
    0,
  );

  // Funções de manipulação do ecrã de passos
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // 6. SUBMISSÃO FINAL
  const onOrderSubmit = (data) => {
    if (cart.length === 0) {
      toast.error("O seu carrinho está vazio!");
      return;
    }

    console.log("Sucesso! Encomenda registada:", {
      ...data,
      produtos: cart,
      total: cartTotal,
    });

    // Aviso direto e limpo solicitado por ti
    toast.success(
      "Compra efetuada com sucesso! Obrigado pela preferência. 📚",
      {
        position: "top-center",
        autoClose: 4000,
      },
    );

    clearCart(); // Limpa os livros do estado global do carrinho
    navigate("/"); // Retorna o cliente à Home page
  };

  // Salvaguarda caso o carrinho fique vazio repentinamente
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-empty-state">
        <FaShoppingBag size={50} color="#ccc" />
        <h2>O seu carrinho está vazio.</h2>
        <p>Explore os nossos livros e adicione algo à sua coleção!</p>
        <button onClick={() => navigate("/")} className="btn-back-home">
          Continuar a comprar
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container-premium">
      {/* ETAPAS FLUIDAS SUPERIORES */}
      <div className="checkout-steps-bar">
        <div className={`step-item ${currentStep >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-text">Entrega</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${currentStep >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-text">Pagamento</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${currentStep >= 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-text">Confirmação</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onOrderSubmit)}
        className="checkout-layout-grid"
      >
        {/* LADO ESQUERDO: PASSOS DA COMPRA */}
        <div className="checkout-main-content">
          {/* PASSO 1: DADOS DE ENTREGA */}
          {currentStep === 1 && (
            <div className="checkout-card-step">
              <h2>
                <FaMapMarkerAlt /> Onde devemos entregar a encomenda?
              </h2>
              <p className="step-subtitle">
                Confirme abaixo os seus dados de faturação e envio habituais.
              </p>

              <div className="address-preview-box">
                <p>
                  <strong>
                    {user?.nome} {user?.apelido}
                  </strong>
                </p>
                <p>
                  {user?.morada?.logradouro}
                  {user?.morada?.numero ? `, nº ${user.morada.numero}` : ""}
                </p>
                {user?.morada?.andar && (
                  <p>Andar/Porta: {user?.morada?.andar}</p>
                )}
                <p>
                  {user?.morada?.codigoPostal} {user?.morada?.cidade}
                </p>
                <p>{user?.morada?.pais}</p>
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#666",
                    borderTop: "1px dashed #eee",
                    paddingTop: "8px",
                  }}
                >
                  NIF: {user?.nif} | Telemóvel:{" "}
                  {user?.telemovel || "Não associado"}
                </p>
              </div>

              {/* Inputs ocultos para o react-hook-form ler no submit final */}
              <input type="hidden" {...register("nome")} />
              <input type="hidden" {...register("morada")} />
              <input type="hidden" {...register("cidade")} />

              <div className="step-actions-footer">
                <div></div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-step-next"
                >
                  Seguinte <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 2: ESCOLHA DO MÉTODO DE PAGAMENTO */}
          {currentStep === 2 && (
            <div className="checkout-card-step">
              <h2>
                <FaCreditCard /> Escolha o Método de Pagamento
              </h2>
              <p className="step-subtitle">
                Selecione uma das opções seguras aceites na nossa livraria.
              </p>

              <div className="payment-options-list">
                <label
                  className={`payment-selector-card ${selectedPayment === "mbway" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="mbway"
                    {...register("metodoPagamento")}
                  />
                  <div className="payment-details">
                    <span className="payment-badge mbway-badge">MB WAY</span>
                    <p>
                      Pague instantaneamente com o seu telemóvel usando a app MB
                      WAY.
                    </p>
                  </div>
                </label>

                <label
                  className={`payment-selector-card ${selectedPayment === "multibanco" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="multibanco"
                    {...register("metodoPagamento")}
                  />
                  <div className="payment-details">
                    <span className="payment-badge mb-badge">Multibanco</span>
                    <p>
                      Gere uma Entidade e Referência para pagar no Multibanco ou
                      Homebanking.
                    </p>
                  </div>
                </label>

                <label
                  className={`payment-selector-card ${selectedPayment === "cartao" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    value="cartao"
                    {...register("metodoPagamento")}
                  />
                  <div className="payment-details">
                    <span className="payment-badge card-badge">
                      Cartão de Crédito / Débito
                    </span>
                    <p>
                      Aceitamos as redes Visa e Mastercard com protocolo 3D
                      Secure.
                    </p>
                  </div>
                </label>
              </div>

              {/* Detalhes condicionais adicionais */}
              {selectedPayment === "mbway" && (
                <div className="payment-extra-fields">
                  <label>Número de Telemóvel associado ao MB WAY:</label>
                  <input
                    type="text"
                    placeholder="9xxxxxxxx"
                    defaultValue={user?.telemovel}
                    className="checkout-input-text"
                  />
                </div>
              )}

              {selectedPayment === "cartao" && (
                <div className="payment-extra-fields input-grid-card">
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    className="checkout-input-text long"
                  />
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="checkout-input-text short"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="checkout-input-text short"
                  />
                </div>
              )}

              <div className="step-actions-footer">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-step-back"
                >
                  <FaChevronLeft /> Voltar
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-step-next"
                >
                  Seguinte <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: CONFIRMAÇÃO FINAL */}
          {currentStep === 3 && (
            <div className="checkout-card-step">
              <h2>
                <FaCheckCircle /> Confirme os seus dados antes de finalizar
              </h2>
              <p className="step-subtitle">
                Por favor, reveja todas as informações antes de concluir a
                encomenda.
              </p>

              <div className="review-grid">
                <div className="review-box-info">
                  <h4>Dados de Envio</h4>
                  <p>
                    {user?.nome} {user?.apelido}
                  </p>
                  <p>
                    {user?.morada?.logradouro}
                    {user?.morada?.numero ? `, nº ${user.morada.numero}` : ""}
                  </p>
                  <p>
                    {user?.morada?.codigoPostal} - {user?.morada?.cidade}
                  </p>
                </div>
                <div className="review-box-info">
                  <h4>Pagamento Escolhido</h4>
                  <p className="payment-final-style">
                    {selectedPayment === "mbway" && "📱 MB WAY"}
                    {selectedPayment === "multibanco" &&
                      "🏦 Referência Multibanco"}
                    {selectedPayment === "cartao" &&
                      "💳 Cartão de Crédito/Débito"}
                  </p>
                </div>
              </div>

              <div className="step-actions-footer">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-step-back"
                >
                  <FaChevronLeft /> Alterar Dados
                </button>
                <button type="submit" className="btn-confirm-order-premium">
                  <FaLock /> FINALIZAR ENCOMENDA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LADO DIREITO: RESUMO LATERAL (STICKY SIDEBAR) */}
        <div className="checkout-sidebar-summary">
          <div className="sidebar-sticky-card">
            <h3>Resumo da Encomenda</h3>
            <p className="summary-item-count">
              Total de artigos:{" "}
              <strong>
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </strong>
            </p>

            {/* LISTA DE LIVROS COM RESOLUÇÃO DE IMAGEM ATUALIZADA */}
            <div className="sidebar-books-scroller">
              {cart.map((item) => (
                <div key={item.id} className="sidebar-book-item">
                  {/* CORREÇÃO AQUI: Agora chama a função getImageUrl() igual ao teu CartItem */}
                  {item.image && (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title ?? "Livro"}
                      className="mini-cover"
                    />
                  )}
                  <div className="mini-book-details">
                    {/* CORREÇÃO AQUI: Retirado o texto duplicado para renderizar apenas o título uma vez */}
                    <p className="mini-title">
                      {item.title ?? "Livro sem título"}
                    </p>
                    <p className="mini-qty">Qtd: {item.quantity || 1}</p>
                    <p className="mini-price">
                      {((item.price ?? 0) * (item.quantity || 1)).toFixed(2)}€
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="divider" />

            <div className="total-calculation-box">
              <div className="price-row">
                <span>Subtotal:</span> <span>{cartTotal.toFixed(2)}€</span>
              </div>
              <div className="price-row">
                <span>Portes de Envio:</span>{" "}
                <span className="free-shipping">Grátis</span>
              </div>
              <div className="price-row total-row">
                <span>TOTAL A PAGAR:</span>
                <span className="final-price-tag">{cartTotal.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
