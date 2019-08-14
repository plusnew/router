import { converter } from '../types/mapper';

export default (): converter<boolean> => ({
  displayName: 'boolean',
  fromUrl: (value) => {
    if (value !== undefined) {
      if (value === 'true') {
        return {
          valid: true,
          value: true,
        };
      }
      if (value === 'false') {
        return {
          valid: true,
          value: false,
        };
      }
    }

    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (typeof value === 'boolean') {
      return {
        valid: true,
        value: value.toString(),
      };
    }
    return {
      valid: false,
    };
  },
});
