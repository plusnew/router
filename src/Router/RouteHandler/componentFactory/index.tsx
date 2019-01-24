import { ApplicationElement, Component, Props, store, storeType } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import { routeStore } from '../storeFactory';
import ComponentInstance from 'plusnew/dist/src/instances/types/Component/Instance';

export type routeCallback<Spec extends RouteParamsSpec, props> = (Parameter: Props<SpecToType<Spec>>, Props: Props<props>) => ApplicationElement;

// tslint:disable-next-line:space-before-function-paren
function componentFactory<Spec extends RouteParamsSpec, componentProps extends Partial<props>>
(routeStore: routeStore<Spec>, callback: routeCallback<Spec, componentProps>) {
  return class RouterComponent extends Component<componentProps>{
    parameter: storeType<SpecToType<Spec>, SpecToType<Spec>>;
    instance: ComponentInstance<componentProps>;
    isActive = false;

    private createParameterObserver() {
      let created = false;
      const routeState = routeStore.getState();
      if (routeState.active === true && this.isActive === false) {
        this.isActive = true;
        this.parameter = store(routeState.parameter);
        created = true;
      } else if (routeState.active === false && this.isActive === true) {
        this.isActive = false;
      }
      return created;
    }

    private createComponentIfNeeded() {
      if (routeStore.getState().active === true) {
        return callback(this.parameter.Observer, this.instance.storeProps.Observer);
      }

      return null;
    }

    render(_Props: Props<componentProps>, instance: ComponentInstance<componentProps>) {
      this.instance = instance;
      this.createParameterObserver();
      routeStore.subscribe(this.update);

      return this.createComponentIfNeeded();
    }

    update = () => {
      const created = this.createParameterObserver();

      const routeState = routeStore.getState();
      if (routeState.active === true && created === false) {
        this.parameter.dispatch(routeState.parameter);
      } else {
        this.instance.render(this.createComponentIfNeeded());
      }
    }

    // route.Component unmounting is not specified yet and should not be used
    // componentWillUnmount() {
    //   routeStore.unsubscribe(this.update);
    // }
  };
}
export default componentFactory;
