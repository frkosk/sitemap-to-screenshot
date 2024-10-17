const puppeteer = require('puppeteer') // Import puppeteer library
const axios = require('axios') // Import axios for fetching URLs
const xml2js = require('xml2js') // Import xml2js for parsing XML data
const fs = require('fs') // Import filesystem module for file operations
const path = require('path') // Import path module for working with file paths

// Function to fetch and parse sitemap
async function fetchSitemap(url) {
    try {
        const response = await axios.get(url)
        const sitemap = await xml2js.parseStringPromise(response.data)
        const urls = sitemap.urlset.url.map(u => u.loc[0])
        return urls
    } catch (error) {
        console.error('Error fetching sitemap:', error)
        throw error
    }
}

// Function to take screenshot for each URL
async function takeScreenshots(urls, resolution = { width: 1280, height: 800 }, outputDir = './screenshots') {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set the viewport size
    await page.setViewport(resolution)

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
    }

    let screenshotCount = 0
    const startTime = Date.now()

    // Loop through each URL and take a screenshot
    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' })
            const filename = path.join(outputDir, `${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.png`)
            await page.screenshot({ path: filename })
            screenshotCount++
            console.log(`Screenshot saved: ${filename}`)
        } catch (error) {
            console.error(`Failed to capture screenshot for ${url}:`, error)
        }
    }

    const endTime = Date.now()
    console.log(`Total screenshots taken: ${screenshotCount}`)
    console.log(`Total time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`)

    await browser.close()
}

// Main function to run the script
async function main() {
    const args = process.argv.slice(2)
    const sitemapUrl = args[0]
    const width = args[1] ? parseInt(args[1]) : 1280
    const height = args[2] ? parseInt(args[2]) : 800
    const outputDir = args[3] || './screenshots'

    if (!sitemapUrl) {
        console.error('Error: Sitemap URL is required.')
        process.exit(1)
    }

    console.log('Fetching sitemap...')
    const urls = await fetchSitemap(sitemapUrl)
    console.log(`Found ${urls.length} URLs in the sitemap.`)

    console.log('Taking screenshots...')
    await takeScreenshots(urls, { width, height }, outputDir)

    console.log('Screenshots complete.')
}

main()
