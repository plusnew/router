import type { serializer } from '../types/mapper';

export default <literal extends number = number>(literal?: literal): serializer<literal> => ({
  displayName: literal === undefined ? 'number' : `${literal}`,
  fromUrl: (value) => {
    if (value !== undefined) {
      const result = Number(value);

      // @TODO evaluate if a stricter number parser makes sense /(-)?([0-9]+)(.[0-9]+)?/
      if (isNaN(result) === true) {
        return {
          valid: false,
        };
      }

      if (literal === undefined || literal === result) {
        return {
          value: result as literal,
          valid: true,
        };
      }
    }
    return {
      valid: false,
    };
  },
  toUrl: (value: number) => {
    if (typeof value === 'number') {
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
