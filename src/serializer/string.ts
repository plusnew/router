import { converter } from '../types/mapper';

export default (): converter<string> => ({
  displayName: 'string',
  fromUrl: (value: string) => {
    return {
      valid: true,
      value: decodeURIComponent(value),
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
