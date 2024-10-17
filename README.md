
# Sitemap to Screenshots

A Node.js script that takes screenshots of URLs listed in a sitemap, either from a URL or a local file, and saves them in a specified directory. The script also handles cookie consent by clicking a provided button (optional).

## Features

- Parse sitemaps (both local files and remote URLs)
- Take full-page screenshots of URLs
- Optionally click a cookie consent button (via its unique ID)
- Save screenshots in a user-defined output folder
- Accept customizable viewport resolution for screenshots
- Logs progress and errors in the terminal for better visibility

## How to Use

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/sitemap-to-screenshot.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the script:
   ```bash
   node sitemap-screenshot.js <URL-of-sitemap>
   ```

###  Parameters

- **input**: Required. The URL of the sitemap or the path to a local sitemap file.
- **--viewport**: Optional. Set the resolution for the screenshots (default: `1280x800`).
- **--output**: Optional. The directory where screenshots will be saved (default: `screenshots`).
- **--cookies**: Optional. The ID of the button to click for cookie consent.

## Example

```bash
node sitemap-screenshot-generator.js https://example.com/sitemap.xml --viewport=1920x1080 --output=./my_screenshots --cookies=cookie-consent-button
```

This will take screenshots of all pages in the provided sitemap with the specified resolution and save them to the `./my-screenshots` folder.

## Dependencies

- `puppeteer`: Used for automating the browser and taking screenshots.
- `axios`: Used for fetching the sitemap from a remote URL.
- `xml2js`: Used for parsing the XML sitemap file.
- `minimist`: Used for parsing command-line arguments.
- `is-url`: Used to check if the input is a valid URL.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
