import { TOKENS, type Tokenizer } from "../tokenizer";
import type { Serializer } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

export default function <
  T extends string = string,
  U extends "" | null = null,
>(opt?: {
  validate?: (value: string) => value is T;
  default?: U;
}): Serializer<
  IsAny<T, string, T>,
  U extends null ? IsAny<T, string, T> : IsAny<T, string, T> | null
> {
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

      if (opt?.validate && opt.validate(result) === false) {
        throw new Error("Validation failed");
      }

      return result as any;
    },
    toUrl: function (value) {
      if (value === null || value === opt?.default) {
        return null;
      }

      if (opt?.validate && opt.validate(value) === false) {
        throw new Error("Validation failed");
      }

      return encodeURIComponent(value);
    },
  };
}

function getText(tokenizer: Tokenizer) {
  if (tokenizer.lookahead({ type: "TEXT" })) {
    return decodeURIComponent(tokenizer.eat({ type: "TEXT" }).value);
  } else if (tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" })) {
    tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
    return TOKENS.PROPERTY_SEPERATOR;
  }
  return null;
}
