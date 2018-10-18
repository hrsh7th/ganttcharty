import React from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import Hotkeys from '../hotkeys';
import Outside from '../outside';

export type Props<T extends Date | string | number> = {
  value: T;
  onChange: (value: T) => void;
} & (T extends Date
  ? {
      format: string;
    }
  : {});

export type State<T> = {
  value: T;
  editing: boolean;
};

const InlineStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '100%',
  height: '100%'
};

export default class InlineEdit<
  T extends Date | string | number
> extends React.Component<Props<T>, State<T>> {
  private editing: React.RefObject<HTMLInputElement> = React.createRef();

  private keymap = {
    finish: ['esc', 'enter']
  };

  public constructor(props: Props<T>) {
    super(props);
    this.state = { value: props.value, editing: false };
  }

  public componentDidUpdate() {
    if (this.editing.current) {
      this.editing.current.focus();
    }
  }

  public render() {
    if (this.state.editing) {
      return (
        <Outside onClick={this.onFinish}>
          <Hotkeys
            scope="inline"
            keymap={this.keymap}
            listeners={{ finish: this.onFinish }}
          >
            {this.edit()}
          </Hotkeys>
        </Outside>
      );
    }
    return this.value();
  }

  private value() {
    if (this.props.value instanceof Date) {
      return (
        <span style={InlineStyle} onDoubleClick={this.onDoubleClick}>
          {format(this.props.value, (this.props as any).format)}
        </span>
      );
    }
    return (
      <span style={InlineStyle} onDoubleClick={this.onDoubleClick}>
        {String(this.props.value)}
      </span>
    );
  }

  private edit() {
    if (this.props.value instanceof Date) {
      return (
        <input
          ref={this.editing}
          style={InlineStyle}
          type="date"
          value={format(this.state.value, 'YYYY-MM-DD')}
          onChange={this.onChange}
        />
      );
    }
    return (
      <input
        ref={this.editing}
        style={InlineStyle}
        type="text"
        value={String(this.state.value)}
        onChange={this.onChange}
      />
    );
  }

  private onDoubleClick = () => {
    if (this.state.editing) return;

    this.setState({
      editing: true
    });
  };

  private onChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.value instanceof Date) {
      this.setState({ value: (parse(e.currentTarget.value!) as any) as T });
    } else {
      this.setState({ value: (e.currentTarget.value! as any) as T });
    }
  };

  private onFinish = () => {
    if (!this.state.editing) return;

    this.setState(
      {
        editing: false
      },
      () => {
        if (this.props.value instanceof Date) {
          this.props.onChange((parse(this.state.value) as any) as T);
        } else {
          this.props.onChange((this.state.value as any) as T);
        }
      }
    );
  };
}
