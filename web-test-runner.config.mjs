import { esbuildPlugin } from "@web/dev-server-esbuild";

const commonjs = fromRollup(rollupVirtual);

export default {
  nodeResolve: true,
  files: "src/**/*.test.tsx",
  plugins: [
    esbuildPlugin({ ts: true, tsx: true, target: "auto", jsxFactory: "plusnew.createElement" }),
  ],
}