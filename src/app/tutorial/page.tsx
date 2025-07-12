import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import styles from "@/style/components/tutorial/tutorial.module.scss";

export default function TutorialPage() {
  return (
    <div className={styles.tutorialPage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.sectionsContainer}>
          <section className={styles.stepsSection}>
            <h2 className={styles.stepTitle}>Passo a Passo</h2>
            <div className={styles.stepsContainer}>
              <p className={styles.stepDescription}>
                <span className={styles.span}>1. Cadastro de Produtos: </span>
                Adicione os produtos que você vende, com nome, preço e
                quantidade. e selecione a categoria
              </p>
              <p className={styles.stepDescription}>
                <span className={styles.span}>2. Registro de Vendas:</span>
                Registre cada venda realizada para manter o controle financeiro.
              </p>
              <p className={styles.stepDescription}>
                <span className={styles.span}>3. Relatórios: </span>
                Acesse relatórios detalhados para acompanhar o desempenho do seu
                negócio.
              </p>
            </div>
          </section>
          <section className={styles.tipsSection}>
            <h2 className={styles.tipsTitle}>Dicas Úteis</h2>
            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                Mantenha seus produtos sempre atualizados para evitar erros nas
                vendas.
              </li>
              <li className={styles.tipItem}>
                Utilize os relatórios para identificar quais produtos estão
                vendendo mais.
              </li>
              <li className={styles.tipItem}>
                Faça backup dos seus dados regularmente para evitar perdas.
              </li>
              <li className={styles.tipItem}>
                Explore todas as funcionalidades do NexoBiiz para otimizar a
                gestão do seu negócio.
              </li>
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
