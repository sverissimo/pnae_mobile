import * as colors from "./colorsPallete";
const { grayscale } = colors;

const selectedColor = colors.materialTeal;
const lightTheme = {
  background: "white",
  background2: grayscale[50],
  background3: selectedColor[100],
  text: "black",
  primary: selectedColor,
  grayscale: colors.grayscale,
};
const darkTheme = {
  background: selectedColor[900],
  background2: grayscale[950],
  background3: selectedColor[900],
  text: "white",
  primary: invertPalette(selectedColor),
  grayscale: invertPalette(colors.grayscale),
};

export const globalColors = lightTheme;
//export const globalColors = darkTheme;

function invertPalette(palette: any) {
  const invertedPalette: any = {};
  const keyMapping: { [key: number | string]: number | string } = {
    50: 950,
    100: 900,
    200: 800,
    300: 700,
    400: 600,
    500: 500,
    600: 400,
    700: 300,
    800: 200,
    900: 100,
    950: 50,
    A100: "A700",
    A200: "A400",
    A400: "A200",
    A700: "A100",
  };

  for (const key in palette) {
    const invertedKey = keyMapping[key];
    if (invertedKey) {
      invertedPalette[invertedKey] = palette[key];
    }
  }

  return invertedPalette;
}

/* export const lightTheme = (color: any) => {
  return {
    background: color,
    text: "black",
    primary: color,
    grayscale: colors.grayscale,
  };
};

export const darkTheme = (color: typeof colors) => {
  return {
    background: colors,
    text: "white",
    primary: invertPalette(color),
    grayscale: invertPalette(colors.grayscale),
  };
};
 */
