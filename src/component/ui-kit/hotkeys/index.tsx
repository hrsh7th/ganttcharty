import React from 'react';
import ReactDOM from 'react-dom';
import closest from 'closest-element';
import hotkeys, { KeyHandler, HotkeysEvent } from 'hotkeys-js';

hotkeys.filter = () => true;

export type Props<Keymap extends { [name: string]: string[]; }> = {
  scope?: string;
  keymap: Keymap;
  listeners: { [K in keyof Keymap]: KeyHandler; };
};

export default class Hotkeys<Keymap extends { [name: string]: string[]; }> extends React.Component<Props<Keymap>> {

  private static recentTarget: HTMLElement | null = null;

  public static setScope(scope: string, target: HTMLElement) {
    if (this.recentTarget === target) {
      return;
    }
    this.recentTarget = target;
    hotkeys.setScope(scope);
  }

  private id: string = '';

  public componentDidMount() {
    this.id = this.props.scope || 'default';

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
        onClick: (e: React.MouseEvent) => {
          this.onClick(e);
          c.props.onClick && c.props.onClick(e);
        }
      });
    });
  }

  private onClick = (e: React.MouseEvent) => {
    const element = ReactDOM.findDOMNode(this);
    if (element && element instanceof HTMLElement) {
      if (closest(e.target as any, element)) {
        Hotkeys.setScope(this.id, e.target as HTMLElement);
      }
    }
  }

}

