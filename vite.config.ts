import { defineConfig, ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // Serve static HTML for /en and /zh-hant routes
    {
      name: "static-html-middleware",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const url = req.url || "";
          
          // Handle /en and /zh-hant routes
          if (url === "/en" || url === "/en/") {
            const filePath = path.resolve(__dirname, "public/en/index.html");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "text/html");
              res.end(fs.readFileSync(filePath, "utf-8"));
              return;
            }
          }
          
          if (url === "/zh-hant" || url === "/zh-hant/") {
            const filePath = path.resolve(__dirname, "public/zh-hant/index.html");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "text/html");
              res.end(fs.readFileSync(filePath, "utf-8"));
              return;
            }
          }
          
          next();
        });
      },
    },
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
