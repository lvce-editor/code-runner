import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { Worker, isMainThread, workerData } from 'node:worker_threads'

const context = workerData || (process.argv.includes('--child') ? 'child' : 'main')
console.log(
  JSON.stringify({
    context,
    executable: process.execPath,
    path: Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toLowerCase() === 'path')),
  }),
)
console.log(context, 'where bash:', spawnSync('where.exe', ['bash.exe'], { encoding: 'utf8' }).stdout)
const { spawn } = await import('node-pty')
const output = await new Promise((resolve, reject) => {
  const terminal = spawn('bash.exe', ['--version'], { cwd: process.cwd() })
  let data = ''
  const timeout = setTimeout(() => {
    terminal.kill()
    reject(new Error('PTY diagnostic timed out'))
  }, 10000)
  terminal.onData((chunk) => {
    data += chunk
  })
  terminal.onExit(({ exitCode }) => {
    clearTimeout(timeout)
    resolve({ exitCode, data })
  })
})
console.log(context, 'PTY result:', JSON.stringify(output))
if (isMainThread && context === 'main') {
  await new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), { env: { ...process.env }, workerData: 'worker' })
    worker.on('error', reject)
    worker.on('exit', (code) => (code ? reject(new Error(`worker exit ${code}`)) : resolve()))
  })
  const child = spawnSync(process.execPath, [fileURLToPath(import.meta.url), '--child'], { encoding: 'utf8', env: { ...process.env } })
  console.log('child result:', child.status, child.stdout, child.stderr)
}
