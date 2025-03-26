import type { schema } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

type Numberschema<T, U> = schema<
  T | (null extends U ? null : never),
  T | (U extends T ? null : never) | (null extends U ? null : never)
>;

export default function <
  T extends number = number,
  U extends IsAny<T, number, T> | null | undefined = undefined,
>(opt?: {
  validate?: (value: number) => value is T;
  default?: U;
}): Numberschema<IsAny<T, number, T>, IsAny<U, undefined, U>> {
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
    isDefault: function (value) {
      return value === null || (value as number) === opt?.default;
    },
  };
}
