
# Sitemap to Screenshot

This script automates the process of generating full-page screenshots from URLs listed in a sitemap.xml file.

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

### Optional Parameters

- **Resolution**: You can set the resolution for the screenshots (default: 1280x800):
  ```bash
  node sitemap-screenshot.js <URL-of-sitemap> 1920 1080
  ```

- **Output Directory**: Specify an output folder (default: `screenshots` in the current directory):
  ```bash
  node sitemap-screenshot.js <URL-of-sitemap> 1920 1080 /path/to/output-folder
  ```

## Example

```bash
node sitemap-screenshot.js https://yourwebsite.com/sitemap.xml 1920 1080 ./my-screenshots
```

This will take screenshots of all pages in the provided sitemap with the specified resolution and save them to the `./my-screenshots` folder.

## Dependencies

- **puppeteer**: For automating the browser and taking screenshots.
- **axios**: For fetching the sitemap.xml file.
- **xml2js**: For parsing the sitemap.xml file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
