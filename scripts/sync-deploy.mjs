import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const scriptsDir = import.meta.dirname;
const projectRoot = join(scriptsDir, '..');
const dist = join(projectRoot, 'dist');

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      cpSync(srcPath, destPath);
    }
  }
}

const assetsDir = join(projectRoot, 'assets');
if (statSync(assetsDir).isDirectory()) {
  rmSync(assetsDir, { recursive: true, force: true });
}

copyDir(dist, projectRoot);
rmSync(dist, { recursive: true, force: true });

console.log('Deploy-Artefakte nach mydevweb.de/ synchronisiert.');
