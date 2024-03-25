import { TOKENS } from "../tokenizer";
import type { Serializer, Token } from "../types";

export default (): Serializer<number, number> => ({
  // eslint-disable-next-line require-yield
  fromUrl: function* (tokens, index) {
    if (index === null) {
      throw new Error("No default value provided");
    }
    let value = getNumberValue(tokens[index]);
    index++;

    if (index < tokens.length && tokens[index].type === "PROPERTY_SEPERATOR") {
      index++;
      value += `.${getNumberValue(tokens[index])}`;
    }
    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) {
      throw new Error(`${value} is not a valid number`);
    }

    return { index, value: parsedValue };
  },
  toUrl: function (value) {
    return value.toString();
  },
});

function getNumberValue(token: Token) {
  if (token.type === "TEXT") {
    return token.value;
  } else {
    throw new Error(`Cant parse ${TOKENS[token.type]} as a number`);
  }
}
