import {GraphPoint} from 'src/models';
import {Node, TreeNode} from 'src/models/Graph';

/* Horizontal diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compact-horizontal */
export const curvedEdgesHorizontal = (s: GraphPoint, t: GraphPoint, m: GraphPoint): string => {
  // Define source and target x,y coordinates
  const x = s.x;
  const y = s.y;
  const ex = t.x;
  const ey = t.y;

  const mx = m?.x ?? x;
  const my = m?.y ?? y;

  // Values in case of top reversed and left reversed diagonals
  const xrvs = ex - x < 0 ? -1 : 1;
  const yrvs = ey - y < 0 ? -1 : 1;

  // Define preferred curve radius
  const rdef = 35;

  // Reduce curve radius, if source-target x space is smaller
  let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

  // Further reduce curve radius, is y space is more small
  r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

  // Defin width and height of link, excluding radius
  // const h = Math.abs(ey - y) / 2 - r;
  const w = Math.abs(ex - x) / 2 - r;

  // Build and return custom arc command
  const pathArray = [
    `M ${mx} ${my}`,
    `L ${mx} ${y}`,
    `L ${x} ${y}`,
    `L ${x + w * xrvs} ${y}`,
    `C ${x + w * xrvs + r * xrvs} ${y} ${x + w * xrvs + r * xrvs} ${y} ${x + w * xrvs + r * xrvs} ${y + r * yrvs}`,
    `L ${x + w * xrvs + r * xrvs} ${ey - r * yrvs}`,
    `C ${x + w * xrvs + r * xrvs} ${ey} ${x + w * xrvs + r * xrvs} ${ey} ${ex - w * xrvs} ${ey}`,
    `L ${ex} ${ey}`,
  ];
  return pathArray.join(' ');
};
/* Vertical diagonal generation algorithm - https://observablehq.com/@bumbeishvili/curved-edges-compacty-vertical */
export const curvedEdgesVertical = (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets = {sy: 0}): string => {
  const x = s.x;
  let y = s.y;

  const ex = t.x;
  const ey = t.y;

  const mx = m?.x ?? x;
  const my = m?.y ?? y;

  const xrvs = ex - x < 0 ? -1 : 1;
  const yrvs = ey - y < 0 ? -1 : 1;

  y += offsets.sy;

  const rdef = 35;
  let r = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;

  r = Math.abs(ey - y) / 2 < r ? Math.abs(ey - y) / 2 : r;

  const h = Math.abs(ey - y) / 2 - r;
  const w = Math.abs(ex - x) - r * 2;
  //w=0;
  const pathArray = [
    `M ${mx} ${my}`,
    `L ${x} ${my}`,
    `L ${x} ${y}`,
    `L ${x} ${y + h * yrvs}`,
    `C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x + r * xrvs} ${y + h * yrvs + r * yrvs}`,
    `L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}`,
    `C  ${ex} ${y + h * yrvs + r * yrvs} ${ex} ${y + h * yrvs + r * yrvs} ${ex} ${ey - h * yrvs}`,
    `L ${ex} ${ey}`,
  ];
  return pathArray.join(' ');
};
export interface DirectionConfigProperties {
  readonly containerX: (params: Partial<ConfigParams>) => number;
  readonly containerY: (params: Partial<ConfigParams>) => number;
  readonly edgeX: (params: Partial<ConfigParams>) => number;
  readonly edgeY: (params: Partial<ConfigParams>) => number;
  readonly edgeMidX: (params: Partial<ConfigParams>) => number;
  readonly edgeMidY: (params: Partial<ConfigParams>) => number;
  readonly edgeParentX: (params: Partial<ConfigParams>) => number;
  readonly edgeParentY: (params: Partial<ConfigParams>) => number;
  readonly nodeFlexSize: (params: Partial<ConfigParams>) => [number, number];
  readonly calculateEdge: (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets: any) => string;
  readonly swap: (node: TreeNode<Node>) => {x: number; y: number};
  readonly viewBoxDimensions: ({
    rootNode,
    childrenSpacing,
    siblingSpacing,
  }: {
    rootNode: TreeNode<Node>;
    childrenSpacing: number;
    siblingSpacing: number;
  }) => {x: number; y: number; width: number; height: number};
}

interface ConfigParams {
  readonly node: any;
  readonly parent: any;
  readonly width: number;
  readonly height: number;
  readonly nodeWidth: number;
  readonly nodeHeight: number;
  readonly siblingSpacing: number;
  readonly childrenSpacing: number;
  readonly x: number;
  readonly y: number;
}

export const DirectionConfig: Record<string, DirectionConfigProperties> = {
  top: {
    containerX: ({width}: ConfigParams) => width / 2,
    containerY: () => 0,
    edgeX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth / 2,
    edgeY: ({node}: ConfigParams) => node.y,
    edgeMidX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth / 2,
    edgeMidY: ({node}: ConfigParams) => node.y,
    edgeParentX: ({parent, nodeWidth}: ConfigParams) => parent.x + nodeWidth / 2,
    edgeParentY: ({parent, nodeHeight}: ConfigParams) => parent.y + nodeHeight,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingSpacing, childrenSpacing}: ConfigParams): [number, number] => {
      return [nodeWidth + siblingSpacing, nodeHeight + childrenSpacing];
    },
    calculateEdge: curvedEdgesVertical,
    swap: (node: TreeNode<Node>) => ({
      x: node.left,
      y: node.top,
    }),
    viewBoxDimensions: ({rootNode, childrenSpacing, siblingSpacing}) => {
      const {left, top, right, bottom} = rootNode.extents;
      const width = Math.abs(left) + Math.abs(right);
      const height = Math.abs(top) + Math.abs(bottom);
      const x = Math.abs(left) + siblingSpacing / 2;
      const y = (rootNode.ySize - childrenSpacing) / 2;
      return {x: -x, y: -y, width, height};
    },
  },
  bottom: {
    containerX: ({width}: ConfigParams) => width / 2,
    containerY: ({height, nodeHeight}: ConfigParams) => height - nodeHeight - 10,
    edgeX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth / 2,
    edgeY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight,
    edgeMidX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth / 2,
    edgeMidY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight,
    edgeParentX: ({parent, nodeWidth}: ConfigParams) => parent.x + nodeWidth / 2,
    edgeParentY: ({parent}: ConfigParams) => parent.y,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingSpacing, childrenSpacing}: ConfigParams): [number, number] => {
      return [nodeWidth + siblingSpacing, nodeHeight + childrenSpacing];
    },
    calculateEdge: curvedEdgesVertical,
    swap: (node: TreeNode<Node>) =>
      ({
        ...node,
        y: -node.y,
      }) as TreeNode<Node>,
    viewBoxDimensions: ({rootNode, childrenSpacing, siblingSpacing}) => {
      const {left, top, right, bottom} = rootNode.extents;
      const width = Math.abs(left) + Math.abs(right);
      const height = Math.abs(top) + Math.abs(bottom);
      const x = Math.abs(left) - (rootNode.xSize - siblingSpacing) / 2;
      const y = height - rootNode.ySize + childrenSpacing / 2;
      return {x: -x, y: -y, width, height};
    },
  },
  left: {
    containerX: () => 10,
    containerY: ({height}: ConfigParams) => height / 2,
    edgeX: ({node}: ConfigParams) => node.x,
    edgeY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight / 2,
    edgeMidX: ({node}: ConfigParams) => node.x,
    edgeMidY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight / 2,
    edgeParentX: ({parent, nodeWidth}: ConfigParams) => parent.x + nodeWidth,
    edgeParentY: ({parent, nodeHeight}: ConfigParams) => parent.y + nodeHeight / 2,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingSpacing, childrenSpacing}: ConfigParams) => {
      return [nodeHeight + siblingSpacing, nodeWidth + childrenSpacing];
    },
    calculateEdge: curvedEdgesHorizontal,
    swap: (node: TreeNode<Node>) =>
      ({
        ...node,
        x: node.y,
        y: node.x,
      }) as TreeNode<Node>,
    viewBoxDimensions: ({rootNode, childrenSpacing, siblingSpacing}) => {
      const {left, top, right, bottom} = rootNode.extents;
      const width = Math.abs(top) + Math.abs(bottom);
      const height = Math.abs(left) + Math.abs(right);
      const x = Math.abs(top) + childrenSpacing / 2;
      const y = Math.abs(left) - siblingSpacing;
      return {x: -x, y: -y, width, height};
    },
  },
  right: {
    containerX: ({width, nodeWidth}: ConfigParams) => width - nodeWidth - 10,
    containerY: ({height}: ConfigParams) => height / 2,
    edgeX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth,
    edgeY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight / 2,
    edgeMidX: ({node, nodeWidth}: ConfigParams) => node.x + nodeWidth,
    edgeMidY: ({node, nodeHeight}: ConfigParams) => node.y + nodeHeight / 2,
    edgeParentX: ({parent}: ConfigParams) => parent.x,
    edgeParentY: ({parent, nodeHeight}: ConfigParams) => parent.y + nodeHeight / 2,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingSpacing, childrenSpacing}: ConfigParams) => {
      return [nodeHeight + siblingSpacing, nodeWidth + childrenSpacing];
    },
    calculateEdge: curvedEdgesHorizontal,
    swap: (node: TreeNode<Node>) =>
      ({
        ...node,
        x: -node.y,
        y: node.x,
      }) as TreeNode<Node>,
    viewBoxDimensions: ({rootNode, siblingSpacing, childrenSpacing}) => {
      const {left, top, right, bottom} = rootNode.extents;
      const width = Math.abs(top) + Math.abs(bottom);
      const height = Math.abs(left) + Math.abs(right);
      const x = width - rootNode.ySize + childrenSpacing / 2;
      const y = Math.abs(left) - siblingSpacing;
      return {x: -x, y: -y, width, height};
    },
  },
};
