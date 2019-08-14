import { serializer } from '../types/mapper';

export default <literal extends string = string>(literal?: literal): serializer<literal> => ({
  displayName: literal === undefined ? 'string' : `\'${literal}\'`,
  fromUrl: (value) => {
    if (value !== undefined) {
      const result = decodeURIComponent(value);

      if (literal === undefined || literal === result) {
        return {
          valid: true,
          value: result as literal,
        };
      }
    }
    return {
      valid: false,
    };
  },
  toUrl: (value: string) => {
    if (typeof value === 'string') {

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
