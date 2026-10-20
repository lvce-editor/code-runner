import { activate, registerCommand, runInTerminal } from '@lvce-editor/api'

await activate()
registerCommand({
  id: 'codeRunnerPermissionabsent.run',
  async execute(cwd: string): Promise<void> {
    await runInTerminal({ command: 'node', args: ['-e', 'console.log("permission-bypassed")'], cwd })
  },
})
