import type { Serializer } from "../types";

export default (): Serializer<Date> => ({
  displayName: "date",
  fromPath: (value) => {
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
  toPath: (value: unknown) => {
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
