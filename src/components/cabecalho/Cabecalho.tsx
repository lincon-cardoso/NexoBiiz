import Image from "next/image";
import Link from "next/link";

export const Cabecalho: React.FC = () => {
    // Variáveis para textos e classes
    const logoSrc = "/img/logo.png";
    const logoAlt = "Logo";
    const logoClass = "logo";
    const titulo = "NexoBiiz";

    const menuItems = [
        { label: "Tutorial", href: "/tutorial" },
        { label: "Sobre o Projeto", href: "/sobre-o-projeto" }, 
        { label: "Suporte", href: "/suporte" },
    ];
    const btnLoginText = "Login";
    const btnCadastroText = "Cadastro";

    return (
        <header className="cabecalho">
            {/* Bloco de logo e título */}
            <Link href="/" className="cabecalho__logo-titulo">
                <Image
                    src={logoSrc}
                    alt={logoAlt}
                    className={logoClass}
                    width={50}
                    height={50}
                />
                <h1 className="cabecalho__titulo">{titulo}</h1>
            </Link>

            {/* Menu de navegação */}
            <div className="cabecalho__menu">
                <nav className="cabecalho__menu-nav">
                    <ul className="cabecalho__menu-lista">
                        {menuItems.map((item, index) => (
                            <li key={index} className="cabecalho__menu-item">
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Botões de ação */}
            <div className="cabecalho__acoes">
                {/* Botões de login e cadastro com rotas */}
                <Link href="/login" passHref>
                    <button className="cabecalho__btn-login">{btnLoginText}</button>
                </Link>
                <Link href="/cadastro" passHref>
                    <button className="cabecalho__btn-cadastro">{btnCadastroText}</button>
                </Link>
            </div>
        </header>
    );
};