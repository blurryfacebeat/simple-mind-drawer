export abstract class BaseComponent<TElement extends Element = Element> {
  protected element: TElement;
  protected isMounted = false;

  abstract render(): TElement;
  abstract update(): void;

  protected onMount(): void {}
  protected onDestroy(): void {}

  mount(parent: Element): void {
    if (this.isMounted) {
      return;
    }

    this.element = this.render();
    parent.appendChild(this.element);
    this.onMount();
    this.isMounted = true;
  }

  destroy(): void {
    if (!this.isMounted) {
      return;
    }

    this.element.remove();
    this.onDestroy();
    this.isMounted = false;
  }

  getElement(): TElement {
    return this.element;
  }
}
