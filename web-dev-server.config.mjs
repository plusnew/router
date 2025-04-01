import { existsSync } from "fs"
import { join } from "path"
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  middleware: [
    function (ctx, next) {
      if (existsSync(join("./", ctx.url)) === false && ctx.headers.accept.includes('text/html')) {
        ctx.url = "index.html";
      }

      return next();
    }
  ]
}