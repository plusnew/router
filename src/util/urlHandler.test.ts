import { parseUrl, createUrl } from './urlHandler';
import { RouteParamsSpec } from '../types/mapper';
import { serializer } from '../index';

describe('urlHandler', () => {
  it('namespace missmatch', () => {
    expect(() =>
      parseUrl('bar', {}, createUrl('foo', {}, {})),
    ).toThrow(new Error('Can not parse url /foo for wrong namespace bar'));
  });

  describe('missing parameter', () => {
    it('parseUrl', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=bar'),
      ).toThrow(new Error('The url /namespace?foo=bar is missing the parameter bar'));
    });

    it('createUrl', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' }),
      ).toThrow(new Error('Could not create url for namespace, the property bar was missing'));
    });
  });

  describe('string', () => {
    it('basic', () => {
      const spec: RouteParamsSpec = {
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
      const spec: RouteParamsSpec = {
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
      const spec: RouteParamsSpec = {
        foo: [serializer.string()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 42 }),
      ).toThrow(new Error('Could not create url for property foo with value 42, it is not of the correct type string'));
    });

    it('basic with multiple', () => {
      const spec: RouteParamsSpec = {
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
      const spec: RouteParamsSpec = {
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
  });

  describe('number', () => {
    it('basic', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.number()],
      };

      const parameter = {
        foo: 23,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.number()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type number'));
    });

    it('parseUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.number()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as number'));
    });
  });

  describe('date', () => {
    it('basic', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.date()],
      };

      const parameter = {
        foo: new Date(),
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.date()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type date'));
    });

    it('parseUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.date()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as date'));
    });
  });

  describe('boolean', () => {
    it('true', () => {
      const spec: RouteParamsSpec = {
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
      const spec: RouteParamsSpec = {
        foo: [serializer.boolean()],
      };

      const parameter = {
        foo: false,
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('createUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' }),
      ).toThrow(new Error('Could not create url for property foo with value fooValue, it is not of the correct type boolean'));
    });

    it('parseUrl with invalid type', () => {
      const spec: RouteParamsSpec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as boolean'));
    });
  });
});
