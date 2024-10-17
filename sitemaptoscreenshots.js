#!/usr/bin/env node

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const xml2js = require('xml2js')
const minimist = require('minimist')
const isUrl = require('is-url')

const { performance } = require('perf_hooks')

// Function to process a single URL and take screenshot
async function takeScreenshot(url, browser, outputDir, viewport, cookieButtonId) {
    const page = await browser.newPage()
    await page.setViewport(viewport)

    try {
        console.log(`Taking screenshot of ${url}`)
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 3000 })

        // If cookieButtonId is provided, try to click the cookie button
        if (cookieButtonId) {
            try {
                console.log(`🍪 Checking for cookie button with ID: ${cookieButtonId}`)
                const cookieButton = await page.$(`#${cookieButtonId}`)

                if (cookieButton) {
                    console.log(`🍪 Clicking cookie button with ID: ${cookieButtonId}`)
                    await cookieButton.click()
                    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 3000 })
                    await page.waitForTimeout(1000) // Wait 1 second after clicking to allow page updates
                    console.log(`✅ Cookie consent button clicked`)
                } else {
                    console.warn(`⚠️  Cookie button with ID ${cookieButtonId} not found.`)
                }
            } catch (error) {
                console.warn(`⚠️  Error while interacting with cookie button: ${error.message}`)
            }
        }

        const filename = path.join(outputDir, `${url.replace(/https?:\/\//, '').replace(/\//g, '_')}.png`)
        await page.screenshot({ path: filename, fullPage: true })
        console.log(`✅ Screenshot saved: ${filename}\n\n`)
    } catch (error) {
        console.error(`❌ Error while processing ${url}: ${error.message}`)
    } finally {
        await page.close()
    }
}

// Function to parse sitemap (either from a URL or a local file)
async function parseSitemap(input) {
    let sitemapXml = ''

    if (isUrl(input)) {
        console.log(`🌐 Fetching sitemap from URL: ${input}`)
        const response = await axios.get(input)
        sitemapXml = response.data
    } else {
        console.log(`📂 Reading sitemap from local file: ${input}`)
        sitemapXml = fs.readFileSync(input, 'utf8')
    }

    const parser = new xml2js.Parser()
    const result = await parser.parseStringPromise(sitemapXml)
    const urls = result.urlset.url.map(entry => entry.loc[0])
    return urls
}

// Function to format time in seconds, minutes, and seconds if over a minute
function formatDuration(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60)
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)

    let timeString = `${seconds} seconds`

    if (minutes > 0) {
        timeString = `${minutes} minutes ${timeString}`
    }

    if (hours > 0) {
        timeString = `${hours} hours ${timeString}`
    }

    return timeString
}

// Main function to process the script
async function main(input, resolution = '1280x800', outputDir = 'screenshots', cookieButtonId) {
    const viewport = { width: parseInt(resolution.split('x')[0]), height: parseInt(resolution.split('x')[1]) }

    console.log(`🛠️  Starting the screenshot process...`)

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        console.log(`📁 Creating output directory: ${outputDir}`)
        fs.mkdirSync(outputDir)
    }

    const urls = await parseSitemap(input)
    console.log(`🔗 Found ${urls.length} URLs in the sitemap.`)

    const browser = await puppeteer.launch({ headless: true })
    const startTime = performance.now()

    for (let i = 0; i < urls.length; i++) {
        await takeScreenshot(urls[i], browser, outputDir, viewport, cookieButtonId)
    }

    const endTime = performance.now()
    const duration = endTime - startTime
    console.log(`⏱️ Total time: ${formatDuration(duration)}`)

    await browser.close()
    console.log(`✅ Screenshot process completed!`)
}

// Process command-line arguments
const args = minimist(process.argv.slice(2))

const input = args._[0]
const resolution = args.viewport
const outputDir = args.output || 'screenshots'
const cookieButtonId = args.cookies // New parameter for cookie button ID

if (!input) {
    console.error('❌ Please provide a sitemap URL or file path as the first argument.')
    process.exit(1)
}

main(input, resolution, outputDir, cookieButtonId)
