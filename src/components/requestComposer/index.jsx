import { LuChevronDown, LuCode2, LuPlay, LuSparkles } from "react-icons/lu";
import styles from "./styles.module.css";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const RequestComposer = ({ request, onChange, onSend, isLoading, onLoadExample }) => (
    <form
        className={styles.requestComposer}
        onSubmit={(event) => {
            event.preventDefault();
            onSend();
        }}
    >
        <div className={styles.requestTitleRow}>
            <div>
                <span className={styles.sectionIcon}><LuCode2 aria-hidden="true" /></span>
                <div><h2>Request</h2><p>Build your HTTP call</p></div>
            </div>
            <button className={styles.exampleButton} type="button" onClick={onLoadExample}>
                <LuSparkles aria-hidden="true" /> Try example
            </button>
        </div>
        <label className={styles.urlLabel} htmlFor="request-url">Request URL</label>
        <div className={styles.urlRow}>
            <label className={styles.methodSelect} htmlFor="request-method">
                <select id="request-method" value={request.method} onChange={(event) => onChange("method", event.target.value)}>
                    {methods.map((method) => <option value={method} key={method}>{method}</option>)}
                </select>
                <LuChevronDown aria-hidden="true" />
            </label>
            <input
                className={styles.urlInput}
                id="request-url"
                type="url"
                required
                placeholder="https://api.example.com/items"
                value={request.url}
                onChange={(event) => onChange("url", event.target.value)}
            />
            <button className={styles.sendButton} type="submit" disabled={isLoading || !request.url.trim()}>
                <LuPlay aria-hidden="true" />
                {isLoading ? "Sending" : "Send"}
            </button>
        </div>
        <div className={styles.requestFields}>
            <label className={styles.editorField} htmlFor="request-headers">
                <span>Headers <small>JSON</small></span>
                <textarea
                    id="request-headers"
                    rows="4"
                    spellCheck="false"
                    value={request.headers}
                    onChange={(event) => onChange("headers", event.target.value)}
                />
                <small className={styles.fieldHint}>Add key and value pairs as a JSON object.</small>
            </label>
            <label className={styles.editorField} htmlFor="request-body">
                <span>Body <small>{request.method === "GET" ? "not used for GET" : "JSON or text"}</small></span>
                <textarea
                    id="request-body"
                    rows="4"
                    spellCheck="false"
                    disabled={request.method === "GET"}
                    value={request.body}
                    onChange={(event) => onChange("body", event.target.value)}
                    placeholder={'{\n  "name": "Example"\n}'}
                />
                <small className={styles.fieldHint}>Requests from a browser may be limited by the API's CORS policy.</small>
            </label>
        </div>
    </form>
);

export default RequestComposer;
