import { TOKENS, type Tokenizer } from "../tokenizer";
import type { schema } from "../types";

export default function <
  T extends Date = Date,
  U extends T | null | undefined = undefined,
>(opt?: {
  validate?: (value: Date) => value is T;
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
      const result = new Date(getText(tokenizer));

      if (isNaN(result.getTime()) === true) {
        throw new Error("Not a valid date");
      }

      if (opt?.validate && opt.validate(result) === false) {
        throw new Error("Validation failed");
      }

      return result as any;
    },
    toUrl: function (value: Date | null) {
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

      return encodeURIComponent(value.toISOString());
    },
    isEqual: function (a: Date, b: Date) {
      return a.getTime() === b.getTime();
    },
    default: opt?.default,
  };
}

function getText(tokenizer: Tokenizer) {
  let result = tokenizer.eat({ type: "TEXT" }).value;

  while (tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" }) !== null) {
    tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
    result += `${TOKENS.PROPERTY_SEPERATOR}${tokenizer.eat({ type: "TEXT" }).value}`;
  }
  return decodeURIComponent(result);
}
