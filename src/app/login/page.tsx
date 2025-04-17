"use client";
export default function LoginPage() {
    const handleLogout = () => {
        window.location.href = '/'; // Redireciona para o início da página
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form">
                <input type="text" placeholder="Usuário" className="login-input" />
                <input type="password" placeholder="Senha" className="login-input" />
                <button type="submit" className="login-button">Entrar</button>
                <button type="button" className="login-button" onClick={handleLogout}>Sair</button>
                <div className="login-footer">
                    <a href="#" className="login-link">Esqueci minha senha</a>
                    <a href="#" className="login-link">Criar conta</a>
                </div>
            </form>
        </div>
    );
}