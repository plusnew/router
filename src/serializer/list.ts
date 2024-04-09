import { TOKENS } from "../tokenizer";
import type {
  InferSerializerToUrl,
  InferSerializerFromUrl,
  Serializer,
} from "../types";
import { containerHandler } from "./util";

export default function <T extends Serializer<any, any>>(opt: {
  entities: T;
  validate?(): null;
}): Serializer<InferSerializerFromUrl<T>[], InferSerializerToUrl<T>[]> {
  return {
    toUrl: function (entities) {
      return `${TOKENS.LIST_OPEN}${entities.map(opt.entities.toUrl).join(TOKENS.LIST_SEPERATOR)}${TOKENS.LIST_CLOSE}`;
    },
    // eslint-disable-next-line require-yield
    fromUrl: function* (tokenizer, hasValues) {
      if (hasValues === null) {
        throw new Error("default not implemented");
      }
      const result: InferSerializerFromUrl<T>[] = [];

      tokenizer.eat({ type: "LIST_OPEN" });

      while (tokenizer.done === false) {
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
