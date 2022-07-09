import type { parameterSpecToType, parameterSpecTemplate } from "../types";

type Route<T> = {
  parseUrl: (
    url: string
  ) =>
    | { isActive: true; isActiveAsParent: false; parameter: T }
    | { isActive: false; isActiveAsParent: true; parameter: T }
    | { isActive: false; isActiveAsParent: false };

  createChildRoute: <U extends string, V extends parameterSpecTemplate>(
    namespace: U,
    parameterSpec: V
  ) => Route<T & { [namespace in U]: parameterSpecToType<V> }>;
};

const createRouteFactory = function <T>(
  parents: [string, parameterSpecTemplate][]
) {
  return function <U extends string, V extends parameterSpecTemplate>(
    namespace: U,
    parameterSpec: V
  ): Route<T & { [namespace in U]: parameterSpecToType<V> }> {
    return {
      parseUrl: () => ({ isActive: false, isActiveAsParent: false }),
      createChildRoute: createRouteFactory<
        T & { [namespace in U]: parameterSpecToType<V> }
      >([...parents, [namespace, parameterSpec]]),
    };
  };
};
export const createRoute = function <
  T extends string,
  U extends parameterSpecTemplate
>(
  namespace: T,
  parameterSpec: U
): Route<{ [namespace in T]: parameterSpecToType<U> }> {
  return createRouteFactory([])(namespace, parameterSpec);
};
