import { LuChevronDown, LuCode, LuPlay, LuSparkles } from "react-icons/lu";
import styles from "./styles.module.css";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const RequestComposer = ({
    request,
    onChange,
    onSend,
    isLoading,
    onLoadExample,
    examples,
    selectedExampleId,
}) => (
    <form
        className={styles.requestComposer}
        id="request"
        onSubmit={(event) => {
            event.preventDefault();
            onSend();
        }}
    >
        <div className={styles.requestTitleRow}>
            <div>
                <span className={styles.sectionIcon}>
                    <LuCode aria-hidden="true" />
                </span>
                <div>
                    <h2>Request</h2>
                    <p>Build your HTTP call</p>
                </div>
            </div>
            <label className={styles.examplePicker}>
                <LuSparkles className={styles.exampleIcon} aria-hidden="true" />
                <select
                    aria-label="Choose a request example"
                    value={selectedExampleId}
                    onChange={(event) => onLoadExample(event.target.value)}
                >
                    <option value="">Choose example</option>
                    {examples.map((example) => (
                        <option value={example.id} key={example.id}>
                            {example.label}
                        </option>
                    ))}
                </select>
                <LuChevronDown
                    className={styles.exampleChevron}
                    aria-hidden="true"
                />
            </label>
        </div>
        <label className={styles.urlLabel} htmlFor="request-url">
            Request URL
        </label>
        <div className={styles.urlRow}>
            <label className={styles.methodSelect} htmlFor="request-method">
                <select
                    id="request-method"
                    value={request.method}
                    onChange={(event) => onChange("method", event.target.value)}
                >
                    {methods.map((method) => (
                        <option value={method} key={method}>
                            {method}
                        </option>
                    ))}
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
            <button
                className={styles.sendButton}
                type="submit"
                disabled={isLoading || !request.url.trim()}
            >
                <LuPlay aria-hidden="true" />
                {isLoading ? "Sending" : "Send"}
            </button>
        </div>
        <div className={styles.requestFields}>
            <label className={styles.editorField} htmlFor="request-headers">
                <span>
                    Headers <small>JSON</small>
                </span>
                <textarea
                    id="request-headers"
                    rows="4"
                    spellCheck="false"
                    value={request.headers}
                    onChange={(event) =>
                        onChange("headers", event.target.value)
                    }
                />
                <small className={styles.fieldHint}>
                    Add key and value pairs as a JSON object.
                </small>
            </label>
            <label className={styles.editorField} htmlFor="request-body">
                <span>
                    Body{" "}
                    <small>
                        {request.method === "GET"
                            ? "not used for GET"
                            : "JSON or text"}
                    </small>
                </span>
                <textarea
                    id="request-body"
                    rows="4"
                    spellCheck="false"
                    disabled={request.method === "GET"}
                    value={request.body}
                    onChange={(event) => onChange("body", event.target.value)}
                    placeholder={'{\n  "name": "Example"\n}'}
                />
                <small className={styles.fieldHint}>
                    Requests from a browser may be limited by the API's CORS
                    policy.
                </small>
            </label>
        </div>
    </form>
);

export default RequestComposer;
