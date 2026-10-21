declare module '@lvce-editor/shared-process' {
  export const exportStatic: (options: {
    readonly root: string
    readonly extensionPath: string
    readonly testPath: string
  }) => Promise<{ readonly commitHash: string }>
}
