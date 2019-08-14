import { serializer } from '../types/mapper';

export default <literal extends boolean = boolean>(literal?: literal): serializer<literal> => ({
  displayName: literal === undefined ? 'boolean' : `${literal}`,
  fromUrl: (value) => {
    if (value !== undefined) {
      if (value === 'true') {
        if (literal === undefined || literal === true) {
          return {
            valid: true,
            value: true as literal,
          };
        }
      }
      if (value === 'false') {
        if (literal === undefined || literal === false) {
          return {
            valid: true,
            value: false as literal,
          };
        }
      }
    }

    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (typeof value === 'boolean') {
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
