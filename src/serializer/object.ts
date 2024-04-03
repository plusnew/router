import type {
  InferSerializerToUrl,
  InferSerializerFromUrl,
  Serializer,
} from "../types";

export default <T extends { [Property: string]: Serializer<any, any> }>(
  serializers: T,
): Serializer<
  {
    [PropertyName in keyof T]: InferSerializerToUrl<T[PropertyName]>;
  },
  {
    [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
  }
> => {
  const serializerEntries = Object.entries(serializers);
  return {
    toUrl: function (parameter) {
      return Object.fromEntries(
        serializerEntries.map(([key, serializer]) => [
          key,
          serializer.toUrl(parameter[key]),
        ]),
      );
    },
    fromUrl: function* (tokenizer, hasValues) {
      const result = {} as {
        [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
      };

      while (hasValues) {
        const propertyToken = tokenizer.eat({ type: "TEXT" });

        const propertySeperator = tokenizer.lookahead({
          type: "PROPERTY_SEPERATOR",
        });

        const hasMultipleValues = propertySeperator !== null;
        if (hasMultipleValues) {
          tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
        } else {
          tokenizer.eat({ type: "VALUE_ASSIGNMENT" });
        }

        const propertyGenerator = serializers[propertyToken.value].fromUrl(
          tokenizer,
          true,
        );

        while (true) {
          const propertyResult = propertyGenerator.next(hasValues);

          if (propertyResult.done === true) {
            result[propertyToken.value as keyof T] = propertyResult.value;

            break;
          } else if (hasMultipleValues === false) {
            throw new Error("Assignments have to be done after one call");
          } else {
            hasValues = yield;
            const nextProperty = tokenizer.lookahead(propertyToken);

            if (nextProperty === null) {
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
              tokenizer.eat({ type: "PROPERTY_SEPERATOR" });
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
        return result;
      }

      return result;
    },
  };
};
