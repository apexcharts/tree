import {G, Path} from '@svgdotjs/svg.js';
import {flextree, FlextreeNode} from 'd3-flextree';
import {getEdge} from 'src/modules/EdgeUtils';
import {generateStyles, getTooltip, getTooltipStyles, highlightToPath, updateTooltip} from 'src/modules/GraphUtils';
import {Paper} from 'src/modules/Paper';
import {DirectionConfig} from 'src/modules/settings/DirectionConfig';
import {FontOptions, NodeOptions, TooltipOptions, TreeDirection, TreeOptions} from 'src/modules/settings/Options';

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

export class Graph {
  public options: TreeOptions;
  public rootNode: TreeNode<Node>;
  public element: HTMLElement;
  public paper: Paper;
  constructor(element: HTMLElement, options: TreeOptions) {
    this.element = element;
    this.options = options;
    const {width, height, canvasStyle} = this.options;
    this.paper = new Paper(this.element, width, height, canvasStyle);
  }

  public clear() {
    this.paper.clear();
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
    const {nodeWidth, nodeHeight, nodeTemplate, highlightOnHover, borderRadius, enableTooltip, tooltipTemplate} =
      this.options;
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
      borderColorHover,
      nodeBGColor,
    } = {...this.options, ...node.data.options};
    const {x, y} = DirectionConfig[this.options.direction].swap(node);

    const group = Paper.drawGroup(x, y, node.data.id, node.parent?.data.id);
    const nodeContent = nodeTemplate(node.data[this.options.contentKey as keyof Node]);
    const object = Paper.drawTemplate(nodeContent, {
      nodeWidth,
      nodeHeight,
    });
    const nodeStyle = generateStyles({
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
    });
    const borderStyles = generateStyles({
      borderColor,
      borderStyle,
      borderWidth,
      borderRadius: borderRadius,
      backgroundColor: nodeBGColor,
    });
    object.attr('style', borderStyles);
    group.attr('style', nodeStyle);
    group.add(object);
    if (highlightOnHover) {
      group.on('mouseover', function () {
        highlightToPath(this.node, {borderWidth: 2, borderColor: borderColorHover});
      });
      group.on('mouseout', function () {
        highlightToPath(this.node, {borderWidth: 1, borderColor: borderColor});
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

    node.children?.forEach((child: any) => {
      this.renderNode(child, mainGroup);
    });
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
    this.paper.updateViewBox(x, y, vWidth, vHeight);
  }

  public render(): void {
    this.clear();
    const {containerClassName, enableTooltip, tooltipId, fontSize, fontWeight, fontFamily, fontColor} = this.options;
    const globalStyle = generateStyles({fontSize, fontWeight, fontFamily, fontColor});
    const mainGroup = Paper.drawGroup(0, 0, containerClassName);
    mainGroup.attr('style', globalStyle);
    mainGroup.id(containerClassName);
    this.renderNode(this.rootNode, mainGroup);

    const nodes = this.rootNode.descendants().slice(1);
    console.log('nodes', this.rootNode, nodes);
    nodes.forEach((node: any) => {
      this.renderEdge(node, mainGroup);
    });
    this.paper.add(mainGroup);
    this.fitScreen();

    if (enableTooltip) {
      const tooltipElement = getTooltip(tooltipId);
      this.element.append(tooltipElement);
    }
  }
}
