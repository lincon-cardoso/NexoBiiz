import styles from "@/style/components/MainContent.module.scss";
import Link from "next/link";
import Image from "next/image";

export function MainContent() {
  return (
    <main className={styles.mainContent}>
      <section className={styles.section}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Organize seu negócio com{" "}
            <span className={styles.highlight}>praticidade e autonomia</span> .
          </h1>
        </header>
        <p className={styles.description}>
          <h1>
            teste
          </h1>
          Um sistema gratuito feito para ajudar microempreendedores da
          comunidade a crescerem com tecnologia, simplificando a gestão diária.
        </p>
        <div className={styles.actions}>
          <Link href="/signup" passHref>
            <button className={styles.primaryButton}>Comece Agora</button>
          </Link>
          <Link href="/tutorial" passHref>
            <button className={styles.secondaryButton}>Ver Tutorial</button>
          </Link>
        </div>
      </section>
      <section className={styles.whyUseSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Por que usar o NexoBiiz?</h2>
        </header>
        <div className={styles.cardsContainer}>
          <article className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src="/img/imagens-barra/Selection(2).png"
                alt="Ícone de Praticidade"
                width={80}
                height={80}
              />
            </div>
            <h3 className={styles.cardTitle}>Controle de estoque simples</h3>
            <p className={styles.cardDescription}>
              Adicione e acompanhe produtos com facilidade, mantendo tudo
              organizado.
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src="/img/imagens-barra/Selection(3).png"
                alt="Ícone de Praticidade"
                width={80}
                height={80}
              />
            </div>
            <h3 className={styles.cardTitle}>Relatórios de vendas claros</h3>
            <p className={styles.cardDescription}>
              Veja quanto vendeu e quanto recebeu, sem precisar de planilhas
              complexas.
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src="/img/imagens-barra/Selection(4).png"
                alt="Ícone de Praticidade"
                width={80}
                height={80}
              />
            </div>
            <h3 className={styles.cardTitle}>Acesso móvel e desktop</h3>
            <p className={styles.cardDescription}>
              Funciona perfeitamente em qualquer navegador, do seu celular ao
              computador.
            </p>
          </article>
          <article className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src="/img/imagens-barra/Selection(5).png"
                alt="Ícone de Praticidade"
                width={80}
                height={80}
              />
            </div>
            <h3 className={styles.cardTitle}>
              100% gratuito e sem mensalidade
            </h3>
            <p className={styles.cardDescription}>
              Criado com o propósito de um projeto social, para você sem custos.
            </p>
          </article>
        </div>
      </section>
      <section className={styles.howToUseSection}>
        <header className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>Veja como é fácil usar</h1>
        </header>
        <p className={styles.sectionDescription}>
          Descubra a simplicidade do NexoBiiz com nosso tutorial interativo.
          Organize seu negócio em poucos passos.
        </p>
        <h2 className={styles.resourcesTitle}>Recursos Principais</h2>

        <ul className={styles.resourcesList}>
          <li className={styles.resourceItem}>
            Cadastro de produtos e serviços
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 12l-6-6h12l-6 6z" />
              </svg>
            </span>
          </li>
          <li className={styles.resourceItem}>
            Controle de estoque
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 12l-6-6h12l-6 6z" />
              </svg>
            </span>
          </li>
          <li className={styles.resourceItem}>
            Relatórios de vendas
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 12l-6-6h12l-6 6z" />
              </svg>
            </span>
          </li>
          <li className={styles.resourceItem}>
            Acesso em qualquer dispositivo
            <span className={styles.icon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 12l-6-6h12l-6 6z" />
              </svg>
            </span>
          </li>
        </ul>

        <div className={styles.actions}>
          <button className={styles.primaryButton}>
            Ver Tutorial Completo
          </button>
        </div>
      </section>
      <section className={styles.userFeedbackSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>O que nossos usuários dizem</h2>
        </header>
        <div className={styles.feedbackContainer}>
          <article className={styles.feedbackCard}>
            <p className={styles.feedbackText}>
              &quot;Antes eu anotava tudo no caderno. Agora tenho tudo no
              celular, organizado e fácil de acessar. NexoBiiz mudou minha
              vida!&quot;
            </p>
            <span className={styles.feedbackAuthor}>
              — Carla, artesã do bairro Fátima
            </span>
          </article>
          <article className={styles.feedbackCard}>
            <p className={styles.feedbackText}>
              &quot;Com o NexoBiiz aprendi a cuidar do meu dinheiro de forma
              eficaz. Agora vejo minhas vendas e lucros de um jeito que nunca vi
              antes.&quot;
            </p>
            <span className={styles.feedbackAuthor}>
              — João, vendedor ambulante
            </span>
          </article>
          <article className={styles.feedbackCard}>
            <p className={styles.feedbackText}>
              &quot;O sistema é simples e me ajuda a organizar meu estoque sem
              complicação. É a ferramenta que eu precisava para minha pequena
              loja.&quot;
            </p>
            <span className={styles.feedbackAuthor}>
              — Maria, dona de uma pequena loja
            </span>
          </article>
        </div>
      </section>

      <section className={styles.howWeStartedSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Como Nascemos</h2>
        </header>
        <div className={styles.sectionContent}>
          <p className={styles.sectionDescription}>
            O NexoBiiz nasceu como parte de um projeto universitário com um
            impacto social profundo e real. Foi cuidadosamente pensado para
            ajudar pessoas reais e comunidades, oferecendo soluções acessíveis,
            tecnológicas e humanizadas para o dia a dia do microempreendedor.
          </p>
        </div>
      </section>
    </main>
  );
}
