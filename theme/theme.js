import { themeColors } from "./theme-colors";

const colorPalette = [];

const reduceColors = (entries) => {
  for (const [key, value] of Object.entries(themeColors)) {
    if (typeof value == "object") {
      reduceColors(value);
    } else {
      colorPalette.push({
        name: key,
        slug: key,
        color: value,
      });
    }
  }
};

reduceColors(themeColors);

const themeConfig = {
  version: 2,
  settings: {
    layout: {
      contentSize: "100%",
      wideSize: "1024px",
      fullSize: "1280px",
    },
    color: {
      custom: false,
      customGradient: false,
      defaultPalette: false,
      gradients: [],
      defaultGradients: false,
      palette: colorPalette,
    },
    typography: {
      customFontSize: false,
      dropCap: false,
      fontWeight: false,
      fontStyle: false,
      textTransform: false,
      textDecoration: false,
      fontSizes: [
        {
          name: "xs",
          slug: "xs",
          size: "12px",
        },
        {
          name: "md",
          slug: "md",
          size: "14px",
        },
        {
          name: "base",
          slug: "base",
          size: "16px",
        },
        {
          name: "lg",
          slug: "lg",
          size: "18px",
        },
        {
          name: "xl",
          slug: "xl",
          size: "20px",
        },
        {
          name: "2xl",
          slug: "2xl",
          size: "24px",
        },
      ],
    },
  },
  styles: {},
};

export default themeConfig;
