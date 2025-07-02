import styles from "@/style/suporte/suporte.module.scss";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export default function SuportePage() {
  return (
    <div className={styles.suportePage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h1 className={styles.title}>Suporte</h1>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>
            Como faço para começar a usar o NexoBiiz?
          </h2>
          <p className={styles.description}>
            Você pode começar criando uma conta gratuita e explorando as
            funcionalidades disponíveis no painel inicial.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>O sistema é realmente gratuito?</h2>
          <p className={styles.description}>
            Sim, o NexoBiiz é 100% gratuito e foi desenvolvido como parte de um
            projeto social.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.subtitle}>
            Como posso entrar em contato para suporte técnico?
          </h2>
          <p className={styles.description}>
            Você pode nos contatar pelo e-mail suporte@nexobiiz.com ou pelas
            nossas redes sociais.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
