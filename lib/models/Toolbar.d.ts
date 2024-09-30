import { Graph } from './Graph';
export declare enum ToolbarItem {
    ZoomIn = "zoom-in",
    ZoomOut = "zoom-out",
    FitScreen = "fit-screen",
    Export = "export"
}
export declare class Toolbar {
    element: HTMLElement | null;
    graph: Graph;
    private readonly export;
    constructor(element: HTMLElement | null, graph: Graph);
    render(): void;
    createToolbarItem(itemName: ToolbarItem, icon: string): HTMLElement;
}
