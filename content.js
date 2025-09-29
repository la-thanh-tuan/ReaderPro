// Content script for Reader Pro Chrome Extension
class SmartTranslator {
  constructor() {
    this.popup = null;
    this.selectedText = '';
    this.isTranslating = false;
    this.currentSelection = null;
    
    this.init();
  }

  init() {
    // Listen for text selection
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
    document.addEventListener('keyup', this.handleTextSelection.bind(this));
    
    // Listen for clicks to hide popup
    document.addEventListener('mousedown', this.handleClickOutside.bind(this));
    
    // Listen for escape key to hide popup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hidePopup();
      }
    });
  }

  handleTextSelection(e) {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText && selectedText.length > 0 && selectedText.length < 500) {
        this.selectedText = selectedText;
        this.currentSelection = selection;
        
        // Get selection position
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        this.showPopup(rect);
        this.translateText(selectedText);
      } else {
        this.hidePopup();
      }
    }, 100);
  }

  handleClickOutside(e) {
    if (this.popup && !this.popup.contains(e.target)) {
      this.hidePopup();
    }
  }

  showPopup(rect) {
    this.hidePopup(); // Hide any existing popup
    
    this.popup = document.createElement('div');
    this.popup.className = 'smart-translator-popup';
    
    // Position popup above selection
    const x = rect.left + window.pageXOffset;
    const y = rect.top + window.pageYOffset - 10;
    
    this.popup.style.left = `${x}px`;
    this.popup.style.top = `${y}px`;
    
    this.popup.innerHTML = `
      <div class="translator-header">
        <div class="translator-title">Reader Pro</div>
        <button class="translator-close" title="Close">×</button>
      </div>
      <div class="translator-content">
        <div class="translator-text">
          <div class="text-label">Original</div>
          <div class="text-content original-text">${this.escapeHtml(this.selectedText)}</div>
        </div>
        <div class="translator-loading">
          <div class="loading-spinner"></div>
          <span>Translating...</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.popup);
    
    // Add event listener for close button
    this.popup.querySelector('.translator-close').addEventListener('click', () => {
      this.hidePopup();
    });
    
    // Animate popup appearance
    requestAnimationFrame(() => {
      this.popup.classList.add('show');
    });
    
    // Adjust position if popup goes outside viewport
    this.adjustPopupPosition();
  }

  adjustPopupPosition() {
    if (!this.popup) return;
    
    const rect = this.popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position
    if (rect.right > viewportWidth - 20) {
      this.popup.style.left = `${viewportWidth - rect.width - 20}px`;
    }
    
    // Adjust vertical position
    if (rect.top < 20) {
      const selectionRect = this.currentSelection.getRangeAt(0).getBoundingClientRect();
      this.popup.style.top = `${selectionRect.bottom + window.pageYOffset + 10}px`;
      
      // Move arrow to top
      this.popup.style.setProperty('--arrow-position', 'top');
    }
  }

  hidePopup() {
    if (this.popup) {
      this.popup.classList.remove('show');
      setTimeout(() => {
        if (this.popup && this.popup.parentNode) {
          this.popup.parentNode.removeChild(this.popup);
        }
        this.popup = null;
      }, 200);
    }
  }

  async translateText(text) {
    if (this.isTranslating) return;
    
    this.isTranslating = true;
    
    try {
      // Send message to background script to handle API call
      const response = await chrome.runtime.sendMessage({
        action: 'translate',
        text: text,
        targetLanguage: 'vi',
        sourceLanguage: ''
      });

      if (response.success && response.data) {
        if (response.data.isSuccessful && response.data.data) {
          this.displayTranslation(response.data.data);
        } else {
          this.displayError('Translation failed. Please try again.');
        }
      } else {
        this.displayError(response.error || 'Unable to translate. Please check your connection.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      this.displayError('Unable to translate. Please check your connection.');
    } finally {
      this.isTranslating = false;
    }
  }

  displayTranslation(data) {
    if (!this.popup) return;
    
    const content = this.popup.querySelector('.translator-content');
    content.innerHTML = `
      <div class="translator-text">
        <div class="text-label">Original</div>
        <div class="text-content original-text">${this.escapeHtml(data.originalText)}</div>
      </div>
      <div class="translator-text">
        <div class="text-label">Translation</div>
        <div class="text-content translated-text">${this.escapeHtml(data.translatedText)}</div>
      </div>
      <div class="language-info">
        <span>${data.sourceLanguage || 'Auto'}</span>
        <span class="lang-arrow">→</span>
        <span>${data.targetLanguage.toUpperCase()}</span>
      </div>
    `;
  }

  displayError(message) {
    if (!this.popup) return;
    
    const content = this.popup.querySelector('.translator-content');
    content.innerHTML = `
      <div class="translator-text">
        <div class="text-label">Original</div>
        <div class="text-content original-text">${this.escapeHtml(this.selectedText)}</div>
      </div>
      <div class="translator-error">${message}</div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the translator when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SmartTranslator();
  });
} else {
  new SmartTranslator();
}