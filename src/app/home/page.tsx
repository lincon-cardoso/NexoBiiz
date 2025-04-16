import React from 'react';

export const Home: React.FC = () => {
    return (
        <div className="home">
            {/* Título e Subtítulo */}
            <header className="home-header">
                <h1 className="home-header-title">Organize seu negócio com praticidade e autonomia.</h1>
                <p className="home-header-subtitle">
                    Um sistema gratuito feito para ajudar microempreendedores da comunidade a crescerem com tecnologia.
                </p>
                <div className="home-header-buttons">
                    <button className="home-button primary">Comece Agora</button>
                    <button className="home-button secondary">Ver Tutorial</button>
                </div>
            </header>

            {/* Seção: Por que usar o NexoBiiz? */}
            <section className="home-why">
                <h2 className="home-why-title">Por que usar o NexoBiiz?</h2>
                <ul className="home-why-list">
                    <li className="home-why-item">
                        📦 <strong>Controle de estoque simples</strong>
                        <p>Adicione e acompanhe produtos com facilidade.</p>
                    </li>
                    <li className="home-why-item">
                        📊 <strong>Relatórios de vendas</strong>
                        <p>Veja quanto vendeu e quanto recebeu, sem precisar de planilhas.</p>
                    </li>
                    <li className="home-why-item">
                        📱 <strong>Acesso pelo celular ou computador</strong>
                        <p>Funciona em qualquer navegador.</p>
                    </li>
                    <li className="home-why-item">
                        🆓 <strong>100% gratuito e sem mensalidade</strong>
                        <p>Criado como parte de um projeto social.</p>
                    </li>
                </ul>
            </section>

            {/* Seção: Veja como é fácil usar */}
            <section className="home-how">
                <h2 className="home-how-title">Veja como é fácil usar</h2>
                <div className="home-how-content">
                    <p>Vídeo ou carrossel com prints mostrando o uso:</p>
                    <ul className="home-how-list">
                        <li className="home-how-item">Cadastro de produtos</li>
                        <li className="home-how-item">Registro de vendas</li>
                        <li className="home-how-item">Relatório financeiro</li>
                    </ul>
                    <button className="home-how-button">Ver tutorial completo</button>
                </div>
            </section>

            {/* Seção: Depoimentos */}
            <section className="home-testimonials">
                <h2 className="home-testimonials-title">Depoimentos</h2>
                <div className="home-testimonials-content">
                    <blockquote className="home-testimonial">
                        “Antes eu anotava tudo no caderno. Agora tenho tudo no celular.”
                        <footer className="home-testimonial-footer">
                            <small>— Carla, artesã do bairro Fátima</small>
                        </footer>
                    </blockquote>
                    <blockquote className="home-testimonial">
                        “Com o NexoBiiz aprendi a cuidar do meu dinheiro.”
                        <footer className="home-testimonial-footer">
                            <small>— João, vendedor ambulante</small>
                        </footer>
                    </blockquote>
                    <blockquote className="home-testimonial">
                        “O sistema é simples e me ajuda a organizar meu estoque sem complicação.”
                        <footer className="home-testimonial-footer">
                            <small>— Maria, dona de uma pequena loja</small>
                        </footer>
                    </blockquote>
                </div>
            </section>

            {/* Nova Seção: Como Nascemos */}
            <section className="home-origin">
                <h2 className="home-origin-title">Como Nascemos</h2>
                <p className="home-origin-content">
                    O NexoBiiz nasceu como parte de um projeto universitário com impacto social real. Foi pensado para ajudar pessoas reais, com soluções acessíveis e humanas.
                </p>
            </section>

            {/* Rodapé */}
            <footer className="home-footer">
                <p className="home-footer-links">
                    <a href="#" className="home-footer-link">Sobre o Projeto</a>
                    <a href="#" className="home-footer-link">Política de Privacidade</a>
                    <a href="#" className="home-footer-link">Contato</a>
                </p>
            </footer>
        </div>
    );
};