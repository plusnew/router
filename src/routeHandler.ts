import { object } from "./serializer";
import { containerHandler } from "./serializer/util";
import { Tokenizer } from "./tokenizer";
import { TOKENS } from "./tokenizer";
import type {
  NamespaceTemplate,
  ParameterSpecificationTemplate,
  Route,
  RouteToLinkParameter,
  RouteToParameter,
  toUrlResult,
} from "./types";

export function createRootRoute<T extends ParameterSpecificationTemplate>(
  parameterSpec: T,
): Route<{ "/": T }> {
  return createRoute({
    toUrl: (namespacedParameter) =>
      `${TOKENS.PATH_SEPERATOR}${parameterToUrl(parameterSpec, namespacedParameter[TOKENS.PATH_SEPERATOR])}`,
    // eslint-disable-next-line require-yield
    fromUrl: function (tokenizer) {
      tokenizer.eat({ type: "PATH_SEPERATOR" });

      const result = handleParameter(parameterSpec, tokenizer);

      return {
        [TOKENS.PATH_SEPERATOR]: result,
      };
    },
  });
}

function createRoute<T extends NamespaceTemplate>(routeParser: {
  toUrl: (value: RouteToParameter<T>) => toUrlResult;
  fromUrl: (tokenizer: Tokenizer) => RouteToLinkParameter<T>;
}): Route<T> {
  return {
    createPath(namespacedParameter) {
      return routeParser.toUrl(namespacedParameter) as string;
    },
    map(url, cb) {
      const tokenizer = new Tokenizer(url);

      const result = routeParser.fromUrl(tokenizer);

      return cb({
        hasChildRouteActive: false,
        parameter: result,
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
  tokenizer: Tokenizer,
) {
  let hasValues = true;
  const valueSeperator = tokenizer.lookahead({ type: "VALUE_SEPERATOR" });
  if (valueSeperator === null) {
    hasValues = false;
  } else {
    tokenizer.eat({ type: "VALUE_SEPERATOR" });
  }
  return containerHandler(object(parameterSpecification), tokenizer, hasValues);
}
