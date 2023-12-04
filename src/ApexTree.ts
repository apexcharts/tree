import {Node, Graph, Toolbar} from 'src/models';
import {DefaultOptions, TreeOptions} from './settings/Options';

export class ApexTree {
  public element: HTMLElement;
  public options: TreeOptions;
  public graph: Graph;

  constructor(element: HTMLElement, options: TreeOptions) {
    this.element = element;
    this.options = {...DefaultOptions, ...options};
    const treeWrapper = document.createElement('div');
    treeWrapper.id = 'apexTreeWrapper';
    treeWrapper.style.position = 'relative';
    this.graph = new Graph(treeWrapper, this.options);
    this.element.append(treeWrapper);
  }

  public render(data: Node) {
    if (!this.element) {
      throw new Error('Element not found');
    }
    this.graph.construct(data);
    this.graph.render();
    if (this.options.enableToolbar) {
      const toolbar = new Toolbar(document.getElementById('apexTreeWrapper'), this.graph);
      toolbar.render();
    }
    console.log('graph', this.graph, this.options);
    return this.graph;
  }
}
