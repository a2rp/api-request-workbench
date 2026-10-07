import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/api-request-workbench/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
