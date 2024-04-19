import { TOKENS, type Tokenizer } from "../tokenizer";
import type { InferSerializerFromUrl, Serializer, toUrlResult } from "../types";

export function containerHandler<T>(
  serializer: Serializer<any, T>,
  tokenizer: Tokenizer,
  hasValues: boolean,
) {
  const generator = serializer.fromUrl(tokenizer, hasValues);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = generator.next(hasValues);
    if (result.done === true) {
      const valueSeperator = tokenizer.lookahead({ type: "VALUE_SEPERATOR" });
      if (valueSeperator !== null) {
        throw new Error(`To many properties`);
      }

      return result.value;
    } else {
      const valueSeperator = tokenizer.lookahead({ type: "VALUE_SEPERATOR" });

      if (valueSeperator === null) {
        hasValues = false;
      } else {
        tokenizer.eat({ type: "VALUE_SEPERATOR" });
      }

      const result = generator.next(hasValues);

      if (result.done === true) {
        return result.value;
      } else if (hasValues === false) {
        throw new Error(
          "When generator gets null for next, then it has to finish",
        );
      } else {
        tokenizer.eat({ type: "VALUE_SEPERATOR" });
      }
    }
  }
}

export function flattenUrlResult(
  name: string,
  urlResult: toUrlResult,
): [string, string][] {
  if (urlResult === null) {
    return [];
  }
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

export function* propertyHandler<T extends Serializer<any, any>>(
  tokenizer: Tokenizer,
  serializer: T,
): Generator<undefined, InferSerializerFromUrl<T>, boolean> {
  let hasValueAssignment = false;
  let hasNestedProperty = false;

  if (tokenizer.lookahead({ type: "VALUE_ASSIGNMENT" }) !== null) {
    hasValueAssignment = true;
    tokenizer.eat({ type: "VALUE_ASSIGNMENT" });
  } else if (tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" }) !== null) {
    hasNestedProperty = true;
    tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
  }

  let hasValues = hasValueAssignment || hasNestedProperty;

  const generator = serializer.fromUrl(tokenizer, hasValues);

  while (true) {
    const result = generator.next(hasValues);

    if (result.done === true) {
      return result.value;
    } else {
      if (hasValues === true) {
        hasValues = yield;
        if (hasValues === false) {
          const result = generator.next(false);
          if (result.done === true) {
            return result.value;
          } else {
            throw new Error("Serializer needed to stop when it got no values");
          }
        } else {
          tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
        }
      } else {
        throw new Error("Serializer needed to stop when it got no values");
      }
    }
  }
}
