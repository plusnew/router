import routeContext from "./context/route";
export { createRoute } from "./routeHandler";
export type { RouteToParameter } from "./routeHandler";
export { default as serializer } from "./serializer";

export const StaticProvider = routeContext.Provider;
export const UrlConsumer = routeContext.Consumer;
