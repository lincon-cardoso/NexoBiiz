import styles from '@/style/components/Header.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    return (
        <header className={styles.header} role="banner">
            <nav className={styles.headerNav} role="navigation" aria-label="Main Navigation">
                <div className={styles.headerLogo}>
                    <Link href="/" aria-label="Go to Home">
                        <Image
                            src="/img/logo.png"
                            alt="NexoBiiz Logo"
                            className={styles.headerLogoImage}
                            width={50}
                            height={50}
                            priority
                        />
                        <span className={styles.headerLogoText}>NexoBiiz</span>
                    </Link>
                </div>
                <ul className={styles.headerNavLinks}>
                    <li className={styles.headerNavItem}>
                        <Link href="/">Home</Link>
                    </li>
                    <li className={styles.headerNavItem}>
                        <Link href="/about">About</Link>
                    </li>
                    <li className={styles.headerNavItem}>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
                <div className={styles.headerAuthButtons}>
                    <Link href="/login" className={styles.headerLoginButton}>Login</Link>
                    <Link href="/register" className={styles.headerRegisterButton}>Register</Link>
                </div>
            </nav>
        </header>
    );
}