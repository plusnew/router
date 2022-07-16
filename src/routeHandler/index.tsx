import type { parameterSpecTemplate, parameterSpecToType } from "../types";

type Route<T> = {
  createUrl: (parameter: T) => string;
  createChildRoute: <U extends string, V extends parameterSpecTemplate>(
    namespace: U,
    parameterSpec: V
  ) => Route<T & { [namespace in U]: parameterSpecToType<V> }>;
  map: <U>(
    url: string,
    map: (state: { isActiveAsParent: boolean; parameter: T }) => U
  ) => U | null;
};

export type RouteToParameter<T extends Route<any>> = T extends Route<infer I>
  ? I
  : never;

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
      createChildRoute: createRouteFactory<
        T & { [namespace in U]: parameterSpecToType<V> }
      >([...parents, [namespace, parameterSpec]]),
      createUrl: (parameters) =>
        allRoutes.reduce(
          (path, [namespace, parameterSpec]) =>
            `${path}${NAMESPACE_DELIMITER}${namespace}${Object.entries(
              (parameters as any)[namespace]
            ).reduce((path, [parameterName, parameterValue]) => {
              for (const serializer of parameterSpec[parameterName]) {
                const result = serializer.toUrl(parameterValue);
                if (result.valid) {
                  if (result.value === null) {
                    return path;
                  } else {
                    return `${path}${PARAMETER_DELIMITER}${parameterName}${PARAMETER_VALUE_DELIMITER}${result.value}`;
                  }
                }
              }
              throw new Error("Could not serialize " + parameterName);
            }, "")}`,
          ""
        ),
      map: function (path, callback) {
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
              while (
                isActive &&
                pathIndex < path.length &&
                path[pathIndex] !== NAMESPACE_DELIMITER &&
                path[pathIndex] === PARAMETER_DELIMITER
              ) {
                pathIndex++;

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
              result[currentRouteNamespace] = {
                ...Object.fromEntries(
                  Object.entries(currentRouteParameterSpec)
                    .filter(
                      ([parameterName, _]) =>
                        parameterName in result[currentRouteNamespace] === false
                    )
                    .map(([parameterName, serializers]) => {
                      for (const serializer of serializers) {
                        const serializerResult = serializer.fromUrl(null);
                        if (serializerResult.valid) {
                          return [parameterName, serializerResult.value];
                        }
                      }
                      isActive = false;
                      return [parameterName, null];
                    })
                ),
                ...result[currentRouteNamespace],
              };
            }
          } else {
            isActive = false;
          }
        }
        if (isActive) {
          return callback({
            isActiveAsParent: pathIndex !== path.length,
            parameter: result,
          });
        } else {
          return null;
        }
      },
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
