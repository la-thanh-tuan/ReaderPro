// Background service worker for Smart Translator
class TranslationService {
  constructor() {
    this.API_BASE_URL = 'https://x142xfvk-7027.asse.devtunnels.ms/api';
    this.init();
  }

  init() {
    // Listen for extension installation
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Smart Translator extension installed');
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'translate') {
        this.handleTranslateRequest(request, sendResponse);
        return true; // Keep message channel open for async response
      }
    });
  }

  async handleTranslateRequest(request, sendResponse) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/Translation/translate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/octet-stream',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          targetLanguage: request.targetLanguage || 'vi',
          sourceLanguage: request.sourceLanguage || ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      sendResponse({ success: true, data: result });
    } catch (error) {
      console.error('Translation error:', error);
      sendResponse({ 
        success: false, 
        error: error.message || 'Translation failed' 
      });
    }
  }
}

// Initialize the service
new TranslationService();