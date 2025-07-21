import { BlockNode } from './block-node';

export class SelectionManager {
  private selectedNodes = new Set<BlockNode>();

  constructor() {
    this.initListeners();
  }

  select(node: BlockNode, additive = false) {
    if (!additive) {
      this.clear();
    }

    if (this.selectedNodes.has(node)) {
      node.deselect();
      this.selectedNodes.delete(node);
    } else {
      node.select();
      this.selectedNodes.add(node);
    }
  }

  clear() {
    this.selectedNodes.forEach((node) => node.deselect());
    this.selectedNodes.clear();
  }

  getSelected(): BlockNode[] {
    return Array.from(this.selectedNodes);
  }

  isSelected(node: BlockNode): boolean {
    return this.selectedNodes.has(node);
  }

  private initListeners() {
    this.clearAllSelectionHandler();
  }

  private clearAllSelectionHandler() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        this.clear();
      }
    });
  }
}
