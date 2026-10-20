# Code Runner

Right-click a JavaScript (`.js`, `.mjs`, `.cjs`), TypeScript (`.ts`, `.mts`, `.cts`)
or Bash (`.sh`, `.bash`) file in Explorer and choose **Run**. Code Runner starts
that file in a fresh integrated terminal, using the file's containing directory.
The terminal keeps the program output after it exits. Missing runtimes and other
startup errors appear in the terminal.

JavaScript and TypeScript use `node` from PATH. TypeScript requires Node 24 or newer
and follows Node's native TypeScript support; this extension does not transpile
TypeScript projects. Bash files require `bash` on PATH, including on Windows.
Only local filesystem resources are supported. Filenames are passed as separate
process arguments and are never interpolated into a shell command.

This extension declares `terminal.execute` in `extension.json`. The permission
is shown in the extension details Security tab before installation.

## Development

Use the Node version in `.nvmrc`, then `npm ci`, `npm test`, `npm run type-check`,
`npm run build`, and `npm run e2e:headless`. `npm run build:static` creates the
GitHub Pages demo. CI follows the language-features-typescript, Prettier and HTML
extension conventions with OS/browser checks, a bundled extension archive and a
Pages deployment after the main-branch matrix passes.
