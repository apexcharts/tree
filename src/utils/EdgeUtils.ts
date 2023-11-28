import {Node, TreeNode} from 'src/models/Graph';
import {DirectionConfig} from 'src/settings/DirectionConfig';

export const getEdge = (
  node: TreeNode<Node>,
  nodeWidth: number,
  nodeHeight: number,
  graphDirection: string,
): string | null => {
  if (!node || !node.parent) return null;
  const {edgeX, edgeY, edgeParentX, edgeParentY, edgeMidX, edgeMidY, calculateEdge, swap} =
    DirectionConfig[graphDirection];
  const newNode = swap(node);
  const newParent = swap(node.parent);
  const child = {
    x: edgeX({node: newNode, nodeWidth, nodeHeight}),
    y: edgeY({node: newNode, nodeWidth, nodeHeight}),
  };

  const parent = {
    x: edgeParentX({parent: newParent, nodeWidth, nodeHeight}),
    y: edgeParentY({parent: newParent, nodeWidth, nodeHeight}),
  };

  const mid = {
    x: edgeMidX({node: newNode, nodeWidth, nodeHeight}),
    y: edgeMidY({node: newNode, nodeWidth, nodeHeight}),
  };
  return calculateEdge(child, parent, mid, {sy: 0});
};
