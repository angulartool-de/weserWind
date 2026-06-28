import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
copyFileSync(join(root, 'index.dev.html'), join(root, 'index.html'));
