import {
    FaCodepen,
    FaFacebook,
    FaGithub,
    FaLinkedin,
    FaYoutube,
} from "react-icons/fa6";
import { LuCoffee, LuHeart, LuMail } from "react-icons/lu";
import styles from "./styles.module.css";

const profileLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net" },
    { label: "GitHub", href: "https://github.com/a2rp", Icon: FaGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", Icon: FaCodepen },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aashishranjan",
        Icon: FaLinkedin,
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/theash.ashish/",
        Icon: FaFacebook,
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1",
        Icon: FaYoutube,
    },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", Icon: LuMail },
];

const supportLinks = [
    {
        label: "Support",
        href: "https://a2rp-donation-page.netlify.app/",
        Icon: LuHeart,
    },
    {
        label: "Buy Me a Coffee",
        href: "https://buymeacoffee.com/ashishranjan",
        Icon: LuCoffee,
    },
    { label: "Patreon", href: "https://www.patreon.com/ashishranjan" },
];

const SiteFooter = () => (
    <footer className={styles.siteFooter}>
        <div className={styles.footerInner}>
            <div className={styles.ownerDetails}>
                <a
                    className={styles.logoLink}
                    href="https://www.ashishranjan.net"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={`${import.meta.env.BASE_URL}logo.png`}
                        alt="Ashish Ranjan portfolio"
                    />
                </a>
                <p>
                    © {new Date().getFullYear()}{" "}
                    <a
                        href="https://github.com/a2rp"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ashish Ranjan
                    </a>
                    . All rights reserved.
                </p>
            </div>
            <div className={styles.footerLinks}>
                <div className={styles.linkGroup} aria-label="Links">
                    <a
                        href="https://github.com/a2rp/api-request-workbench"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub aria-hidden="true" /> Source code
                    </a>
                    {profileLinks.map(({ label, href, Icon }) => (
                        <a
                            href={href}
                            key={label}
                            target={
                                href.startsWith("mailto:")
                                    ? undefined
                                    : "_blank"
                            }
                            rel={
                                href.startsWith("mailto:")
                                    ? undefined
                                    : "noreferrer"
                            }
                        >
                            {Icon && <Icon aria-hidden="true" />}
                            {label}
                        </a>
                    ))}
                </div>
                <div className={styles.linkGroup} aria-label="Support">
                    {supportLinks.map(({ label, href, Icon }) => (
                        <a
                            href={href}
                            key={label}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {Icon && <Icon aria-hidden="true" />}
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
