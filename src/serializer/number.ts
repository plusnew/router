import type { Serializer } from "../types";

type IsAny<T, Then, Else> = (T extends never ? true : false) extends false
  ? Else
  : Then;

export default function <
  T extends number = number,
  U extends number | null = null,
>(opt?: {
  validate?: (value: number) => value is T;
  default?: U;
}): Serializer<
  IsAny<T, number, T>,
  U extends null ? IsAny<T, number, T> : IsAny<T, number, T> | null
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
      let value = tokenizer.eat({ type: "TEXT" }).value;

      if (tokenizer.done === false) {
        const hasDot = tokenizer.lookahead({ type: "PROPERTY_SEPERATOR" });
        if (hasDot !== null) {
          tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
          value += `.${tokenizer.eat({ type: "TEXT" }).value}`;
        }
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
    toUrl: function (value) {
      if (value === null || value === opt?.default) {
        return null;
      }
      if (opt?.validate && opt.validate(value) === false) {
        throw new Error("Validation failed");
      }
      return value.toString();
    },
  };
}
