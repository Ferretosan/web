// sticky-notes.js - Completely redesigned
class StickyNotesManager {
  constructor() {
    this.container = null;
    this.noteFiles = ['todo.md', 'updates.md', 'notes.md'];
  }

  // Simple markdown parser specifically for sticky notes
  parseMarkdown(markdown) {
    let html = markdown.trim();
    
    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Task lists
    html = html.replace(/^- \[x\] (.*)$/gim, '<li><input type="checkbox" checked disabled> $1</li>');
    html = html.replace(/^- \[ \] (.*)$/gim, '<li><input type="checkbox" disabled> $1</li>');
    
    // Regular list items
    html = html.replace(/^- (.*)$/gim, '<li>$1</li>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Split by double newlines for paragraphs
    const sections = html.split(/\n\s*\n/);
    
    html = sections.map(section => {
      section = section.trim();
      if (!section) return '';
      
      // Check if it's a header
      if (section.match(/^<h[1-6]>/)) {
        return section;
      }
      
      // Check if it contains list items
      if (section.includes('<li>')) {
        // Wrap consecutive list items in ul
        let processedSection = section.replace(/\n/g, '');
        processedSection = processedSection.replace(/(<li>.*?<\/li>)/g, '$1');
        processedSection = '<ul>' + processedSection + '</ul>';
        return processedSection;
      }
      
      // Regular paragraph - replace single newlines with <br>
      section = section.replace(/\n/g, '<br>');
      return `<p>${section}</p>`;
      
    }).filter(section => section).join('');
    
    return html;
  }

  async loadNote(filename) {
    try {
      const response = await fetch(`/sticky-notes/${filename}`);
      if (!response.ok) throw new Error(`Failed to load ${filename}`);
      
      const markdown = await response.text();
      const html = this.parseMarkdown(markdown);
      
      const noteElement = document.createElement('div');
      noteElement.className = 'sticky-note';
      noteElement.innerHTML = html;
      
      return noteElement;
    } catch (error) {
      console.log(`Could not load sticky note: ${filename}`);
      return null;
    }
  }

  async loadAllNotes() {
    this.container = document.getElementById('sticky-notes-container');
    if (!this.container) {
      console.error('Sticky notes container not found');
      return;
    }

    // Clear existing notes
    this.container.innerHTML = '';

    // Load each note file
    for (const filename of this.noteFiles) {
      const noteElement = await this.loadNote(filename);
      if (noteElement) {
        this.container.appendChild(noteElement);
      }
    }
  }

  init() {
    // Wait for DOM and markdown parser to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.loadAllNotes(), 100);
      });
    } else {
      setTimeout(() => this.loadAllNotes(), 100);
    }
  }
}

// Initialize the sticky notes system
const stickyNotes = new StickyNotesManager();
stickyNotes.init();
