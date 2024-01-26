import { Node, TreeNode } from 'src/models/Graph';
import { FontOptions, TreeOptions } from 'src/settings/Options';

export const setAttributes = (
  element: Element | null,
  attrs: Record<string, any> = {},
) => {
  for (const key in attrs) {
    element?.setAttribute(key, attrs[key]);
  }
};

export const ExpandCollapseButtonSize = 14;

export const highlightToPath = (
  nodes: ReadonlyArray<TreeNode<Node>>,
  selfNode: TreeNode<Node>,
  isHighlighted: boolean,
  options: TreeOptions,
): void => {
  const nodeOptions = selfNode?.data.options;
  let borderWidth = nodeOptions?.borderWidth || options.borderWidth;
  let borderColor = nodeOptions?.borderColor || options.borderColor;
  let backgroundColor = nodeOptions?.nodeBGColor || options.nodeBGColor;

  if (isHighlighted) {
    // borderWidth = borderWidth + 1;
    borderColor = nodeOptions?.borderColorHover || options.borderColorHover;
    backgroundColor = nodeOptions?.nodeBGColorHover || options.nodeBGColorHover;
  }
  const selfContentElement: HTMLElement | null = document.querySelector(
    `[data-self='${selfNode.data.id}'] foreignObject`,
  );
  if (selfContentElement) {
    selfContentElement.style.borderWidth = `${borderWidth}px`;
    selfContentElement.style.borderColor = borderColor;
    selfContentElement.style.backgroundColor = backgroundColor;
  }

  if (selfNode.parent) {
    const edge = document.getElementById(
      `${selfNode.data.id}-${selfNode.parent?.data.id}`,
    );
    if (isHighlighted) {
      setAttributes(edge, {
        'stroke-width': borderWidth + 1,
        stroke: options.edgeColorHover,
      });
    } else {
      setAttributes(edge, {
        'stroke-width': borderWidth,
        stroke: options.edgeColor,
      });
    }

    selfNode.parent &&
      highlightToPath(nodes, selfNode.parent, isHighlighted, options);
  }
};

export const getTooltipStyles = (
  x: number,
  y: number,
  maxWidth: number,
  borderColor: string,
  bgColor: string,
  addPadding: boolean,
): ReadonlyArray<string> => {
  const styles = [
    'position: absolute;',
    `left: ${x + 20}px;`,
    `top: ${y + 20}px;`,
    `border: 1px solid ${borderColor};`,
    `border-radius: 5px;`,
    `max-width: ${maxWidth}px;`,
    `background-color: ${bgColor};`,
  ];
  if (addPadding) {
    styles.push('padding: 10px;');
  }
  return styles;
};

export const generateStyles = (
  styleObject: Record<string, number | string> = {},
): string => {
  const styles = [];
  for (const styleKey in styleObject) {
    let key = styleKey;
    if (styleKey === 'fontColor') {
      key = 'color';
    }
    const styleString = `${camelToKebabCase(key)}: ${
      styleObject[styleKey as keyof FontOptions]
    };`;
    styles.push(styleString);
  }
  return styles.join(' ');
};

export const getTooltip = (
  tooltipId: string = 'apextree-tooltip-container',
) => {
  const tooltipElement =
    document.getElementById(tooltipId) || document.createElement('div');
  tooltipElement.id = tooltipId;
  return tooltipElement;
};

export const updateTooltip = (
  id: string = '',
  styles?: string | undefined,
  content: string = '',
) => {
  const tooltipElement = document.getElementById(id);
  if (styles) {
    tooltipElement?.setAttribute('style', styles);
  } else {
    tooltipElement?.removeAttribute('style');
  }

  if (
    tooltipElement?.innerHTML.replaceAll("'", '"') !==
    content.replaceAll("'", '"')
  ) {
    tooltipElement && (tooltipElement.innerHTML = content);
  }
};

export const camelToKebabCase = (str: string): string => {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );
};
