import browserContext from "./context/browser";
import routeContext from "./context/route";

export { createRoute } from "./routeHandler";
export { default as serializer } from "./serializer";

export const BrowserProvider = browserContext.Provider;
export const StaticProvider = routeContext.Provider;
export const UrlConsumer = routeContext.Consumer;
