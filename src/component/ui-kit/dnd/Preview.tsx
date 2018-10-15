import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  preview: () => React.ReactNode;
  x: number;
  y: number;
};

export default class extends React.Component<Props> {

  public render() {
    return ReactDOM.createPortal((
      <div {...this.props} style={{
        position: 'fixed',
        top: this.props.y,
        left: this.props.x
      }}>{this.props.preview()}</div>
    ), document.body);
  }

}

