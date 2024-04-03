import type { Serializer, Token } from "../types";

export function containerHandler<T>(
  serializer: Serializer<any, T>,
  tokens: Token[],
  index: number | null,
) {
  const generator = serializer.fromUrl(tokens, index);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = generator.next(index);
    if (result.done === true) {
      if (
        result.value.index !== null &&
        result.value.index < tokens.length &&
        tokens[result.value.index].type === "VALUE_SEPERATOR"
      ) {
        throw new Error(`To many properties at ${index}`);
      }
      return result.value;
    } else {
      if (result.value < tokens.length) {
        index = result.value;
        if (tokens[index].type === "VALUE_SEPERATOR") {
          if (index + 1 < tokens.length) {
            index++;
          } else {
            throw new Error("url stopped unexpectedly");
          }
        } else {
          const result = generator.next(null);

          if (result.done === true) {
            return result;
          } else {
            throw new Error(
              "When generator gets null for next, then it has to finish",
            );
          }
        }
      }
    }
  }
}
