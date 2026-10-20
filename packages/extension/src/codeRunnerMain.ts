import { activate, registerCommand, registerExplorerContextMenuProvider, runInTerminal } from '@lvce-editor/api'
import { getExecution } from './parts/GetExecution/GetExecution.ts'

await activate()

registerCommand({
  id: 'codeRunner.run',
  async execute(uri: string): Promise<void> {
    const execution = getExecution(uri)
    if (!execution) throw new Error('Code Runner supports JavaScript, TypeScript and Bash files on the local filesystem.')
    await runInTerminal(execution)
  },
})

registerExplorerContextMenuProvider({
  id: 'codeRunner',
  provideMenuEntries(context) {
    if (context.isDirectory || !getExecution(context.uri)) return []
    return [{ command: 'codeRunner.run', id: 'run', label: 'Run' }]
  },
})
