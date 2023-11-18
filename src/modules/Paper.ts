import {Element, ForeignObject, G, Path, Rect, Svg, SVG, Text, TextAttr} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import {DefaultOptions, NodeOptions} from 'src/modules/settings/Options';

export class Paper {
  private width: number;
  private height: number;
  private svg: Svg;
  constructor(element: HTMLElement, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.svg = SVG()
      .addTo(element)
      .size(width, height)
      .viewbox(`0 0 ${width} ${height}`)
      .panZoom({zoomFactor: 0.2})
      .attr({style: 'border: 1px solid black;'});
  }

  public add(element: Element) {
    this.svg.add(element);
  }

  public resetViewBox(): void {
    this.svg.viewbox(`0 0 ${this.width} ${this.height}`);
  }

  public updateViewBox(x: number, y: number, width: number, height: number): void {
    this.svg.viewbox(`${x} ${y} ${width} ${height}`);
  }

  public get(selector: string): Element {
    return this.svg.findOne(selector) as any;
  }

  public clear() {
    this.svg.clear().viewbox(`0 0 ${this.width} ${this.height}`);
  }

  static drawRect({
    x1 = undefined,
    y1 = undefined,
    width = 0,
    height = 0,
    radius = 0,
    color = '#fefefe',
    opacity = 1,
  } = {}): Rect {
    const rect = new Rect();
    rect.attr({
      x: x1 ?? undefined,
      y: y1 ?? undefined,
      width,
      height,
      rx: radius,
      ry: radius,
      opacity,
    });
    rect.fill(color);
    return rect;
  }

  static drawText(
    text: string = '',
    {x = undefined, y = undefined, dx = undefined, dy = undefined}: Partial<TextAttr>,
  ): Text {
    const textSvg = new Text();
    textSvg.font({fill: '#f06'});
    textSvg.tspan(text);

    if (x !== undefined && y !== undefined) {
      textSvg.move(x, y);
    }

    if (dx !== undefined && dy !== undefined) {
      textSvg.attr({dx, dy});
    }

    return textSvg;
  }

  static drawTemplate(template: any, {nodeWidth, nodeHeight}: Partial<NodeOptions> = {}): ForeignObject {
    const object = new ForeignObject({
      width: nodeWidth,
      height: nodeHeight,
    });
    object.add(template);
    return object;
  }

  static drawGroup(x: number = 0, y: number = 0, id: string, parent: string = ''): G {
    const group = new G();
    group.attr({transform: `translate(${x}, ${y})`, 'data-self': id, 'data-parent': parent});
    return group;
  }

  static drawPath(pathString: string, {id = '', borderColor = DefaultOptions.borderColor} = {}): Path {
    const path = new Path({d: pathString});
    path.id(id);
    path.fill('none').stroke({color: borderColor, width: 1});
    return path;
  }
}
