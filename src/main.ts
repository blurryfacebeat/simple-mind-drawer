import { BlockNode, CanvasView } from '@/features';

const root = document.getElementById('app')!;
const view = new CanvasView(root);
const holst = view.getRootGroup();

const selected: Set<BlockNode> = new Set();

const handleSelect = (node: BlockNode, additive: boolean) => {
  if (!additive) {
    selected.forEach((n) => n.deselect());
    selected.clear();
    node.select();
    selected.add(node);
  } else {
    if (selected.has(node)) {
      node.deselect();
      selected.delete(node);
    } else {
      node.select();
      selected.add(node);
    }
  }
};

// Тест
for (let i = 0; i < 5; i++) {
  const block = new BlockNode(handleSelect);
  block.setPosition(100 + i * 140, 100);
  block.mount(holst);
}
