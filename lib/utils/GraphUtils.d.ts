import { Node, TreeNode } from '../models/Graph';
import { TreeOptions } from '../settings/Options';
export declare const setAttributes: (element: Element | null, attrs?: Record<string, any>) => void;
export declare const ExpandCollapseButtonSize = 14;
export declare const highlightToPath: (nodes: ReadonlyArray<TreeNode<Node>>, selfNode: TreeNode<Node>, isHighlighted: boolean, options: TreeOptions) => void;
export declare const getTooltipStyles: (x: number, y: number, maxWidth: number, borderColor: string, bgColor: string, addPadding: boolean) => ReadonlyArray<string>;
export declare const generateStyles: (styleObject?: Record<string, number | string>) => string;
export declare const getTooltip: (tooltipId?: string) => HTMLElement;
export declare const updateTooltip: (id?: string, styles?: string | undefined, content?: string) => void;
export declare const camelToKebabCase: (str: string) => string;