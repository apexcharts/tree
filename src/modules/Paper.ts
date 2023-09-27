import {Dom, Rect, SVG, Text, G, TextAttr, Path} from '@svgdotjs/svg.js';

export class Paper {
  public svg: Dom;
  constructor(element: Dom, width: number, height: number) {
    this.svg = SVG().addTo(element).size(width, height);
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

  static drawGroup(x: number = 0, y: number = 0) {
    const group = new G();
    group.attr({transform: `translate(${x}, ${y})`});
    return group;
  }

  static drawPath(pathString: string) {
    const path = new Path({d: pathString});
    path.fill('none').stroke({color: '#8C8C8C', width: 1});
    return path;
  }
}
