import { storeFactory } from './activeRoutes';

describe('activeRoutes', () => {
  it('when activeroutes store gets called with incorrect action, error gets thrown', () => {
    const activeRoutes = storeFactory();

    expect(() => activeRoutes.dispatch({
      type: 'invalid',
    } as any)).toThrowError('No such action');
  });
});
