import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew from 'plusnew';
import Router, { BasicDriver } from '../../../index';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test links', () => {
  it('is link changing the url in the driver', () => {
    const basicDriver = new BasicDriver('foo');
    const router = new Router(basicDriver);

    const route = router.createRoute('namespace', { param: 'string' }, ({ param }) => <span>{param}</span>);

    const wrapper = mount(
      <>
        <route.Link parameter={{ param: 'bar' }}>link</route.Link>
      </>,
    );

    expect(wrapper.containsMatchingElement(
      <a className="router__link">link</a>,
    )).toBe(true);

    const link = wrapper.search(<a className="router__link">link</a>);
    const clickFn = link.prop('onclick');
    const event =  new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(event.defaultPrevented).toBe(false);
    expect(basicDriver.store.getState()).toBe('foo');

    clickFn(event);

    expect(event.defaultPrevented).toBe(true);
    expect(basicDriver.store.getState()).toBe('/namespace/param/bar/');
    expect(link.hasClass('router__link--active')).toBe(true);
  });

  it('is link with ctrlkey should not change the store', () => {
    const basicDriver = new BasicDriver('foo');
    const router = new Router(basicDriver);

    const route = router.createRoute('namespace', { param: 'string' }, ({ param }) => <span>{param}</span>);

    const wrapper = mount(
      <>
        <route.Link parameter={{ param: 'bar' }}>link</route.Link>
      </>,
    );

    expect(wrapper.containsMatchingElement(
      <a className="router__link">link</a>,
    )).toBe(true);

    const link = wrapper.search(<a className="router__link">link</a>);
    const clickFn = link.prop('onclick');
    const event =  new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });

    expect(event.defaultPrevented).toBe(false);
    expect(basicDriver.store.getState()).toBe('foo');

    clickFn(event);

    expect(event.defaultPrevented).toBe(false);
    expect(basicDriver.store.getState()).toBe('foo');
    expect(link.hasClass('router__link--active')).toBe(false);
  });
});
