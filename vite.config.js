import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

// Mantém dist/skargrid.min.css como alias do CSS gerado, para compatibilidade
// com integrações 1.x que referenciam esse nome de arquivo diretamente.
function legacyCssAlias() {
  return {
    name: 'skargrid-legacy-css-alias',
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
  plugins: [legacyCssAlias()],
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
