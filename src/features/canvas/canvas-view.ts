import { Coordinates } from '@/shared';

export class CanvasView {
  private wrapper: HTMLDivElement;
  private holst: SVGSVGElement;
  private innerGroup: SVGGElement;

  private scale = 1;
  private translate: Coordinates = { x: 0, y: 0 };

  private isPanning = false;
  private lastMouse: Coordinates = { x: 0, y: 0 };

  constructor(private container: HTMLElement) {
    this.createWrapper();
    this.createHolst();

    this.wrapper.appendChild(this.holst);
    this.container.appendChild(this.wrapper);

    this.attachListeners();
    this.updateTransform();
  }

  getHolstRoot(): SVGSVGElement {
    return this.holst;
  }

  getRootGroup(): SVGGElement {
    return this.innerGroup;
  }

  private attachListeners() {
    this.addZoomListener();
    this.addPanListener();
    this.addMouseMoveListener();
    this.addMouseUpListener();
  }

  private updateTransform() {
    const transform = `translate(${this.translate.x}, ${this.translate.y}) scale(${this.scale})`;
    this.innerGroup.setAttribute('transform', transform);
  }

  private createWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.position = 'relative';
  }

  private createHolst() {
    this.holst = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.holst.setAttribute('width', '100%');
    this.holst.setAttribute('height', '100%');
    this.holst.style.background = '#f9f9f9';
    this.holst.style.cursor = 'grab';

    this.innerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.holst.appendChild(this.innerGroup);
  }

  private addZoomListener() {
    this.wrapper.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) return;

      event.preventDefault();

      const delta = -event.deltaY * 0.001;
      this.scale = Math.min(Math.max(this.scale + delta, 0.2), 4);

      this.updateTransform();
    });
  }

  private addPanListener() {
    this.wrapper.addEventListener('mousedown', (e) => {
      this.isPanning = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.holst.style.cursor = 'grabbing';
    });
  }

  private addMouseMoveListener() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;

      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;

      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.translate.x += dx;
      this.translate.y += dy;

      this.updateTransform();
    });
  }

  private addMouseUpListener() {
    window.addEventListener('mouseup', () => {
      this.isPanning = false;
      this.holst.style.cursor = 'grab';
    });
  }
}
