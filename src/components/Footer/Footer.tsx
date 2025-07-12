import styles from "@/style/components/Footer.module.scss";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Links do rodapé">
          <ul className={styles.list}>
            <li className={styles.item}>
              <Link href="/" className={styles.link}>
                Sobre o Projeto
              </Link>
            </li>
            <li className={styles.item}>
              <Link href="/about" className={styles.link}>
                Política de Privacidade
              </Link>
            </li>
            <li className={styles.item}>
              <Link href="/contato" className={styles.link}>
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          &copy; {currentYear} NexoBiiz. Todos os direitos reservados.
        </p>
        <div className={styles.social}>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Facebook"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
