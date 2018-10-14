import React from 'react';

export type Props = {
  onClick: (e: MouseEvent) => void;
  children: React.ReactNode;
  ref?: React.RefObject<any>;
};

export default class Outside extends React.Component<Props> {

  private _refs: React.RefObject<HTMLElement>[] = [];

  public componentDidMount() {
    document.addEventListener('click', this.onClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  public render() {
    return React.Children.map(this.props.children, (c: any) => {
      this._refs[this._refs.length] = c.ref || React.createRef();
      return React.cloneElement(c, {
        ref: this._refs[this._refs.length - 1]
      });
    });
  }

  private onClick = (e: MouseEvent) => {
    if (this._refs.some(ref => (
      !!ref.current && ref.current === e.target
    ))) {
      return;
    }
    this.props.onClick(e);
  }

}

