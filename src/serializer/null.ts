import type { serializer } from "../types/mapper";

export default (): serializer<null> => ({
  displayName: "null",
  fromUrl: (value) => {
    if (value === undefined) {
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
        value: undefined,
      };
    }
    return {
      valid: false,
    };
  },
});
