import { G, Path } from '@svgdotjs/svg.js';
import { flextree, FlextreeNode } from 'd3-flextree';
import { ExpandCollapseButtonSize, getEdge } from 'src/utils';
import {
  generateStyles,
  getTooltip,
  getTooltipStyles,
  highlightToPath,
  updateTooltip,
} from 'src/utils';
import { Paper } from 'src/models/Paper';
import { DirectionConfig } from 'src/settings/DirectionConfig';
import {
  FontOptions,
  NodeOptions,
  TooltipOptions,
  TreeDirection,
  TreeOptions,
} from 'src/settings/Options';
import addSvg from 'src/icons/add-circle.svg';
import minusSvg from 'src/icons/minus-circle.svg';

export interface GraphPoint {
  readonly x: number;
  readonly y: number;
}

export interface Node {
  readonly id: string;
  readonly name: string;
  readonly children: Array<Node>;
  readonly expanded: boolean;
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
    const { nodeWidth, nodeHeight, siblingSpacing, childrenSpacing } =
      this.options;
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
    const {
      nodeWidth,
      nodeHeight,
      nodeTemplate,
      highlightOnHover,
      borderRadius,
      enableTooltip,
      tooltipTemplate,
      enableExpandCollapse,
    } = options;
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
      nodeStyle,
      nodeClassName,
    } = { ...options, ...node.data.options };
    const { x, y } = DirectionConfig[options.direction].swap(node);

    const graphInstance = this;

    const group = Paper.drawGroup(x, y, node.data.id, node.parent?.data.id);
    const nodeContent = nodeTemplate(
      node.data[options.contentKey as keyof Node],
    );
    const object = Paper.drawTemplate(nodeContent, { nodeWidth, nodeHeight });
    const groupStyle = generateStyles({
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
    });
    const borderStyles = generateStyles({
      borderColor,
      borderStyle,
      borderWidth: `${borderWidth}px`,
      borderRadius,
      backgroundColor: nodeBGColor,
    });
    object.attr('style', borderStyles.concat(nodeStyle));
    object.attr('class', nodeClassName);
    group.attr('style', groupStyle);
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
          e.pageX,
          e.pageY,
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

    if (!node.children && !node.hiddenChildren) {
      return;
    }

    if (enableExpandCollapse) {
      //add expand/collapse buttons
      const expandButtonRadius = ExpandCollapseButtonSize / 2;
      const buttonGroup = Paper.drawGroup(x + nodeWidth / 2 - expandButtonRadius, y + nodeHeight - expandButtonRadius, node.data.id);
      const buttonClickArea = Paper.drawCircle({cx: expandButtonRadius, cy: expandButtonRadius, r: expandButtonRadius, style: 'fill: #FFF; cursor: pointer;'});
      buttonGroup.data('expanded', false);
      buttonGroup.add(buttonClickArea);
      if (node.hiddenChildren) {
        buttonGroup.add(addSvg as any);
      } else {
        buttonGroup.add(minusSvg as any);
      }
      buttonGroup.on('click', function() {
        if (node.hiddenChildren) {
          graphInstance.expand(this.node.dataset.self);
        } else {
          graphInstance.collapse(this.node.dataset.self);
        }
      });
      mainGroup.add(buttonGroup);
    }
  }

  public renderEdge(node: TreeNode<Node>, group: G) {
    const { nodeWidth, nodeHeight } = this.options;
    const edge = getEdge(node, nodeWidth, nodeHeight, this.options.direction);
    if (!edge) return;
    const path = Paper.drawPath(edge, {
      id: `${node.data.id}-${node.parent?.data.id}`,
    });
    node.edge = path;
    group.add(path);
  }

  public collapse(nodeId: string) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: TreeNode<Node>) => n.data.id === nodeId);
    if (node?.children) {
      node.hiddenChildren = node.children;
      node.hiddenChildren.forEach((child: any) => this.collapse(child));
      node.children = undefined;
      this.render({keepOldPosition: true});
    }
  }

  public expand(nodeId: string) {
    const nodes = this.rootNode.descendants();
    const node = nodes.find((n: any) => n.data.id === nodeId);
    if (node?.hiddenChildren) {
      node.children = node.hiddenChildren;
      node.children.forEach((child: any) => this.expand(child));
      node.hiddenChildren = undefined;
      this.render({keepOldPosition: true});
    }
  }

  public changeLayout(direction: TreeDirection = 'top') {
    this.options = { ...this.options, direction };
    this.render({keepOldPosition: false});
  }

  public fitScreen() {
    const { childrenSpacing, siblingSpacing } = this.options;
    const { viewBoxDimensions } = DirectionConfig[this.options.direction];
    const {
      x,
      y,
      width: vWidth,
      height: vHeight,
    } = viewBoxDimensions({
      rootNode: this.rootNode,
      childrenSpacing,
      siblingSpacing,
    });
    this.updateViewBox(x, y, vWidth, vHeight);
  }

  public render({keepOldPosition = false} = {}): void {
    const oldViewbox = this.canvas.viewbox();
    this.clear();
    const {
      containerClassName,
      enableTooltip,
      tooltipId,
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
    } = this.options;
    const globalStyle = generateStyles({
      fontSize,
      fontWeight,
      fontFamily,
      fontColor,
    });
    const mainGroup = Paper.drawGroup(0, 0, containerClassName);
    mainGroup.attr('style', globalStyle);
    mainGroup.id(containerClassName);

    const nodes = this.rootNode.nodes;
    nodes.forEach((node: any) => {
      this.renderEdge(node, mainGroup);
    });
    nodes.forEach((node: any) => {
      this.renderNode(node, mainGroup);
    });
    this.add(mainGroup);
    this.fitScreen();

    if (keepOldPosition) {
      this.updateViewBox(oldViewbox.x, oldViewbox.y, oldViewbox.width, oldViewbox.height);
    }

    if (enableTooltip) {
      const tooltipElement = getTooltip(tooltipId);
      const body = document.body || document.getElementsByTagName('body')[0];
      body.append(tooltipElement);
    }
  }
}
