import type { Tokenizer } from "../tokenizer";
import type { Serializer } from "../types";

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
      const valueSeperator = tokenizer.done
        ? null
        : tokenizer.lookahead({ type: "VALUE_SEPERATOR" });
      if (valueSeperator !== null) {
        throw new Error(`To many properties`);
      }

      return result.value;
    } else {
      if (tokenizer.done) {
        hasValues = false;
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
}
