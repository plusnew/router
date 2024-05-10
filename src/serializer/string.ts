import { TOKENS, type Tokenizer } from "../tokenizer";
import type { Serializer } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

type StringSerializer<T, U> = Serializer<
  T | (null extends U ? null : never),
  T | (U extends T ? null : never) | (null extends U ? null : never)
>;

export default function <
  T extends string = string,
  U extends string | null | undefined = undefined,
>(opt?: {
  validate?: (value: string) => value is T;
  default?: U;
}): StringSerializer<IsAny<T, string, T>, IsAny<U, undefined, U>> {
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
    toUrl: function (value) {
      if (value === null || value === (opt?.default as string | undefined)) {
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
