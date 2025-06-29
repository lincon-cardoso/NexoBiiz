import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import styles from "@/style/sobre-o-projeto/sobre-o-projeto.module.scss";

export default function SobreOProjetoPage() {
  return (
    <div className={styles.sobreOProjetoPage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h1 className={styles.title}>Sobre o Projeto</h1>
          <p className={styles.description}>
            O NexoBiiz é um sistema ERP (Enterprise Resource Planning) simples e
            acessível, desenvolvido para atender as necessidades de pequenos
            negócios de bairro. Nosso objetivo é oferecer uma solução prática e
            gratuita para ajudar microempreendedores a gerenciar seus negócios
            com mais eficiência e autonomia.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Nossa Missão</h2>
          <p className={styles.description}>
            Facilitar o dia a dia de pequenos empreendedores, fornecendo
            ferramentas que permitem o controle de estoque, registro de vendas,
            geração de relatórios financeiros e muito mais, tudo de forma
            intuitiva e sem custos.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Como Nascemos</h2>
          <p className={styles.description}>
            O NexoBiiz nasceu como parte de um projeto universitário com foco em
            impacto social. Foi idealizado para ajudar pequenos comerciantes e
            autônomos a superarem desafios comuns, como a falta de organização
            financeira e a dificuldade de acesso a tecnologias avançadas.
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Nossos Valores</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              Acessibilidade: Um sistema gratuito e fácil de usar.
            </li>
            <li className={styles.listItem}>
              Inclusão: Criado para atender negócios de todos os tamanhos.
            </li>
            <li className={styles.listItem}>
              Impacto Social: Focado em transformar vidas e comunidades.
            </li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subtitle}>Nosso Futuro</h2>
          <p className={styles.description}>
            Estamos comprometidos em continuar evoluindo o NexoBiiz, adicionando
            novas funcionalidades e ouvindo as necessidades dos nossos usuários.
            Nosso sonho é ver pequenos negócios prosperarem com a ajuda da
            tecnologia.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
