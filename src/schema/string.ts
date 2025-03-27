import { TOKENS, type Tokenizer } from "../tokenizer";
import type { schema } from "../types";

export default function <
  T extends string = string,
  U extends T | null | undefined = undefined,
>(opt?: {
  validate?: (value: string) => value is T;
  default?: U;
}): NoInfer<
  schema<
    T | (null extends U ? null : never),
    T | (U extends T ? null : never) | (U extends null ? null : never)
  >
> {
  return {
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === false) {
        if (opt?.default !== undefined) {
          return opt.default;
        }
        throw new Error("No default value provided");
      }
      let result = getText(tokenizer) ?? "";

      while (tokenizer.isDone() === false) {
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
    toUrl: function (value: string | null) {
      if (value === null) {
        if (opt?.default === undefined) {
          throw new Error("No default value provided");
        }

        if (opt.default === null) {
          return null;
        }
        value = opt.default;
      }

      if (opt?.validate && opt.validate(value) === false) {
        throw new Error("Validation failed");
      }

      return encodeURIComponent(value);
    },
    isEqual: function (value) {
      return value === null || (value as string) === opt?.default;
    },
    default: opt?.default,
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
