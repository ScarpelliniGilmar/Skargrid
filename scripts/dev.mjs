import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const watcher = spawn(npmCmd, ['run', 'watch'], { cwd: root, stdio: 'inherit' });

await import('./dev-server.mjs');

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    watcher.kill();
    process.exit(0);
  });
}
