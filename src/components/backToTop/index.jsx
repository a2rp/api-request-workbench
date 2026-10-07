import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";
import styles from "./styles.module.css";

const BackToTop = () => {
    const [visible, setVisible] = useState(() => window.scrollY > 50);

    useEffect(() => {
        const updateVisibility = () => setVisible(window.scrollY > 50);
        window.addEventListener("scroll", updateVisibility, { passive: true });
        return () => window.removeEventListener("scroll", updateVisibility);
    }, []);

    return (
        <button
            className={styles.backToTop}
            type="button"
            aria-label="Back to top"
            hidden={!visible}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            <LuArrowUp aria-hidden="true" /><span>Top</span>
        </button>
    );
};

export default BackToTop;
