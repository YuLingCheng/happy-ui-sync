import camelcase from "lodash.camelcase";

const parseColorName = (
  color: PaintStyle
): { name: string; variant: string } => {
  const [name, variant] = color.name.split(" / ");
  return {
    name: camelcase(name),
    variant: camelcase(variant),
  };
};

const stringyfyRGBA = (color: RGB, opacity?: number): string => {
  const r = Math.floor(color.r * 255);
  const g = Math.floor(color.g * 255);
  const b = Math.floor(color.b * 255);
  let a = "1";
  if (opacity !== undefined && opacity === 0) {
    a = "0";
  }
  if (opacity !== undefined && opacity !== 1) {
    a = opacity.toFixed(2);
  }
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

interface Colors {
  [colorName: string]: {
    [colorVariant: number]: string;
  };
}

// ------ Parse paintstyles -------
const getNewColors = (figma: PluginAPI) => {
  const figmaPainStyles = figma.getLocalPaintStyles();

  const colorsToParse = figmaPainStyles.filter(
    (paintStyle) => paintStyle.paints[0].type === "SOLID"
  );

  const newColors = {};

  colorsToParse.reduce((newColors: Colors, colorToParse) => {
    const { name, variant } = parseColorName(colorToParse);
    if (!newColors[name]) {
      newColors[name] = {};
    }

    const paint = colorToParse.paints[0] as SolidPaint;
    newColors[name][variant] = stringyfyRGBA(paint.color, paint.opacity);

    return newColors;
  }, newColors);

  return newColors;
};

export default getNewColors;
