import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.unsupported'

export const test: Test = async ({ expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.mkdir(`${root}/folder.js`)
  await FileSystem.writeFile(`${root}/readme.md`, 'hello')
  await Workspace.setUri(root)
  await Explorer.openContextMenu(0)
  await expect(Locator('.Menu').locator('text=Run')).toHaveCount(0)
  await KeyBoard.press('Escape')
  await Explorer.openContextMenu(1)
  await expect(Locator('.Menu').locator('text=Run')).toHaveCount(0)
}
