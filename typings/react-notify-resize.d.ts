declare module '@zippytech/react-notify-resize' {
  const NotifyResize: React.ComponentType<{
    onResize: (args: { width: number; height: number; }) => void;
    notifyOnMount?: boolean;
    measureSize?: () => { width: number; height: number; };
  }>;

  export { NotifyResize };
}

