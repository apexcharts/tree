import { G, Path } from '@svgdotjs/svg.js';
import { FlextreeNode } from 'd3-flextree';
import { Paper } from './Paper';
import { FontOptions, NodeOptions, TooltipOptions, TreeDirection, TreeOptions } from '../settings/Options';
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
export declare class Graph extends Paper {
    options: TreeOptions;
    rootNode: TreeNode<Node> | undefined;
    element: HTMLElement;
    constructor(element: HTMLElement, options: TreeOptions);
    construct(data: Node): void;
    renderNode(node: TreeNode<Node>, mainGroup: G): void;
    renderEdge(node: TreeNode<Node>, group: G): void;
    collapse(nodeId: string): void;
    expand(nodeId: string): void;
    changeLayout(direction?: TreeDirection): void;
    fitScreen(): void;
    render({ keepOldPosition }?: {
        keepOldPosition?: boolean | undefined;
    }): void;
}
