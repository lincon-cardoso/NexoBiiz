import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import styles from "@/style/components/tutorial/tutorial.module.scss";

export default function TutorialPage() {
  return (
    <div className={styles.tutorialPage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.introSection}>
          <h1 className={styles.title}>Como usar o NexoBiiz</h1>
          <h2 className={styles.subtitle}>
            Aprenda a utilizar o NexoBiiz para gerenciar seu negócio de forma
            simples e eficiente.
          </h2>
        </section>
        <section className={styles.sectionsContainer}>
          <section className={styles.stepsSection}>
            <div className={styles.step}>
              <h1 className={styles.stepTitle}>Passo a Passo</h1>
              <div className={styles.stepsContainer}>
                <p className={styles.stepDescription}>
                  <span className={styles.span}>1. Cadastro de Produtos: </span>{" "}
                  Adicione os produtos que você vende, com nome, preço e
                  quantidade. e selecione a categoria
                </p>
                <p className={styles.stepDescription}>
                  <span className={styles.span}>2. Registro de Vendas:</span>{" "}
                  Registre cada venda realizada para manter o controle
                  financeiro.
                </p>
                <p className={styles.stepDescription}>
                  <span className={styles.span}> 3. Relatórios: </span> Acesse
                  relatórios detalhados para acompanhar o desempenho do seu
                  negócio.
                </p>
              </div>
            </div>
          </section>
          <section className={styles.tipsSection}>
            <h1 className={styles.tipsTitle}>Dicas Úteis</h1>
            <p className={styles.tipsDescription}>
              - Mantenha seus produtos sempre atualizados para evitar erros nas
              vendas.
              <br />
              - Utilize os relatórios para identificar quais produtos estão
              vendendo mais.
              <br />
              - Faça backup dos seus dados regularmente para evitar perdas.
              <br />- Explore todas as funcionalidades do NexoBiiz para otimizar
              a gestão do seu negócio.
            </p>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
