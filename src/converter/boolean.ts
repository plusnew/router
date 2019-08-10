import { converter } from '../types/mapper';

const converter: converter<boolean> = {
  displayName: 'boolean',
  fromUrl: (value: string) => ({ value: Boolean(value), valid: true }),
  toUrl: (value: boolean) => ({ value: value.toString(), valid: true }),
};

export default converter;
