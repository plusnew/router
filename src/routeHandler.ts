import { object } from "./serializer";
import { containerHandler, flattenUrlResult } from "./serializer/util";
import { Tokenizer } from "./tokenizer";
import { TOKENS } from "./tokenizer";
import type {
  NamespaceTemplate,
  NamespaceToLinkParameter,
  NamespaceToParameter,
  ParameterSpecificationTemplate,
  Route,
} from "./types";

export function createRootRoute<T extends ParameterSpecificationTemplate>(
  parameterSpec: T,
): Route<{ "/": T }> {
  return createRoute({
    toUrl: (namespacedParameter) =>
      `${TOKENS.PATH_SEPERATOR}${parameterToUrl(parameterSpec, namespacedParameter[TOKENS.PATH_SEPERATOR])}`,
    fromUrl: function (tokenizer) {
      const hasNamespace = tokenizer.lookahead({ type: "TEXT" }) !== null;
      const result = handleParameter(parameterSpec, tokenizer);

      if (hasNamespace === false) {
        tokenizer.eat({ type: "PATH_SEPERATOR" });
      }

      return {
        [TOKENS.PATH_SEPERATOR]: result,
      };
    },
  });
}

function createRoute<T extends NamespaceTemplate>(routeParser: {
  toUrl: (value: NamespaceToLinkParameter<T>) => string;
  fromUrl: (tokenizer: Tokenizer) => NamespaceToParameter<T> | null;
}): Route<T> {
  return {
    createPath(namespacedParameter) {
      return routeParser.toUrl(namespacedParameter) as string;
    },
    map(url, cb) {
      const tokenizer = new Tokenizer(url);
      const result = routeParser.fromUrl(tokenizer);

      if (result === null) {
        return null;
      }

      return cb({
        hasChildRouteActive: tokenizer.done === false,
        parameter: result,
      });
    },
    createChildRoute(namespace, parameterSpec) {
      return createRoute({
        toUrl: (namespacedParameter) => {
          const parentUrl = routeParser.toUrl(namespacedParameter);

          return `${parentUrl === TOKENS.PATH_SEPERATOR ? "" : parentUrl}${TOKENS.PATH_SEPERATOR}${namespace}${parameterToUrl(parameterSpec, namespacedParameter[namespace])}`;
        },
        fromUrl: function (tokenizer) {
          const parentResult = routeParser.fromUrl(tokenizer);

          if (
            parentResult === null ||
            tokenizer.done === true ||
            tokenizer.lookahead({ type: "TEXT", value: namespace }) === null
          ) {
            return null;
          }
          tokenizer.eat({ type: "TEXT", value: namespace });
          const result = handleParameter(parameterSpec, tokenizer);

          tokenizer.eat({ type: "PATH_SEPERATOR" });

          return {
            ...parentResult,
            [namespace]: result,
          };
        },
      });
    },
  };
}

function parameterToUrl(
  parameterSpec: ParameterSpecificationTemplate,
  parameter: object,
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
  const result = containerHandler(
    object(parameterSpecification),
    tokenizer,
    hasValues,
  );

  return result;
}
