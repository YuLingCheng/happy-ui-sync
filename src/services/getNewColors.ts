// ------ Parse paintstyles -------
const getNewColors = (figma: PluginAPI) => {
  const painStyles = figma.getLocalPaintStyles();

  const parseColorName = (
    color: PaintStyle
  ): { name: string; variant: number } => {
    const [name, variant] = color.name.split(' / ');
    return {
      name: name.toLowerCase(),
      variant: parseInt(variant)
    };
  };

  const stringyfyRGB = (color: RGB): string => {
    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);
    return `rgb(${r},${g},${b})`;
  };

  const solidPaintStyles = painStyles.filter(
    paintStyle => paintStyle.paints[0].type === 'SOLID'
  );

  interface ParsedColors {
    [colorName: string]: {
      [colorVariant: number]: string;
    };
  }

  const reducedColors = {};
  solidPaintStyles.reduce((reducedColors: ParsedColors, solidPainstyle) => {
    const { name, variant } = parseColorName(solidPainstyle);
    if (!reducedColors[name]) {
      reducedColors[name] = {};
    }

    const paint = solidPainstyle.paints[0] as SolidPaint;
    reducedColors[name][variant] = stringyfyRGB(paint.color);
    return reducedColors;
  }, reducedColors);

  return reducedColors;
};

export default getNewColors;
