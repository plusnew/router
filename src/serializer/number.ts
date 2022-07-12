import type { Serializer } from "../types";

export default <literal extends number>(
  literal?: literal
): Serializer<undefined extends literal ? number : literal> => ({
  displayName: literal === undefined ? "number" : `${literal}`,
  fromUrl: (value) => {
    if (value !== null) {
      const result = Number(value);

      // @TODO evaluate if a stricter number parser makes sense /(-)?([0-9]+)(.[0-9]+)?/
      if (isNaN(result) === true) {
        return {
          valid: false,
        };
      }

      if (literal === undefined || literal === result) {
        return {
          value: result as undefined extends literal ? number : literal,
          valid: true,
        };
      }
    }
    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (typeof value === "number") {
      if (literal === undefined || literal === value) {
        return {
          value: value.toString(),
          valid: true,
        };
      }
    }
    return {
      valid: false,
    };
  },
});
