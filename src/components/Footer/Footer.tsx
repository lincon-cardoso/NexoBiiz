import styles from '@/style/components/Footer.module.scss';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <nav className={styles.navLinks} aria-label="Links do rodapé">
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link href="/" className={styles.navLink}>Sobre o Projeto</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/about" className={styles.navLink}>Política de Privacidade</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/Contato" className={styles.navLink}>Contato</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={styles.footerBottom}>
                <p className={styles.copyright}>&copy; {currentYear} NexoBiiz. Todos os direitos reservados.</p>
                <div className={styles.socialIcons}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}