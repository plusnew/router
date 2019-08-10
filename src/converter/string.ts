import { converter } from '../types/mapper';

const converter: converter<string> = {
  displayName: 'string',
  fromUrl: (value: string) => ({ value, valid: true }),
  toUrl: (value: string) => ({ value, valid: true }),
};

export default converter;
