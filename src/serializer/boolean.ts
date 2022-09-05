import type { Serializer } from "../types";

export default <literal extends boolean>(
  literal?: literal
): Serializer<undefined extends literal ? boolean : literal> => ({
  displayName: literal === undefined ? "boolean" : `${literal.toString()}`,
  fromPath: (value) => {
    if (value !== null) {
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
  toPath: (value) => {
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
