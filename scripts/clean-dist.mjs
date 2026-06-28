import { unlinkSync } from 'node:fs';
import { join } from 'node:path';

const orphan = join(import.meta.dirname, '..', 'dist', 'favicon.ico');
try {
  unlinkSync(orphan);
} catch {
  // nicht vorhanden oder bereits entfernt
}
