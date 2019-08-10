import { converter } from '../types/mapper';

const converter: converter<number> = {
  displayName: 'number',
  fromUrl: (value: string) => ({ value: Number(value), valid: true }),
  toUrl: (value: number) => ({ value: value.toString(), valid: true }),
};

export default converter;
