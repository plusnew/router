export { mapPath, createPath } from "./routeHandler";

export * as schema from "./schema";

import type { InferschemaFromUrl } from "./types";
import { object } from "./schema";

export type RouteToParameter<T extends { [1]: any }> = InferschemaFromUrl<
  ReturnType<typeof object<T>>
>;
