import type { Serializer } from "../types";

export default (): Serializer<null> => ({
  displayName: "null",
  fromPath: (value) => {
    if (value === null) {
      return {
        valid: true,
        value: null,
      };
    }
    return {
      valid: false,
    };
  },
  toPath: (value) => {
    if (value === null) {
      return {
        valid: true,
        value: null,
      };
    }
    return {
      valid: false,
    };
  },
});
