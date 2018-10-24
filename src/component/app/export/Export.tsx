import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import * as State from '../../../state';

const Consumer = State.select(state => ({
  exporting: state.ui.exporting
}));

export const Export = () => (
  <Consumer>
    {state => (
      <>
        {state.exporting
          ? ReactDOM.createPortal(
              <Box>
                <textarea
                  style={{ width: '100%', height: '100%' }}
                  readOnly
                  value={JSON.stringify(data())}
                />
              </Box>,
              document.body
            )
          : null}
      </>
    )}
  </Consumer>
);

const data = () => {
  const { ui: _, ...data } = State.get()!;
  return data;
};

const Box = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 300px;
`;
