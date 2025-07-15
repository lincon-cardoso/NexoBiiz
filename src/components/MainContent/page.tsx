import styles from "@/style/components/main/MainContent.module.scss";
import Link from "next/link";
import Image from "next/image";

export function MainContent() {
  return (
    <main className={styles.mainContent}>
      <section className={styles.section}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Organize seu negócio com{" "}
            <span className={styles.highlight}>praticidade e autonomia</span>.
          </h1>
        </header>
        <p className={styles.description}>
          Um sistema gratuito feito para ajudar microempreendedores da
          comunidade a crescerem com tecnologia, simplificando a gestão diária.
        </p>
        <div className={styles.actions}>
          <Link href="/register" passHref>
            <button className={styles.primaryButton} aria-label="Comece agora">
              Comece Agora
            </button>
          </Link>
          <Link href="/tutorial" passHref>
            <button
              className={styles.secondaryButton}
              aria-label="Ver tutorial"
            >
              Ver Tutorial
            </button>
          </Link>
        </div>
      </section>

      <section className={styles.whyUseSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Por que usar o NexoBiiz?</h2>
        </header>
        <div className={styles.cardsContainer}>
          {[
            {
              src: "/img/imagens-barra/Selection(2).png",
              alt: "Ícone de Praticidade",
              title: "Controle de estoque simples",
              description:
                "Adicione e acompanhe produtos com facilidade, mantendo tudo organizado.",
            },
            {
              src: "/img/imagens-barra/Selection(3).png",
              alt: "Ícone de Relatórios",
              title: "Relatórios de vendas claros",
              description:
                "Veja quanto vendeu e quanto recebeu, sem precisar de planilhas complexas.",
            },
            {
              src: "/img/imagens-barra/Selection(4).png",
              alt: "Ícone de Acesso",
              title: "Acesso móvel e desktop",
              description:
                "Funciona perfeitamente em qualquer navegador, do seu celular ao computador.",
            },
            {
              src: "/img/imagens-barra/Selection(5).png",
              alt: "Ícone de Gratuidade",
              title: "100% gratuito e sem mensalidade",
              description:
                "Criado com o propósito de um projeto social, para você sem custos.",
            },
          ].map((card, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardImage}>
                <Image src={card.src} alt={card.alt} width={80} height={80} />
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </article>
          ))}
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
          {[
            "Cadastro de produtos e serviços",
            "Controle de estoque",
            "Relatórios de vendas",
            "Acesso em qualquer dispositivo",
          ].map((resource, index) => (
            <li key={index} className={styles.resourceItem}>
              {resource}
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
          ))}
        </ul>
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            aria-label="Ver tutorial completo"
          >
            Ver Tutorial Completo
          </button>
        </div>
      </section>

      <section className={styles.userFeedbackSection}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>O que nossos usuários dizem</h2>
        </header>
        <div className={styles.feedbackContainer}>
          {[
            {
              text: "Antes eu anotava tudo no caderno. Agora tenho tudo no celular, organizado e fácil de acessar. NexoBiiz mudou minha vida!",
              author: "Carla, artesã do bairro Fátima",
            },
            {
              text: "Com o NexoBiiz aprendi a cuidar do meu dinheiro de forma eficaz. Agora vejo minhas vendas e lucros de um jeito que nunca vi antes.",
              author: "João, vendedor ambulante",
            },
            {
              text: "O sistema é simples e me ajuda a organizar meu estoque sem complicação. É a ferramenta que eu precisava para minha pequena loja.",
              author: "Maria, dona de uma pequena loja",
            },
          ].map((feedback, index) => (
            <article key={index} className={styles.feedbackCard}>
              <p className={styles.feedbackText}>&quot;{feedback.text}&quot;</p>
              <span className={styles.feedbackAuthor}>— {feedback.author}</span>
            </article>
          ))}
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
