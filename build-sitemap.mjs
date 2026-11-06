import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://ferretosan.com";
const BLOG_DIR = "blog";

// Top-level pages worth indexing. 404.html, blog.html (a redirect) and
// email-template.html are intentionally left out.
const PAGES = [
  { file: "index.html", loc: "/", changefreq: "weekly", priority: "1.0" },
  { file: "art.html", loc: "/art.html", changefreq: "monthly", priority: "0.8" },
  { file: "music.html", loc: "/music.html", changefreq: "monthly", priority: "0.8" },
  { file: "school.html", loc: "/school.html", changefreq: "monthly", priority: "0.5" },
];

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function mtime(file) {
  return statSync(file).mtime.toISOString().slice(0, 10);
}

// Prefer the last commit that touched the file; fall back to its mtime when
// git is unavailable (e.g. an exported copy of the site).
function lastModified(file) {
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { encoding: "utf8" }).trim();
    if (date) return date;
  } catch {}
  return mtime(file);
}

function toIsoDate(ddmmyyyy) {
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

function parsePost(file) {
  const html = readFileSync(join(BLOG_DIR, file), "utf8");
  const date = html.match(/<span class="postDate">([^<]+)<\/span>/i);
  if (!date) throw new Error(`No postDate found in ${join(BLOG_DIR, file)}`);
  return {
    loc: `/blog/${file}`,
    lastmod: toIsoDate(date[1].trim()),
    priority: "0.7",
  };
}

function renderUrl({ loc, lastmod, changefreq, priority }) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(SITE + loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
  ];
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");
  return lines.join("\n");
}

const pages = PAGES.map(({ file, loc, changefreq, priority }) => ({
  loc,
  lastmod: lastModified(file),
  changefreq,
  priority,
}));

const posts = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".html"))
  .map(parsePost)
  .sort((a, b) => b.lastmod.localeCompare(a.lastmod));

const urls = [...pages, ...posts].map(renderUrl).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

process.stdout.write(sitemap);
