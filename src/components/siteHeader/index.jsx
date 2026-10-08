import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuBraces, LuMenu, LuX } from "react-icons/lu";
import styles from "./styles.module.css";

const navigationLinks = [
    { label: "Request", href: "#request" },
    { label: "History", href: "#history" },
    { label: "Response", href: "#response" },
];

const SiteHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const closeOutside = (event) => {
            if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <header className={styles.siteHeader} ref={headerRef}>
            <div className={styles.headerInner}>
                <a className={styles.brand} href="#request">
                    <span className={styles.brandIcon}>
                        <LuBraces aria-hidden="true" />
                    </span>
                    <span>Requestly</span>
                    <span className={styles.brandTag}>API WORKBENCH</span>
                </a>
                <nav
                    className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}
                    id="main-navigation"
                    aria-label="Main navigation"
                >
                    {navigationLinks.map((link) => (
                        <a
                            href={link.href}
                            key={link.href}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className={styles.actions}>
                    <a
                        className={styles.repositoryLink}
                        href="https://github.com/a2rp/api-request-workbench"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub aria-hidden="true" />
                        <span>Repository</span>
                    </a>
                    <button
                        className={styles.menuButton}
                        type="button"
                        aria-label={
                            menuOpen ? "Close navigation" : "Open navigation"
                        }
                        aria-expanded={menuOpen}
                        aria-controls="main-navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? (
                            <LuX aria-hidden="true" />
                        ) : (
                            <LuMenu aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;
