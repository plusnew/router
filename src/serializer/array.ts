import { fromUrl, toUrl } from "./index";
import type { Serializer } from "../types";

const DELIMITER = ",";

type ArrayType<T> = T extends (infer R)[] ? R : never;
type SerializerType<T> = T extends Serializer<infer R> ? R : never;

export default <T extends Serializer<any>[]>(
  serializers: T
): Serializer<SerializerType<ArrayType<T>>[]> => ({
  displayName: "array",
  fromUrl: (value) => {
    if (value !== null) {
      if (value === "") {
        return {
          valid: true,
          value: [],
        };
      }

      const serializerResults = value
        .split(DELIMITER)
        .map((singleValue) => fromUrl(serializers, singleValue));

      if (serializerResults.every((serializerResult) => serializerResult.valid))
        return {
          valid: true,
          value: serializerResults.map(
            (serializerResult) => (serializerResult as any).value
          ),
        };
    }

    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (Array.isArray(value)) {
      const serializerResults = value.map((singleValue) =>
        toUrl(serializers, singleValue)
      );

      if (serializerResults.every((serializerResult) => serializerResult.valid))
        return {
          valid: true,
          value: serializerResults
            .map((serializerResult) => (serializerResult as any).value)
            .join(DELIMITER),
        };
    }

    return {
      valid: false,
    };
  },
});
