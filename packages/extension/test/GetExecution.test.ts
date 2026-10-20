import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { getExecution } from '../src/parts/GetExecution/GetExecution.ts'

for (const extension of ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts', 'sh', 'bash']) {
  test(`selects the runtime and working directory for .${extension}`, () => {
    deepStrictEqual(getExecution(`file:///workspace/test.${extension}`), {
      args: ['--', `/workspace/test.${extension}`],
      command: ['sh', 'bash'].includes(extension) ? 'bash' : 'node',
      cwd: '/workspace/',
    })
  })
}

test('preserves spaces, quotes and shell metacharacters as one process argument', () => {
  const filename = `file name'; $(touch nope) & % #.js`
  deepStrictEqual(getExecution(`file:///workspace/${encodeURIComponent(filename)}`)?.args, ['--', `/workspace/${filename}`])
})

test('handles Windows drive paths without a leading slash', () => {
  deepStrictEqual(getExecution('file:///C:/My%20Project/test.ts'), { args: ['--', 'C:/My Project/test.ts'], command: 'node', cwd: 'C:/My Project/' })
})

for (const uri of [
  'file:///workspace/readme.md',
  'file:///workspace/test.js/',
  'file:///workspace/test.js?query',
  'file:///workspace/test.js#fragment',
  'html:///test.js',
  'remote-ssh://host/test.js',
  'not a uri',
]) {
  test(`does not offer Run for ${uri}`, () => {
    strictEqual(getExecution(uri), undefined)
  })
}
