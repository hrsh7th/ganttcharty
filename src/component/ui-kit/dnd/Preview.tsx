import React from 'react';
import ReactDOM from 'react-dom';
import Body from '../body';

type Props = {
  preview: () => React.ReactNode;
  x: number;
  y: number;
};

export default class extends React.Component<Props> {

  public render() {
    return ReactDOM.createPortal((
      <>
        <Body style={{ cursor: 'move' }} />
        <div style={{
          position: 'fixed',
          top: 0,
          left:0,
          transform: `translate(${this.props.x - 5}px, ${this.props.y - 5}px)`,
          zIndex: 100000
        }}>
          {this.props.preview()}
        </div>
      </>
    ), document.body);
  }

}

