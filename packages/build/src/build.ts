import { packageExtension } from '@lvce-editor/package-extension'
import { build } from 'esbuild'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const extension = join(root, 'packages/extension')
await build({
  entryPoints: [join(extension, 'src/codeRunnerMain.ts')],
  outfile: join(extension, 'dist/codeRunnerMain.js'),
  bundle: true,
  format: 'esm',
  external: ['electron', 'node:*'],
  platform: 'browser',
  target: 'esnext',
})
for (const variant of ['absent', 'invalid']) {
  const fixture = join(root, 'packages/e2e/fixtures', `permission-${variant}`)
  await build({
    entryPoints: [join(fixture, 'main.ts')],
    outfile: join(fixture, 'dist/main.js'),
    bundle: true,
    format: 'esm',
    external: ['electron', 'node:*'],
    platform: 'browser',
    target: 'esnext',
  })
}
const out = join(root, '.tmp/dist')
await rm(out, { force: true, recursive: true })
await mkdir(out, { recursive: true })
const manifest = JSON.parse(await readFile(join(extension, 'extension.json'), 'utf8'))
const tag = process.env.GITHUB_REF_NAME
manifest.version = tag?.startsWith('v') ? tag.slice(1) : '0.0.0-dev'
await writeFile(join(out, 'extension.json'), JSON.stringify(manifest, null, 2) + '\n')
await cp(join(extension, 'dist'), join(out, 'dist'), { recursive: true })
await cp(join(root, 'README.md'), join(out, 'README.md'))
await packageExtension({ highestCompression: true, inDir: out, outFile: join(root, 'extension.tar.br') })
