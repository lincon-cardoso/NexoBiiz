import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import styles from "@/style/contato/contato.module.scss";

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h1 className={styles.title}>Contato</h1>
          <form className={styles.form} action="#" method="post">
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="message" className={styles.label}>
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                rows={5}
                required
              ></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
              Enviar
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
