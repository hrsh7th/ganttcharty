import React from 'react';
import ReactDOM from 'react-dom';
import closest from 'closest-element';
import uuid from 'uuid';
import hotkeys, { KeyHandler, HotkeysEvent } from 'hotkeys-js';

export type Props<Keymap extends { [name: string]: string[]; }> = {
  scope?: string;
  keymap: Keymap;
  listeners: { [K in keyof Keymap]: KeyHandler; };
};

export default class Hotkeys<Keymap extends { [name: string]: string[]; }> extends React.Component<Props<Keymap>> {

  private id: string = '';

  public componentDidMount() {
    hotkeys.filter = () => {
      return true;
    };

    this.id = uuid.v4();

    // bind events.
    Object.keys(this.props.keymap).forEach(name => {
      this.props.keymap[name].forEach(key => {
        hotkeys(key, this.id, (ke: KeyboardEvent, he: HotkeysEvent) => {
          this.props.listeners[name](ke, he);
        });
      });
    });

    // set this scope.
    hotkeys.setScope(this.id);
  }

  public componentWillUnmount() {
    hotkeys.deleteScope(this.id);
  }

  public render() {
    return React.Children.map(this.props.children, (c: any) => {
      return React.cloneElement(c, {
        ...c.props,
        onFocus: (e: React.FocusEvent) => {
          c.props.onFocus && c.props.onFocus(e);
          this.onFocus(e);
        }
      });
    });
  }

  private onFocus = (e: React.FocusEvent) => {
    const element = ReactDOM.findDOMNode(this);
    if (element && element instanceof HTMLElement) {
      if (!closest(e.target as any, element)) {
        hotkeys.setScope(this.id);
      }
    }
  };

}

