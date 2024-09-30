import { GraphPoint, Node, TreeNode } from '../models';
export declare const curvedEdgesHorizontal: (s: GraphPoint, t: GraphPoint, m: GraphPoint) => string;
export declare const curvedEdgesVertical: (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets?: {
    sy: number;
}) => string;
export interface DirectionConfigProperties {
    readonly containerX: (params: ConfigParams) => number;
    readonly containerY: (params: ConfigParams) => number;
    readonly edgeX: (params: ConfigParams) => number;
    readonly edgeY: (params: ConfigParams) => number;
    readonly edgeMidX: (params: ConfigParams) => number;
    readonly edgeMidY: (params: ConfigParams) => number;
    readonly edgeParentX: (params: ConfigParams) => number;
    readonly edgeParentY: (params: ConfigParams) => number;
    readonly nodeFlexSize: (params: ConfigParams) => [number, number];
    readonly calculateEdge: (s: GraphPoint, t: GraphPoint, m: GraphPoint, offsets: {
        sy: number;
    }) => string;
    readonly swap: (node: TreeNode<Node>) => {
        x: number;
        y: number;
    };
    readonly viewBoxDimensions: ({ rootNode, childrenSpacing, siblingSpacing, }: {
        rootNode: TreeNode<Node> | undefined;
        childrenSpacing: number;
        siblingSpacing: number;
    }) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
interface ConfigParams {
    readonly node: TreeNode<Node>;
    readonly parent: TreeNode<Node>;
    readonly width: number;
    readonly height: number;
    readonly nodeWidth: number;
    readonly nodeHeight: number;
    readonly siblingSpacing: number;
    readonly childrenSpacing: number;
    readonly x: number;
    readonly y: number;
}
export declare const DirectionConfig: Record<string, DirectionConfigProperties>;
export {};
