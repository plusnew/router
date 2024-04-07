import { TOKENS, type Tokenizer } from "../tokenizer";
import type { Serializer } from "../types";

export default function <T extends "" | null = null>(opt?: {
  default?: T;
}): Serializer<string, T extends null ? string : string | null> {
  return {
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === false) {
        if (opt?.default) {
          return opt.default;
        }
        throw new Error("No default value provided");
      }
      let result =
        getText(tokenizer) ??
        (() => {
          throw new Error("Expected text");
        })();

      // eslint-disable-next-line no-constant-condition
      while (tokenizer.done === false) {
        const more = getText(tokenizer);
        if (more === null) {
          break;
        } else {
          result += more;
        }
      }
      return decodeURIComponent(result);
    },
    toUrl: function (value) {
      if (value === null || value === opt?.default) {
        return null;
      }
      return encodeURIComponent(value);
    },
  };
}

function getText(tokenizer: Tokenizer) {
  if (tokenizer.lookahead({ type: "TEXT" })) {
    return tokenizer.eat({ type: "TEXT" }).value;
  } else if (tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" })) {
    tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
    return TOKENS.PROPERTY_SEPERATOR;
  }
  return null;
}
