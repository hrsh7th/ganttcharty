import React from 'react';

export type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default class Body extends React.PureComponent<Props> {
  public static defaultProps = {
    className: '',
    style: {}
  };

  private previousStyles: { prop: string; value: string }[] = [];

  public componentDidMount() {
    this.toggleClassName(true);
    this.toggleStyle(true);
  }

  public componentWillUnmount() {
    this.toggleClassName(false);
    this.toggleStyle(false);
  }

  public render() {
    return null;
  }

  private toggleClassName(apply: boolean) {
    const classNames = this.props.className!.split(' ');
    if (apply) {
      classNames.forEach(className => {
        if (className && !document.body.classList.contains(className)) {
          document.body.classList.add(className);
        }
      });
    } else {
      classNames.forEach(className => {
        if (className && document.body.classList.contains(className)) {
          document.body.classList.remove(className);
        }
      });
    }
  }

  private toggleStyle(apply: boolean) {
    const styles = Object.keys(this.props.style!).map((prop: any) => {
      const value = (this.props.style! as any)[prop];
      return {
        prop: prop.replace(/([a-z])([A-Z])/, '$1-L$2'),
        value: typeof value === 'number' ? `${value}px` : value
      };
    });

    if (apply) {
      this.previousStyles = styles.map(({ prop }) => {
        return {
          prop: prop,
          value: document.body.style[prop as any]
        };
      });
      styles.forEach(({ prop, value }) => {
        document.body.style[prop] = value;
      });
    } else {
      styles.forEach(({ prop }) => {
        document.body.style[prop] = (null as any) as string;
      });
      this.previousStyles.forEach(({ prop, value }) => {
        // @ts-ignore
        document.body.style[prop] = value;
      });
    }
  }
}
