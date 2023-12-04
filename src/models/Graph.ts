import {G, Path} from '@svgdotjs/svg.js';
import {flextree, FlextreeNode} from 'd3-flextree';
import {getEdge} from 'src/utils';
import {generateStyles, getTooltip, getTooltipStyles, highlightToPath, updateTooltip} from 'src/utils';
import {Paper} from 'src/models/Paper';
import {DirectionConfig} from 'src/settings/DirectionConfig';
import {FontOptions, NodeOptions, TooltipOptions, TreeDirection, TreeOptions} from 'src/settings/Options';

export interface GraphPoint {
  readonly x: number;
  readonly y: number;
}

export interface Node {
  readonly id: string;
  readonly name: string;
  readonly children: Array<Node>;
  readonly options?: NodeOptions & TooltipOptions & FontOptions;
}

export interface TreeNode<N> extends FlextreeNode<N> {
  hiddenChildren: Array<TreeNode<N>> | undefined;
  edge?: Path;
}

export class Graph extends Paper {
  public options: TreeOptions;
  public rootNode: TreeNode<Node>;
  public element: HTMLElement;
  constructor(element: HTMLElement, options: TreeOptions) {
    super(element, options.width, options.height, options.canvasStyle);
    this.element = element;
    this.options = options;
  }

  public construct(data: Node): void {
    const {nodeWidth, nodeHeight, siblingSpacing, childrenSpacing} = this.options;
    const flexLayout = flextree({
      nodeSize: () => {
        return DirectionConfig[this.options.direction].nodeFlexSize({
          nodeWidth,
          nodeHeight,
          siblingSpacing,
          childrenSpacing,
        });
      },
      spacing: 0,
    });
    const tree = flexLayout.hierarchy(data);
    this.rootNode = flexLayout(tree) as any;
  }

  public renderNode(node: TreeNode<Node>, mainGroup: G) {
    const options = this.options;
    const {nodeWidth, nodeHeight, nodeTemplate, highlightOnHover, borderRadius, enableTooltip, tooltipTemplate} =
      options;
    const {
      tooltipId,
      tooltipMaxWidth,
      tooltipBGColor,
      tooltipBorderColor,
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
      borderWidth,
      borderStyle,
      borderColor,
      nodeBGColor,
    } = {...options, ...node.data.options};
    const {x, y} = DirectionConfig[options.direction].swap(node);

    const group = Paper.drawGroup(x, y, node.data.id, node.parent?.data.id);
    const nodeContent = nodeTemplate(node.data[options.contentKey as keyof Node]);
    const object = Paper.drawTemplate(nodeContent, {nodeWidth, nodeHeight});
    const nodeStyle = generateStyles({fontSize, fontWeight, fontFamily, fontColor});
    const borderStyles = generateStyles({
      borderColor,
      borderStyle,
      borderWidth: `${borderWidth}px`,
      borderRadius,
      backgroundColor: nodeBGColor,
    });
    object.attr('style', borderStyles);
    group.attr('style', nodeStyle);
    group.add(object);
    const nodes = this.rootNode.nodes;
    if (highlightOnHover) {
      group.on('mouseover', function () {
        const self = this.node.dataset.self;
        const selfNode = nodes.find((n) => n.data.id === self);
        selfNode && highlightToPath(nodes, selfNode, true, options);
      });
      group.on('mouseout', function () {
        const self = this.node.dataset.self;
        const selfNode = nodes.find((n) => n.data.id === self);
        selfNode && highlightToPath(nodes, selfNode, false, options);
      });
    }

    if (enableTooltip) {
      const tooltipContent = tooltipTemplate
        ? tooltipTemplate(node.data[this.options.contentKey as keyof Node])
        : nodeContent;
      group.on('mousemove', function (e: MouseEvent) {
        const styles = getTooltipStyles(
          e.x,
          e.y,
          tooltipMaxWidth,
          tooltipBorderColor,
          tooltipBGColor,
          !tooltipTemplate,
        );
        updateTooltip(tooltipId, styles.join(' '), tooltipContent);
      });
      group.on('mouseout', function (e: MouseEvent) {
        if ((e.relatedTarget as HTMLElement).tagName === 'svg') {
          updateTooltip(tooltipId);
        }
      });
    }
    mainGroup.add(group);
  }

  public renderEdge(node: TreeNode<Node>, group: G) {
    const {nodeWidth, nodeHeight} = this.options;
    const edge = getEdge(node, nodeWidth, nodeHeight, this.options.direction);
    if (!edge) return;
    const path = Paper.drawPath(edge, {id: `${node.data.id}-${node.parent?.data.id}`});
    node.edge = path;
    group.add(path);
  }

  public collapse(nodeId: string) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: TreeNode<Node>) => n.data.name === nodeId);
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
    this.render();
  }

  public fitScreen() {
    const {childrenSpacing, siblingSpacing} = this.options;
    const {viewBoxDimensions} = DirectionConfig[this.options.direction];
    const {
      x,
      y,
      width: vWidth,
      height: vHeight,
    } = viewBoxDimensions({rootNode: this.rootNode, childrenSpacing, siblingSpacing});
    this.updateViewBox(x, y, vWidth, vHeight);
  }

  public render(): void {
    this.clear();
    const {containerClassName, enableTooltip, tooltipId, fontSize, fontWeight, fontFamily, fontColor} = this.options;
    const globalStyle = generateStyles({fontSize, fontWeight, fontFamily, fontColor});
    const mainGroup = Paper.drawGroup(0, 0, containerClassName);
    mainGroup.attr('style', globalStyle);
    mainGroup.id(containerClassName);

    const nodes = this.rootNode.nodes;
    console.log('nodes', this.rootNode, nodes);
    nodes.forEach((node: any) => {
      this.renderNode(node, mainGroup);
      this.renderEdge(node, mainGroup);
    });
    this.add(mainGroup);
    this.fitScreen();

    if (enableTooltip) {
      const tooltipElement = getTooltip(tooltipId);
      this.element.append(tooltipElement);
    }
  }
}
