import { Graph } from './Graph';
export declare class Export {
    graph: Graph;
    constructor(graph: Graph);
    private getSvgString;
    private svgUrl;
    private triggerDownload;
    exportToSVG(): void;
}
