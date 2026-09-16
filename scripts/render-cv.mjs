import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sourceUrl = new URL('../cv/resume.html', import.meta.url).href;
const output = fileURLToPath(new URL('../public/cv/Vlad_Ivanov_Resume.pdf', import.meta.url));

if (!existsSync(chrome)) {
  throw new Error(`Google Chrome was not found at ${chrome}. Set CHROME_BIN to its executable path.`);
}

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${output}`,
    sourceUrl,
  ],
  { encoding: 'utf8' },
);

if (result.status !== 0) {
  throw new Error(result.stderr || `Chrome exited with status ${result.status}`);
}

if (!existsSync(output) || statSync(output).size < 10_000) {
  throw new Error('Chrome did not produce a valid CV PDF.');
}

console.log(output);
