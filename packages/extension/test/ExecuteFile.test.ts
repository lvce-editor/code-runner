import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { pathToFileURL } from 'node:url'
import { strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { getExecution } from '../src/parts/GetExecution/GetExecution.ts'

const run = promisify(execFile)
for (const [extension, content] of [
  ['js', "console.log('javascript-output')"],
  ['ts', "const message: string = 'typescript-output'; console.log(message)"],
  ['sh', "printf 'bash-output\\n'"],
] as const) {
  test(`executes .${extension} with spaces and shell metacharacters in its path`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'code runner '))
    try {
      const filename = join(directory, `file name ; echo injected & test.${extension}`)
      await writeFile(filename, content)
      const execution = getExecution(pathToFileURL(filename).href)
      if (!execution) throw new Error('Expected a supported file execution')
      const { stdout } = await run(execution.command, [...execution.args], { cwd: execution.cwd })
      strictEqual(stdout.trim(), extension === 'js' ? 'javascript-output' : extension === 'ts' ? 'typescript-output' : 'bash-output')
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  })
}
