import {Graph} from 'src/models/Graph';
import {isIE11} from 'src/utils';

export class Export {
  constructor(public graph: Graph) {}

  private fixSvgStringForIe11(svgData: string): string {
    // IE11 generates broken SVG that we have to fix by using regex
    if (!isIE11()) {
      // not IE11 - noop
      return svgData.replace(/&nbsp;/g, '&#160;');
    }

    // replace second occurrence of "xmlns" attribute with "xmlns:xlink" with correct url + add xmlns:svgjs
    let nXmlnsSeen = 0;
    let result = svgData.replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/g, (match) => {
      nXmlnsSeen++;
      return nXmlnsSeen === 2 ? 'xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev"' : match;
    });

    // remove the invalid empty namespace declarations
    result = result.replace(/xmlns:NS\d+=""/g, '');
    // remove these broken namespaces from attributes
    result = result.replace(/NS\d+:(\w+:\w+=")/g, '$1');

    return result;
  }

  private getSvgString(): string {
    const svgString = this.graph.canvas.svg();
    return this.fixSvgStringForIe11(svgString);
  }

  private svgUrl() {
    const svgData = this.getSvgString();
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
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
    this.triggerDownload(this.svgUrl(), `apex-tree-${new Date().getTime()}.svg`);
  }
}
