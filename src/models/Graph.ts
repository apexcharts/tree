import { Dom, G } from '@svgdotjs/svg.js';
import { flextree } from 'd3-flextree';
import { Paper } from 'src/modules/Paper';
import { DirectionConfig, TreeDirection, TreeOptions } from 'src/modules/settings/Options';

export interface GraphPoint {
  readonly x: number;
  readonly y: number;
}

export class Graph {
  public options: TreeOptions;
  public rootNode: any;
  public element: Dom;
  public paper: Paper;
  private directionConfig: any;

  constructor(element: Dom, data: any, options: TreeOptions) {
    this.element = element;
    this.options = options;
    this.rootNode = data;
    const {width, height} = this.options;
    this.paper = new Paper(this.element, width, height);
    this.directionConfig = DirectionConfig[this.options.direction];
  }

  public clear() {
    this.paper.svg.clear();
  }

  public construct(): void {
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
      spacing: (nodeA, nodeB) => (nodeA.parent == nodeB.parent ? 0 : 80),
    });
    const tree = flexLayout.hierarchy(this.rootNode);
    this.rootNode = flexLayout(tree) as any;
  }

  public renderNode(node: any, mainGroup: G) {
    const {nodeWidth, nodeHeight, nodeBorderRadius} = this.options;
    const {x, y} = this.directionConfig.swap(node);
    // const {x, y} = node;
    const group = Paper.drawGroup(x, y);
    const rect = Paper.drawRect({
      width: nodeWidth,
      height: nodeHeight,
      strokeColor: '#b00',
      radius: nodeBorderRadius,
      id: node.data.name,
    });
    group.add(rect);

    const text = Paper.drawText(node.data[this.options.titleKey], {dx: 10, dy: nodeHeight / 1.5});
    group.add(text);

    mainGroup.add(group);

    node.children?.forEach((child: any) => {
      this.renderNode(child, mainGroup);
    });
  }

  public getEdge(node: any) {
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

  public renderEdge(node: any, group: G) {
    if (node && node.parent) {
      const edge = this.getEdge(node);
      const path = Paper.drawPath(edge);
      group.add(path);
    }
  }

  public collapse(nodeId: any) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: any) => n.data.name === nodeId);
    if (node?.children) {
      node.hiddenChilds = node.children;
      node.hiddenChilds.forEach((child: any) => this.collapse(child));
      node.children = null;
      this.render();
    }
  }

  public expand(nodeId: any) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: any) => n.data.name === nodeId);
    if (node?.hiddenChilds) {
      node.children = node.hiddenChilds;
      node.children.forEach((child: any) => this.expand(child));
      node.hiddenChilds = null;
      this.render();
    }
  }

  public changeLayout(direction: TreeDirection = 'top') {
    this.options = {...this.options, direction};
    this.directionConfig = DirectionConfig[direction];
    this.render();
  }

  public render(): void {
    this.clear();
    const {containerX, containerY} = this.directionConfig;
    const {width, height} = this.options;
    const mainGroup = Paper.drawGroup(containerX({width, height}), containerY({width, height}));
    this.renderNode(this.rootNode, mainGroup);

    const nodes = this.rootNode.descendants().slice(1);
    console.log('nodes', this.rootNode, nodes);
    nodes.forEach((node: any) => {
      this.renderEdge(node, mainGroup);
    });
    this.paper.svg.add(mainGroup);
  }
}
