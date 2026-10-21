import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.open-in-terminal'

export const test: Test = async ({ Command, ContextMenu, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  await Settings.update({ 'terminal.backend': 'mock' })
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.mkdir(`${root}/folder`)
  await Workspace.setUri(root)
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Open in integrated Terminal')
  await expect(Locator('.XtermTerminal')).toBeVisible()
  const states = (await Command.execute('Viewlet.getAllStates')) as Record<string, { cwd?: string }>
  if (!Object.values(states).some((state) => state.cwd === `${root}/folder`)) {
    throw new Error('Expected the existing Explorer action to preserve its folder working directory')
  }
}
