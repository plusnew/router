import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  files: "test/**/*.test.ts",
  plugins: [esbuildPlugin({ ts: true })],
  appIndex: "index.html"
}