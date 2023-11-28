import ZoomInIcon from 'src/icons/zoom-in-icon.svg';
import ZoomOutIcon from 'src/icons/zoom-out-icon.svg';
import FitScreenIcon from 'src/icons/fit-screen-icon.svg';
import {Graph} from 'src/models/index';

export enum ToolbarItem {
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
  FitScreen = 'fit-screen',
  Export = 'export',
}

const ToolBarIcons = {
  [ToolbarItem.ZoomIn]: ZoomInIcon,
  [ToolbarItem.ZoomOut]: ZoomOutIcon,
  [ToolbarItem.FitScreen]: FitScreenIcon,
};

const ZoomChangeFactor = 0.1;

export class Toolbar {
  constructor(
    public element: HTMLElement | null,
    public graph: Graph,
  ) {}

  public create(): void {
    const container = document.createElement('div');
    container.id = 'toolbar';
    container.setAttribute('style', 'display: flex;gap: 5px;position: absolute;right: 20px;top: 20px;');

    const btnZoomIn = this.createToolbarItem(ToolbarItem.ZoomIn, ToolBarIcons[ToolbarItem.ZoomIn]);
    const btnZoomOut = this.createToolbarItem(ToolbarItem.ZoomOut, ToolBarIcons[ToolbarItem.ZoomOut]);
    const btnFitScreen = this.createToolbarItem(ToolbarItem.FitScreen, ToolBarIcons[ToolbarItem.FitScreen]);
    btnZoomIn.addEventListener('click', () => {
      this.graph.zoom(ZoomChangeFactor);
    });
    btnZoomOut.addEventListener('click', () => {
      this.graph.zoom(-ZoomChangeFactor);
    });
    btnFitScreen.addEventListener('click', () => {
      this.graph.fitScreen();
    });

    container.append(btnZoomIn, btnZoomOut, btnFitScreen);

    this.element?.append(container);
  }

  public createToolbarItem(itemName: ToolbarItem, icon: string): HTMLElement {
    const itemContainer = document.createElement('div');
    itemContainer.id = itemName;
    itemContainer.innerHTML = icon;
    itemContainer.setAttribute(
      'style',
      'width: 30px;height: 30px;display: flex;align-items: center;justify-content: center;border: 1px solid #BCBCBC;background-color: #FFFFFF;cursor: pointer;',
    );
    return itemContainer;
  }
}
