import { serializer } from '../index';
import { createUrl, parseUrl } from './urlHandler';
import { SpecToType } from 'types/mapper';

describe('urlHandler', () => {
  it('namespace missmatch', () => {
    expect(() =>
      parseUrl('bar', {}, createUrl('foo', {}, {})),
    ).toThrow(new Error('Can not parse url /foo for wrong namespace bar'));
  });

  describe('missing parameter', () => {
    it('parseUrl', () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=bar'),
      ).toThrow(new Error('The url /namespace?foo=bar is missing the parameter bar'));
    });

    it('createUrl', () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' } as any),
      ).toThrow(new Error('Could not create url for namespace, the property bar was missing'));
    });
  });

  describe('string', () => {
    it('basic', () => {
      const spec = {
        foo: [serializer.string()],
      };

      const parameter = {
        foo: 'fooValue',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('empty String', () => {
      const spec = {
        foo: [serializer.string()],
      };

      const parameter = {
        foo: '',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec = {
        foo: [serializer.string()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 42 as any }),
      ).toThrow(new Error('Could not create url for property foo with value 42, it is not of the correct type string'));
    });

    it('basic with multiple', () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      const parameter = {
        foo: 'fooValue',
        bar: 'barValue',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('weird characters', () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      const parameter = {
        foo: 'foo&Value',
        bar: 'barValue',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    xit('with optional serializer, and no value given', () => {
      const spec = {
        optional: [serializer.string(), serializer.undefined()],
        undefined: [serializer.undefined()],
        else: [serializer.number()],
      };

      type foo = SpecToType<typeof spec>

      const parameter: SpecToType<typeof spec> = {
        optional: '',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });
  });

  describe('number', () => {
    it('basic', () => {
      const spec = {
        foo: [serializer.number()],
      };

      const parameter = {
        foo: 23,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and no value given', () => {
      const spec = {
        foo: [serializer.number(), serializer.undefined()],
        foo2: [serializer.undefined()],
        foo3: [serializer.undefined(), serializer.number()],
        bar: [serializer.number()],
        baz: [serializer.string()],
      };

      type foo = SpecToType<typeof spec>;

      const parameter: SpecToType<typeof spec> = {
        // foo: undefined,
        bar: 1,
        baz: '',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec = {
        foo: [serializer.number()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' as any }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type number'));
    });

    it('parseUrl with invalid type', () => {
      const spec = {
        foo: [serializer.number()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as number'));
    });
  });

  describe('date', () => {
    it('basic', () => {
      const spec = {
        foo: [serializer.date()],
      };

      const parameter = {
        foo: new Date(),
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and no value given', () => {
      const spec = {
        foo: [serializer.date(), serializer.undefined()],
      };

      const parameter = {
        // foo: undefined,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec = {
        foo: [serializer.date()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' as any }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type date'));
    });

    it('parseUrl with invalid type', () => {
      const spec = {
        foo: [serializer.date()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as date'));
    });
  });

  describe('boolean', () => {
    it('true', () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      const parameter = {
        foo: true,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('false', () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      const parameter = {
        foo: false,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and no value given', () => {
      const spec = {
        foo: [serializer.boolean(), serializer.undefined()],
      };

      const parameter = {
        // foo: undefined,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' as any }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type boolean'));
    });

    it('parseUrl with invalid type', () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as boolean'));
    });
  });
});
