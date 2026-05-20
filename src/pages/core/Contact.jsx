import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    email: "",
    assunto: "",
    mensagem: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const { nome, apelido, email, assunto, mensagem } = formData;
    if (!nome || !apelido || !email || !assunto || !mensagem) {
      return "Todos os campos devem ser preenchidos.";
    }
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    const error = validateForm();
    if (error) {
      setStatus({
        type: "error",
        msg: error,
      });
      return;
    }

    setTimeout(() => {
      setStatus({
        type: "success",
        msg: "Mensagem enviada com sucesso!",
      });

      setFormData({
        nome: "",
        apelido: "",
        email: "",
        assunto: "",
        mensagem: "",
      });
    }, 1000);
  }

  return (
    <>
      <div className="back-home-container">
        <Link to="/" className="btn-back-home">
          <FaChevronLeft /> Voltar à Página Inicial
        </Link>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>

        <h1>Contacto</h1>

        <p className="contact-subtitle">
          Estamos aqui para ajudar. Envia-nos a tua mensagem.
        </p>

        {status.msg && (
          <div className={`form-status ${status.type}`}>
            {status.msg}
          </div>
        )}

        <div className="row">
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="O teu nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Apelido</label>
            <input
              type="text"
              name="apelido"
              placeholder="O teu apelido"
              value={formData.apelido}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="exemplo@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Assunto</label>
          <select
            name="assunto"
            value={formData.assunto}
            onChange={handleChange}
          >
            <option value="">Seleciona um assunto</option>
            <option value="Encomendas">Encomendas</option>
            <option value="Entregas">Entregas</option>
            <option value="Faturação">Faturação</option>
            <option value="Trocas e Devoluções">Trocas e Devoluções</option>
            <option value="Outras Informações">Outras Informações</option>
          </select>
        </div>

        <div className="input-group">
          <label>Mensagem</label>
          <textarea
            name="mensagem"
            placeholder="Escreve a tua mensagem aqui..."
            rows="5"
            value={formData.mensagem}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Enviar mensagem</button>
      </form>
    </>

  );
}

export default Contact;