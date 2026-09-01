import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BLOG_DIR = "blog";
const SITE = "https://ferretosan.com";
const FEED_URL = `${SITE}/feed.xml`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toRfc2822(ddmmyyyy) {
  const [dd, mm, yyyy] = ddmmyyyy.split("/").map(Number);
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  return `${DAYS[date.getUTCDay()]}, ${String(dd).padStart(2, "0")} ${MONTHS[mm - 1]} ${yyyy} 00:00:00 +0000`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function cdata(str) {
  return `<![CDATA[${str.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function resolveUrl(value) {
  if (/^(https?:|mailto:|data:|#|javascript:)/i.test(value)) return value;
  if (value.startsWith("../")) return SITE + value.slice(2);
  if (value.startsWith("/")) return SITE + value;
  return `${SITE}/${BLOG_DIR}/${value}`;
}

function absolutize(html) {
  return html.replace(/(\b(?:src|href)=")([^"]*)(")/gi, (match, pre, url, post) => pre + resolveUrl(url) + post);
}

function extractArticle(html) {
  const match = html.match(/<article>([\s\S]*?)<\/article>/i);
  return match ? match[1].trim() : "";
}

function coverSrc(html) {
  const match = html.match(/<img[^>]*class="[^"]*postCover[^"]*"[^>]*>/i);
  if (match) {
    const src = match[0].match(/\bsrc="([^"]+)"/i);
    if (src) return src[1];
  }
  return null;
}

function parsePost(file) {
  const html = readFileSync(join(BLOG_DIR, file), "utf8");
  const date = html.match(/<span class="postDate">([^<]+)<\/span>/i)[1].trim();
  const title = html.match(/<span class="postTitle">([^<]+)<\/span>/i)[1].trim();
  const content = absolutize(extractArticle(html));
  const postUrl = `${SITE}/${BLOG_DIR}/${file}`;
  const item = {
    title,
    url: postUrl,
    date,
    content,
  };
  const cover = coverSrc(html);
  if (cover) {
    item.cover = resolveUrl(cover);
    const local = cover.replace(/^\.\.\//, "");
    try {
      item.coverLength = statSync(local).size;
    } catch {
      item.coverLength = 0;
    }
  }
  return item;
}

function renderItem(item) {
  const lines = [
    `    <item>`,
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${item.url}</link>`,
    `      <guid>${item.url}</guid>`,
  ];
  if (item.cover) {
    lines.push(`      <enclosure url="${item.cover}" length="${item.coverLength}" type="image/jpeg" />`);
  }
  lines.push(`      <pubDate>${toRfc2822(item.date)}</pubDate>`);
  lines.push(`      <description>${cdata(item.content)}</description>`);
  lines.push(`      <content:encoded>${cdata(item.content)}</content:encoded>`);
  lines.push(`    </item>`);
  return lines.join("\n");
}

function sortKey(date) {
  return date.split("/").reverse().join("");
}

const posts = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".html"))
  .map(parsePost)
  .sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));

const items = posts.map(renderItem).join("\n");
const lastBuildDate = toRfc2822(posts[0].date);

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ferret's Corner - The Ferretosan Blog</title>
    <link>${SITE}/</link>
    <description>Ferretosan's blog - reflections of something or other, plus art and music.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

process.stdout.write(feed);