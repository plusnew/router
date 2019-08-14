import { serializer } from '../types/mapper';

export default (): serializer<string> => ({
  displayName: 'string',
  fromUrl: (value) => {
    if (value !== undefined) {
      return {
        valid: true,
        value: decodeURIComponent(value),
      };
    }
    return {
      valid: false,
    };
  },
  toUrl: (value: string) => {
    if (typeof value === 'string') {
      return {
        valid: true,
        value: encodeURIComponent(value),
      };
    }
    return {
      valid: false,
    };
  },
});
