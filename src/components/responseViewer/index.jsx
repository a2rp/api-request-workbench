import { useState } from "react";
import { LuCheck, LuCopy, LuFileJson2, LuPanelTop, LuTerminal } from "react-icons/lu";
import styles from "./styles.module.css";

const formatBytes = (bytes) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

const ResponseViewer = ({ response }) => {
    const [activeTab, setActiveTab] = useState("body");
    const [copyMessage, setCopyMessage] = useState("");
    const responseText = activeTab === "headers"
        ? JSON.stringify(Object.fromEntries(response?.headers ?? []), null, 2)
        : response?.body ?? "";

    const copyResponse = async () => {
        try {
            await navigator.clipboard.writeText(responseText);
            setCopyMessage("Copied to clipboard");
        } catch {
            setCopyMessage("Clipboard access is unavailable");
        }
        window.setTimeout(() => setCopyMessage(""), 1800);
    };

    return (
        <section className={styles.responseViewer} id="response" aria-labelledby="response-title">
            <div className={styles.responseHeader}>
                <div className={styles.responseHeading}>
                    <span className={styles.responseIcon}><LuTerminal aria-hidden="true" /></span>
                    <div><h2 id="response-title">Response</h2><p>{response ? "Latest server response" : "Your response will appear here"}</p></div>
                </div>
                {response && (
                    <div className={styles.responseMetrics}>
                        <span className={`${styles.statusBadge} ${response.error ? styles.statusError : response.ok ? styles.statusSuccess : styles.statusWarning}`}>
                            {response.error ? "ERROR" : `${response.status} ${response.statusText}`}
                        </span>
                        <span>{response.duration} ms</span>
                        <span>{formatBytes(response.size)}</span>
                    </div>
                )}
            </div>
            <div className={styles.responseTabs} role="tablist" aria-label="Response details">
                <button
                    className={activeTab === "body" ? styles.tabActive : ""}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "body"}
                    onClick={() => setActiveTab("body")}
                >
                    <LuFileJson2 aria-hidden="true" /> Body
                </button>
                <button
                    className={activeTab === "headers" ? styles.tabActive : ""}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "headers"}
                    onClick={() => setActiveTab("headers")}
                >
                    <LuPanelTop aria-hidden="true" /> Headers <span>{response?.headers?.length ?? 0}</span>
                </button>
                {response && (
                    <button className={styles.copyButton} type="button" onClick={copyResponse}>
                        {copyMessage ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
                        {copyMessage || "Copy"}
                    </button>
                )}
            </div>
            <div className={styles.responseContent} role="tabpanel">
                {!response ? (
                    <div className={styles.emptyResponse}>
                        <span><LuTerminal aria-hidden="true" /></span>
                        <h3>Ready when you are</h3>
                        <p>Send a request to inspect its status, headers, and response body.</p>
                    </div>
                ) : activeTab === "headers" ? (
                    <div className={styles.headerList}>
                        {response.headers.length ? response.headers.map(([name, value]) => (
                            <div className={styles.headerRow} key={name}><strong>{name}</strong><span>{value}</span></div>
                        )) : <p className={styles.emptyText}>No response headers were returned.</p>}
                    </div>
                ) : (
                    <pre className={styles.responseBody}><code>{response.body || "Response body is empty."}</code></pre>
                )}
            </div>
            <p className={styles.copyStatus} aria-live="polite">{copyMessage}</p>
        </section>
    );
};

export default ResponseViewer;
