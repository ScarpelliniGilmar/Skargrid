import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

const virtualEntry = 'virtual:skargrid-implementation';
const resolvedVirtualEntry = `\0${virtualEntry}`;

const sourceFiles = [
  'src/core/skargrid.js',
  'src/features/pagination.js',
  'src/features/sort.js',
  'src/features/selection.js',
  'src/features/filter.js',
  'src/features/select-filter.js',
  'src/features/input-filter.js',
  'src/features/virtualization.js',
  'src/features/columnConfig.js',
  'src/features/export.js',
  'src/features/search.js',
  'src/features/table-header.js',
  'src/features/table-body.js',
  'src/features/top-bar.js',
];

function removeLegacyExports(source) {
  return source
    .replace('export function initColumnConfig', 'function initColumnConfig')
    .replace(/\nif \(typeof window[\s\S]*$/u, '');
}

function legacyCompatibilityEntry() {
  return {
    name: 'skargrid-legacy-compatibility-entry',
    resolveId(id) {
      return id === virtualEntry ? resolvedVirtualEntry : null;
    },
    load(id) {
      if (id !== resolvedVirtualEntry) {
        return null;
      }

      const cssPath = path.resolve('src/css/skargrid.css').replaceAll('\\', '/');
      const sources = sourceFiles.map(file => {
        const source = fs.readFileSync(path.resolve(file), 'utf8');
        return `// ${file}\n${removeLegacyExports(source)}`;
      });

      return `import ${JSON.stringify(cssPath)};\n${sources.join('\n')}\nexport default Skargrid;\n`;
    },
    closeBundle() {
      const css = path.resolve('dist/skargrid.css');
      const legacyCss = path.resolve('dist/skargrid.min.css');
      if (fs.existsSync(css)) {
        fs.copyFileSync(css, legacyCss);
      }
    },
  };
}

export default defineConfig({
  plugins: [legacyCompatibilityEntry()],
  build: {
    lib: {
      entry: path.resolve('src/index.js'),
      name: 'Skargrid',
      formats: ['es', 'cjs', 'iife'],
      fileName: format => ({
        es: 'skargrid.js',
        cjs: 'skargrid.cjs',
        iife: 'skargrid.min.js',
      })[format],
      cssFileName: 'skargrid',
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'default',
      },
    },
  },
});
