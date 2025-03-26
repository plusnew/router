import type { schema } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

type Booleanschema<T, U> = schema<
  T | (null extends U ? null : never),
  T | (U extends boolean ? null : never) | (null extends U ? null : never)
>;

export default function <
  T extends boolean = boolean,
  U extends IsAny<T, boolean, T> | null | undefined = undefined,
>(opt?: {
  validate?: (value: boolean) => value is T;
  default?: U;
}): Booleanschema<IsAny<T, boolean, T>, IsAny<U, undefined, U>> {
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
    toUrl: function (value: boolean | null) {
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
    isDefault: function (value) {
      return value === null || (value as boolean) === opt?.default;
    },
  };
}
