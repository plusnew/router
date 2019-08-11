import { converter } from '../types/mapper';

export default (): converter<number> => ({
  displayName: 'number',
  fromUrl: (value: string) => {
    const result = Number(value);

    // @TODO evaluate if a stricter number parser makes sense /(-)?([0-9]+)(.[0-9]+)?/
    if (isNaN(result) === true) {
      return {
        valid: false,
      };
    }
    return {
      value: result,
      valid: true,
    };
  },
  toUrl: (value: number) => {
    if (typeof value === 'number') {
      return {
        value: value.toString(),
        valid: true,
      };
    }
    return {
      valid: false,
    };
  },
});
