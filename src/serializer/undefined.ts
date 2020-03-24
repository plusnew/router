import type { serializer } from '../types/mapper';

export default (): serializer<undefined> => ({
  displayName: 'undefined',
  fromUrl: (value) => {
    if (value === undefined) {
      return {
        valid: true,
        value: undefined,
      };
    }
    return {
      valid: false,
    };
  },
  toUrl: (value) => {
    if (value === undefined) {
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
