# Block Element

🚫 A modern Chrome Extension to block unwanted elements on any website with a point-and-click element picker — no coding required.

## ✨ Features

### Core Features

- **Element Picker** - Click any element on a page to block it instantly
  - Hover highlight with visual outline
  - Click to open a mini confirmation toolbar
  - Shadow DOM toolbar (isolated from page styles)
  - CSS `display: none !important` injection per site
- **Per-Site Rules** - Rules are scoped to each domain
  - Auto-generated CSS selectors (ID → class → path fallback)
  - Optional custom label for each rule
  - Enable / disable individual rules without deleting them
- **Rules Panel** - Manage all rules for the current site
  - Toggle rules on/off with a switch
  - Delete rules with a confirmation dialog
  - Import rules from a JSON file
  - Export rules to a JSON file

### Advanced Features

- **Statistics** - Display blocking statistics
  - Total rules created
  - Number of sites with active rules
  - Rules count for the current domain
  - Date of the last rule created
- **Whitelist Domains** - Exclude specific domains from all blocking
- **Context Menu Integration** - Right-click to activate the element picker for the current tab
- **Dark/Light Theme** - Theme support (Light, Dark, System)
- **Extension Toggle** - Enable or disable the extension globally with a single switch

## 🚀 Installation

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Load Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder from this project

## 💡 How to Use

1. Navigate to any webpage
2. Click the Block Element icon in the toolbar (or right-click → **Block this element**)
3. Hover over elements — they will be highlighted in green
4. Click the element you want to block
5. Confirm in the mini toolbar that appears
6. The element is hidden immediately and on every future visit to that site

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📝 Author

**Made with ❤️ by @jirateep12z**
