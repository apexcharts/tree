import { curvedEdgesHorizontal, curvedEdgesVertical } from '../GraphUtils';

export type TreeDirection = 'left' | 'top' | 'right' | 'bottom';

export interface TreeOptions {
  readonly width: number;
  readonly height: number;
  readonly direction: TreeDirection;
  readonly parentKey: string;
  readonly idKey: string;
  readonly titleKey: string;
  readonly nodeWidth: number;
  readonly nodeHeight: number;
  readonly nodeBorderRadius: number;
  readonly siblingSpacing: number;
  readonly childrenSpacing: number;
}

export const DefaultOptions: TreeOptions = {
  width: 400,
  height: 400,
  parentKey: 'parentId',
  idKey: 'id',
  titleKey: 'name',
  nodeWidth: 50,
  nodeHeight: 30,
  nodeBorderRadius: 5,
  siblingSpacing: 10,
  childrenSpacing: 50,
  direction: 'top',
};

export const DirectionConfig: Record<string, any> = {
  top: {
    containerX: ({width}: any) => width / 2,
    containerY: () => 0,
    edgeX: ({node, nodeWidth}: any) => node.x + nodeWidth / 2,
    edgeY: ({node}: any) => node.y,
    edgeMidX: ({node, nodeWidth}: any) => node.x + nodeWidth / 2,
    edgeMidY: ({node}: any) => node.y,
    edgeParentX: ({parent, nodeWidth}: any) => parent.x + nodeWidth / 2,
    edgeParentY: ({parent, nodeHeight}: any) => parent.y + nodeHeight,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: any): [number, number] => {
      return [nodeWidth + siblingsMargin, nodeHeight + childrenMargin];
    },
    calculateEdge: curvedEdgesVertical,
    nodeUpdateXY: ({x, y, width}: any) => ({x: x - width / 2, y}),
    swap: (node: any) => node,
  },
  left: {
    containerX: () => 0,
    containerY: ({height}: any) => height / 2,
    edgeX: ({node}: any) => node.x,
    edgeY: ({node, nodeHeight}: any) => node.y + nodeHeight / 2,
    edgeMidX: ({node}: any) => node.x,
    edgeMidY: ({node, nodeHeight}: any) => node.y + nodeHeight / 2,
    edgeParentX: ({parent, nodeWidth}: any) => parent.x + nodeWidth,
    edgeParentY: ({parent, nodeHeight}: any) => parent.y + nodeHeight / 2,
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: any) => {
      return [nodeHeight + siblingsMargin, nodeWidth + childrenMargin];
    },
    calculateEdge: curvedEdgesHorizontal,
    nodeUpdateXY: ({x, y, height}: any) => ({y: y - height / 2, x}),
    swap: (node: any) => ({
      ...node,
      x: node.y,
      y: node.x,
    }),
  },
};
