import puppeteer from 'puppeteer';


function imageScrape(queries) {
    (async () => {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            for (const query of queries) {
                await page.goto(`https://www.google.com/search?tbm=isch&q=${query}`);

                // Scroll to the bottom of the page to load more images
                await page.evaluate(async () => {
                    for (let i = 0; i < 10; i++) {
                        window.scrollBy(0, window.innerHeight);
                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for more images to load
                    }
                });

                // Wait for images to be loaded
                await page.waitForSelector('img');

                // Extract image URLs
                const images = await page.evaluate(() => {
                    const imageElements = document.querySelectorAll('img');
                    const urls = [];
                    imageElements.forEach(img => {
                        const url = img.src;
                        if (url.startsWith('http') && !url.includes('google')) {
                            urls.push(url);
                        }
                    });
                    return urls.slice(0, 3); // Limit to first 3 image URLs
                });

                console.log(`\nResults for query: ${query}`);
                images.forEach((url, index) => {
                    console.log(`Image ${index + 1}: ${url}`);
                });
            }

            await browser.close();

        } catch (err) {
            console.error('An error occurred:', err);
        }
    })();
}

imageScrape(['python programming language logo'])

// sounds.json has more items than cateogory.json