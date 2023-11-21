import {DefaultOptions, FontOptions} from 'src/modules/settings/Options';

export const setAttributes = (element: Element | null, attrs: Record<string, any> = {}) => {
  for (const key in attrs) {
    element?.setAttribute(key, attrs[key]);
  }
};

export const highlightToPath = (
  node: HTMLElement,
  {
    borderWidth = 1,
    borderColor = DefaultOptions.borderColorHover,
    nodeBGColor = DefaultOptions.nodeBGColor,
    borderRadius = DefaultOptions.borderRadius,
  },
): void => {
  const self = node.getAttribute('data-self');
  const parent = node.getAttribute('data-parent');

  const selfContentElement: HTMLElement | null = document.querySelector(`[data-self='${self}'] foreignObject`);

  if (selfContentElement) {
    selfContentElement.style.border = `${borderWidth}px solid ${borderColor}`;
    selfContentElement.style.borderRadius = borderRadius;
  }

  const edge = document.getElementById(`${self}-${parent}`);
  setAttributes(edge, {'stroke-width': borderWidth.toString(), stroke: borderColor});

  const parentElement: HTMLElement | null = document.querySelector(`[data-self="${parent}"]`);
  parentElement && highlightToPath(parentElement, {borderWidth, borderColor, nodeBGColor});
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

export const generateStyles = (styleObject: Record<string, number | string> = {}): string => {
  const styles = [];
  for (const styleKey in styleObject) {
    let key = styleKey;
    if (styleKey === 'fontColor') {
      key = 'color';
    }
    const styleString = `${camelToKebabCase(key)}: ${styleObject[styleKey as keyof FontOptions]};`;
    styles.push(styleString);
  }
  return styles.join(' ');
};

export const getTooltip = (tooltipId: string = 'tooltip-container') => {
  const tooltipElement = document.getElementById(tooltipId) || document.createElement('div');
  tooltipElement.id = tooltipId;
  // tooltipElement.setAttribute('style', 'border: 1px solid black;');
  return tooltipElement;
};

export const updateTooltip = (id: string = '', styles?: string | undefined, content: string = '') => {
  const tooltipElement = document.getElementById(id);
  if (styles) {
    tooltipElement?.setAttribute('style', styles);
  } else {
    tooltipElement?.removeAttribute('style');
  }

  if (tooltipElement?.innerHTML.replaceAll("'", '"') !== content.replaceAll("'", '"')) {
    tooltipElement && (tooltipElement.innerHTML = content);
  }
};

export const camelToKebabCase = (str: string): string => {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
};
