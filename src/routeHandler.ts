import { object } from "./schema";
import { containerHandler, flattenUrlResult, isDefault } from "./schema/util";
import { Tokenizer, state, tokenize } from "./tokenizer";
import { TOKENS } from "./tokenizer";
import type {
  NamespaceTemplate,
  NamespaceToLinkParameter,
  NamespaceToParameter,
  ParameterSpecificationTemplate,
} from "./types";

export function createRootRoute<T extends ParameterSpecificationTemplate>(
  parameterSchema: T,
): Route<{ "/": T }>;
export function createRootRoute<T extends ParameterSpecificationTemplate>(
  segment: string,
  parameterSchema: T,
): Route<{ "/": T }>;
export function createRootRoute<T extends ParameterSpecificationTemplate>(
  segmentOrParameterSchema: string | T,
  parameterSpec?: T,
): Route<{ "/": T }> {
  if (parameterSpec === undefined) {
    return new Route(TOKENS.PATH_SEPERATOR, segmentOrParameterSchema as T);
  }
  return new Route(segmentOrParameterSchema as string, parameterSpec);
}

class Route<T extends NamespaceTemplate> {
  constructor(
    protected namespace: string,
    protected parameterSpec: ParameterSpecificationTemplate,
    protected parentRoute?: Route<any>,
  ) {}
  map<U>(
    url: string,
    cb: (data: {
      parameter: NamespaceToParameter<T>;
      hasChildRouteActive: boolean;
    }) => U,
  ): U | null {
    let isOuterMap = false;
    if (state.index === null) {
      state.index = 0;
      state.tokens = tokenize(url);

      if (
        state.tokens.length === 0 ||
        state.tokens[state.tokens.length - 1].type !== "PATH_SEPERATOR"
      ) {
        state.tokens.push({ type: "PATH_SEPERATOR" });
      }

      isOuterMap = true;
    }

    const tokenizer = new Tokenizer();

    let parameter =
      this.parentRoute === undefined
        ? null
        : this.parentRoute.map(url, ({ parameter }) => parameter);
    let hasChildRouteActive = false;
    let validRoute = this.parentRoute === undefined ? true : parameter !== null;

    if (validRoute) {
      const segmentTokens = tokenize(this.namespace);
      for (const segmentToken of segmentTokens) {
        if (tokenizer.lookahead(segmentToken) === null) {
          validRoute = false;
          break;
        } else {
          tokenizer.eat(segmentToken);
        }
      }

      const hasParameter =
        tokenizer.lookahead({ type: "VALUE_SEPERATOR" }) !== null;

      if (validRoute === true)
        try {
          parameter = {
            ...parameter,
            [this.parentRoute === undefined
              ? TOKENS.PATH_SEPERATOR
              : this.namespace]: handleParameter(this.parameterSpec, tokenizer),
          };
        } catch (error) {
          validRoute = false;
        }

      if (
        validRoute === true &&
        (this.namespace !== TOKENS.PATH_SEPERATOR || hasParameter === true)
      ) {
        if (tokenizer.lookahead({ type: "PATH_SEPERATOR" }) === null) {
          validRoute = false;
        } else {
          tokenizer.eat({ type: "PATH_SEPERATOR" });
        }
      }

      hasChildRouteActive = tokenizer.isDone() === false;
    }

    if (isOuterMap === true) {
      state.index = null;
    }

    return validRoute === true
      ? cb({
          parameter: parameter as NamespaceToParameter<any>,
          hasChildRouteActive: hasChildRouteActive,
        })
      : null;
  }
  createChildRoute<U extends string, V extends ParameterSpecificationTemplate>(
    namespace: U,
    parameterSpec: V,
  ): Route<T & { [namespace in U]: V }> {
    return new Route(namespace, parameterSpec, this);
  }

  createPath(namespacedParameter: NamespaceToLinkParameter<T>): string {
    let path =
      this.parentRoute === undefined
        ? ""
        : this.parentRoute.createPath(namespacedParameter);

    path += this.namespace;

    path += parameterToUrl(
      this.parameterSpec,
      namespacedParameter[
        this.parentRoute === undefined ? TOKENS.PATH_SEPERATOR : this.namespace
      ],
    );

    if (path.endsWith(TOKENS.PATH_SEPERATOR) === false) {
      path += TOKENS.PATH_SEPERATOR;
    }

    return path;
  }
}

function parameterToUrl(
  parameterSpec: ParameterSpecificationTemplate,
  parameter: object,
) {
  return Object.entries(parameter).reduce((accumulator, [name, value]) => {
    if (isDefault(parameterSpec[name], value)) {
      return accumulator;
    }
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
