import { useEffect, useState } from "react";
import BackToTop from "./components/backToTop/index.jsx";
import RequestComposer from "./components/requestComposer/index.jsx";
import RequestHistory from "./components/requestHistory/index.jsx";
import ResponseViewer from "./components/responseViewer/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const storageKey = "requestly-workbench-v1";
const readHeaders = '{\n  "Accept": "application/json"\n}';
const writeHeaders =
    '{\n  "Accept": "application/json",\n  "Content-Type": "application/json; charset=UTF-8"\n}';

const requestExamples = [
    {
        id: "get-todo",
        label: "GET /todos/1",
        request: {
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/todos/1",
            headers: readHeaders,
            body: "",
        },
    },
    {
        id: "create-post",
        label: "POST /posts",
        request: {
            method: "POST",
            url: "https://jsonplaceholder.typicode.com/posts",
            headers: writeHeaders,
            body: '{\n  "title": "A clear example",\n  "body": "Created from Requestly",\n  "userId": 1\n}',
        },
    },
    {
        id: "replace-post",
        label: "PUT /posts/1",
        request: {
            method: "PUT",
            url: "https://jsonplaceholder.typicode.com/posts/1",
            headers: writeHeaders,
            body: '{\n  "id": 1,\n  "title": "An updated example",\n  "body": "Replaced from Requestly",\n  "userId": 1\n}',
        },
    },
    {
        id: "edit-post",
        label: "PATCH /posts/1",
        request: {
            method: "PATCH",
            url: "https://jsonplaceholder.typicode.com/posts/1",
            headers: writeHeaders,
            body: '{\n  "title": "A revised title"\n}',
        },
    },
    {
        id: "delete-post",
        label: "DELETE /posts/1",
        request: {
            method: "DELETE",
            url: "https://jsonplaceholder.typicode.com/posts/1",
            headers: readHeaders,
            body: "",
        },
    },
];

const sampleRequest = requestExamples[0].request;

const loadSavedApp = () => {
    try {
        const saved = JSON.parse(window.localStorage.getItem(storageKey));
        return {
            request: saved?.request ?? sampleRequest,
            history: Array.isArray(saved?.history) ? saved.history : [],
        };
    } catch {
        return { request: sampleRequest, history: [] };
    }
};

const formatBody = (text, contentType) => {
    if (!contentType.includes("json") || !text) return text;
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text;
    }
};

const App = () => {
    const [savedState] = useState(loadSavedApp);
    const [request, setRequest] = useState(savedState.request);
    const [history, setHistory] = useState(savedState.history);
    const [activeHistoryId, setActiveHistoryId] = useState(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedExampleId, setSelectedExampleId] = useState("");

    useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ request, history }));
        } catch {
            return;
        }
    }, [request, history]);

    const handleRequestChange = (key, value) => {
        if (key === "method") {
            const example = requestExamples.find(
                (item) => item.request.method === value,
            );

            if (example) {
                setRequest({ ...example.request });
                setActiveHistoryId(null);
                setSelectedExampleId(example.id);
                return;
            }
        }

        setRequest((current) => ({ ...current, [key]: value }));
        setActiveHistoryId(null);
        setSelectedExampleId("");
    };

    const sendRequest = async () => {
        const startedAt = performance.now();
        setIsLoading(true);
        setResponse(null);
        try {
            const parsedHeaders = JSON.parse(request.headers || "{}");
            if (!parsedHeaders || typeof parsedHeaders !== "object" || Array.isArray(parsedHeaders)) {
                throw new Error("Headers must be a JSON object with name and value pairs.");
            }
            const headers = new Headers();
            Object.entries(parsedHeaders).forEach(([name, value]) => headers.set(name, String(value)));
            if (request.body.trim() && !headers.has("Content-Type") && request.method !== "GET") {
                try {
                    JSON.parse(request.body);
                    headers.set("Content-Type", "application/json");
                } catch {
                    headers.set("Content-Type", "text/plain;charset=UTF-8");
                }
            }
            const options = { method: request.method, headers };
            if (request.method !== "GET" && request.body.trim()) options.body = request.body;

            const result = await fetch(request.url, options);
            const rawBody = await result.text();
            const nextResponse = {
                ok: result.ok,
                status: result.status,
                statusText: result.statusText || "Response",
                duration: Math.round(performance.now() - startedAt),
                size: new Blob([rawBody]).size,
                body: formatBody(rawBody, result.headers.get("content-type") ?? ""),
                headers: [...result.headers.entries()].sort(([first], [second]) => first.localeCompare(second)),
            };
            setResponse(nextResponse);
            const historyItem = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
                method: request.method,
                url: request.url,
                headers: request.headers,
                body: request.body,
                status: nextResponse.status,
                statusText: nextResponse.statusText,
                ok: nextResponse.ok,
                timestamp: new Date().toISOString(),
            };
            setHistory((current) => [historyItem, ...current].slice(0, 8));
            setActiveHistoryId(historyItem.id);
        } catch (error) {
            const message = error instanceof SyntaxError
                ? "Headers must be valid JSON. Check the header names and values, then try again."
                : error instanceof TypeError
                    ? "Request failed. Check the URL, network, and the API's CORS policy."
                    : error.message;
            const nextResponse = {
                ok: false,
                error: true,
                status: null,
                statusText: "Request failed",
                duration: Math.round(performance.now() - startedAt),
                size: new Blob([message]).size,
                body: message,
                headers: [],
            };
            setResponse(nextResponse);
            const historyItem = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
                method: request.method,
                url: request.url,
                headers: request.headers,
                body: request.body,
                status: null,
                statusText: "Request failed",
                ok: false,
                timestamp: new Date().toISOString(),
            };
            setHistory((current) => [historyItem, ...current].slice(0, 8));
            setActiveHistoryId(historyItem.id);
        } finally {
            setIsLoading(false);
        }
    };

    const restoreRequest = (item) => {
        setRequest({ method: item.method, url: item.url, headers: item.headers, body: item.body });
        setActiveHistoryId(item.id);
        setSelectedExampleId("");
    };

    const loadExample = (exampleId) => {
        const example = requestExamples.find((item) => item.id === exampleId);

        if (!example) {
            setSelectedExampleId("");
            return;
        }

        setRequest({ ...example.request });
        setActiveHistoryId(null);
        setSelectedExampleId(example.id);
    };

    return (
        <div className={styles.appShell} id="top">
            <SiteHeader />
            <main className={styles.mainContent}>
                <div className={styles.workbenchIntro}>
                    <div><h1>Make the request.<br /><span>Read the response.</span></h1><p>A small, focused space to test an endpoint and inspect what comes back.</p></div>
                    <span className={styles.localBadge}>LOCAL WORKSPACE</span>
                </div>
                <div className={styles.workbenchShell}>
                    <RequestHistory items={history} activeId={activeHistoryId} onRestore={restoreRequest} />
                    <div className={styles.mainColumn}>
                        <RequestComposer
                            request={request}
                            onChange={handleRequestChange}
                            onSend={sendRequest}
                            isLoading={isLoading}
                            onLoadExample={loadExample}
                            examples={requestExamples}
                            selectedExampleId={selectedExampleId}
                        />
                        <ResponseViewer response={response} />
                    </div>
                </div>
            </main>
            <SiteFooter />
            <BackToTop />
        </div>
    );
};

export default App;
