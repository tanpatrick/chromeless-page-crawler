const parallelLimit = require('async/parallelLimit');

const Crawler = require('./crawler');
const FirestoreDb = require('./firestore');
const log = require('./logger');

const db = new FirestoreDb('my-collection');

function createCrawlerTasks(urls) {
    return urls.map(url => {
        return async () => {
            const crawler = new Crawler(url);
            await crawler.crawl();
            return {
                url,
                duration: crawler.getNavigationTimings().duration
            };
        };
    });
}

function runCrawler() {
    const urls = ['/', '/page-a/', '/page-b/'];
    parallelLimit(createCrawlerTasks(urls), 3, (error, results) => {
        if (error) {
            log(error);
            process.exit(0);
        }

        let ctr = 0;
        results.forEach(async result => {
            const docRef = await db.add(result);
            ctr++;

            if (ctr === results.length) {
                console.log(`all queue has been processed! exiting now...`);
                process.exit(0);
            }
        });
    });
}

runCrawler();
