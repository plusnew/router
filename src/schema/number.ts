import type { schema } from "../types";

export default function <
  T extends number = number,
  U extends T | null | undefined = undefined,
>(opt?: {
  validate?: (value: number) => value is T;
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
      let value = tokenizer.eat({ type: "TEXT" }).value;

      if (tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" }) !== null) {
        tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
        value += `.${tokenizer.eat({ type: "TEXT" }).value}`;
      }
      const parsedValue = Number(value);
      if (Number.isNaN(parsedValue)) {
        throw new Error(`${value} is not a valid number`);
      }

      if (opt?.validate && opt.validate(parsedValue) === false) {
        throw new Error("Validation failed");
      }

      return parsedValue as any;
    },
    toUrl: function (value: number | null) {
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
      return value.toString();
    },
    isEqual: function (a: number | null, b: number) {
      return a === b;
    },
    default: opt?.default,
  };
}
