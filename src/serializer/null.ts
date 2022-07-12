import type { Serializer } from "../types";

export default (): Serializer<null> => ({
  displayName: "null",
  fromUrl: (value) => {
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
  toUrl: (value) => {
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
