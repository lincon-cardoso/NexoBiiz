import React from "react";
import Image from "next/image";

export const Cabecalho: React.FC = () => {
    // Variáveis para textos e classes
    const logoSrc = "/img/logo.png";
    const logoAlt = "Logo";
    const logoClass = "logo";
    const titulo = "NexoBiiz";

    const menuItems = ["Produto", "Planos", "Suporte"];
    const btnLoginText = "Login";
    const btnCadastroText = "Cadastro";

    return (
        <header className="cabecalho">
            {/* Bloco de logo e título */}
            <div className="cabecalho__logo-titulo">
                <Image
                    src={logoSrc}
                    alt={logoAlt}
                    className={logoClass}
                    width={50}
                    height={50}
                />
                <h1 className="cabecalho__titulo">{titulo}</h1>
            </div>

            {/* Menu de navegação */}
            <div className="cabecalho__menu">
                <nav className="cabecalho__menu-nav">
                    <ul className="cabecalho__menu-lista">
                        {menuItems.map((item, index) => (
                            <li key={index} className="cabecalho__menu-item">
                                {item}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Botões de ação */}
            <div className="cabecalho__acoes">
                {/* Caixa de pesquisa */}
                <div className="cabecalho__pesquisa">
                    <input
                        type="text"
                        className="cabecalho__pesquisa-input"
                        placeholder="Digite sua pergunta"
                    />
                    <button className="cabecalho__pesquisa-btn">🔍</button>
                </div>
                {/* Botões de login e cadastro */}
                <button className="cabecalho__btn-login">{btnLoginText}</button>
                <button className="cabecalho__btn-cadastro">{btnCadastroText}</button>
            </div>
        </header>
    );
};