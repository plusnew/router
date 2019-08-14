import { serializer } from '../index';
import { createUrl, parseUrl } from './urlHandler';

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
      ).toThrow(new Error('The url /namespace?foo=bar has incorrect parameter bar, it is not parsable as string'));
    });

    it('createUrl', () => {
      const spec = {
        foo: [serializer.string()],
        bar: [serializer.string()],
      };

      expect(() =>
        createUrl('namespace', spec, { foo: 'fooValue' } as any),
      ).toThrow(new Error('Could not create url for namespace, the property bar was not serializable as string with the value undefined'));
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
      ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as string with the value 42'));
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

    it('with optional serializer, and no value given', () => {
      const spec = {
        foo: [serializer.string(), serializer.undefined()],
      };

      const parameter = {};

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and value given', () => {
      const spec = {
        foo: [serializer.undefined(), serializer.string()],
      };

      const parameter = {
        foo: 'string',
      };

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    describe('literal', () => {
      it('with correct value', () => {
        const spec = {
          param: [serializer.string('foo'), serializer.string('bar')],
        };

        const parameter = {
          param: 'foo' as const,
        };

        expect(
          parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
        ).toEqual(parameter);
      });

      it('with correct weird value', () => {
        const spec = {
          param: [serializer.string('foo&'), serializer.string('bar')],
        };

        const parameter = {
          param: 'foo&' as const,
        };

        expect(
          parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
        ).toEqual(parameter);
      });

      it('with incorrect value for createUrl', () => {
        const spec = {
          param: [serializer.string('foo'), serializer.string('bar')],
        };

        const parameter = {
          param: 'baz' as any,
        };

        expect(() =>
          createUrl('namespace', spec, parameter),
        ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as \'foo\' | \'bar\' with the value baz'));
      });

      it('with incorrect value for parseUrl', () => {
        const spec = {
          param: [serializer.string('foo'), serializer.string('bar')],
        };

        expect(() =>
          parseUrl('namespace', spec, '/namespace?param=baz'),
        ).toThrow(new Error('The url /namespace?param=baz has incorrect parameter param, it is not parsable as \'foo\' | \'bar\''));
      });
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
      };

      const parameter = {};

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and value given', () => {
      const spec = {
        foo: [serializer.undefined(), serializer.number()],
      };

      const parameter = {
        foo: 34,
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
      ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as number with the value fooValue'));
    });

    it('parseUrl with invalid type', () => {
      const spec = {
        foo: [serializer.number()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as number'));
    });

    describe('literal', () => {
      it('with correct value', () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        const parameter = {
          param: 2 as const,
        };

        expect(
          parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
        ).toEqual(parameter);
      });

      it('with incorrect value for createUrl', () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        const parameter = {
          param: 5 as any,
        };

        expect(() =>
          createUrl('namespace', spec, parameter),
        ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as 2 | 3 with the value 5'));
      });

      it('with incorrect value for parseUrl', () => {
        const spec = {
          param: [serializer.number(2), serializer.number(3)],
        };

        expect(() =>
          parseUrl('namespace', spec, '/namespace?param=5'),
        ).toThrow(new Error('The url /namespace?param=5 has incorrect parameter param, it is not parsable as 2 | 3'));
      });

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

      const parameter = {};

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and value given', () => {
      const spec = {
        foo: [serializer.undefined(), serializer.date()],
      };

      const parameter = {
        foo: new Date(),
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
      ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as date with the value fooValue'));
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

      const parameter = {};

      expect(
        parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
      ).toEqual(parameter);
    });

    it('with optional serializer, and value given', () => {
      const spec = {
        foo: [serializer.undefined(), serializer.boolean()],
      };

      const parameter = {
        foo: true,
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
      ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as boolean with the value fooValue'));
    });

    it('parseUrl with invalid type', () => {
      const spec = {
        foo: [serializer.boolean()],
      };

      expect(() =>
        parseUrl('namespace', spec, '/namespace?foo=invalid'),
      ).toThrow(new Error('The url /namespace?foo=invalid has incorrect parameter foo, it is not parsable as boolean'));
    });

    describe('literal', () => {
      it('with correct value', () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        const parameter = {
          param: true as const,
        };

        expect(
          parseUrl('namespace', spec, createUrl('namespace', spec, parameter)),
        ).toEqual(parameter);
      });

      it('with incorrect value for createUrl', () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        const parameter = {
          param: false as any,
        };

        expect(() =>
          createUrl('namespace', spec, parameter),
        ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as true with the value false'));
      });

      it('with incorrect value for createUrl', () => {
        const spec = {
          param: [serializer.boolean(false)],
        };

        const parameter = {
          param: true as any,
        };

        expect(() =>
          createUrl('namespace', spec, parameter),
        ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as false with the value true'));
      });

      it('with incorrect value for parseUrl', () => {
        const spec = {
          param: [serializer.boolean(true)],
        };

        expect(() =>
          parseUrl('namespace', spec, '/namespace?param=false'),
        ).toThrow(new Error('The url /namespace?param=false has incorrect parameter param, it is not parsable as true'));
      });

    });
  });
});
