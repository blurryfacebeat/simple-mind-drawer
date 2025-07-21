import { BaseComponent, effect, reactive } from '@/features/core';
import { Coordinates } from '@/shared';

type BlockNodeState = {
  position: Coordinates;
  label: string;
};

type SelectHandler = (node: BlockNode, additive: boolean) => void;

export class BlockNode extends BaseComponent<SVGGElement> {
  private group: SVGGElement;
  private rect: SVGRectElement;
  private label: SVGTextElement;

  private state = reactive<BlockNodeState>({
    position: { x: 100, y: 100 },
    label: 'Block',
  });

  private isSelected = false;

  constructor(private onSelect?: SelectHandler) {
    super();
  }

  render(): SVGGElement {
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.group.setAttribute('data-block-node', 'true'); // 👈 чтобы CanvasView знал, что это блок

    this.initRect();
    this.initLabel();

    this.group.appendChild(this.rect);
    this.group.appendChild(this.label);

    return this.group;
  }

  update() {
    const { x, y } = this.state.position;
    this.group?.setAttribute('transform', `translate(${x}, ${y})`);
  }

  mount(parent: SVGGElement) {
    this.element = this.render();
    parent.appendChild(this.element);

    this.updateTransform();
    this.initSelect();
    this.initDrag();
  }

  setPosition(x: number, y: number) {
    this.state.position.x = x;
    this.state.position.y = y;

    this.updateTransform();
  }

  private updateTransform() {
    const { x, y } = this.state.position;
    this.group?.setAttribute('transform', `translate(${x}, ${y})`);
  }

  getPosition(): Coordinates {
    return { ...this.state.position };
  }

  setLabel(label: string) {
    this.state.label = label;
    this.label.textContent = label;
  }

  getLabel(): string {
    return this.state.label;
  }

  isSelectedBlock(): boolean {
    return this.isSelected;
  }

  private initSelect() {
    this.element.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button !== 0) return;
      event.stopPropagation();

      const additive = event.shiftKey;
      this.onSelect?.(this, additive);
    });
  }

  select() {
    this.isSelected = true;
    this.updateSelectionVisual();
  }

  deselect() {
    this.isSelected = false;
    this.updateSelectionVisual();
  }

  toggleSelect() {
    this.isSelected = !this.isSelected;
    this.updateSelectionVisual();
  }

  private updateSelectionVisual() {
    if (this.isSelected) {
      this.rect.setAttribute('stroke', '#007aff');
      this.rect.setAttribute('stroke-width', '2');
    } else {
      this.rect.setAttribute('stroke', '#333');
      this.rect.setAttribute('stroke-width', '1.5');
    }
  }

  private initDrag() {
    let offset: Coordinates = { x: 0, y: 0 };
    let isDragging = false;
    let pending = false;

    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;

      event.stopPropagation();

      isDragging = true;
      const currentPos = this.state.position;

      offset = {
        x: event.clientX - currentPos.x,
        y: event.clientY - currentPos.y,
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      lastX = event.clientX - offset.x;
      lastY = event.clientY - offset.y;

      if (!pending) {
        pending = true;
        requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      this.setPosition(lastX, lastY);
      pending = false;
    };

    const onMouseUp = () => {
      isDragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    this.group.addEventListener('mousedown', onMouseDown);
  }

  private initRect() {
    this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.rect.setAttribute('width', '120');
    this.rect.setAttribute('height', '60');
    this.rect.setAttribute('rx', '8');
    this.rect.setAttribute('fill', '#fff');
    this.rect.setAttribute('stroke', '#333');
    this.rect.setAttribute('stroke-width', '1.5');
  }

  private initLabel() {
    this.label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.label.textContent = this.state.label;
    this.label.setAttribute('x', '60');
    this.label.setAttribute('y', '35');
    this.label.setAttribute('text-anchor', 'middle');
    this.label.setAttribute('font-size', '14');
    this.label.setAttribute('fill', '#000');
  }
}
