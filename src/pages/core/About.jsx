import "./About.css";
import { FaBullseye, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

function About() {
  return (
    <section className="about">
      <div className="about-hero">
        <h1>Sobre Nós</h1>
        <p>Conheça a missão, a visão e o propósito da Página & Cia.</p>
      </div>

      <div className="about-section">
        <h2>A nossa história</h2>
        <p>
          A Página & Cia nasceu com o objetivo de tornar a descoberta de livros
          mais simples, intuitiva e agradável. Aqui, cada leitor encontra
          histórias que fazem sentido para si.
        </p>
        <p>
          Escolher um livro deve ser uma experiência sem complicações. Queremos
          aproximar leitores de histórias que realmente fazem diferença no seu
          dia a dia.
        </p>
      </div>

      <div className="about-section">
        <h2>Sobre a livraria</h2>
        <p>
          Somos uma livraria digital pensada para apaixonados por leitura.
          Reunimos títulos de diferentes categorias — desde ficção e romance até
          ciência e desenvolvimento pessoal — para que o leitor possa explorar
          novos mundos e ideias. O nosso foco é proporcionar uma experiência
          simples e organizada, onde encontrar o próximo livro seja tão
          prazeroso quanto lê-lo.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <FaBullseye className="about-icon" />
          <h3>Missão</h3>
          <p>
            Tornar a descoberta de livros acessível, organizada e inspiradora
            para todos os leitores.
          </p>
        </div>

        <div className="about-card">
          <FaLightbulb className="about-icon" />
          <h3>Visão</h3>
          <p>
            Ser uma referência digital na forma como o leitor explora,
            descobre e escolhe seus livros.
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>Para quem é a Página & Cia?</h2>
        <ul>
          <li>Leitores ocasionais</li>
          <li>Apaixonados por literatura</li>
          <li>Estudantes e pesquisadores</li>
          <li>Descoberta guiada de novas leituras</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>O que oferecemos</h2>
        <ul>
          <li>Catálogo variado de livros</li>
          <li>Últimos lançamentos e promoções</li>
          <li>Navegação por gêneros e temas</li>
          <li>Gerenciamento de favoritos</li>
          <li>Compras simples e intuitivas</li>
          <li>Acesso rápido em qualquer dispositivo</li>

        </ul>
      </div>

      <div className="about-section">
        <h2>Tecnologias utilizadas</h2>
        <ul>
          <li>React</li>
          <li>React Router</li>
          <li>LocalStorage</li>
          <li>Google Books API (em evolução)</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Sobre o projeto</h2>
        <p>
          Este projeto foi desenvolvido como parte do meu percurso de
          aprendizagem em desenvolvimento web, com o objetivo de simular uma
          aplicação real de e-commerce.
        </p>
      </div>

      <div className="about-cta">
        <h3>Vamos falar?</h3>
        <p>Se tiveres sugestões ou feedback, adoraríamos ouvir-te.</p>

        <Link to="/contact" className="cta-button">
          Ir para Contacto
        </Link>
      </div>
    </section>
  );
}

export default About;
