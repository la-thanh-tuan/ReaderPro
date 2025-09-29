# Reader Pro Chrome Extension

## Overview
A Chrome extension that provides instant text translation using an existing backend API. Features Metro-style UI design with smooth animations and popup interface.

## Recent Changes (September 29, 2025)
- Created complete Chrome extension structure with manifest v3
- Implemented text selection detection and automatic popup display
- Built Metro-style UI with modern design principles
- Added API integration with translation endpoint
- Created development server for testing and installation

## User Preferences
- Requested Metro-style UI/UX design
- Vietnamese as default target language
- Clean, modern interface with popup display
- Text selection-based translation trigger

## Project Architecture

### Extension Structure
```
├── manifest.json           # Chrome extension configuration (v3)
├── content.js/css          # Content script for text selection
├── background.js           # Service worker for API communication
├── popup.html/css/js       # Extension popup interface
├── icons/                  # Extension icons (16px, 48px, 128px)
└── server.js              # Development server
```

### Key Components

**Content Script (content.js)**
- Detects text selection on webpages
- Shows/hides translation popup
- Handles user interactions (ESC key, click outside)
- Manages popup positioning and responsive layout

**Background Service Worker (background.js)**
- Handles API communication with translation endpoint
- Manages Chrome extension lifecycle events
- Processes translation requests from content script

**Popup Interface**
- Metro-style design with Segoe UI font family
- Extension information and usage instructions
- Status indicator for extension activity

**Translation API Integration**
- Endpoint: `https://x142xfvk-7027.asse.devtunnels.ms/api/Translation/translate`
- Default target language: Vietnamese (vi)
- Auto-detection of source language
- Error handling and retry logic

### Metro Design System
- Color scheme: Blue (#0078d4) primary, dark backgrounds for popups
- Typography: Segoe UI font family, various weights and sizes
- Animations: Smooth fade-in/scale transitions, pulse effects
- Layout: Clean grids, proper spacing, subtle shadows

## API Configuration
- Backend API URL: `https://x142xfvk-7027.asse.devtunnels.ms/api`
- Translation endpoint: `/Translation/translate`
- Request format: JSON with text, targetLanguage, sourceLanguage
- Response includes original text, translation, and metadata

## Development Workflow
1. Development server runs on port 5000
2. Serves installation instructions and extension files
3. Manual installation required in Chrome via chrome://extensions/
4. Enable Developer mode and "Load unpacked" from project directory

## Installation Steps
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" toggle
3. Click "Load unpacked" button
4. Select the project directory containing manifest.json
5. Extension appears in extensions list and is ready to use

## Usage
1. Navigate to any webpage
2. Select text with mouse/cursor
3. Translation popup appears automatically above selection
4. View original and translated text
5. Click elsewhere or press ESC to close popup

## Technical Features
- Cross-origin API requests with proper CORS handling
- Responsive popup positioning (viewport awareness)
- Text escaping for security
- Loading states and error handling
- Keyboard shortcuts (ESC to close)
- Click-outside detection for UX