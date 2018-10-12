import { Component } from 'plusnew';
import Router from '../index';

export default (router: Router) => {
  return class NotFound extends Component<{children: any}> {
    render() {
      return null;
    }
  };
};
