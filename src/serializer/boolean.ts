import type { Serializer } from "../types";

export default <literal extends boolean>(
  literal?: literal
): Serializer<undefined extends literal ? boolean : literal> => ({
  displayName: literal === undefined ? "boolean" : `${literal}`,
  fromUrl: (value) => {
    if (value !== undefined) {
      if (value === "true") {
        if (literal === undefined || literal === true) {
          return {
            valid: true,
            value: true as undefined extends literal ? boolean : literal,
          };
        }
      }
      if (value === "false") {
        if (literal === undefined || literal === false) {
          return {
            valid: true,
            value: false as undefined extends literal ? boolean : literal,
          };
        }
      }
    }

    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (typeof value === "boolean") {
      if (literal === undefined || literal === value) {
        return {
          valid: true,
          value: value.toString(),
        };
      }
    }

    return {
      valid: false,
    };
  },
});
