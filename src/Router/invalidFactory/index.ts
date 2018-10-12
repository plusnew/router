import { Component } from 'plusnew';
import Router from '../index';

export default (router: Router) => {
  return class Invalid extends Component<{children: any}> {
    render() {
      return null;
    }
  };
};
