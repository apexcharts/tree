import { Circle } from '@svgdotjs/svg.js';
import { CircleAttr } from '@svgdotjs/svg.js';
import { Element, ForeignObject, G, Path, Rect, Svg, Text, TextAttr } from '@svgdotjs/svg.js';
import { NodeOptions } from '../settings/Options';
export declare class Paper {
    private readonly width;
    private readonly height;
    canvas: Svg;
    constructor(element: HTMLElement, width: number, height: number, canvasStyle: string);
    add(element: Element): void;
    resetViewBox(): void;
    updateViewBox(x: number, y: number, width: number, height: number): void;
    zoom(zoomFactor: number): void;
    clear(): void;
    static drawRect({ x1, y1, width, height, radius, color, opacity, }?: {
        x1?: undefined;
        y1?: undefined;
        width?: number | undefined;
        height?: number | undefined;
        radius?: number | undefined;
        color?: string | undefined;
        opacity?: number | undefined;
    }): Rect;
    static drawCircle(attributes?: CircleAttr): Circle;
    static drawText(text: string | undefined, { x, y, dx, dy }: Partial<TextAttr>): Text;
    static drawTemplate(template: string, { nodeWidth, nodeHeight }?: Partial<NodeOptions>): ForeignObject;
    static drawGroup(x?: number, y?: number, id?: string, parent?: string): G;
    static drawPath(pathString: string, { id, borderColor }?: {
        id?: string | undefined;
        borderColor?: string | undefined;
    }): Path;
}
