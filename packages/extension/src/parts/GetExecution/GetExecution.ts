export interface Execution {
  readonly args: readonly string[]
  readonly command: string
  readonly cwd: string
}

const filePath = (url: URL): string => {
  const pathname = decodeURIComponent(url.pathname)
  if (pathname.includes('\0')) throw new Error('File paths cannot contain null bytes')
  if (url.hostname && url.hostname !== 'localhost') return `//${url.hostname}${pathname}`
  return /^\/[a-z]:\//i.test(pathname) ? pathname.slice(1) : pathname
}

export const getExecution = (uri: string): Execution | undefined => {
  if (!URL.canParse(uri)) return undefined
  const url = new URL(uri)
  if (url.protocol !== 'file:' || url.search || url.hash || url.pathname.endsWith('/')) return undefined
  const path = filePath(url)
  const command = /\.(?:[cm]?js|[cm]?ts)$/.test(path) ? 'node' : /\.(?:sh|bash)$/.test(path) ? 'bash' : ''
  if (!command) return undefined
  // Windows PTYs look up the exact executable name without adding .exe.
  const executable = /^(?:[a-z]:\/|\/\/)/i.test(path) ? `${command}.exe` : command
  return { args: ['--', path], command: executable, cwd: filePath(new URL('.', url)) }
}
