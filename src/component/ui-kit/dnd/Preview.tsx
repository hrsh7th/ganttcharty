import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

type Props = {
  preview: () => React.ReactNode;
  x: number;
  y: number;
};

export default class extends React.Component<Props> {

  public render() {
    return ReactDOM.createPortal((
      <Preview {...this.props}>{this.props.preview()}</Preview>
    ), document.body);
  }

}

const Preview = styled.div<Props>`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  * {
    transform: translateX(0);
  }
`;

