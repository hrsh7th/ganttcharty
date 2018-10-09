export type UI = {
  viewportWidth: number;
};

export const defaults = (element: HTMLElement, ui: Partial<UI>) => {
  ui.viewportWidth = element.offsetWidth;
  return ui;
};
