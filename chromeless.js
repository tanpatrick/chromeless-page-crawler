const parallelLimit = require('async/parallelLimit');
const reduce = require('lodash/reduce');

const Crawler = require('./crawler');
const FirestoreDb = require('./firestore');
const log = require('./logger');

const db = new FirestoreDb('my-collection');

function createCrawlerTasks(baseUrl, urls) {
    return urls.map(url => {
        return async () => {
            const crawler = new Crawler(baseUrl, url);
            await crawler.crawl();
            return {
                url,
                duration: crawler.getNavigationTimings().duration
            };
        };
    });
}

function runnerCallback(error, results) {
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
}

function runCrawler(params) {
    const { baseUrl, urls, limit } = params;
    const tasks = createCrawlerTasks(baseUrl, urls.split(','));

    parallelLimit(tasks, limit, runnerCallback);
}

const args = process.argv.splice(2);

if (args.length === 0) {
    console.log(`
Usage: node chromeless.js ...options
where options:
    baseUrl = protocol://{hostname}:{port}
    limit   = max number of crawlers running in parallel
    urls    = page paths of the pages to crawl

For example
node chromeless.js baseUrl=http://localhost urls=/page-a/,/page-b/ limit=2
`);
    process.exit(0);
}

const params = reduce(
    args,
    (result, value) => {
        const param = value.split('=');
        return {
            ...result,
            [param[0]]: param[1]
        };
    },
    {}
);

runCrawler(params);
