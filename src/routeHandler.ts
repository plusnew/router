import { object } from "./serializer";
import { containerHandler } from "./serializer/util";
import { TOKENS, tokenize } from "./tokenizer";
import type {
  NamespaceTemplate,
  ParameterSpecificationTemplate,
  Route,
  RouteToLinkParameter,
  RouteToParameter,
  Serializer,
  Token,
  toUrlResult,
} from "./types";

export function createRootRoute<T extends ParameterSpecificationTemplate>(
  parameterSpec: T,
): Route<{ "/": T }> {
  return createRoute({
    toUrl: (namespacedParameter) =>
      `${TOKENS.PATH_SEPERATOR}${parameterToUrl(parameterSpec, namespacedParameter[TOKENS.PATH_SEPERATOR])}`,
    // eslint-disable-next-line require-yield
    fromUrl: function (tokens, index) {
      if (index === null) {
        throw new Error("Cant handle null index");
      } else if (tokens[index].type === "PATH_SEPERATOR") {
        index++;

        const hasValueSeperator = tokens[index].type === "VALUE_SEPERATOR";
        const result = handleParameter(parameterSpec, tokens, index);

        return {
          index: hasValueSeperator ? result.index : 0,
          value: {
            [TOKENS.PATH_SEPERATOR]: result.value,
          },
        };
      } else {
        throw new Error(
          `Parsing route has to start with ${TOKENS.PATH_SEPERATOR}`,
        );
      }
    },
  });
}

function createRoute<T extends NamespaceTemplate>(routeParser: {
  toUrl: (value: RouteToParameter<T>) => toUrlResult;
  fromUrl: (
    tokens: Token[],
    index: number | null,
  ) => { index: number | null; value: RouteToLinkParameter<T> };
}): Route<T> {
  return {
    createPath(namespacedParameter) {
      return routeParser.toUrl(namespacedParameter) as string;
    },
    map(url, cb) {
      const tokens = tokenize(url);

      const index = 0;

      const result = routeParser.fromUrl(tokens, index);

      return cb({
        hasChildRouteActive: false,
        parameter: result.value,
      });

      // while (index < tokens.length) {
      //   if (tokens[index].type === "PATH_SEPERATOR") {
      //     const [namespace, parameterSpec] = routeValues[routeIndex];
      //     if (routeIndex === 0) {
      //       if (tokens[index + 1].type !== "VALUE_SEPERATOR") {
      //         routeIndex++;
      //         continue;
      //       }
      //     } else {
      //       index++;
      //       const namespaceToken = tokens[index];
      //       if (namespaceToken.type === "TEXT") {
      //         if (namespaceToken.value !== namespace) {
      //           return null;
      //         }
      //         index++;
      //       } else {
      //         throw new Error("Didnt expect anything but text here");
      //       }
      //     }
      //   } else {
      //     throw new Error(`Didn't expect this character here ${index} ${url}`);
      //   }
      // }

      return null;
    },
    createChildRoute(namespace, parameterSpec) {
      return createRoute({ ...routes, [namespace]: parameterSpec });
    },
  };
}

function parameterToUrl(
  parameterSpec: ParameterSpecificationTemplate,
  parameter: {},
) {
  return Object.entries(parameter).reduce((accumulator, [name, value]) => {
    const urlResult = parameterSpec[name].toUrl(value);
    if (urlResult === "") {
      return accumulator;
    }
    return `${accumulator}${flattenUrlResult(name, urlResult).reduce(
      (accumulator, [name, value]) =>
        `${accumulator}${TOKENS.VALUE_SEPERATOR}${name}${TOKENS.VALUE_ASSIGNMENT}${value}`,
      "",
    )}`;
  }, "");
}

function flattenUrlResult(
  name: string,
  urlResult: toUrlResult,
): [string, string][] {
  if (typeof urlResult === "string") {
    return [[name, urlResult]];
  }
  return Object.entries(urlResult).flatMap(([propertyName, value]) =>
    flattenUrlResult(propertyName, value).map(
      ([nestedName, value]): [string, string] => [
        `${name}${TOKENS.PROPERTY_SEPERATOR}${nestedName}`,
        value,
      ],
    ),
  );
}

function handleParameter<T extends ParameterSpecificationTemplate>(
  parameterSpecification: T,
  tokens: Token[],
  index: number,
) {
  return containerHandler(
    object(parameterSpecification),
    tokens,
    tokens[index].type === "VALUE_SEPERATOR" ? index + 1 : null,
  );
}
