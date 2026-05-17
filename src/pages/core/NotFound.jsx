import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>

      <p className="notfound-text">Ups! A página que procuras não existe.</p>

      <Link to="/" className="notfound-button">
        <MdHome />
        Voltar à Página Inicial
      </Link>
    </div>
  );
};

export default NotFound;
