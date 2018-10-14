import React from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import Hotkeys from '../hotkeys';
import Outside from '../outside';

export type Props<T extends Date | string | number> = {
  value: T;
  onChange: (value: T) => void;
} & (
  T extends Date ? {
    format: string;
  } : {}
);

export type State<T> = {
  value: T;
  editing: boolean;

};

const InlineStyle = {
  display: 'inline-block',
  verticalAlign: 'top',
  width: '100%',
  height: '100%'
};

export default class InlineEdit<T extends Date | string | number> extends React.Component<Props<T>, State<T>> {

  private editing: React.RefObject<HTMLInputElement> = React.createRef();

  private keymap = {
    'finish': ['escape']
  };

  public constructor(props: Props<T>) {
    super(props);
    this.state = { value: props.value, editing: false };
  }

  public render() {
    if (this.state.editing) {
      return (
        <Hotkeys keymap={this.keymap} listeners={{ finish: this.onFinish }}>
          <Outside onClick={this.onFinish}>
            {this.edit()}
          </Outside>
        </Hotkeys>
      );
    }
    return this.value();
  }

  private value() {
    if (this.props.value instanceof Date) {
      return <span style={InlineStyle} onClick={this.onClick}>{format(this.props.value, (this.props as any).format)}</span>;
    }
    return <span style={InlineStyle} onClick={this.onClick}>{String(this.props.value)}</span>;
  }

  private edit() {
    if (this.props.value instanceof Date) {
      return <input style={InlineStyle} type="date" ref={this.editing} defaultValue={format(this.props.value, 'YYYY-MM-DD')} />;
    }
    return <input style={InlineStyle} type="text" ref={this.editing} defaultValue={String(this.props.value)} />;
  }

  private onClick = () => {
    if (!this.state.editing) {
      this.setState({
        editing: true
      });
    }
  };

  private onFinish = () => {
    if (this.editing.current) {
      if (this.props.value instanceof Date) {
        this.props.onChange(parse(this.editing.current.value!) as any as T);
      } else {
        this.props.onChange(this.editing.current.value! as any as T);
      }
    }
    this.setState({
      editing: false
    });
  };

}

