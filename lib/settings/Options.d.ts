export type TreeDirection = 'left' | 'top' | 'right' | 'bottom';
export interface NodeOptions {
    readonly nodeWidth: number;
    readonly nodeHeight: number;
    readonly nodeBGColor: string;
    readonly nodeBGColorHover: string;
    readonly nodeStyle: string;
    readonly nodeClassName: string;
    readonly nodeTemplate: (content: any) => any;
    readonly borderRadius: string;
    readonly borderWidth: number;
    readonly borderColor: string;
    readonly borderStyle: string;
    readonly borderColorHover: string;
    readonly enableExpandCollapse: boolean;
}
export interface TooltipOptions {
    readonly enableTooltip: boolean;
    readonly tooltipId: string;
    readonly tooltipTemplate?: (content: any) => any;
    readonly tooltipMaxWidth: number;
    readonly tooltipBorderColor: string;
    readonly tooltipBGColor: string;
}
export interface FontOptions {
    readonly fontSize: string;
    readonly fontFamily: string;
    readonly fontWeight: number;
    readonly fontColor: string;
}
export interface EdgeOptions {
    readonly edgeWidth: number;
    readonly edgeColor: string;
    readonly edgeColorHover: string;
}
export interface CommonOptions {
    readonly width: number | string;
    readonly height: number | string;
    readonly direction: TreeDirection;
    readonly contentKey: string;
    readonly siblingSpacing: number;
    readonly childrenSpacing: number;
    readonly highlightOnHover: boolean;
    readonly containerClassName: string;
    readonly canvasStyle: string;
    readonly enableToolbar: boolean;
    readonly viewPortWidth: number;
    readonly viewPortHeight: number;
}
export type TreeOptions = CommonOptions & NodeOptions & TooltipOptions & FontOptions & EdgeOptions;
export declare const DefaultOptions: TreeOptions;
