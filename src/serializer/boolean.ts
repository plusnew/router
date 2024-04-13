import type { Serializer } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

type BooleanSerializer<T, U> = Serializer<
  T | (null extends U ? null : never),
  T | (U extends T ? null : never) | (null extends U ? null : never)
>;

export default function <
  T extends boolean = boolean,
  U extends boolean | null | undefined = undefined,
>(opt?: {
  validate?: (value: boolean) => value is T;
  default?: U;
}): BooleanSerializer<IsAny<T, boolean, T>, IsAny<U, undefined, U>> {
  return {
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === false) {
        if (opt?.default !== undefined) {
          return opt.default;
        }
        throw new Error("No default value provided");
      }
      let result: boolean;
      if (tokenizer.lookahead({ type: "TEXT", value: "true" }) === null) {
        tokenizer.eat({ type: "TEXT", value: "false" });
        result = false;
      } else {
        tokenizer.eat({ type: "TEXT", value: "true" });
        result = true;
      }

      if (opt?.validate && opt.validate(result) === false) {
        throw new Error("Validation failed");
      }

      return result as any;
    },
    toUrl: function (value) {
      if (value === null || value === (opt?.default as boolean | undefined)) {
        return null;
      }

      if (opt?.validate && opt.validate(value) === false) {
        throw new Error("Validation failed");
      }

      return encodeURIComponent(value);
    },
  };
}
