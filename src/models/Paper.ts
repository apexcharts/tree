import {Element, ForeignObject, G, Path, Rect, Svg, SVG, Text, TextAttr} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import {DefaultOptions, NodeOptions} from 'src/settings/Options';

export class Paper {
  private readonly width: number;
  private readonly height: number;
  public canvas: Svg;
  constructor(element: HTMLElement, width: number, height: number, canvasStyle: string) {
    this.width = width;
    this.height = height;
    this.canvas = SVG()
      .addTo(element)
      .size(width, height)
      .viewbox(`0 0 ${width} ${height}`)
      .panZoom({zoomFactor: 0.2, zoomMin: 0.1})
      .attr({style: canvasStyle});
  }

  public add(element: Element) {
    this.canvas.add(element);
  }

  public resetViewBox(): void {
    this.canvas.viewbox(`0 0 ${this.width} ${this.height}`);
  }

  public updateViewBox(x: number, y: number, width: number, height: number): void {
    this.canvas.viewbox(`${x} ${y} ${width} ${height}`);
  }

  public zoom(zoomFactor: number): void {
    const newZoomVal = this.canvas.zoom() + zoomFactor;
    if (newZoomVal >= 0.1) {
      this.canvas.zoom(newZoomVal);
    }
  }

  public get(selector: string): Element {
    return this.canvas.findOne(selector) as any;
  }

  public clear() {
    this.canvas.clear().viewbox(`0 0 ${this.width} ${this.height}`);
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
    const element = SVG(template);
    element.node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    object.add(element);
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
