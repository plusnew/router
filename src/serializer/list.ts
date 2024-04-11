import { TOKENS } from "../tokenizer";
import type {
  InferSerializerToUrl,
  InferSerializerFromUrl,
  Serializer,
} from "../types";
import { containerHandler, flattenUrlResult } from "./util";

export default function <T extends Serializer<any, any>>(opt: {
  entities: T;
  validate?(): null;
}): Serializer<InferSerializerFromUrl<T>[], InferSerializerToUrl<T>[]> {
  return {
    toUrl: function (entities) {
      return `${TOKENS.LIST_OPEN}${entities
        .map(opt.entities.toUrl)
        .reduce((accumulator: string, currentValue, index, list) => {
          let result = "";
          if (currentValue === null) {
            result = "";
          } else if (typeof currentValue === "string") {
            result = currentValue;
          } else {
            result = Object.entries(currentValue)
              .map(([key, value]) =>
                flattenUrlResult(key, value).map(
                  ([key, value]) => `${key}${TOKENS.VALUE_ASSIGNMENT}${value}`,
                ),
              )
              .join(TOKENS.VALUE_SEPERATOR);
          }

          return `${accumulator}${result}${result === "" || index + 1 < list.length ? TOKENS.LIST_SEPERATOR : ""}`;
        }, "")}${TOKENS.LIST_CLOSE}`;
    },
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === null) {
        throw new Error("default not implemented");
      }
      const result: InferSerializerFromUrl<T>[] = [];

      tokenizer.eat({ type: "LIST_OPEN" });

      while (
        tokenizer.done === false &&
        tokenizer.lookahead({ type: "LIST_CLOSE" }) === null
      ) {
        let hasValues = true;
        if (tokenizer.lookahead({ type: "LIST_SEPERATOR" }) !== null) {
          tokenizer.eat({ type: "LIST_SEPERATOR" });
          hasValues = false;
        }
        result.push(containerHandler(opt.entities, tokenizer, hasValues));

        if (tokenizer.lookahead({ type: "LIST_SEPERATOR" }) === null) {
          break;
        } else {
          tokenizer.eat({ type: "LIST_SEPERATOR" });
        }
      }

      tokenizer.eat({ type: "LIST_CLOSE" });

      return result;
    },
  };
}
