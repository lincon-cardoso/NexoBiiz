import { Cabecalho } from '@/components/cabecalho/Cabecalho';
import { Rodape } from '@/components/rodape/Rodape';

const faqs = [
    {
        pergunta: "Como faço para começar a usar o NexoBiiz?",
        resposta: "Você pode começar criando uma conta gratuita e explorando as funcionalidades disponíveis no painel inicial.",
    },
    {
        pergunta: "O sistema é realmente gratuito?",
        resposta: "Sim, o NexoBiiz é 100% gratuito e foi desenvolvido como parte de um projeto social.",
    },
    {
        pergunta: "Como posso entrar em contato para suporte técnico?",
        resposta: "Você pode nos contatar pelo e-mail suporte@nexobiiz.com ou pelas nossas redes sociais.",
    },
];

const FAQItem = ({ pergunta, resposta }: { pergunta: string; resposta: string }) => (
    <li className="suporte__faq-item">
        <strong>{pergunta}</strong>
        <p>{resposta}</p>
    </li>
);

const FAQSection = () => (
    <section className="suporte__faq">
        <h2 className="suporte__subtitulo">Perguntas Frequentes</h2>
        <ul className="suporte__faq-lista">
            {faqs.map((faq, index) => (
                <FAQItem key={index} pergunta={faq.pergunta} resposta={faq.resposta} />
            ))}
        </ul>
    </section>
);

const ContatoSection = () => (
    <section className="suporte__contato">
        <h2 className="suporte__subtitulo">Entre em Contato</h2>
        <p>
            Caso precise de mais ajuda, entre em contato conosco pelo e-mail:{" "}
            <a href="mailto:suporte@nexobiiz.com">suporte@nexobiiz.com</a>
        </p>
        <p>Ou visite nossas redes sociais:</p>
        <ul className="suporte__contato-lista">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
    </section>
);

export default function Suporte() {
    return (
        <div className="suporte">
            <Cabecalho />
            <main className="suporte__conteudo">
                <h1 className="suporte__titulo">Suporte</h1>
                <FAQSection />
                <ContatoSection />
            </main>
            <Rodape />
        </div>
    );
}