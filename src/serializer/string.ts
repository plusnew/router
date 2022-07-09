import type { Serializer } from "../types";

export default <literal extends string>(
  literal?: literal
): Serializer<undefined extends literal ? string : literal> => ({
  displayName: literal === undefined ? "string" : `'${literal}'`,
  fromUrl: (value) => {
    if (value !== undefined) {
      const result = decodeURIComponent(value);

      if (literal === undefined || literal === result) {
        return {
          valid: true,
          value: result as undefined extends literal ? string : literal,
        };
      }
    }
    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (typeof value === "string") {
      if (literal === undefined || literal === value) {
        return {
          valid: true,
          value: encodeURIComponent(value),
        };
      }
    }
    return {
      valid: false,
    };
  },
});
