import React from 'react';
import ReactDOM from 'react-dom';
import closest from 'closest-element';

export type Props = {
  onClick: (e: MouseEvent) => void;
  children: React.ReactNode;
};

export default class Outside extends React.Component<Props> {

  public componentDidMount() {
    document.addEventListener('click', this.onClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  public render() {
    return React.Children.only(this.props.children);
  }

  private onClick = (e: MouseEvent) => {
    const element = ReactDOM.findDOMNode(this);
    if (element && element instanceof HTMLElement) {
      if (!closest(e.target as any, element)) {
        this.props.onClick(e);
      }
    }
  }

}

