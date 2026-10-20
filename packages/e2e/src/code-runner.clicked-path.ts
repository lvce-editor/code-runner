import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.clicked-path'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  await Settings.update({ 'terminal.backend': 'real' })
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.writeFile(`${root}/a file ; $(echo injected) & space.js`, "console.log('clicked-path-output')")
  await FileSystem.writeFile(`${root}/z-other.js`, "console.log('wrong-selected-file')")
  await Workspace.setUri(root)
  await Explorer.focusIndex(1)
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Run')
  await expect(Locator('.XtermTerminal')).toContainText('clicked-path-output')
  await expect(Locator('.XtermTerminal')).not.toContainText('wrong-selected-file')
}
