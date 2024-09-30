import { Node, Graph } from './models';
import { TreeOptions } from './settings/Options';
export declare class ApexTree {
    element: HTMLElement;
    options: TreeOptions;
    graph: Graph;
    constructor(element: HTMLElement, options: TreeOptions);
    render(data: Node): Graph;
}
