import {Dom} from '@svgdotjs/svg.js';
import {DefaultOptions, TreeOptions} from './modules/settings/Options';
import {Graph} from './models';

export class ApexTree {
  public element: Dom;
  public options: TreeOptions;
  public graph: Graph;

  constructor(element: Dom, data: any, options: TreeOptions) {
    this.element = element;
    this.options = {...DefaultOptions, ...options};
    this.graph = new Graph(this.element, data, this.options);
  }

  public render() {
    if (!this.element) {
      throw new Error('Element not found');
    }
    this.graph.construct();
    console.log('graph', this.graph);
    this.graph.render();
    return this.graph;
  }
}
