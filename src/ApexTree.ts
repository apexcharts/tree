import {Dom} from '@svgdotjs/svg.js';
import {Node} from 'src/models/Graph';
import {DefaultOptions, TreeOptions} from './modules/settings/Options';
import {Graph} from './models';

export class ApexTree {
  public element: Dom;
  public options: TreeOptions;
  public graph: Graph;

  constructor(element: Dom, options: TreeOptions) {
    this.element = element;
    this.options = {...DefaultOptions, ...options};
    this.graph = new Graph(this.element, this.options);
  }

  public render(data: Node) {
    if (!this.element) {
      throw new Error('Element not found');
    }
    this.graph.construct(data);
    console.log('graph', this.graph);
    this.graph.render();
    return this.graph;
  }
}
