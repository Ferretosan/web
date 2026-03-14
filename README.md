# Ferretosan Website

Welcome to the Ferretosan website repository! This project features a retro pixel art aesthetic and is built with pure HTML, CSS, and JavaScript.

## About

This site showcases Ferretosan's artwork and web design. Contributions are welcome to help improve the site and fix bugs. Some code is AI-generated.

## Blog Comments (Utterances)

Blog posts display a **Comments** section powered by [Utterances](https://utteranc.es/), which stores comments as GitHub Issues — no ads, no tracking beyond GitHub.

### Setup

1. **Choose a public GitHub repository** to store comment issues. You can use this repo (`Ferretosan/web`) or create a dedicated one (e.g. `Ferretosan/blog-comments`).

2. **Install the Utterances GitHub App** on that repository:
   [https://github.com/apps/utterances](https://github.com/apps/utterances)

3. **Set `UTTERANCES_REPO`** near the top of `js/markdown-parser.js`:
   ```js
   const UTTERANCES_REPO = 'Ferretosan/web'; // replace with owner/repo
   const UTTERANCES_THEME = 'photon-dark';   // optional: change theme
   ```

4. **Issue mapping** — each blog post is mapped to a GitHub Issue using the term `blog/<filename>` (e.g. `blog/newyear26.md`). Utterances will create or reuse an issue with a matching title automatically. This mapping is stable and unique per post.

5. **Permissions** — users must have a GitHub account and authorize Utterances via OAuth to post comments. Read-only viewing works without login.

## Contribution Guidelines

Before contributing, please read the following:

- Only submit code suitable for a personal website (no inappropriate content).
- Not all contributions may be accepted or used.
- Major framework changes are discouraged; keep it pure HTML/CSS/JS.
- Your code may be modified or removed as needed.

### Contributors

- [Ferretosan](https://github.com/ferretosan)
- [proplayer919](https://github.com/proplayer919)