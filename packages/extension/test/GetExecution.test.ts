import { deepStrictEqual, strictEqual, throws } from 'node:assert/strict'
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
  deepStrictEqual(getExecution('file:///C:/My%20Project/test.ts'), {
    args: ['--', 'C:/My Project/test.ts'],
    command: 'node.exe',
    cwd: 'C:/My Project/',
  })
})

test('selects the Windows Bash executable for drive paths', () => {
  deepStrictEqual(getExecution('file:///C:/My%20Project/test.sh'), {
    args: ['--', 'C:/My Project/test.sh'],
    command: 'bash.exe',
    cwd: 'C:/My Project/',
  })
})

test('selects the Windows executable for UNC paths', () => {
  deepStrictEqual(getExecution('file://server/share/test.js'), {
    args: ['--', '//server/share/test.js'],
    command: 'node.exe',
    cwd: '//server/share/',
  })
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

test('rejects encoded null bytes before offering a process execution', () => {
  throws(() => getExecution('file:///workspace/a%00.js'), /null bytes/)
})
