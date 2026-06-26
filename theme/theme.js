import { palette } from "./theme-colors";

const colorPalette = [];

for (const [slug, entry] of Object.entries(palette)) {
  colorPalette.push({ name: slug, slug, color: entry.color });
}

const disableTypography = {
  fontSizes: [],
  customLineHeight: false,
  customFontSize: false,
  defaultFontSizes: false,
  writingMode: false,
  dropCap: false,
  textDecoration: false,
  letterSpacing: false,
  textTransform: false,
  fontWeight: false,
  fontStyle: false,
};

const themeConfig = {
  version: 3,
  settings: {
    layout: {
      contentSize: "100%",
      wideSize: "1024px",
      fullSize: "1280px",
      allowEditing: false,
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
    spacing: {
      customSpacingSize: false,
      defaultSpacingSizes: false,
      spacingScale: {
        steps: 0,
      },
      spacingSizes: [
        {
          name: "sm",
          slug: "sm",
          size: "clamp( 20px,  3vw, 40px )",
        },
        {
          name: "md",
          slug: "md",
          size: "clamp( 56px, 4vw,  56px )",
        },
        {
          name: "lg",
          slug: "lg",
          size: "clamp( 20px, 5vw + 84px  ,  84px )",
        },
        {
          name: "xl",
          slug: "xl",
          size: "clamp( 20px, 6vw,  112px )",
        },
      ],
    },
    blocks: {
      "core/group": {
        typography: disableTypography,
        color: {
          text: false,
        },
        shadow: {
          defaultPresets: false,
        },
        spacing: {
          padding: true,
        },
      },
    },
  },
  styles: {},
};

export default themeConfig;
