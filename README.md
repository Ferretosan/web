# Ferretosan Website

Welcome to the Ferretosan website repository! This project features a retro pixel art aesthetic and is built with pure HTML, CSS, and JavaScript.

## About

This site showcases Ferretosan's artwork and web design. Contributions are welcome to help improve the site and fix bugs. Some code is AI-generated.

## Contribution Guidelines

Before contributing, please read the following:

- Only submit code suitable for a personal website (no inappropriate content).
- Not all contributions may be accepted or used.
- Major framework changes are discouraged; keep it pure HTML/CSS/JS.
- Your code may be modified or removed as needed.

### Contributors

- [Ferretosan](https://github.com/ferretosan)
- [proplayer919](https://github.com/proplayer919)

## Blog Comments (Utterances)

Blog posts display a **Comments** section powered by [Utterances](https://utteranc.es/), which stores comments as GitHub Issues in [`Ferretosan/web-blog-comments`](https://github.com/Ferretosan/web-blog-comments) — no ads, no tracking beyond GitHub.

### Setup

1. **Install the Utterances GitHub App** on the `Ferretosan/web-blog-comments` repository:
   - Visit <https://github.com/apps/utterances> and grant access to `Ferretosan/web-blog-comments`.
2. **Ensure the repo is public** — Utterances requires a public repository to create and read issues.
3. The embed is already wired up in `js/markdown-parser.js`. Each blog post gets its own GitHub Issue titled `blog/<filename>` (e.g. `blog/newyear26.md`), providing a stable, deterministic mapping regardless of URL changes.
4. To change the comment theme, update `UTTERANCES_THEME` at the top of `js/markdown-parser.js`. Available themes: `github-light`, `github-dark`, `preferred-color-scheme`, `github-dark-orange`, `icy-dark`, `dark-blue`, `photon-dark`, `boxy-light`, `catppuccin-mocha`.
5. **Permissions** — users must have a GitHub account and authorize Utterances via OAuth to post comments. Read-only viewing works without login.