import type { Serializer } from "../types";

export default (): Serializer<Date> => ({
  displayName: "date",
  fromUrl: (value) => {
    if (value !== null) {
      const date = new Date(decodeURIComponent(value));
      if (isNaN(date.getTime()) === true) {
        return {
          valid: false,
        };
      }

      return {
        valid: true,
        value: date,
      };
    }
    return {
      valid: false,
    };
  },
  toUrl: (value: unknown) => {
    if (value instanceof Date) {
      return {
        value: encodeURIComponent(value.toISOString()),
        valid: true,
      };
    }
    return {
      valid: false,
    };
  },
});
