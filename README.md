# ApexTree - Installation and Getting started

The Apextree is a javascript library built on SVG that helps to create organizational or hierarchical charts.

<img width="811" alt="Screenshot 2023-12-17 at 10 28 04 PM" src="https://github.com/apexcharts/tree/assets/17950663/e09212ec-6322-4c68-ac12-9afc524d2abd">


## Installation

To add the Apextree to your project and its dependencies, install the package from npm.

```bash
npm install apextree
```

## Usage

```js
import ApexTree from 'apextree'
```

To create a basic tree with minimal configuration, write as follows:

```html
<div id="svg-tree"></div>
```

```js
 const data = {
   ...(nested data with format provided below)
 }
 const options = {
   width: 700,
   height: 700,
   nodeWidth: 120,
   nodeHeight: 80,
   childrenSpacing: 100,
   siblingSpacing: 30,
   direction: 'top',
   canvasStyle: 'border: 1px solid black;background: #f6f6f6;',
 };
 const tree = new ApexTree(document.getElementById('svg-tree'), options);
 const graph = tree.render(data);
```

## Tree Options

The layout can be configured by either setting the properties in the table below by passing a second arg to Apextree with these properties set. The latter takes precedence.

Options | Default                      | Description
--- |------------------------------| ---
width | 400                         | The width of graph container
height | 400                         | The height of graph container
direction | top                          | The direction of the tree to start rendering. Possible values: `top`, `bottom`, `left` and `right`
contentKey | name                         | The key of content in passed data object 
siblingSpacing | 50                           | The spacing between sibling nodes
childrenSpacing | 50                           | The spacing between children and parent
highlightOnHover | true                         | Enable/disable highlight on hover
containerClassName | root                         | The class name for the root container
canvasStyle | None                         | The css styles for canvas root container
enableToolbar | false                        | Enable/disable graph toolbar
nodeWidth | 50                           | The width of graph nodes
nodeHeight | 30                           | The height of graph nodes
nodeTemplate | defaultNodeTemplate          | The HTML template for nodes
nodeBGColor | `#FFFFFF`                    | The background color of nodes
nodeBGColorHover | `#FFFFFF`                    | The background color on hover of nodes
borderWidth | 1                            | The border width of the nodes in pixels
borderStyle | solid                        | The border style of the nodes
borderRadius | 5px                          | The border radius of the nodes in pixels
borderColor | `#BCBCBC`                    | The border color of the nodes
borderColorHover | `#5C6BC0`                    | The border color on hover of the nodes
edgeColor | `#BCBCBC`                    | The color for the edges
edgeColorHover | `#BCBCBC`                    | The color for the edges when highlighted
enableTooltip | false                        | Enable tooltip on hover of nodes
tooltipId | `apextree-tooltip-container` | The tooltip HTML element id
tooltipTemplate | defaultNodeTemplate          | The HTML template for tooltip
tooltipMaxWidth | 100                          | The max width of the tooltip
tooltipBorderColor | `#BCBCBC`                    | The border color of tooltip
tooltipBGColor | `#FFFFFF`                    | The background color of tooltip
fontSize | 14px                         | The size of font of nodes
fontFamily | None                         | The font family of nodes
fontWeight | 400                          | The font weight of nodes
fontColor | `#000000`                    | The font color of nodes

Default node template

```js
const defaultNodeTemplate = (content: string) => {
  return `<div style='display: flex;justify-content: center;align-items: center; text-align: center; height: 100%;'>${content}</div>`;
};
```
### Expected data format

```json
{
  "id": "1", 
  "name": "A",
  "children": []
}
```
Passed data object should contain id, name and children.

For *id* key, value of id can be unique otherwise edge highlight won't work as expected.

For *name* key, if using other than *name* then specify key name in contentKey option

For *children* key, it contains list of child objects

**Example**
```js
const data = {
  "id": "1",
  "name": "A",
  "children": [
     {
       "id": "2",
       "name": "B",
       "children": [
         {
           "id": "3",
           "name": "C"
         },
         {
            "id": "4",
            "name": "D"
         }
      ]
     }
  ]
}
```
