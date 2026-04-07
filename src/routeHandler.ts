import { object } from "./schema";
import { containerHandler, flattenUrlResult, isDefault } from "./schema/util";
import { Tokenizer, TOKENS } from "./tokenizer";
import type {
  NamespaceToLinkParameter,
  NamespaceToParameter,
  ParameterSpecificationTemplate,
} from "./types";

export function createPath<T extends ParameterSpecificationTemplate>(
  namespace: string,
  parameterSpec: T,
  parameter: NamespaceToLinkParameter<T>,
) {
  return `${TOKENS.PATH_SEPERATOR}${namespace}${Object.entries(
    parameter,
  ).reduce((accumulator, [name, value]) => {
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
  }, "")}`;
}

export function mapPath<T extends ParameterSpecificationTemplate, U>(
  namespace: string,
  parameterSpec: T,
  path: string,
  cb: (parameter: NamespaceToParameter<T>, rest: string | null) => U,
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
