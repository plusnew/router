import type { parameterSpecToType } from "../types";
import type { parameterSpecTemplate } from "../types";

type Route<T> = {
  parseUrl: (
    url: string
  ) =>
    | { isActive: true; isActiveAsParent: false; parameter: T }
    | { isActive: false; isActiveAsParent: true; parameter: T }
    | { isActive: false; isActiveAsParent: false };

  createUrl: (parameter: T) => string;
  createChildRoute: <U extends string, V extends parameterSpecTemplate>(
    namespace: U,
    parameterSpec: V
  ) => Route<T & { [namespace in U]: parameterSpecToType<V> }>;
};

const NAMESPACE_DELIMITER = "/";
const PARAMETER_DELIMITER = ";";
const PARAMETER_VALUE_DELIMITER = "=";

const createRouteFactory = function <T>(
  parents: [string, parameterSpecTemplate][]
) {
  return function <U extends string, V extends parameterSpecTemplate>(
    namespace: U,
    parameterSpec: V
  ): Route<T & { [namespace in U]: parameterSpecToType<V> }> {
    const allRoutes: typeof parents = [...parents, [namespace, parameterSpec]];
    return {
      parseUrl: (path: string) => {
        const result: any = {};
        let isActive = true;
        let pathIndex = 0;
        for (
          let routeIndex = 0;
          isActive && routeIndex < allRoutes.length;
          routeIndex++
        ) {
          if (path[pathIndex] === NAMESPACE_DELIMITER) {
            pathIndex++;
            const [currentRouteNamespace, currentRouteParameterSpec] =
              allRoutes[routeIndex];
            result[currentRouteNamespace] = {};
            for (
              let routeNamespaceIndex = 0;
              isActive && routeNamespaceIndex < currentRouteNamespace.length;
              routeNamespaceIndex++
            ) {
              if (
                currentRouteNamespace[routeNamespaceIndex] === path[pathIndex]
              ) {
                pathIndex++;
              } else {
                isActive = false;
              }
            }
            if (isActive) {
              if (path[pathIndex] === PARAMETER_DELIMITER) {
                pathIndex++;
                while (
                  isActive &&
                  pathIndex < path.length &&
                  path[pathIndex] !== NAMESPACE_DELIMITER
                ) {
                  let parameterName = "";
                  for (
                    ;
                    path[pathIndex] !== PARAMETER_VALUE_DELIMITER &&
                    pathIndex < path.length;
                    pathIndex++
                  ) {
                    parameterName += path[pathIndex];
                  }
                  if (
                    parameterName in currentRouteParameterSpec &&
                    path[pathIndex] === PARAMETER_VALUE_DELIMITER
                  ) {
                    pathIndex++;
                    let parameterValue = "";
                    for (
                      ;
                      path[pathIndex] !== NAMESPACE_DELIMITER &&
                      path[pathIndex] !== PARAMETER_DELIMITER &&
                      pathIndex < path.length;
                      pathIndex++
                    ) {
                      parameterValue += path[pathIndex];
                    }
                    let isSerialized = false;

                    for (
                      let parameterSpecIndex = 0;
                      isSerialized === false &&
                      parameterSpecIndex <
                        currentRouteParameterSpec[parameterName].length;
                      parameterSpecIndex++
                    ) {
                      const serializerResult =
                        currentRouteParameterSpec[parameterName][
                          parameterSpecIndex
                        ].fromUrl(parameterValue);
                      if (serializerResult.valid) {
                        result[currentRouteNamespace][parameterName] =
                          serializerResult.value;
                        isSerialized = true;
                      }
                    }
                    isActive = isSerialized;
                  } else {
                    isActive = false;
                  }
                }
                if (
                  Object.keys(result[currentRouteNamespace]).length !==
                  Object.keys(currentRouteParameterSpec).length
                ) {
                  isActive = false;
                }
              }
            }
          } else {
            isActive = false;
          }
        }
        if (isActive) {
          return { isActive: true, isActiveAsParent: false, parameter: result };
        } else {
          return { isActive: false, isActiveAsParent: false };
        }
      },
      createChildRoute: createRouteFactory<
        T & { [namespace in U]: parameterSpecToType<V> }
      >([...parents, [namespace, parameterSpec]]),
      createUrl: (_parameter: T) => "",
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
