import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import fg from 'fast-glob';
import pug from 'pug';
import autoprefixer from 'autoprefixer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import viteImagemin from 'vite-plugin-imagemin';

const projectRoot = __dirname;
const appDir = path.resolve(projectRoot, 'app');
const viewsDir = path.resolve(appDir, 'views');
const pagesDir = path.resolve(viewsDir, 'pages');
const svgIconsDir = path.resolve(appDir, 'assets/images/svg-icons');

function renderPug(filePath, options = {}) {
  return pug.renderFile(filePath, {
    pretty: true,
    basedir: viewsDir,
    ...options,
  });
}

function pugPagesPlugin() {
  return {
    name: 'pug-pages',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const pathname = req.url.split('?')[0];
        if (pathname !== '/' && !pathname.endsWith('.html')) {
          next();
          return;
        }

        const pageName = pathname === '/' ? 'index' : pathname.replace(/^\/|\.html$/g, '');
        const pagePath = path.resolve(pagesDir, `${pageName}.pug`);

        if (!fs.existsSync(pagePath)) {
          next();
          return;
        }

        const html = renderPug(pagePath, { env: 'development' });
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
      });
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.pug')) {
        server.ws.send({ type: 'full-reload' });
      }
    },
    generateBundle() {
      const pages = fg.sync('**/*.pug', { cwd: pagesDir, absolute: true });
      for (const pagePath of pages) {
        const name = path.basename(pagePath, '.pug');
        const html = renderPug(pagePath, { env: 'production' });
        this.emitFile({ type: 'asset', fileName: `${name}.html`, source: html });
      }
    },
  };
}

function cssProxyPlugin() {
  const cssMap = new Map([
    ['/assets/css/style.css', '/assets/scss/style.scss'],
    ['/assets/css/print.css', '/assets/scss/print.scss'],
  ]);

  return {
    name: 'css-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const pathname = req.url.split('?')[0];
        const source = cssMap.get(pathname);
        if (!source) {
          next();
          return;
        }

        const result = await server.transformRequest(`${source}?direct`);
        if (!result || !result.code) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'text/css');
        res.end(result.code);
      });
    },
  };
}

function svgSpritePlugin() {
  const outputFile = 'assets/images/svg-sprite.svg';

  function buildSprite() {
    if (!fs.existsSync(svgIconsDir)) {
      return '';
    }

    const files = fg.sync('*.svg', { cwd: svgIconsDir, absolute: true });
    if (files.length === 0) {
      return '';
    }

    const symbols = files.map((filePath) => {
      const name = path.basename(filePath, '.svg');
      const raw = fs.readFileSync(filePath, 'utf8');
      const viewBoxMatch = raw.match(/viewBox="([^"]+)"/i);
      const viewBox = viewBoxMatch ? ` viewBox="${viewBoxMatch[1]}"` : '';
      const inner = raw
        .replace(/<\?xml[\s\S]*?\?>/gi, '')
        .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
        .trim();

      return `<symbol id="${name}"${viewBox}>${inner}</symbol>`;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>`;
  }

  return {
    name: 'svg-sprite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const pathname = req.url.split('?')[0];
        if (pathname !== `/${outputFile}`) {
          next();
          return;
        }

        const sprite = buildSprite();
        if (!sprite) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(sprite);
      });
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(svgIconsDir) && file.endsWith('.svg')) {
        server.ws.send({ type: 'full-reload' });
      }
    },
    generateBundle() {
      const sprite = buildSprite();
      if (sprite) {
        this.emitFile({ type: 'asset', fileName: outputFile, source: sprite });
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  root: appDir,
  appType: 'custom',
  server: {
    port: 8000,
    open: false,
  },
  publicDir: false,
  plugins: [
    pugPagesPlugin(),
    cssProxyPlugin(),
    svgSpritePlugin(),
    viteStaticCopy({
      targets: [
        { src: path.resolve(appDir, 'assets/fonts/**/*'), dest: 'assets/fonts' },
        { src: path.resolve(appDir, 'assets/images/**/*'), dest: 'assets/images' },
      ],
    }),
    viteImagemin({
      disable: command !== 'build',
    }),
  ],
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    outDir: path.resolve(projectRoot, 'build'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        app: path.resolve(appDir, 'assets/js/app.js'),
        style: path.resolve(appDir, 'assets/scss/style.scss'),
        print: path.resolve(appDir, 'assets/scss/print.scss'),
      },
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: (assetInfo) => {
          const ext = path.extname(assetInfo.name || '');
          if (ext === '.css') {
            const base = path.basename(assetInfo.name || 'style', ext);
            return `assets/css/${base}.css`;
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
}));
