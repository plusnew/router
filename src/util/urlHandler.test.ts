import { serializer } from '../index';
import { createUrl, parseUrl } from './urlHandler';

describe('urlHandler', () => {
  describe('root', () => {
    it('namespace missmatch', () => {
      expect(() =>
        parseUrl('bar', {}, createUrl('foo', {}, {})),
      ).toThrow(new Error('Can not parse url /foo for wrong namespace bar'));
    });

    describe('missing parameter', () => {
      it('parseUrl', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
            bar: [serializer.string()],
          },
        };

        expect(() =>
          parseUrl(specContainer, '/namespace;foo=bar'),
        ).toThrow(new Error('The url /namespace;foo=bar has incorrect parameter bar, it is not parsable as string'));
      });

      it('createUrl', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
            bar: [serializer.string()],
          },
        };

        expect(() =>
          createUrl(specContainer, { foo: 'fooValue' } as any),
        ).toThrow(new Error('Could not create url for namespace, the property bar was not serializable as string with the value undefined'));
      });
    });

    it('optional parameter', () => {
      const specContainer = {
        namespace: {
          foo: [serializer.undefined(), serializer.string()],
          bar: [serializer.undefined(), serializer.string()],
        },
      };

      const parameter = {
        bar: 'baz',
      };

      expect(
        parseUrl(specContainer, createUrl(specContainer, parameter)),
      ).toEqual(parameter);
    });

    describe('string', () => {
      it('basic', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
          },
        };

        const parameter = {
          foo: 'fooValue',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('empty String', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
          },
        };

        const parameter = {
          foo: '',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('createUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
          },
        };

        expect(() =>
          createUrl(specContainer, { foo: 42 as any }),
        ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as string with the value 42'));
      });

      it('basic with multiple', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
            bar: [serializer.string()],
          },
        };

        const parameter = {
          foo: 'fooValue',
          bar: 'barValue',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('weird characters', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
            bar: [serializer.string()],
          },
        };

        const parameter = {
          foo: 'foo&Value',
          bar: 'barValue',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and no value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string(), serializer.undefined()],
          },
        };

        const parameter = {};

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.undefined(), serializer.string()],
          },
        };

        const parameter = {
          foo: 'string',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      describe('literal', () => {
        it('with correct value', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo'), serializer.string('bar')],
            },
          };

          const parameter = {
            param: 'foo' as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });

        it('with correct weird value &', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo&'), serializer.string('bar')],
            },
          };

          const parameter = {
            param: 'foo&' as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });

        it('with correct weird value ;', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo;'), serializer.string('bar')],
            },
          };

          const parameter = {
            param: 'foo;' as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });

        it('with correct weird value =', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo='), serializer.string('bar')],
            },
          };

          const parameter = {
            param: 'foo=' as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });
        it('with incorrect value for createUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo'), serializer.string('bar')],
            },
          };

          const parameter = {
            param: 'baz' as any,
          };

          expect(() =>
            createUrl(specContainer, parameter),
          ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as \'foo\' | \'bar\' with the value baz'));
        });

        it('with incorrect value for parseUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.string('foo'), serializer.string('bar')],
            },
          };

          expect(() =>
            parseUrl(specContainer, '/namespace;param=baz'),
          ).toThrow(new Error('The url /namespace;param=baz has incorrect parameter param, it is not parsable as \'foo\' | \'bar\''));
        });
      });
    });

    describe('number', () => {
      it('basic', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.number()],
          },
        };

        const parameter = {
          foo: 23,
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and no value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.number(), serializer.undefined()],
          },
        };

        const parameter = {};

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.undefined(), serializer.number()],
          },
        };

        const parameter = {
          foo: 34,
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('createUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.number()],
          },
        };

        expect(() =>
          createUrl(specContainer, { foo: 'fooValue' as any }),
        ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as number with the value fooValue'));
      });

      it('parseUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.number()],
          },
        };

        expect(() =>
          parseUrl(specContainer, '/namespace;foo=invalid'),
        ).toThrow(new Error('The url /namespace;foo=invalid has incorrect parameter foo, it is not parsable as number'));
      });

      describe('literal', () => {
        it('with correct value', () => {
          const specContainer = {
            namespace: {
              param: [serializer.number(2), serializer.number(3)],
            },
          };

          const parameter = {
            param: 2 as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });

        it('with incorrect value for createUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.number(2), serializer.number(3)],
            },
          };

          const parameter = {
            param: 5 as any,
          };

          expect(() =>
            createUrl(specContainer, parameter),
          ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as 2 | 3 with the value 5'));
        });

        it('with incorrect value for parseUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.number(2), serializer.number(3)],
            },
          };

          expect(() =>
            parseUrl(specContainer, '/namespace;param=5'),
          ).toThrow(new Error('The url /namespace;param=5 has incorrect parameter param, it is not parsable as 2 | 3'));
        });

      });

    });

    describe('date', () => {
      it('basic', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.date()],
          },
        };

        const parameter = {
          foo: new Date(),
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and no value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.date(), serializer.undefined()],
          },
        };

        const parameter = {};

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.undefined(), serializer.date()],
          },
        };

        const parameter = {
          foo: new Date(),
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('createUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.date()],
          },
        };

        expect(() =>
          createUrl(specContainer, { foo: 'fooValue' as any }),
        ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as date with the value fooValue'));
      });

      it('parseUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.date()],
          },
        };

        expect(() =>
          parseUrl(specContainer, '/namespace;foo=invalid'),
        ).toThrow(new Error('The url /namespace;foo=invalid has incorrect parameter foo, it is not parsable as date'));
      });
    });

    describe('boolean', () => {
      it('true', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.boolean()],
          },
        };

        const parameter = {
          foo: true,
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('false', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.boolean()],
          },
        };

        const parameter = {
          foo: false,
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and no value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.boolean(), serializer.undefined()],
          },
        };

        const parameter = {};

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('with optional serializer, and value given', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.undefined(), serializer.boolean()],
          },
        };

        const parameter = {
          foo: true,
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });

      it('createUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.boolean()],
          },
        };

        expect(() =>
          createUrl(specContainer, { foo: 'fooValue' as any }),
        ).toThrow(new Error('Could not create url for namespace, the property foo was not serializable as boolean with the value fooValue'));
      });

      it('parseUrl with invalid type', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.boolean()],
          },
        };

        expect(() =>
          parseUrl(specContainer, '/namespace;foo=invalid'),
        ).toThrow(new Error('The url /namespace;foo=invalid has incorrect parameter foo, it is not parsable as boolean'));
      });

      describe('literal', () => {
        it('with correct value', () => {
          const specContainer = {
            namespace: {
              param: [serializer.boolean(true)],
            },
          };

          const parameter = {
            param: true as const,
          };

          expect(
            parseUrl(specContainer, createUrl(specContainer, parameter)),
          ).toEqual(parameter);
        });

        it('with incorrect value for createUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.boolean(true)],
            },
          };

          const parameter = {
            param: false as any,
          };

          expect(() =>
            createUrl(specContainer, parameter),
          ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as true with the value false'));
        });

        it('with incorrect value for createUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.boolean(false)],
            },
          };

          const parameter = {
            param: true as any,
          };

          expect(() =>
            createUrl(specContainer, parameter),
          ).toThrow(new Error('Could not create url for namespace, the property param was not serializable as false with the value true'));
        });

        it('with incorrect value for parseUrl', () => {
          const specContainer = {
            namespace: {
              param: [serializer.boolean(true)],
            },
          };

          expect(() =>
            parseUrl(specContainer, '/namespace;param=false'),
          ).toThrow(new Error('The url /namespace;param=false has incorrect parameter param, it is not parsable as true'));
        });
      });
    });

    describe('string', () => {
      it('basic', () => {
        const specContainer = {
          namespace: {
            foo: [serializer.string()],
          },
        };

        const parameter = {
          foo: 'fooValue',
        };

        expect(
          parseUrl(specContainer, createUrl(specContainer, parameter)),
        ).toEqual(parameter);
      });
    });
  });
