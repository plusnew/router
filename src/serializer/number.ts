import type { Serializer } from "../types";

export default (): Serializer<number, number> => ({
  // eslint-disable-next-line require-yield
  fromUrl: function* (tokenizer, hasValues) {
    if (hasValues === false) {
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

    return parsedValue;
  },
  toUrl: function (value) {
    return value.toString();
  },
});
