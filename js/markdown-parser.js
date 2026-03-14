//    .-. .----..-.   .-.  .--.  .----. .-. .-..----.  .----. .-. . .-..-. .-.
// .-.| |{ {__  |  `.'  | / {} \ | {}  }| |/ / | {}  \/  {}  \| |/ \| ||  `| |
// | {} |.-._} }| |\ /| |/  /\  \| .-. \| |\ \ |     /\      /|  .'.  || |\  |
// `----'`----' `-' ` `-'`-'  `-'`-' `-'`-' `-'`----'  `----' `-'   `-'`-' `-'
// markdown-parser.js - Simple Markdown to HTML parser
// by Ferretosan !!!!

function parseMarkdown(markdown) {
  let html = markdown;
  
  // Headers with animations
  html = html.replace(/^### (.*$)/gim, '<h3 class="slide-in-left">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="slide-in-right">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="fade-in">$1</h1>');
  
  // Horizontal rules
  html = html.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, '<hr>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>');
  
  // Code blocks (simple)
  html = html.replace(/```([\s\S]*?)```/gim, '<pre class="scale-in"><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Task lists (checkboxes) - before list processing
  html = html.replace(/^- \[x\] (.*$)/gim, '<li><input type="checkbox" checked disabled> $1</li>');
  html = html.replace(/^- \[ \] (.*$)/gim, '<li><input type="checkbox" disabled> $1</li>');
  
  // Regular list items
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');
  
  // Split into paragraphs first
  const paragraphs = html.split(/\n\s*\n/);
  
  // Process each paragraph
  html = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';
    
    // Skip if it's already wrapped in block elements
    if (para.match(/^<(h[1-6]|ul|ol|pre|div|hr)/)) {
      return para;
    }
    
    // Replace single line breaks with <br> within paragraphs
    para = para.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags
    return `<p class="fade-in">${para}</p>`;
  }).join('\n');
  
  return html;
}

// ---- Utterances comments config ----
const UTTERANCES_REPO = "Ferretosan/web-blog-comments";
const UTTERANCES_THEME = "github-light";

// Inject (or replace) the Utterances widget inside targetEl.
// postId is used as the issue title so each post gets its own stable thread.
function injectUtterances(targetEl, postId) {
  if (!targetEl) return;

  // Remove any existing Utterances iframe/container when switching posts
  const existing = targetEl.querySelector('.utterances');
  if (existing) existing.remove();

  // Use document.title to pass the stable postId to Utterances (issue-term="title").
  // We set it briefly while the script loads, then restore the original title.
  // This avoids any URL or og:title hacking and gives a clean, deterministic mapping.
  const originalTitle = document.title;
  document.title = postId;

  const s = document.createElement('script');
  s.src = 'https://utteranc.es/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.setAttribute('repo', UTTERANCES_REPO);
  s.setAttribute('issue-term', 'title');
  s.setAttribute('theme', UTTERANCES_THEME);
  s.setAttribute('label', 'blog-comment');

  // Restore the original page title after Utterances has had time to read it.
  // The script reads document.title synchronously on execution, so the load event
  // fires after the title has been captured. A setTimeout fallback guards against
  // any async initialisation in the Utterances client.
  s.addEventListener('load', function() {
    setTimeout(function() { document.title = originalTitle; }, 0);
  });
  // Restore on error too
  s.addEventListener('error', function() {
    document.title = originalTitle;
  });

  targetEl.appendChild(s);
}

// Blog post hash/file mappings
const blogHashToFile = {
  '#blog-newyear26': 'newyear26.md',
  '#blog-font': 'font.md',
  '#blog-aseprite': 'aesprite.md',
  '#blog-chromebooks': 'chromebooks.md',
  '#blog-mcjob': 'mcjob.md'
};

const blogFileToHash = {
  'newyear26.md': '#blog-newyear26',
  'font.md': '#blog-font',
  'aesprite.md': '#blog-aseprite',
  'chromebooks.md': '#blog-chromebooks',
  'mcjob.md': '#blog-mcjob'
};

// Function to load and display blog post
async function loadBlogPost(filename) {
  try {
    const response = await fetch(`blog/${filename}`);
    if (!response.ok) {
      throw new Error('Blog post not found');
    }
    
    const markdown = await response.text();
    const html = parseMarkdown(markdown);
    
    // Display in popup
    popupwindowstart(html);

    // Update URL to reflect the blog post slug without navigation
    const newHash = blogFileToHash[filename];
    if (newHash && window.location.hash !== newHash) {
      window.history.replaceState(null, null, newHash);
    }
    
    // Initialize scroll animations for popup content
    setTimeout(() => {
      const popupContent = document.getElementById('popup-content');
      if (popupContent) {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              // Remove visible class when element goes out of view (replayable animations)
              entry.target.classList.remove('visible');
            }
          });
        }, observerOptions);

        // Observe all animated elements in the popup
        const animatedElements = popupContent.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => observer.observe(el));

        // Append comments section and inject Utterances widget
        const comments = document.createElement('div');
        comments.id = 'blog-comments';
        const hr = document.createElement('hr');
        const heading = document.createElement('h2');
        heading.className = 'slide-in-right';
        heading.textContent = 'Comments';
        comments.appendChild(hr);
        comments.appendChild(heading);
        popupContent.appendChild(comments);

        // Use "blog/<filename>" as the stable, deterministic issue title per post
        const postId = `blog/${filename}`;
        injectUtterances(comments, postId);
      }
    }, 100); // Small delay to ensure popup is fully rendered
    
  } catch (error) {
    console.error('Error loading blog post:', error);
    popupwindowstart('<h2>Error</h2><p>Sorry, could not load the blog post.</p>');
  }
}

// Handle hash navigation for blog posts on page load
document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash;
  // If hash matches a blog post, load it
  if (blogHashToFile[hash]) {
    loadBlogPost(blogHashToFile[hash]);
  }
});