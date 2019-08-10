import { converter } from '../types/mapper';

const converter: converter<Date> = {
  displayName: 'Date',
  fromUrl: (value: string) => ({ value: new Date(value), valid: true }),
  toUrl: (value: Date) => ({ value: value.toString(), valid: true }),
};

export default converter;
