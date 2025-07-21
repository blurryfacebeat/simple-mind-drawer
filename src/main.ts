import { BlockNode, CanvasView, SelectionManager } from '@/features';

const root = document.getElementById('app')!;
const view = new CanvasView(root);
const holst = view.getRootGroup();
const selection = new SelectionManager();

const handleSelect = (node: BlockNode, additive: boolean) => {
  selection.select(node, additive);
};

// Тест
for (let i = 0; i < 5; i++) {
  const block = new BlockNode(handleSelect);
  block.setPosition(100 + i * 140, 100);
  block.mount(holst);
}
