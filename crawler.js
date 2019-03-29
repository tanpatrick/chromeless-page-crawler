const puppeteer = require('puppeteer');

/**
 * Class use to access a given url then generates the page performance timing (e.g. duration how long the page took to load).
 * This wraps some of the puppeteer's basic functionalities.
 *
 * To know more about
 * - puppeteer go to https://github.com/GoogleChrome/puppeteer.
 * - page performance go to https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
 */
class Crawler {
    /**
     * Creates a new instance.
     *
     * @param baseUrl   - base url of the page to access
     * @param url       - path of the page to be access
     */
    constructor(baseUrl, url) {
        this.baseUrl = baseUrl;
        this.url = url;
    }

    async initBrowser() {
        this.browser = await puppeteer.launch({
            args: ['--disable-gpu'],
            ignoreHTTPSErrors: true
        });
    }

    async getPerformance() {
        this.navigationTiming = await this.page.evaluate(_ => {
            const [entry] = performance.getEntriesByType('navigation');
            return entry.toJSON();
        });
    }

    async crawl() {
        await this.initBrowser();

        this.page = await this.browser.newPage();

        await this.page.goto(`${this.baseUrl}${this.url}`, {
            waitUntil: 'load',
            timeout: 0
        });

        await this.getPerformance();
        this.browser.close();
    }

    getNavigationTimings() {
        return this.navigationTiming;
    }
}

module.exports = Crawler;
