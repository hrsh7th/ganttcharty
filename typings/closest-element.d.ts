declare module 'closest-element' {

  const Closest: (
    element: HTMLElement,
    selectorOrElement: string | HTMLElement,
    rootElement?: HTMLElement,
    excludeSelf?: boolean
  ) => HTMLElement | null;

  export default Closest;

}
