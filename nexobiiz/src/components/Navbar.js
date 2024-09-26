import React from "react";
import logo from "../assets/img/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/components/Navbar.scss";
// import "./Navbar.scss"; // Importar o arquivo de estilos

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="logo" />
        <span>NexoBiiz</span>
      </div>
      <ul className="navbar__menu">
        <li>Produtos</li>
        <li>Planos</li>
        <li>Suporte</li>
      </ul>
      <div className="navbar__actions">
        <i className="fa fa-search"></i>
        <i className="fa fa-user"></i>
      </div>
      <div className="navbar__logo">NexoBiiz</div>
      <img src="/assets/img/logo.png" alt="logo" />
    </nav>
  );
}

export default Navbar;
