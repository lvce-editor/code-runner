import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'code-runner.permission-absent'

export const test: Test = async ({ Command, Extension, FileSystem }) => {
  const root = await FileSystem.getTmpDir({ scheme: 'file' })
  await Extension.addWebExtension(import.meta.resolve('../fixtures/permission-absent'))
  let denied = false
  try {
    await Command.execute('ExtensionHost.executeCommand', 'codeRunnerPermissionabsent.run', root)
  } catch (error) {
    denied = error instanceof Error && error.message.includes('requires the terminal.execute permission')
  }
  if (!denied) throw new Error('Expected an explicit terminal execution permission denial from the bound extension runtime')
}
