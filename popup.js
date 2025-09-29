// Popup script for Smart Translator
document.addEventListener('DOMContentLoaded', () => {
  // Initialize popup
  initializePopup();
});

function initializePopup() {
  // Check if extension is properly loaded
  checkExtensionStatus();
  
  // Add any interactive features here if needed
  console.log('Smart Translator popup initialized');
}

function checkExtensionStatus() {
  // Query active tab to verify content script is loaded
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      // Extension is active
      updateStatusIndicator(true);
    } else {
      updateStatusIndicator(false);
    }
  });
}

function updateStatusIndicator(isActive) {
  const statusDot = document.querySelector('.status-dot');
  const statusText = statusDot.nextElementSibling;
  
  if (isActive) {
    statusDot.classList.add('active');
    statusText.textContent = 'Extension Active';
  } else {
    statusDot.classList.remove('active');
    statusText.textContent = 'Extension Inactive';
  }
}