import * as fs from 'fs';
import * as path from 'path';
import { chromium } from 'playwright';
import { parseRSStoHTML, saveHTML } from '../src/parser';

const RSS_URLS = [
  'https://news.yahoo.co.jp/rss/topics/top-picks.xml', // Example RSS feed
];
const OUTPUT_PATH = path.join(__dirname, '../public/index.html');

async function main() {
  const browser = await chromium.launch();
  console.log('Browser launched');
  
  try {
    const page = await browser.newPage();
    console.log('Starting RSS fetch process...');
    
    for (const url of RSS_URLS) {
      console.log(`Fetching RSS from: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        
        const xmlContent = await page.content();
        
        console.log('Parsing RSS content...');
        const html = await parseRSStoHTML(xmlContent);
        
        console.log('Saving HTML...');
        saveHTML(html, OUTPUT_PATH);
        
        console.log('RSS processing completed successfully!');
      } catch (error) {
        console.error(`Error processing RSS from ${url}:`, error);
      }
    }
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
