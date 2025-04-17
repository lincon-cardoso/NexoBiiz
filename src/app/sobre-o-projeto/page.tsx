import { Cabecalho } from '@/components/cabecalho/Cabecalho';
import { Rodape } from '@/components/rodape/Rodape';

export default function SobreOProjeto() {
  return (
    <div className="sobre-o-projeto__container">
      <Cabecalho />
      <main className="sobre-o-projeto" aria-labelledby="sobre-o-projeto-titulo">
        <section className="sobre-o-projeto__introducao">
          <h1 id="sobre-o-projeto-titulo" className="sobre-o-projeto__titulo">Sobre o Projeto</h1>
          <p className="sobre-o-projeto__descricao">
            O <strong>NexoBiiz</strong> é um sistema ERP (Enterprise Resource Planning) simples e acessível,
            desenvolvido para atender as necessidades de pequenos negócios de bairro. Nosso objetivo é
            oferecer uma solução prática e gratuita para ajudar microempreendedores a gerenciar seus negócios
            com mais eficiência e autonomia.
          </p>
        </section>

        <section className="sobre-o-projeto__missao">
          <h2 className="sobre-o-projeto__subtitulo">Nossa Missão</h2>
          <p className="sobre-o-projeto__texto">
            Facilitar o dia a dia de pequenos empreendedores, fornecendo ferramentas que permitem o controle
            de estoque, registro de vendas, geração de relatórios financeiros e muito mais, tudo de forma
            intuitiva e sem custos.
          </p>
        </section>

        <section className="sobre-o-projeto__origem">
          <h2 className="sobre-o-projeto__subtitulo">Como Nascemos</h2>
          <p className="sobre-o-projeto__texto">
            O NexoBiiz nasceu como parte de um projeto universitário com foco em impacto social.
            Foi idealizado para ajudar pequenos comerciantes e autônomos a superarem desafios comuns,
            como a falta de organização financeira e a dificuldade de acesso a tecnologias avançadas.
          </p>
        </section>

        <section className="sobre-o-projeto__valores">
          <h2 className="sobre-o-projeto__subtitulo">Nossos Valores</h2>
          <ul className="sobre-o-projeto__lista">
            <li className="sobre-o-projeto__item">
              <strong>Acessibilidade:</strong> Um sistema gratuito e fácil de usar.
            </li>
            <li className="sobre-o-projeto__item">
              <strong>Inclusão:</strong> Criado para atender negócios de todos os tamanhos.
            </li>
            <li className="sobre-o-projeto__item">
              <strong>Impacto Social:</strong> Focado em transformar vidas e comunidades.
            </li>
          </ul>
        </section>

        <section className="sobre-o-projeto__futuro">
          <h2 className="sobre-o-projeto__subtitulo">Nosso Futuro</h2>
          <p className="sobre-o-projeto__texto">
            Estamos comprometidos em continuar evoluindo o NexoBiiz, adicionando novas funcionalidades
            e ouvindo as necessidades dos nossos usuários. Nosso sonho é ver pequenos negócios prosperarem
            com a ajuda da tecnologia.
          </p>
        </section>
      </main>
      <Rodape />
    </div>
  );
}