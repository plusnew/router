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
    fromUrl: function* (tokens, index) {
      const result = {} as {
        [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
      };

      while (index !== null) {
        const propertyToken = tokens[index];
        if (propertyToken.type === "TEXT") {
          index++;
          if (
            tokens[index].type === "VALUE_ASSIGNMENT" ||
            tokens[index].type === "PROPERTY_SEPERATOR"
          ) {
            const hasMultipleValues =
              tokens[index].type === "PROPERTY_SEPERATOR";

            index++;
            const propertyGenerator = serializers[propertyToken.value].fromUrl(
              tokens,
              index,
            );
            while (index !== null) {
              const propertyResult = propertyGenerator.next(index);
              if (propertyResult.done === true) {
                index = propertyResult.value.index;
                result[propertyToken.value as keyof T] =
                  propertyResult.value.value;

                break;
              } else if (hasMultipleValues === false) {
                throw new Error("Assignments have to be done after one call");
              } else {
                index = yield propertyResult.value;

                let currentPropertyEnded = false;
                if (index === null) {
                  currentPropertyEnded = true;
                } else {
                  const currentToken = tokens[index];
                  if (currentToken.type === "TEXT") {
                    if (currentToken.value === propertyToken.value) {
                      index++;
                      if (tokens[index].type === "PROPERTY_SEPERATOR") {
                        index++;
                      } else {
                        throw new Error("property seperator expected");
                      }
                    } else {
                      currentPropertyEnded = true;
                    }
                  } else {
                    throw new Error("text expected");
                  }
                }

                if (currentPropertyEnded) {
                  const propertyResult = propertyGenerator.next(null);

                  if (propertyResult.done === true) {
                    result[propertyToken.value as keyof T] =
                      propertyResult.value.value;

                    break;
                  } else {
                    throw new Error(
                      "After null is given, generator has to be done",
                    );
                  }
                }
              }
            }
          }
        } else {
          throw new Error(`Expected property name at ${index}`);
        }

        if (index !== null) {
          if (Object.keys(result).length === serializerEntries.length) {
            break;
          }
          index = yield { index };
        }
      }

      if (index === null) {
        // @TODO implement default handling
        return { value: result, index: null };
      }

      return { value: result, index: index };
    },
  };
};
