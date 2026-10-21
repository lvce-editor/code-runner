import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.missing-runtime'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Settings }) => {
  await Settings.update({ 'terminal.backend': 'real' })
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await Command.execute('Layout.runInTerminal', { command: 'lvce-code-runner-missing-runtime', args: [], cwd: root })
  await expect(Locator('.XtermTerminal .xterm-rows')).toContainText('terminal')
  await expect(Locator('.XtermTerminal .xterm-rows')).toContainText('lvce-code-runner-missing-runtime')
}
