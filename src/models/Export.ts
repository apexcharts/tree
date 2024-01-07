import { Graph } from 'src/models/Graph';

export class Export {
  constructor(public graph: Graph) {}

  private getSvgString(): string {
    return this.graph.canvas.svg();
  }

  private svgUrl() {
    const svgData = this.getSvgString();
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    return URL.createObjectURL(svgBlob);
  }

  private triggerDownload(href: string, filename: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = href;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  public exportToSVG() {
    this.triggerDownload(
      this.svgUrl(),
      `apex-tree-${new Date().getTime()}.svg`,
    );
  }
}
