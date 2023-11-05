import {GraphPoint} from 'src/models';
import {Node, TreeNode} from 'src/models/Graph';
import {curvedEdgesHorizontal, curvedEdgesVertical} from '../GraphUtils';

export type TreeDirection = 'left' | 'top' | 'right' | 'bottom';

export interface NodeOptions {
  readonly nodeWidth: number;
  readonly nodeHeight: number;
  readonly nodeBorderRadius: number;
  readonly nodeBGColor: string;
  readonly nodeBGColorHover: string;
  readonly nodeTemplate: (content: any) => any;
  readonly borderSize: number;
  readonly borderColor: string;
  readonly borderColorHover: string;
}

export interface TooltipOptions {
  readonly enableTooltip?: boolean;
  readonly tooltipId?: string;
  readonly tooltipTemplate?: (content: any) => any;
  readonly tooltipWidth?: number;
  readonly tooltipBorderColor?: string;
  readonly tooltipBGColor?: string;
}

export interface CommonOptions {
  readonly width: number;
  readonly height: number;
  readonly direction: TreeDirection;
  readonly idKey: string;
  readonly contentKey: string;
  readonly siblingSpacing: number;
  readonly childrenSpacing: number;
  readonly highlightOnHover: boolean;
  readonly containerClassName: string;
}

export type TreeOptions = CommonOptions & NodeOptions & TooltipOptions;

export const DefaultOptions: TreeOptions = {
  width: 400,
  height: 400,
  idKey: 'id',
  contentKey: 'name',
  nodeWidth: 50,
  nodeHeight: 30,
  nodeTemplate: (content: string) => {
    return `<div style='display: flex;justify-content: center;align-items: center;height: 100%;'>${content}</div>`;
  },
  nodeBorderRadius: 5,
  nodeBGColor: '#FFFFFF',
  nodeBGColorHover: '#FFFFFF',
  borderSize: 1,
  borderColor: '#BCBCBC',
  borderColorHover: '#5C6BC0',
  siblingSpacing: 50,
  childrenSpacing: 50,
  direction: 'top',
  highlightOnHover: true,
  containerClassName: 'root',
  enableTooltip: false,
  tooltipId: 'tooltip-container',
  tooltipWidth: 100,
  tooltipBorderColor: '#BCBCBC',
  tooltipBGColor: '#FFFFFF',
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
  readonly siblingsMargin: number;
  readonly childrenMargin: number;
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
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: ConfigParams): [number, number] => {
      return [nodeWidth + siblingsMargin, nodeHeight + childrenMargin];
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
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: ConfigParams): [number, number] => {
      return [nodeWidth + siblingsMargin, nodeHeight + childrenMargin];
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
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: ConfigParams) => {
      // return [nodeHeight + childrenMargin, nodeWidth + siblingsMargin];
      return [nodeWidth + childrenMargin, nodeHeight + siblingsMargin];
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
      const x = siblingSpacing;
      const y = (height + rootNode.ySize - childrenSpacing) / 2;
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
    nodeFlexSize: ({nodeWidth, nodeHeight, siblingsMargin, childrenMargin}: ConfigParams) => {
      // return [nodeHeight + siblingsMargin, nodeWidth + childrenMargin];
      return [nodeWidth + siblingsMargin, nodeHeight + childrenMargin];
    },
    calculateEdge: curvedEdgesHorizontal,
    swap: (node: TreeNode<Node>) =>
      ({
        ...node,
        x: -node.y,
        y: node.x,
      }) as TreeNode<Node>,
    viewBoxDimensions: ({rootNode, childrenSpacing}) => {
      const {left, top, right, bottom} = rootNode.extents;
      const width = Math.abs(top) + Math.abs(bottom);
      const height = Math.abs(left) + Math.abs(right);
      const x = width - rootNode.xSize;
      const y = (height + rootNode.ySize - childrenSpacing) / 2;
      return {x: -x, y: -y, width, height};
    },
  },
};
