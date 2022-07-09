import array from "./array";
import boolean from "./boolean";
import date from "./date";
import number from "./number";
import string from "./string";
import nullSerializer from "./null";

import type { Serializer } from "../types";

export default {
  array,
  boolean,
  date,
  number,
  string,
  null: nullSerializer
};

export function fromUrl<T>(
  serializers: Serializer<T>[],
  value: string | undefined
): { valid: false } | { valid: true; value: T } {
  for (const serializer of serializers) {
    const serializerResult = serializer.fromUrl(value);
    if (serializerResult.valid === true) {
      return serializerResult;
    }
  }

  return {
    valid: false,
  };
}

export function toUrl<T>(
  serializers: Serializer<T>[],
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any
): { valid: false } | { valid: true; value: string | undefined } {
  for (const serializer of serializers) {
    const serializerResult = serializer.toUrl(value);

    if (serializerResult.valid === true) {
      return serializerResult;
    }
  }
  return {
    valid: false,
  };
}
