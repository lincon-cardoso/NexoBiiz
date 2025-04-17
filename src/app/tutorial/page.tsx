import { Cabecalho } from '@/components/cabecalho/Cabecalho';
import { Rodape } from '@/components/rodape/Rodape';

export default function Tutorial() {
    return (
        <div>
            <Cabecalho />
            <main className="tutorial" aria-labelledby="tutorial-titulo">
                <section className="tutorial__introducao">
                    <h1 id="tutorial-titulo" className="tutorial__titulo">Como Usar o NexoBiiz</h1>
                    <p className="tutorial__descricao">
                        Aprenda a utilizar o <strong>NexoBiiz</strong> para gerenciar seu negócio de forma simples e eficiente.
                    </p>
                </section>

                <section className="tutorial__passos">
                    <h2 className="tutorial__subtitulo">Passo a Passo</h2>
                    <ol className="tutorial__lista">
                        <li className="tutorial__item">
                            <strong>Cadastro de Produtos:</strong> Adicione os produtos que você vende, com nome, preço e quantidade.
                        </li>
                        <li className="tutorial__item">
                            <strong>Registro de Vendas:</strong> Registre cada venda realizada para manter o controle financeiro.
                        </li>
                        <li className="tutorial__item">
                            <strong>Relatórios:</strong> Acesse relatórios detalhados para acompanhar o desempenho do seu negócio.
                        </li>
                    </ol>
                </section>

                <section className="tutorial__dicas">
                    <h2 className="tutorial__subtitulo">Dicas Úteis</h2>
                    <ul className="tutorial__dicas-lista">
                        <li className="tutorial__dica-item">Mantenha seu estoque sempre atualizado.</li>
                        <li className="tutorial__dica-item">Use os relatórios para identificar os produtos mais vendidos.</li>
                        <li className="tutorial__dica-item">Acesse o sistema pelo celular para registrar vendas em tempo real.</li>
                    </ul>
                </section>
            </main>
            <Rodape />
        </div>
    );
}