import {Dom, G} from '@svgdotjs/svg.js';
import {flextree, FlextreeNode} from 'd3-flextree';
import {highlightToPath} from 'src/modules/GraphUtils';
import {Paper} from 'src/modules/Paper';
import {DirectionConfig, DirectionConfigProperties, TreeDirection, TreeOptions} from 'src/modules/settings/Options';

export interface GraphPoint {
  readonly x: number;
  readonly y: number;
}

export interface Node {
  readonly id: string;
  readonly name: string;
  readonly children: Array<Node>;
}

export interface TreeNode<Datum> extends FlextreeNode<Datum> {
  hiddenChildren: Array<TreeNode<Node>> | undefined;
}

export class Graph {
  public options: TreeOptions;
  public rootNode: TreeNode<Node>;
  public element: Dom;
  public paper: Paper;
  private directionConfig: DirectionConfigProperties;

  constructor(element: Dom, options: TreeOptions) {
    this.element = element;
    this.options = options;
    const {width, height} = this.options;
    this.paper = new Paper(this.element, width, height);
    this.directionConfig = DirectionConfig[this.options.direction];
  }

  public clear() {
    this.paper.clear();
  }

  public construct(data: Node): void {
    const {nodeWidth, nodeHeight, siblingSpacing, childrenSpacing} = this.options;
    const flexLayout = flextree({
      nodeSize: () => {
        const siblingsMargin = siblingSpacing;
        const childrenMargin = childrenSpacing;
        return this.directionConfig.nodeFlexSize({
          nodeWidth,
          nodeHeight,
          siblingsMargin,
          childrenMargin,
        });
      },
      spacing: 0,
    });
    const tree = flexLayout.hierarchy(data);
    this.rootNode = flexLayout(tree) as any;
  }

  public renderNode(node: any, mainGroup: G) {
    const {
      nodeWidth,
      nodeHeight,
      nodeBorderRadius,
      nodeTemplate,
      nodeBGColor,
      highlightOnHover,
      borderColor,
      borderColorHover,
    } = this.options;
    const {x, y} = this.directionConfig.swap(node);
    // const {x, y} = node;
    const group = Paper.drawGroup(x, y, node.data.id, node.parent?.data.id);
    const rect = Paper.drawRect({
      width: nodeWidth,
      height: nodeHeight,
      strokeColor: borderColor,
      radius: nodeBorderRadius,
      id: node.data.name,
    });
    group.add(rect);

    const object = Paper.drawTemplate(nodeTemplate(node.data[this.options.contentKey]), {
      nodeWidth,
      nodeHeight,
      nodeBGColor,
      nodeBorderRadius,
    });
    group.add(object);
    if (highlightOnHover) {
      group.on('mouseover', function () {
        highlightToPath(this.node, {strokeWidth: 3, strokeColor: borderColorHover});
      });
      group.on('mouseout', function () {
        highlightToPath(this.node, {strokeWidth: 1, strokeColor: borderColor});
      });
    }
    mainGroup.add(group);

    node.children?.forEach((child: any) => {
      this.renderNode(child, mainGroup);
    });
  }

  public getEdge(node: TreeNode<Node>): string | null {
    if (!node || !node.parent) return null;
    const {nodeWidth, nodeHeight} = this.options;
    const {edgeX, edgeY, edgeParentX, edgeParentY, edgeMidX, edgeMidY, calculateEdge} = this.directionConfig;
    const newNode = this.directionConfig.swap(node);
    const newParent = this.directionConfig.swap(node.parent);
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
  }

  public renderEdge(node: TreeNode<Node>, group: G) {
    const edge = this.getEdge(node);
    if (!edge) return;
    const path = Paper.drawPath(edge, {id: `${node.data.id}-${node.parent?.data.id}`});
    group.add(path);
  }

  public collapse(nodeId: string) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: any) => n.data.name === nodeId);
    if (node?.children) {
      node.hiddenChildren = node.children;
      node.hiddenChildren.forEach((child: any) => this.collapse(child));
      node.children = undefined;
      this.render();
    }
  }

  public expand(nodeId: string) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: any) => n.data.name === nodeId);
    if (node?.hiddenChildren) {
      node.children = node.hiddenChildren;
      node.children.forEach((child: any) => this.expand(child));
      node.hiddenChildren = undefined;
      this.render();
    }
  }

  public changeLayout(direction: TreeDirection = 'top') {
    this.options = {...this.options, direction};
    this.directionConfig = DirectionConfig[direction];
    this.render();
  }

  public fitScreen() {
    const {width, height, nodeWidth, nodeHeight, containerClassName} = this.options;
    const {containerX, containerY} = this.directionConfig;
    const root = this.paper.get(`#${containerClassName}`);
    const rootWidth = root?.width() as number;
    const rootHeight = root?.height() as number;
    const wScale = width / (rootWidth + 100);
    const hScale = height / (rootHeight + 100);
    const rootX = containerX({width, height, nodeWidth, nodeHeight});
    const rootY = containerY({width, height, nodeWidth, nodeHeight});
    root.attr({
      transform: `translate(${rootX}, ${rootY}) scale(${Math.min(wScale, hScale)})`,
    });
    this.paper.resetViewBox();
  }

  public render(): void {
    this.clear();
    const {containerX, containerY} = this.directionConfig;
    const {width, height, nodeWidth, nodeHeight, containerClassName} = this.options;
    const mainGroup = Paper.drawGroup(
      containerX({width, height, nodeWidth, nodeHeight}),
      containerY({width, height, nodeWidth, nodeHeight}),
      containerClassName,
    );
    mainGroup.id(containerClassName);
    this.renderNode(this.rootNode, mainGroup);

    const nodes = this.rootNode.descendants().slice(1);
    console.log('nodes', this.rootNode, nodes);
    nodes.forEach((node: any) => {
      this.renderEdge(node, mainGroup);
    });
    this.paper.add(mainGroup);
    this.fitScreen();
  }
}
