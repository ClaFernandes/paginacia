import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import "./LegalPages.css";

function TermsOfUse() {
    return (
        <section className="legal-page">
            <div className="back-home-container">
                <Link to="/" className="btn-back-home">
                    <FaChevronLeft /> Voltar à Página Inicial
                </Link>
            </div>

            <div className="legal-hero">
                <h1>Termos de Uso</h1>
                <p className="legal-updated">Última atualização: Maio de 2026</p>
            </div>

            <div className="legal-section">
                <p>
                    Bem-vindo à <strong>Página & Cia.</strong>. Ao aceder e utilizar o nosso website,
                    concorda em cumprir e vincular-se aos seguintes termos e condições de uso. Por favor,
                    leia-os com atenção antes de efetuar qualquer encomenda.
                </p>
            </div>

            <div className="legal-section">
                <h2>1. Condições Gerais</h2>
                <p>
                    A venda de livros através deste website é gerida pela Página & Cia. Os serviços estão
                    disponíveis apenas para utilizadores que possuam capacidade jurídica para celebrar
                    contratos. Ao criar uma conta, garante que todos os dados fornecidos são verdadeiros
                    e atualizados.
                </p>
            </div>

            <div className="legal-section">
                <h2>2. Preços e Produtos</h2>
                <p>
                    Todos os preços indicados na nossa loja online estão em Euros (€) e incluem o IVA
                    à taxa legal em vigor em Portugal. Reservamos o direito de alterar os preços,
                    promoções e disponibilidade dos livros sem aviso prévio, garantindo, no entanto,
                    que as condições acordadas no momento da compra serão mantidas.
                </p>
            </div>

            <div className="legal-section">
                <h2>3. Processo de Encomenda e Pagamento</h2>
                <p>
                    Após selecionar os seus livros e avançar para o Checkout, o contrato de compra considera-se
                    formalizado quando o pagamento for processado com sucesso através dos métodos disponíveis
                    (MB WAY, Multibanco ou Cartão de Crédito). O utilizador receberá uma confirmação por e-mail.
                </p>
            </div>

            <div className="legal-section">
                <h2>4. Envios, Entregas e Portes</h2>
                <p>
                    Efetuamos entregas em Portugal Continental e Ilhas utilizando os dados fornecidos na sua
                    morada de conta. Os prazos de entrega são meramente indicativos. Conforme anunciado,
                    os portes de envio são gratuitos para as modalidades padrão selecionadas no checkout.
                </p>
            </div>

            <div className="legal-section">
                <h2>5. Propriedade Intelectual</h2>
                <p>
                    Todo o conteúdo presente no website, incluindo logótipos, textos, imagens de capas de livros,
                    gráficos e design de interface, é propriedade exclusiva da Página & Cia. ou dos seus
                    respetivos fornecedores/editoras, estando protegido pelas leis de direitos de autor.
                </p>
            </div>

            <div className="legal-section">
                <h2>6. Resolução de Litígios</h2>
                <p>
                    Em caso de litígio de consumo, o consumidor pode recorrer às Entidades de Resolução Alternativa
                    de Litígios de Consumo (RAL) em Portugal, ou utilizar a Plataforma Europeia de Resolução
                    de Litígios em Linha.
                </p>
            </div>
        </section>
    );
}

export default TermsOfUse;