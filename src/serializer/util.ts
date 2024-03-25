import type { Serializer, Token } from "../types";

export function containerHandler<T>(
  serializer: Serializer<any, T>,
  tokens: Token[],
  index: number | null,
) {
  const done = false;
  const generator = serializer.fromUrl(tokens, index);

  while (done === false) {
    const result = generator.next(index);

    if (result.done === true) {
      if (
        result.value.index < tokens.length &&
        tokens[result.value.index].type === "PROPERTY_SEPERATOR"
      ) {
        throw new Error(`To many properties at ${index}`);
      }
      return result.value;
    } else {
      index = result.value;

      if (index === null) {
        throw new Error("Cant return null in a serializer");
      }

      if (tokens[index].type === "PROPERTY_SEPERATOR") {
        index++;
      } else {
        const result = generator.next(null);
        if (result.done === true) {
          return result.value;
        } else {
          throw new Error(
            "When generator gets null for next, then it has to finish",
          );
        }
      }
    }
  }
  throw new Error("Should not be reachable");
}
