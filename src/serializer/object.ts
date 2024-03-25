import type {
  InferSerializerToUrl,
  InferSerializerFromUrl,
  Serializer,
} from "../types";

export default <T extends { [Property: string]: Serializer<any, any> }>(
  properties: T,
): Serializer<
  {
    [PropertyName in keyof T]: InferSerializerToUrl<T[PropertyName]>;
  },
  {
    [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
  }
> => ({
  toUrl: function () {
    return "";
  },
  fromUrl: function* (tokens, index) {
    const result = {} as {
      [PropertyName in keyof T]: InferSerializerFromUrl<T[PropertyName]>;
    };

    while (index !== null && index < tokens.length) {
      const propertyToken = tokens[index];
      if (propertyToken.type === "TEXT") {
        index++;
        if (tokens[index].type === "VALUE_ASSIGNMENT") {
          index++;
          const propertyResult = yield* properties[propertyToken.value].fromUrl(
            tokens,
            index,
          );
          index = propertyResult.index;
          result[propertyToken.value as keyof T] = propertyResult.value;
        }
      } else {
        throw new Error(`Expected property name at ${index}`);
      }
    }

    if (index === null) {
      throw new Error("mep");
    }

    return { value: result, index: index + 1 };
  },
});
