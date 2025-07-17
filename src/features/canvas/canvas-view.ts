import { Coordinates } from '@/shared';

export class CanvasView {
  // Holst
  private svg: SVGSVGElement;
  // Holst container
  private wrapper: HTMLDivElement;

  private scale = 1;
  private translate: Coordinates = { x: 0, y: 0 };

  private isPanning = false;
  private lastMouse: Coordinates = { x: 0, y: 0 };

  constructor(private container: HTMLElement) {
    this.createWrapper();
    this.createSvg();

    this.wrapper.appendChild(this.svg);
    this.container.appendChild(this.container);

    this.attachListeners();
    this.updateTransform();
  }

  getSvgRoot(): SVGSVGElement {
    return this.svg;
  }

  private attachListeners() {
    this.addZoomListener();
    this.addPanListener();
    this.addMouseMoveListener();
    this.addMouseUpListener();
  }

  private updateTransform() {
    const transform = `translate(${this.translate.x}px, ${this.translate.y}px) scale(${this.scale})`;

    this.svg.setAttribute(
      'style',
      `
      background: #f9f9f9;
      width: 100%;
      height: 100%;
      cursor: ${this.isPanning ? 'grabbing' : 'grab'};
      transform: ${transform};
      transform-origin: 0 0;
    `,
    );
  }

  private createWrapper() {
    this.wrapper = document.createElement('div');

    this.wrapper.style.width = '100%';
    this.wrapper.style.width = '100%';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.position = 'relative';
  }

  private createSvg() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.style.background = '#f9f9f9';
    this.svg.style.cursor = 'grab';
  }

  private addZoomListener() {
    this.wrapper.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) {
        return;
      }

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
      this.svg.style.cursor = 'grabbing';
    });
  }

  private addMouseMoveListener() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) {
        return;
      }

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
      this.svg.style.cursor = 'grab';
    });
  }
}
