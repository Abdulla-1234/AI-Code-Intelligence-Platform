import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { spawn } from 'node:child_process';
import http from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '.output', 'public');
const INTERNAL_PORT = 4500;
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
};

// Start the real Nitro SSR server on an internal port
const child = spawn('node', ['.output/server/index.mjs'], {
  cwd: __dirname,
  env: { ...process.env, PORT: String(INTERNAL_PORT), HOST: '127.0.0.1' },
  stdio: 'inherit',
});

child.on('exit', (code) => {
  console.log('SSR server exited with code', code);
  process.exit(code || 0);
});

// Wait a moment for the child server to boot before accepting traffic
await new Promise((r) => setTimeout(r, 800));

const server = createServer(async (req, res) => {
  // Try to serve as a static file first
  const filePath = join(publicDir, req.url.split('?')[0]);
  try {
    const s = await stat(filePath);
    if (s.isFile()) {
      const ext = extname(filePath);
      const content = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
      return;
    }
  } catch {
    // not a static file — fall through to proxy
  }

  // Proxy everything else to the internal Nitro SSR server
  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: INTERNAL_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );
  req.pipe(proxyReq);
  proxyReq.on('error', (err) => {
    res.writeHead(502);
    res.end('Bad Gateway: ' + err.message);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Wrapper server listening on port ${PORT}, proxying SSR to :${INTERNAL_PORT}`);
});