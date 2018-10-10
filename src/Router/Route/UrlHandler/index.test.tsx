import UrlHandler from './index';

describe('test Urlhandler', () => {
  describe('namespace', () => {
    it('detects simple namespaces', () => {
      const urlHandler = new UrlHandler('namespace', {});

      expect(urlHandler.isCurrentNamespace('/namespace/')).toBe(true);
      expect(urlHandler.isCurrentNamespace('/namespace')).toBe(true);
    });

    it('detects with slashes', () => {
      const urlHandler = new UrlHandler('name/space', {});

      expect(urlHandler.isCurrentNamespace('/name/space/')).toBe(true);
      expect(urlHandler.isCurrentNamespace('/name/space')).toBe(true);
    });

    it('detects wrong namespace with slashes', () => {
      const urlHandler = new UrlHandler('name/space', {});

      expect(urlHandler.isCurrentNamespace('/namespace/')).toBe(false);
      expect(urlHandler.isCurrentNamespace('/namespace')).toBe(false);
    });

    it('detects wrong namespaces', () => {
      const urlHandler = new UrlHandler('namespace', {});

      expect(urlHandler.isCurrentNamespace('/name/space/')).toBe(false);
      expect(urlHandler.isCurrentNamespace('/name/space')).toBe(false);
    });

    it('detects simple namespaces with parameter', () => {
      const urlHandler = new UrlHandler('namespace', {});

      expect(urlHandler.isCurrentNamespace('/namespace/foo')).toBe(true);
      expect(urlHandler.isCurrentNamespace('/namespace/foo')).toBe(true);

    });

  });

  describe('builds url', () => {
    it('for simple namespace', () => {
      const urlHandler = new UrlHandler('namespace', {});

      expect(urlHandler.buildUrl({})).toBe('/namespace/');
    });

    it('for simple slashed namespace', () => {
      const urlHandler = new UrlHandler('name/space', {});

      expect(urlHandler.buildUrl({})).toBe('/name/space/');
    });

    it('with number', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'number' });

      expect(urlHandler.buildUrl({ foo: 3 })).toBe('/name/space/foo/3/');
    });

    it('with string', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string' });

      expect(urlHandler.buildUrl({ foo: 'bar' })).toBe('/name/space/foo/bar/');
    });

    it('with date', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'date' });

      const date = new Date();
      expect(urlHandler.buildUrl({ foo: date })).toBe(`/name/space/foo/${date.getTime()}/`);
    });

    it('with boolean', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'boolean' });

      expect(urlHandler.buildUrl({ foo: true })).toBe(`/name/space/foo/true/`);
    });

    it('with boolean', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'boolean' });

      expect(urlHandler.buildUrl({ foo: false })).toBe(`/name/space/foo/false/`);
    });

    it('with number string and date', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string', bar: 'number', baz: 'date' });

      const date = new Date();

      expect(urlHandler.buildUrl({
        foo: 'foovalue',
        bar: 2,
        baz: date,
      })).toBe(`/name/space/foo/foovalue/bar/2/baz/${date.getTime()}/`);

      expect(urlHandler.buildUrl({
        baz: date,
        bar: 2,
        foo: 'foovalue',
      })).toBe(`/name/space/foo/foovalue/bar/2/baz/${date.getTime()}/`);
    });
  });

  describe('parse url', () => {
    it('just namespace', () => {
      const urlHandler = new UrlHandler('namespace', {});

      expect(urlHandler.parseUrl('/namespace/')).toEqual({});
      expect(urlHandler.parseUrl('namespace')).toEqual({});

    });

    it('namespace with slashes', () => {
      const urlHandler = new UrlHandler('name/space', {});

      expect(urlHandler.parseUrl('/name/space/')).toEqual({});
      expect(urlHandler.parseUrl('name/space')).toEqual({});
    });

    it('wrong namespace', () => {
      const urlHandler = new UrlHandler('name/space', {});

      expect(() => urlHandler.parseUrl('/namespace/')).toThrow(new Error('Can not parse Url for wrong namespace'));
    });

    it('with string params', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string' });

      expect(urlHandler.parseUrl('/name/space/foo/bar')).toEqual({ foo: 'bar' });
      expect(urlHandler.parseUrl('/name/space/foo/bar/')).toEqual({ foo: 'bar' });
      expect(urlHandler.parseUrl('/name/space/foo/2')).toEqual({ foo: '2' });
      expect(urlHandler.parseUrl('/name/space/foo/2/')).toEqual({ foo: '2' });
      expect(urlHandler.parseUrl('/name/space/foo//')).toEqual({ foo: '' });
      expect(urlHandler.parseUrl('/name/space/foo/')).toEqual({ foo: '' });
    });

    it('with boolean params', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'boolean' });

      expect(urlHandler.parseUrl('/name/space/foo/true')).toEqual({ foo: true });
      expect(urlHandler.parseUrl('/name/space/foo/true/')).toEqual({ foo: true });
      expect(urlHandler.parseUrl('/name/space/foo/false/')).toEqual({ foo: false });
      expect(urlHandler.parseUrl('/name/space/foo/false')).toEqual({ foo: false });
    });

    it('with number params', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'number' });

      expect(urlHandler.parseUrl('/name/space/foo/-0.5')).toEqual({ foo: -0.5 });
      expect(urlHandler.parseUrl('/name/space/foo/2/')).toEqual({ foo: 2 });
      expect(urlHandler.parseUrl('/name/space/foo/0/')).toEqual({ foo: 0 });
      expect(urlHandler.parseUrl('/name/space/foo/0.5/')).toEqual({ foo: 0.5 });
      expect(urlHandler.parseUrl('/name/space/foo/-1/')).toEqual({ foo: -1 });
    });

    it('with date params', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'date' });

      const date = new Date();

      expect(urlHandler.parseUrl(`/name/space/foo/${date.getTime()}`)).toEqual({ foo: date });
      expect(urlHandler.parseUrl(`/name/space/foo/${date.getTime()}/`)).toEqual({ foo: date });
    });

    it('with number string and date', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string', bar: 'number', baz: 'date' });

      const date = new Date();

      expect(
        urlHandler.parseUrl(`/name/space/foo/foovalue/bar/2/baz/${date.getTime()}`),
      ).toEqual({ foo: 'foovalue', bar: 2, baz: date });

      expect(
        urlHandler.parseUrl(`/name/space/foo/foovalue/bar/2/baz/${date.getTime()}/`),
      ).toEqual({ foo: 'foovalue', bar: 2, baz: date });

      expect(
        urlHandler.parseUrl(`/name/space/baz/${date.getTime()}/bar/2/foo/foovalue`),
      ).toEqual({ foo: 'foovalue', bar: 2, baz: date });
    });

    it('with missing param', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string' });

      expect(() => {
        urlHandler.parseUrl('/name/space/');
      }).toThrow(new Error(`The url /name/space/ is missing the parameter foo`));
    });

    it('with invalid number', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'number' });

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/bar/');
      }).toThrow(new Error(`The url /name/space/foo/bar/ has incorrect parameter foo`));

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/4bar/');
      }).toThrow(new Error(`The url /name/space/foo/4bar/ has incorrect parameter foo`));

      // expect(() => {
      //   urlHandler.parseUrl('/name/space/foo//');
      // }).toThrow(new Error(`The url /name/space/foo// has incorrect parameter foo`));
    });

    it('with invalid date', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'date' });

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/mep/');
      }).toThrow(new Error(`The url /name/space/foo/mep/ has incorrect parameter foo`));

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/Infinity/');
      }).toThrow(new Error(`The url /name/space/foo/Infinity/ has incorrect parameter foo`));
    });

    it('with invalid boolean', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'boolean' });

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/mep/');
      }).toThrow(new Error(`The url /name/space/foo/mep/ has incorrect parameter foo`));
    });

    it('with to many params', () => {
      const urlHandler = new UrlHandler('name/space', { foo: 'string' });

      expect(() => {
        urlHandler.parseUrl('/name/space/foo/bar/baz/mep');
      }).toThrow(new Error(`The url /name/space/foo/bar/baz/mep has unknown parameter baz`));
    });
  });
});
