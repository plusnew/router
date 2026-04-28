import { object } from "./schema";
import { containerHandler, flattenUrlResult } from "./schema/util";
import { Tokenizer, TOKENS } from "./tokenizer";
import type {
  InferschemaToUrl,
  InferschemaFromUrl,
  ParameterSpecificationTemplate,
  toUrlResult,
} from "./types";

export function createPath<T extends ParameterSpecificationTemplate>(
  namespace: string,
  parameterSpec: T,
  parameter: InferschemaToUrl<ReturnType<typeof object<T>>>,
) {
  const parameterUrl = object(parameterSpec).toUrl(parameter as any);

  return `${TOKENS.PATH_SEPERATOR}${namespace}${Object.entries(
    parameterUrl as { [parameter: string]: toUrlResult },
  ).reduce((accumulator, [name, value]) => {
    if (value === "" || value === null) {
      return accumulator;
    }
    return `${accumulator}${flattenUrlResult(name, value).reduce(
      (accumulator, [name, value]) =>
        `${accumulator}${TOKENS.VALUE_SEPERATOR}${name}${TOKENS.VALUE_ASSIGNMENT}${value}`,
      "",
    )}`;
  }, "")}`;
}

export function mapPath<T extends ParameterSpecificationTemplate, U>(
  namespace: string,
  parameterSpec: T,
  path: string,
  cb: (
    parameter: InferschemaFromUrl<ReturnType<typeof object<T>>>,
    rest: string | null,
  ) => U,
): U | null {
  const tokenizer = new Tokenizer(path);

  tokenizer.eat({ type: "PATH_SEPERATOR" });

  const namespaceTokenizer = new Tokenizer(namespace);
  let matches = true;

  while (namespaceTokenizer.currentToken !== null && matches === true) {
    matches = tokenizer.lookahead(namespaceTokenizer.currentToken) !== null;
    if (matches === true) {
      tokenizer.eat(namespaceTokenizer.currentToken);
      namespaceTokenizer.eat(namespaceTokenizer.currentToken);
    }
  }

  if (matches === true) {
    const hasParameter =
      tokenizer.lookahead({ type: "VALUE_SEPERATOR" }) !== null;

    if (hasParameter) {
      tokenizer.eat({ type: "VALUE_SEPERATOR" });
    }

    let result;
    try {
      result = containerHandler(object(parameterSpec), tokenizer, hasParameter);
    } catch (error) {
      matches = false;
    }

    if (matches === true) {
      return cb(
        result,
        tokenizer.currentToken === null
          ? null
          : tokenizer.path.slice(tokenizer.index - 1),
      );
    }
  }

  return null;
}
