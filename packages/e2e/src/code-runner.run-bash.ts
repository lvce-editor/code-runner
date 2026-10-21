import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.run-bash'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  await Settings.update({ 'terminal.backend': 'real' })
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.writeFile(`${root}/example.sh`, "printf 'code-runner-bash-output\\n'")
  await Workspace.setUri(root)
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Run')
  await expect(Locator('.XtermTerminal')).toContainText('code-runner-bash-output')
}
