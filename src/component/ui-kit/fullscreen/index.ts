import React, { useRef } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";


type Props = {
  on: boolean;
  children: React.ReactElement;
};

export const Fullscreen = (props: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    if (props.on && ref.current) {
      const e = ReactDOM.findDOMNode(ref.current);
      if (e instanceof HTMLElement) {
        e.requestFullscreen();
      }
    } else if (!props.on && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [props.on, props.children]);

  return React.cloneElement(props.children, {
    ref: ref
  });
};
