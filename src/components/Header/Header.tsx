import styles from "@/style/components/Header.module.scss";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header role="banner" className={`${styles.header}`}>
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className={`${styles.headerNav}`}
      >
        <div className={`${styles.headerLogo}`}>
          <Link
            href="/"
            aria-label="Go to Home"
            className={`${styles.headerLogoLink}`}
          >
            <Image
              src="/img/logo.png"
              alt="NexoBiiz Logo"
              className={`${styles.headerLogoImage}`}
              width={50}
              height={50}
              priority
            />
            <span className={`${styles.headerLogoText}`}>NexoBiiz</span>
          </Link>
        </div>
        <ul className={`${styles.headerNavLinks}`}>
          <li className={`${styles.headerNavItem}`}>
            <Link href="/tutorial" className={`${styles.headerNavLink}`}>
              Tutorial
            </Link>
          </li>
          <li className={`${styles.headerNavItem}`}>
            <Link href="/sobre-o-projeto" className={`${styles.headerNavLink}`}>
              Sobre o Projeto
            </Link>
          </li>
          <li className={`${styles.headerNavItem}`}>
            <Link href="/suporte" className={`${styles.headerNavLink}`}>
              Suporte
            </Link>
          </li>
        </ul>
        <div className={`${styles.headerAuthButtons}`}>
          <Link href="/login" className={`${styles.headerLoginButton}`}>
            Login
          </Link>
          <Link href="/register" className={`${styles.headerRegisterButton}`}>
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
