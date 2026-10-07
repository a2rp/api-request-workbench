import { LuHistory, LuRadio, LuTimer } from "react-icons/lu";
import styles from "./styles.module.css";

const formatUrl = (value) => {
    try {
        const url = new URL(value);
        return `${url.host}${url.pathname}${url.search}`;
    } catch {
        return value;
    }
};

const RequestHistory = ({ items, activeId, onRestore }) => (
    <aside className={styles.requestHistory} aria-labelledby="history-title">
        <div className={styles.historyHeading}>
            <span><LuHistory aria-hidden="true" /></span>
            <div><h2 id="history-title">History</h2><p>Recent requests</p></div>
            <span className={styles.historyCount}>{items.length}</span>
        </div>
        {items.length === 0 ? (
            <div className={styles.emptyHistory}>
                <LuRadio aria-hidden="true" />
                <p>Your sent requests will show up here.</p>
            </div>
        ) : (
            <div className={styles.historyList}>
                {items.map((item) => (
                    <button
                        className={`${styles.historyItem} ${activeId === item.id ? styles.historyItemActive : ""}`}
                        key={item.id}
                        type="button"
                        aria-label={`Restore ${item.method} ${item.url}`}
                        aria-current={activeId === item.id ? "true" : undefined}
                        onClick={() => onRestore(item)}
                    >
                        <span className={styles.historyItemTop}>
                            <span className={`${styles.methodBadge} ${styles[item.method.toLowerCase()] ?? ""}`}>{item.method}</span>
                            <span className={`${styles.statusDot} ${item.ok ? styles.statusOk : styles.statusFailed}`} />
                            <span className={styles.historyTime}><LuTimer aria-hidden="true" />{new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                        <span className={styles.historyUrl}>{formatUrl(item.url)}</span>
                        <span className={styles.historyStatus}>{item.status ? `${item.status} ${item.statusText}` : "Request failed"}</span>
                    </button>
                ))}
            </div>
        )}
        <p className={styles.historyNote}>Saved locally in this browser</p>
    </aside>
);

export default RequestHistory;
