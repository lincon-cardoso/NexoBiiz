import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importação dos ícones

export const Rodape: React.FC = () => {
    return (
        <footer className="rodape">
            <div className="rodape__conteudo">
                <p>© 2025 Nexobii. Todos os direitos reservados.</p>

                <div className="rodape__redes-sociais">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={24} /> {/* Ícone do Facebook */}
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter size={24} /> {/* Ícone do Twitter */}
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={24} /> {/* Ícone do Instagram */}
                    </a>
                </div>
            </div>
        </footer>
    );
};