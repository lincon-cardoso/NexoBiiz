import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import styles from "@/style/about/about.module.scss";

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.aboutPage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.description}>
            A sua privacidade é importante para nós. É política do NexoBiiz
            respeitar a sua privacidade em relação a qualquer informação sua que
            possamos coletar no site.
          </p>
          <p className={styles.description}>
            Ao utilizar o NexoBiiz, você concorda com nossa Política de
            Privacidade e com o uso de cookies e tecnologias similares para
            melhorar a experiência do usuário.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
