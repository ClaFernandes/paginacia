import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import "./LegalPages.css";

function PrivacyPolicy() {
    return (
        <section className="legal-page">
            <div className="back-home-wrapper">
                <Link to="/" className="btn-back-home">
                    <FaChevronLeft /> Voltar à Página Inicial
                </Link>
            </div>

            <div className="legal-hero">
                <h1>Política de Privacidade</h1>
                <p className="legal-updated">Última atualização: Maio de 2026</p>
            </div>

            <div className="legal-section">
                <p>
                    Na <strong>Página & Cia.</strong>, a privacidade e a segurança dos dados dos nossos
                    clientes são uma prioridade absoluta. Esta política explica de que forma recolhemos,
                    armazenamos, protegemos e utilizamos as suas informações pessoais, em conformidade com o
                    Regulamento Geral sobre a Proteção de Dados (RGPD).
                </p>
            </div>

            <div className="legal-section">
                <h2>1. Dados Recolhidos</h2>
                <p>
                    Para processar as suas compras e fornecer uma experiência personalizada, recolhemos os seguintes dados:
                </p>
                <ul>
                    <li>Dados de Identificação: Nome completo e NIF (para emissão de faturas).</li>
                    <li>Dados de Contacto: Endereço de e-mail e número de telemóvel.</li>
                    <li>Dados de Envio: Morada completa, andar, código postal e cidade.</li>
                </ul>
            </div>

            <div className="legal-section">
                <h2>2. Finalidade do Tratamento dos Dados</h2>
                <p>
                    As suas informações são utilizadas estritamente para:
                </p>
                <ul>
                    <li>Processar, faturar e entregar as encomendas de livros efetuadas no checkout.</li>
                    <li>Gerir e manter a sua conta de utilizador ativa.</li>
                    <li>Enviar notificações operacionais importantes, como a confirmação de compra.</li>
                </ul>
            </div>

            <div className="legal-section">
                <h2>3. Armazenamento e Segurança dos Dados</h2>
                <p>
                    Os dados do seu perfil e morada são armazenados de forma segura e local. O processamento de
                    pagamentos é efetuado através de gateways externos encriptados e seguros com protocolo 3D Secure,
                    garantindo que a Página & Cia. nunca guarda ou tem acesso aos dados dos seus cartões de crédito.
                </p>
            </div>

            <div className="legal-section">
                <h2>4. Partilha de Dados com Terceiros</h2>
                <p>
                    A Página & Cia. não vende nem cede os seus dados a terceiros para fins de marketing.
                    Apenas partilhamos as informações estritamente necessárias (como nome e morada) com as
                    empresas transportadoras responsáveis por entregar os livros na sua casa.
                </p>
            </div>

            <div className="legal-section">
                <h2>5. Direitos do Utilizador</h2>
                <p>
                    De acordo com o RGPD, o utilizador tem o direito de aceder, retificar, atualizar ou solicitar a
                    eliminação total dos seus dados pessoais a qualquer momento. Para exercer estes direitos, basta
                    entrar em contacto connosco através do suporte ou atualizar os dados diretamente na sua página de Perfil.
                </p>
            </div>

            <div className="legal-section">
                <h2>6. Utilização de Cookies</h2>
                <p>
                    Utilizamos cookies essenciais para o funcionamento básico do website, tais como manter a sua sessão
                    iniciada ou garantir que os livros adicionados não desaparecem do seu carrinho de compras.
                </p>
            </div>
        </section>
    );
}

export default PrivacyPolicy;