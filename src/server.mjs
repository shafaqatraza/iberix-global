// Minimal SPA server — zero dependencies, uses Node.js built-ins.
// Serves static files from dist/ with SPA fallback for client-side routing.
// Usage: node src/server.mjs --port 3000
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const PORT = process.argv.includes('--port')
  ? process.argv[process.argv.indexOf('--port') + 1]
  : process.env.PORT || 3000;

// Find dist/ (project root or src/)
let DIST = join(process.cwd(), 'dist');
if (!existsSync(DIST)) DIST = join(process.cwd(), 'src', 'dist');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

async function serve(req, res) {
  let path = normalize(join(DIST, req.url.split('?')[0]));
  if (!path.startsWith(DIST)) path = DIST; // prevent traversal

  try {
    const s = await stat(path);
    if (s.isDirectory()) path = join(path, 'index.html');
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    // SPA fallback
    try {
      const data = await readFile(join(DIST, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found. Run: npm run build');
    }
  }
}

createServer(serve).listen(PORT, () => {
  console.log(`Iberix Command running on http://localhost:${PORT}`);
});