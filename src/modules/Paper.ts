import {Dom, Element, ForeignObject, G, Path, Rect, Svg, SVG, Text, TextAttr} from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';

export class Paper {
  private width: number;
  private height: number;
  private svg: Svg;
  constructor(element: Dom, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.svg = SVG().addTo(element).size(width, height).viewbox(`0 0 ${width} ${height}`).panZoom();
  }

  public add(element: Element) {
    this.svg.add(element);
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
    strokeWidth = 1,
    strokeColor = '#000',
    strokeDashArray = 0,
    id = '',
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
      'stroke-width': strokeWidth !== null ? strokeWidth : 0,
      stroke: strokeColor !== null ? strokeColor : 'none',
      'stroke-dasharray': strokeDashArray,
    });
    rect.id(id);
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

  static drawTemplate(template: any, width: number, height: number): any {
    const object = new ForeignObject({width, height});
    object.add(template);
    return object;
  }

  static drawGroup(x: number = 0, y: number = 0, id: string, parent: string = '') {
    const group = new G();
    group.attr({transform: `translate(${x}, ${y})`, 'data-self': id, 'data-parent': parent});
    return group;
  }

  static drawPath(pathString: string, id: string) {
    const path = new Path({d: pathString});
    path.id(id);
    path.fill('none').stroke({color: '#8C8C8C', width: 1});
    return path;
  }
}
