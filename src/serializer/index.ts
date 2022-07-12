import array from "./array";
import boolean from "./boolean";
import date from "./date";
import nullSerializer from "./null";
import number from "./number";
import string from "./string";

import type { Serializer } from "../types";

export default {
  array,
  boolean,
  date,
  number,
  string,
  null: nullSerializer,
};

export function fromUrl<T>(
  serializers: Serializer<T>[],
  value: string | null
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
): { valid: false } | { valid: true; value: string | null } {
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
