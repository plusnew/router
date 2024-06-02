import type {
  InferSerializerToUrl,
  InferSerializerFromUrl,
  Serializer,
} from "../types";
import { propertyHandler } from "./util";

export default function <
  T extends { [Property: string]: Serializer<any, any> },
>(
  serializers: T,
): Serializer<
  {
    [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
  },
  {
    [PropertyName in keyof T]: InferSerializerToUrl<T[PropertyName]>;
  }
> {
  const serializerEntries = Object.entries(serializers);

  return {
    fromUrl: function* (tokenizer, hasValues) {
      const result = {} as {
        [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
      };

      while (hasValues) {
        const propertyToken = tokenizer.eat({ type: "TEXT" });

        const propertyGenerator = propertyHandler(
          tokenizer,
          serializers[propertyToken.value],
        );

        while (true) {
          const propertyResult = propertyGenerator.next(hasValues);

          if (propertyResult.done === true) {
            result[propertyToken.value as keyof T] = propertyResult.value;
            break;
          } else {
            hasValues = yield;

            if (
              hasValues === false ||
              tokenizer.lookahead(propertyToken) === null
            ) {
              const propertyResult = propertyGenerator.next(false);

              if (propertyResult.done === true) {
                result[propertyToken.value as keyof T] = propertyResult.value;

                break;
              } else {
                throw new Error(
                  "After null is given, generator has to be done",
                );
              }
            } else {
              tokenizer.eat(propertyToken);
            }
          }
        }

        if (hasValues === true) {
          if (Object.keys(result).length === serializerEntries.length) {
            break;
          }
          hasValues = yield;
        }
      }

      if (hasValues === false) {
        // @TODO implement default handling
        for (const [propertyName, serializer] of serializerEntries) {
          if (propertyName in result === false) {
            const propertyGenerator = serializer.fromUrl(tokenizer, false);
            const propertyResult = propertyGenerator.next(false);
            if (propertyResult.done === false) {
              throw new Error("When null given serializer needs to finish");
            }
            result[propertyName as keyof T] = propertyResult.value;
          }
        }
      }

      return result;
    },
    toUrl: function (parameter) {
      return Object.fromEntries(
        serializerEntries.map(([key, serializer]) => {
          return [
            key,
            serializer.isDefault(parameter[key])
              ? null
              : serializer.toUrl(parameter[key]),
          ];
        }),
      );
    },
    isDefault: function (parameter) {
      return serializerEntries.every(([key, serializer]) =>
        serializer.isDefault(parameter[key]),
      );
    },
  };
}
