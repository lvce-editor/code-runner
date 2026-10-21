import { exportStatic } from '@lvce-editor/shared-process'
import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import './build.ts'

const root = fileURLToPath(new URL('../../../', import.meta.url))
process.env.PATH_PREFIX = '/code-runner'
const { commitHash } = await exportStatic({ extensionPath: 'packages/extension', testPath: 'packages/e2e', root })
await cp(join(root, '.tmp/dist'), join(root, 'dist', commitHash, 'extensions/builtin.code-runner'), { recursive: true, force: true })
