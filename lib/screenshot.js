import puppeteer from 'puppeteer';

export async function takeScreenshot(url) {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
        const buffer = await page.screenshot({ fullPage: true });
        return buffer;
    } catch (error) {
        console.error(error);
    } finally {
        if (browser) {
            await browser.close();    
        }        
    }
}
