import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function cleanSiteUrl(value: string) {
  return value.replace(/^([^:]+:\/\/)+/, "$1").replace(/\/$/, "");
}

function seoFiles(siteUrl: string): Plugin {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;

  return {
    name: "mahesh-advisor-seo-files",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url === "/robots.txt") {
          response.setHeader("Content-Type", "text/plain; charset=utf-8");
          response.end(robots);
          return;
        }
        if (request.url === "/sitemap.xml") {
          response.setHeader("Content-Type", "application/xml; charset=utf-8");
          response.end(sitemap);
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = cleanSiteUrl(
    env.VITE_SITE_URL ||
      (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:5173"),
  );

  return {
    plugins: [react(), seoFiles(siteUrl)],
  };
});
