import React from 'react';
import uuid from 'uuid';
import hotkeys, { KeyHandler, HotkeysEvent } from 'hotkeys-js';

hotkeys.filter = () => true;

export type Props<Keymap extends { [name: string]: string[]; }> = {
  scope?: string;
  ref?: React.RefObject<any>;
  keymap: Keymap;
  listeners: { [K in keyof Keymap]: KeyHandler; };
};

export default class Hotkeys<Keymap extends { [name: string]: string[]; }> extends React.Component<Props<Keymap>> {

  private id: string = '';
  private _refs: React.RefObject<any>[] = [];

  public componentDidMount() {
    this.id = uuid.v4();

    // bind events.
    Object.keys(this.props.keymap).forEach(name => {
      this.props.keymap[name].forEach(key => {
        hotkeys(
          key,
          {
            scope: this.id
          },
          (ke: KeyboardEvent, he: HotkeysEvent) => {
            ke.stopPropagation();
            ke.preventDefault();
            this.props.listeners[name](ke, he);
          }
        );
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
      this._refs[this._refs.length] = c.ref || React.createRef();
      return React.cloneElement(c, {
        ref: this._refs[this._refs.length - 1],
        onFocus: this.onFocus
      });
    });
  }

  private onFocus = () => {
    console.log(this._refs);
    hotkeys.setScope(this.id);
  };

}

