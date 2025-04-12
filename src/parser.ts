import * as fs from 'fs';
import * as path from 'path';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

export async function parseRSStoHTML(xmlContent: string): Promise<string> {
  try {
    const feed = await parser.parseString(xmlContent);
    
    let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${feed.title || 'RSS Viewer'}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    header {
      background-color: #4a6da7;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
    }
    .feed-description {
      font-style: italic;
      margin-top: 10px;
      color: #eee;
    }
    .feed-meta {
      font-size: 14px;
      color: #ddd;
      margin-top: 5px;
    }
    .item {
      background-color: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .item-title {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 20px;
    }
    .item-title a {
      color: #4a6da7;
      text-decoration: none;
    }
    .item-title a:hover {
      text-decoration: underline;
    }
    .item-meta {
      font-size: 14px;
      color: #888;
      margin-bottom: 10px;
    }
    .item-content {
      margin-top: 10px;
    }
    .item-image {
      max-width: 100%;
      height: auto;
      margin-top: 10px;
    }
    footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #888;
    }
    .last-updated {
      margin-top: 5px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <header>
    <h1>${feed.title || 'RSS Feed'}</h1>
    ${feed.description ? `<div class="feed-description">${feed.description}</div>` : ''}
    ${feed.link ? `<div class="feed-meta">Source: <a href="${feed.link}" target="_blank">${feed.link}</a></div>` : ''}
  </header>
  <main>`;

    const items = feed.items.slice(0, 10);
    
    items.forEach(item => {
      const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleString('ja-JP') : '';
      const imageUrl = item.media?.$.url || (item.enclosure?.url || '');
      
      html += `
    <article class="item">
      <h2 class="item-title"><a href="${item.link}" target="_blank">${item.title}</a></h2>
      <div class="item-meta">${pubDate}</div>
      ${item.content ? `<div class="item-content">${item.content}</div>` : ''}
      ${item.contentEncoded ? `<div class="item-content">${item.contentEncoded}</div>` : ''}
      ${imageUrl ? `<img class="item-image" src="${imageUrl}" alt="${item.title}">` : ''}
    </article>`;
    });

    html += `
  </main>
  <footer>
    <p>RSS Feed Viewer - Automatically updated via GitHub Actions</p>
    <p class="last-updated">Last updated: ${new Date().toLocaleString('ja-JP')}</p>
  </footer>
</body>
</html>`;

    return html;
  } catch (error) {
    console.error('Error parsing RSS:', error);
    return `
<!DOCTYPE html>
<html>
<head>
  <title>RSS Parser Error</title>
</head>
<body>
  <h1>Error parsing RSS feed</h1>
  <p>${error}</p>
  <p>Last attempt: ${new Date().toLocaleString('ja-JP')}</p>
</body>
</html>`;
  }
}

export function saveHTML(html: string, outputPath: string): void {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    console.log(`HTML saved to ${outputPath}`);
  } catch (error) {
    console.error('Error saving HTML:', error);
    throw error;
  }
}
